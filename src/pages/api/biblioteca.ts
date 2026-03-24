import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function getCallerProfile(authHeader: string, adminClient: any) {
  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return null;
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, can_edit_biblioteca')
    .eq('id', user.id)
    .single();
  return profile ? { ...profile, id: user.id } : null;
}

// GET — lista todas as tecnologias custom (cached 10min)
export const GET: APIRoute = async () => {
  if (!serviceRoleKey) return json({ error: 'Service unavailable' }, 500);

  const { cacheGet, cacheSet, CACHE_KEYS } = await import('../../lib/redis');
  const cacheKey = CACHE_KEYS.biblioteca();
  const cached = await cacheGet(cacheKey);
  if (cached) return json(cached);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await adminClient
    .from('custom_technologies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return json({ error: error.message }, 500);

  await cacheSet(cacheKey, data || [], 600); // 10 min
  return json(data || []);
};

// POST — adiciona nova tecnologia (master ou can_edit_biblioteca)
export const POST: APIRoute = async ({ request }) => {
  if (!serviceRoleKey) return json({ error: 'Service unavailable' }, 500);

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const caller = await getCallerProfile(authHeader, adminClient);
  if (!caller) return json({ error: 'Token inválido' }, 401);
  if (caller.role !== 'master' && !caller.can_edit_biblioteca) {
    return json({ error: 'Sem permissão para editar a biblioteca' }, 403);
  }

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const { name, category, tagline, description } = body;
  if (!name || !category || !tagline || !description) {
    return json({ error: 'name, category, tagline e description são obrigatórios' }, 400);
  }

  const validCategories = ['frontend', 'backend', 'data', 'infra', 'libs', 'devex', 'ai', 'design', 'mcp'];
  if (!validCategories.includes(category)) {
    return json({ error: `Categoria inválida. Use: ${validCategories.join(', ')}` }, 400);
  }

  const { data, error } = await adminClient.from('custom_technologies').insert({
    name: name.trim(),
    category,
    tagline: tagline.trim(),
    description: description.trim(),
    language: (body.language || '').trim(),
    pros: Array.isArray(body.pros) ? body.pros : (body.pros || '').split('\n').filter(Boolean),
    cons: Array.isArray(body.cons) ? body.cons : (body.cons || '').split('\n').filter(Boolean),
    use_cases: (body.use_cases || '').trim(),
    type_icon: (body.type_icon || 'code').trim(),
    role: (body.role || '').trim(),
    logo: (body.logo || '').trim(),
    website: (body.website || '').trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    uncensored_ai: !!body.uncensored_ai,
    created_by: caller.id,
  }).select().single();

  if (error) return json({ error: error.message }, 500);
  const { cacheDel, CACHE_KEYS } = await import('../../lib/redis');
  await cacheDel(CACHE_KEYS.biblioteca());
  return json(data, 201);
};

// PUT — edita tecnologia existente (master ou can_edit_biblioteca)
export const PUT: APIRoute = async ({ request }) => {
  if (!serviceRoleKey) return json({ error: 'Service unavailable' }, 500);

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const caller = await getCallerProfile(authHeader, adminClient);
  if (!caller) return json({ error: 'Token inválido' }, 401);
  if (caller.role !== 'master' && !caller.can_edit_biblioteca) {
    return json({ error: 'Sem permissão para editar a biblioteca' }, 403);
  }

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const { id, name, category, tagline, description } = body;
  if (!id) return json({ error: 'id é obrigatório' }, 400);
  if (!name || !category || !tagline || !description) {
    return json({ error: 'name, category, tagline e description são obrigatórios' }, 400);
  }

  const validCategories = ['frontend', 'backend', 'data', 'infra', 'libs', 'devex', 'ai', 'design', 'mcp'];
  if (!validCategories.includes(category)) {
    return json({ error: `Categoria inválida. Use: ${validCategories.join(', ')}` }, 400);
  }

  const { data, error } = await adminClient.from('custom_technologies').update({
    name: name.trim(),
    category,
    tagline: tagline.trim(),
    description: description.trim(),
    language: (body.language || '').trim(),
    pros: Array.isArray(body.pros) ? body.pros : (body.pros || '').split('\n').filter(Boolean),
    cons: Array.isArray(body.cons) ? body.cons : (body.cons || '').split('\n').filter(Boolean),
    use_cases: (body.use_cases || '').trim(),
    type_icon: (body.type_icon || 'code').trim(),
    role: (body.role || '').trim(),
    logo: (body.logo || '').trim(),
    website: (body.website || '').trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    uncensored_ai: !!body.uncensored_ai,
  }).eq('id', id).select().single();

  if (error) return json({ error: error.message }, 500);
  const { cacheDel: cacheDelPut, CACHE_KEYS: CK_PUT } = await import('../../lib/redis');
  await cacheDelPut(CK_PUT.biblioteca());
  return json(data);
};

// DELETE — remove tecnologia (master only)
export const DELETE: APIRoute = async ({ request }) => {
  if (!serviceRoleKey) return json({ error: 'Service unavailable' }, 500);

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Não autenticado' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const caller = await getCallerProfile(authHeader, adminClient);
  if (!caller || caller.role !== 'master') {
    return json({ error: 'Apenas master pode remover tecnologias' }, 403);
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id é obrigatório' }, 400);

  const { error } = await adminClient.from('custom_technologies').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  const { cacheDel: cacheDelDel, CACHE_KEYS: CK_DEL } = await import('../../lib/redis');
  await cacheDelDel(CK_DEL.biblioteca());
  return json({ success: true });
};
