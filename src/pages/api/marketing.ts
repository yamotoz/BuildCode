import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

async function getCallerWithMarketing(authHeader: string) {
  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return null;
  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: profile } = await adminClient.from('profiles').select('role, can_access_marketing').eq('id', user.id).single();
  if (!profile) return null;
  if (profile.role !== 'master' && !profile.can_access_marketing) return null;
  return { id: user.id, role: profile.role };
}

// GET — list posts for user (master sees all)
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);
  const caller = await getCallerWithMarketing(authHeader);
  if (!caller) return json({ error: 'Sem permissão' }, 403);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const query = adminClient.from('marketing_posts').select('*').order('created_at', { ascending: false });
  if (caller.role !== 'master') query.eq('user_id', caller.id);
  const { data, error } = await query;
  if (error) return json({ error: error.message }, 500);
  return json(data || []);
};

// POST — create post or generate content with AI
export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);
  const caller = await getCallerWithMarketing(authHeader);
  if (!caller) return json({ error: 'Sem permissão' }, 403);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // If action is 'generate', use AI to generate content
  if (body.action === 'generate') {
    const { platform, contentType, tone, topic } = body;
    if (!platform || !topic) return json({ error: 'Plataforma e tema são obrigatórios' }, 400);

    const systemPrompt = `Você é um especialista em marketing digital e criação de conteúdo para ${platform === 'tiktok' ? 'TikTok (vídeos curtos, hooks fortes, CTAs diretos)' : platform === 'linkedin' ? 'LinkedIn (tom profissional, insights de valor, storytelling B2B)' : platform + ' (conteúdo engajador)'}.
Crie conteúdo do tipo "${contentType || 'post'}" com tom "${tone || 'profissional'}" sobre o tema: "${topic}".

O conteúdo é para o BuildCode — uma plataforma SaaS de arquitetura de software assistida por IA.

Regras:
- Seja persuasivo e direto
- Use emojis estrategicamente (não exagere)
- Inclua hashtags relevantes no final
- Para TikTok: comece com hook nos primeiros 3 segundos, mantenha ritmo rápido
- Para LinkedIn: comece com uma frase impactante, use parágrafos curtos
- Máximo 300 palavras para posts, 150 para hooks/scripts
- Inclua CTA no final`;

    // Call the existing generate API internally
    try {
      const genRes = await fetch(new URL('/api/generate', request.url).href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          systemPrompt,
          userPrompt: `Crie um ${contentType || 'post'} para ${platform} sobre: ${topic}. Tom: ${tone || 'profissional'}.`,
        }),
      });
      const genResult = await genRes.json();
      if (!genRes.ok) return json({ error: genResult.error || 'Erro ao gerar' }, genRes.status);
      return json({ content: genResult.result, model: genResult.model });
    } catch (err: any) {
      return json({ error: err.message || 'Erro ao gerar conteúdo' }, 500);
    }
  }

  // Default: create a post
  const { platform, content_type, title, content, status, scheduled_date, tags, metrics } = body;
  if (!platform || !title || !content) return json({ error: 'platform, title e content são obrigatórios' }, 400);

  const { data, error } = await adminClient.from('marketing_posts').insert({
    user_id: caller.id,
    platform,
    content_type: content_type || 'post',
    title: title.trim(),
    content: content.trim(),
    status: status || 'draft',
    scheduled_date: scheduled_date || null,
    tags: tags || [],
    metrics: metrics || {},
  }).select().single();

  if (error) return json({ error: error.message }, 500);
  return json(data, 201);
};

// PATCH — update post
export const PATCH: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);
  const caller = await getCallerWithMarketing(authHeader);
  if (!caller) return json({ error: 'Sem permissão' }, 403);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const { id, ...updates } = body;
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  updates.updated_at = new Date().toISOString();
  const { data, error } = await adminClient.from('marketing_posts').update(updates).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json(data);
};

// DELETE — delete post
export const DELETE: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);
  const caller = await getCallerWithMarketing(authHeader);
  if (!caller) return json({ error: 'Sem permissão' }, 403);

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id obrigatório' }, 400);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await adminClient.from('marketing_posts').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ success: true });
};
