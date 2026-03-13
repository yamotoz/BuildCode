<div align="center">

<img src="public/Logo_Buildcode.png" alt="BuildCode" width="320" />

<br /><br />

# BuildCode

**Plataforma SaaS de arquitetura de software potencializada por IA — Astro SSR + React + Supabase + 9 LLMs**

<br />

[![Acesse o BuildCode](https://img.shields.io/badge/Acessar_BuildCode-2E748B?style=for-the-badge&logoColor=white)](https://buildcode.com.br)
[![Status](https://img.shields.io/badge/Status-Produção-00C851?style=for-the-badge)]()
[![License](https://img.shields.io/badge/Licença-Proprietária-red?style=for-the-badge)](#licenca)

<br />

https://github.com/user-attachments/assets/b128e015-2b0a-4085-bcd6-81168f4c28d1

<br />

</div>

---

## Sobre

BuildCode e um SaaS que gera documentos de arquitetura (PRD) e Prompt Base otimizados para projetos de software, alimentado por 9 modelos de IA, dados em tempo real da GitHub API e uma base proprietaria de 200+ tecnologias.

O sistema conduz o usuario por um wizard de 20 etapas cobrindo stack completa — frontend, backend, banco de dados, autenticacao, testes, CI/CD, deploy — e entrega:

- **PRD Completo** — Justificativas tecnicas, diagrama de arquitetura, estimativa de custos
- **Prompt Base Otimizado** — Pronto para Claude, GPT, Gemini com boas praticas por tecnologia
- **Insights Visuais** — Graficos radar, distribuicao de stack, complexidade e risco

---

## Arquitetura & Stack

<div align="center">

![Astro](https://img.shields.io/badge/Astro_SSR-BC52EE?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

</div>

### Frontend

| Tecnologia | Uso |
|:---|:---|
| **Astro SSR** | Framework principal — renderizacao server-side com `prerender = false` para rotas de API |
| **React 18** | Componentes interativos dentro de Astro islands (`client:load`) |
| **TypeScript** | Tipagem em todo o codebase — API routes, componentes, configs |
| **Tailwind CSS v4** | Estilizacao utility-first com dark/light mode e CSS layers |
| **Framer Motion** | Animacoes de transicao no wizard e componentes UI |
| **Three.js** | Cena 3D com sistema de particulas animadas no background do wizard |
| **Recharts** | Graficos interativos — radar, barra, distribuicao — no dashboard de analytics |
| **Lucide React** | Icones SVG consistentes em toda a interface |

### Backend & Infraestrutura

| Tecnologia | Uso |
|:---|:---|
| **Supabase Auth** | Autenticacao com JWT — login, registro, sessoes, role-based access (master/admin/user) |
| **Supabase Database** | PostgreSQL gerenciado com RLS (Row Level Security) policies por tabela |
| **Supabase Storage** | Upload de avatares (bucket `avatars`) e armazenamento de PRDs/Prompts gerados |
| **Supabase Realtime** | Subscriptions para atualizacao de dados em tempo real |
| **Astro API Routes** | Endpoints server-side em `/api/*` — chat, generate, tts, save-project, github, invite-user |

### Integracoes de IA

BuildCode roteia para **9 modelos de IA** atraves de 3 provedores:

| Provedor | Modelos | Protocolo |
|:---|:---|:---|
| **OpenAI** | GPT-4o, GPT-4o-mini | API direta (`api.openai.com/v1`) |
| **Google** | Gemini 2.0 Flash, Gemini 1.5 Pro | API direta (`generativelanguage.googleapis.com`) |
| **OpenRouter** | Claude Sonnet, Claude Haiku, Llama 3.3 70B, Mistral Small, DeepSeek V3 | API unificada (`openrouter.ai/api/v1`) |
| **OpenAI TTS** | `tts-1` com 4 vozes (onyx, echo, fable, nova) | API de audio (`api.openai.com/v1/audio/speech`) |

**Tiers de modelo:**

```
Budget  → Gemini Flash, Llama 3.3 70B, Mistral Small     (rapido, economico)
Mid     → GPT-4o-mini, Claude Haiku, DeepSeek V3          (equilibrio custo/qualidade)
Pro     → GPT-4o, Claude Sonnet, Gemini 1.5 Pro           (maximo detalhe)
```

### APIs Externas

| API | Endpoint | Funcao |
|:---|:---|:---|
| **GitHub REST API** | `api.github.com/repos/{owner}/{repo}` | Stars, forks, issues, commits, linguagens — analytics em tempo real |
| **OpenAI Chat** | `/v1/chat/completions` | Chat com agentes mentores (gpt-4o-mini) |
| **OpenAI TTS** | `/v1/audio/speech` | Sintese de voz para resumos dos agentes |
| **OpenRouter** | `/api/v1/chat/completions` | Roteamento multi-modelo para geracao de PRD/Prompt |
| **Google Gemini** | `/v1beta/models/*/generateContent` | Geracao via modelos Gemini |
| **Asaas Payments** | API de pagamentos | Gestao de assinaturas e cobrancas recorrentes |

---

## Sistema de Agentes IA

4 agentes especializados, cada um com personalidade, estilo de comunicacao e voz TTS propria:

| Agente | Voz TTS | Modelo | Especialidade |
|:---|:---|:---|:---|
| **The Boss** | `onyx` | gpt-4o-mini | Arquitetura, decisoes estrategicas |
| **Azrael** | `echo` | gpt-4o-mini | Performance, seguranca, otimizacao |
| **Rizler** | `fable` | gpt-4o-mini | Frontend, UX, tendencias |
| **Anastasia** | `nova` | gpt-4o-mini | Boas praticas, aprendizado guiado |

Os agentes sao acessiveis via chat flutuante integrado ao wizard, com audio TTS em tempo real.

---

## Wizard de Arquitetura

Sistema de 20 etapas com logica dinamica:

- **Filtragem por tipo de projeto** — Steps tem `visibleFor` (hobby/saas/enterprise) e `optionalFor` (etapas pulaveis)
- **Dificuldade por opcao** — Tags `easy`, `medium`, `hard` com badges `recommendedFor`
- **Navegacao inteligente** — Pula automaticamente steps ocultos baseado no tipo de projeto
- **Step 21** = Selecao do modelo LLM | **Step 22** = Loading | **Step 23** = Resultado

**Saida gerada:**

| Documento | Conteudo |
|:---|:---|
| **PRD** | Justificativa de cada tecnologia, diagrama de arquitetura, estimativa de custos, links para docs oficiais |
| **Prompt Base** | Regra `agentlog.md`, boas praticas por tech, guidelines de responsividade, clean code, padrao de logs |

Configuracao completa em `wizard-config.ts`: questions, phases, testesOptions, llmModels, difficultyConfig.

---

## Funcionalidades

| Feature | Tecnologias Envolvidas |
|:---|:---|
| **Wizard 20 etapas** | Astro, React, Framer Motion, wizard-config.ts |
| **Geracao PRD/Prompt** | OpenAI, Gemini, OpenRouter, Astro API routes |
| **Chat IA flutuante** | OpenAI GPT-4o-mini, WebSocket-like streaming |
| **Audio TTS** | OpenAI TTS API, 4 vozes mapeadas por agente |
| **Analytics Dashboard** | GitHub REST API, Recharts, comparacao lado-a-lado |
| **Painel Admin SaaS** | Supabase admin, metricas MRR/Churn/ARPU/LTV/burn rate |
| **Biblioteca Tecnica** | 200+ tecnologias, 9 categorias, busca e filtros |
| **Sistema de planos** | 3 tiers (Explorador/Consultor/Arquiteto), validacao server-side |
| **Perfil & Avatares** | Supabase Auth + Storage, upload com preview |
| **Convite de usuarios** | API route server-side com service role key |
| **i18n** | 350+ chaves PT-BR/EN, troca instantanea via `data-i18n` |
| **Dark/Light Mode** | CSS custom properties, persistencia em localStorage |
| **Background 3D** | Three.js particle system animado |
| **Exportacao** | Markdown (.md), PDF, DOCX — restrito por plano |

---

## Seguranca

- **Supabase RLS** — Row Level Security em todas as tabelas, policies por `user_id`
- **Service Role Key** — Operacoes admin (createUser, deleteUser) apenas server-side
- **Validacao server-side** — Limites de projetos, caracteres do prompt e uso por plano validados na API
- **XSS Prevention** — Sanitizacao de inputs com `textContent`/`innerHTML` escape
- **Auth em todas as rotas** — Bearer token validado em cada API route
- **Rate limiting** — Contagem de uso mensal por tier de modelo

---

## Estrutura de Planos

| | Explorador | Consultor | Arquiteto |
|:---|:---|:---|:---|
| Projetos | 3 | 15 | Ilimitado |
| Prompt Base | 10.000 chars | 25.000 chars | 80.000 chars |
| Modelos LLM | Budget | Budget + Mid | Todos (Budget + Mid + Pro) |
| Audio TTS | — | Sim | Sim |
| Exportacao | Copiar | .md | .md, .pdf, .docx |
| Chat IA | 50/mes | 200/mes | Ilimitado |

---

## Banco de Dados

PostgreSQL via Supabase com as principais tabelas:

- `profiles` — Dados do usuario, role, avatar_url
- `subscriptions` — Plano ativo, status, datas
- `projects` — Projetos salvos com PRD e Prompt gerados
- `usage_logs` — Registro de uso por acao (chat, geracao), modelo e tokens
- `payments` — Historico de pagamentos via Asaas

---

## Desenvolvimento

```bash
# Instalar dependencias
npm install

# Rodar em desenvolvimento
npm run dev

# Build para producao
npm run build

# Preview do build
npm run preview
```

**Variaveis de ambiente necessarias:**

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GOOGLE_GEMINI_API_KEY=
OPENROUTER_API_KEY=
GITHUB_TOKEN=
```

> `.env` requer restart do dev server — Astro/Vite nao faz hot-reload de env vars.

---

## Roadmap

- Persistencia de projetos com historico completo de geracoes
- Templates pre-configurados por vertical (fintech, healthtech, edtech)
- Modo colaborativo para equipes
- Deploy direto via Vercel/Railway integrado
- Marketplace de plugins e extensoes de agentes

---

<div align="center">

## Licenca

Este software e **proprietario** e protegido por direitos autorais. Todos os direitos reservados.

**CNPJ:** 62.829.190/0001-01

<br />

---

**BuildCode** — Engenharia de Software com IA

Criado por **Miguel Oliveira**

</div>
