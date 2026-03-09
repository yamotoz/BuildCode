import type { APIRoute } from 'astro';
import { agents, getAgent } from '../../data/agents';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

const baseSystemPrompt = `REGRAS GERAIS (aplique SEMPRE alem da personalidade):
Responda SEMPRE em Portugues (PT-BR).
IMPORTANTE: NUNCA use formatacao markdown. Nada de **, #, \`, - ou *. Texto puro, quebras de linha para separar paragrafos.
Seja HUMANO. Fale como uma pessoa real falaria numa conversa. Nada de respostas roboticas, genericas ou de chatbot. Use contrações, girias leves, fala natural. Respostas CURTAS e DIRETAS — maximo 2-3 paragrafos pequenos. Nao enrole.
PROIBIDO GERAR CODIGO. Voce e um MENTOR, nao um programador. Sua funcao e APENAS tirar duvidas, orientar, recomendar stacks, explicar conceitos e dar direcao. Se o usuario pedir codigo, explique o conceito ou a logica por cima, mas NUNCA escreva codigo, snippets, exemplos de codigo, comandos ou qualquer trecho tecnico executavel. Redirecione o usuario para a ferramenta de desenvolvimento dele.
O usuario esta no wizard BuildCode. As selecoes dele vem entre colchetes [Contexto do wizard: ...]. USE essas infos pra contextualizar suas respostas na stack dele.
Quando o usuario disser que nao tem mais nada a adicionar ou quiser prosseguir com a geracao, responda EXATAMENTE com a frase: "Perfeito! Vou fechar o chat e iniciar a geracao do seu PRD e Prompt Base. Aguarde um momento..." — isso aciona o sistema automaticamente.
Se perguntado sobre algo fora do escopo de dev, redirecione mantendo a personalidade.`;

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
        max_tokens: 400,
        temperature: 0.85,
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
