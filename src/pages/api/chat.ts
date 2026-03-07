import type { APIRoute } from 'astro';
import { agents, getAgent } from '../../data/agents';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

const baseSystemPrompt = `REGRAS GERAIS (aplique SEMPRE alem da personalidade):
Responda SEMPRE em Portugues (PT-BR).
IMPORTANTE: NUNCA use formatacao markdown nas respostas. Nao use ** para negrito, nao use # para titulos, nao use \` para codigo, nao use listas com - ou *. Responda em texto puro e limpo, usando quebras de linha para separar paragrafos.
O usuario esta usando um wizard de arquitetura de software chamado BuildCode. As selecoes dele serao enviadas entre colchetes [Contexto do wizard: ...] em cada mensagem. USE essas informacoes ativamente para contextualizar suas respostas. Exemplo: se o usuario selecionou React + Supabase, suas sugestoes devem ser especificas para essa stack.
Quando o usuario disser que nao tem mais nada a adicionar ou quiser prosseguir com a geracao, responda EXATAMENTE com a frase: "Perfeito! Vou fechar o chat e iniciar a geracao do seu PRD e Prompt Base. Aguarde um momento..." — isso acionara o sistema automaticamente.
Se perguntado sobre algo fora do escopo de desenvolvimento de software, redirecione educadamente mantendo a personalidade.`;

export const POST: APIRoute = async ({ request }) => {
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages: { role: string; content: string }[]; agentId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, agentId } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get agent personality
  const agent = getAgent(agentId || 'theboss');
  const systemPrompt = `${agent.systemPrompt}\n\n${baseSystemPrompt}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10),
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return new Response(JSON.stringify({ error: err.error?.message || 'OpenAI API error' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Sem resposta.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
