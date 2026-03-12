<div align="center">

# BuildCode

### AI-Powered Software Architecture Engine

[![Astro](https://img.shields.io/badge/Astro-5.17-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Supabase](https://img.shields.io/badge/Supabase-2.98-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Node.js](https://img.shields.io/badge/Node.js-SSR-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#license)

<br />

**Decisoes inteligentes de arquitetura, potencializadas por Inteligencia Artificial.**

Selecione stacks, mitigue riscos e escale com integridade — tudo em um unico sistema.

<br />

<video src="toursystem.webm" autoplay loop muted playsinline width="100%" style="border-radius: 16px; border: 1px solid #2A3135;"></video>

<br />

</div>

---

## Sobre o Projeto

**BuildCode** e um SaaS de engenharia de software que atua como um **arquiteto virtual inteligente**. Atraves de um wizard interativo de 20 etapas, o sistema conduz o usuario por decisoes criticas de arquitetura — desde a escolha de ferramentas e frameworks ate estrategias de deploy e infraestrutura — gerando ao final um **PRD (Product Requirements Document)** completo e prompts otimizados para LLMs.

O sistema combina uma base de dados proprietaria de 200+ tecnologias, analise comparativa via GitHub API, 4 agentes mentores com personalidades unicas, e um motor de decisao que considera senioridade, tipo de projeto, escala e restricoes tecnicas para recomendar a stack ideal.

---

## Funcionalidades Principais

| Funcionalidade | Descricao |
|:---|:---|
| **Wizard de Arquitetura** | 20 etapas guiadas cobrindo ferramenta, frontend, backend, banco de dados, infra, testes, CI/CD e mais |
| **Motor de Decisao IA** | Analise inteligente baseada em senioridade, escopo, escala e restricoes do projeto |
| **Gerador de PRD** | Documento de requisitos completo gerado automaticamente via LLM (OpenRouter) |
| **Prompt Engineering** | Prompts base otimizados para LLMs (Claude, GPT, Gemini) prontos para uso |
| **4 Agentes Mentores** | The Boss, Azrael, Rizler e Anastasia — cada um com personalidade, voz TTS e estilo unico |
| **Chat IA Flutuante** | Widget de chat com agente mentor integrado ao wizard, com audio TTS |
| **Analytics Dashboard** | Comparacao lado-a-lado de tecnologias com dados em tempo real do GitHub (Recharts) |
| **Admin Dashboard** | Painel SaaS completo com MRR, Churn, ARPU, LTV, burn rate e graficos |
| **Biblioteca Tecnica** | Catalogo curado de 200+ tecnologias em 9 categorias com busca, filtro e detalhe |
| **Sistema de Perfis** | Gestao completa de usuario com avatar, senioridade, tema, agente e modelo LLM |
| **Controle de Acesso** | Hierarquia de roles: Master → Admin → User com RLS no Supabase |
| **Convite de Usuarios** | Sistema seguro de invite via API server-side com service role key |
| **Internacionalizacao** | Suporte completo PT-BR ↔ EN com 350+ chaves e troca instantanea |
| **Dark/Light Mode** | Tema claro e escuro global, com logo swap dinamico e persistencia |
| **Background 3D** | Cena Three.js imersiva no wizard para experiencia premium |
| **Pagina de Precos** | 3 planos (Explorador/Consultor/Arquiteto), toggle mensal/anual, FAQ |
| **Termos & Privacidade** | Paginas legais com aceite obrigatorio no primeiro login |

---

## Stack Tecnologica

### Core Framework

| Tecnologia | Versao | Papel |
|:---|:---|:---|
| **Astro** | 5.17 | Framework principal — SSR com Node adapter, component islands |
| **React** | 19.2 | Componentes interativos (Analytics, Admin Dashboard) |
| **TypeScript** | Strict | Tipagem estatica em todo o codebase |
| **Vite** | 6.x | Build tool e dev server (integrado ao Astro) |

### Backend & Dados

| Tecnologia | Versao | Papel |
|:---|:---|:---|
| **Supabase** | 2.98 | Auth, PostgreSQL, Storage (avatars), RLS, RPC functions |
| **Node.js** | SSR | Adapter Astro para server-side rendering (`@astrojs/node`) |
| **PostgreSQL** | via Supabase | Banco relacional com Row Level Security, triggers e functions |

### Frontend & UI

| Tecnologia | Versao | Papel |
|:---|:---|:---|
| **Tailwind CSS** | 4.2 | Utility-first CSS com custom theme (design system proprietario) |
| **Three.js** | 0.183 | Background 3D interativo no wizard (particulas animadas) |
| **Framer Motion** | 12.35 | Animacoes e transicoes nos componentes React |
| **Recharts** | 3.7 | Graficos e visualizacoes de dados (Area, Bar, Line, Radar, Pie) |
| **Lucide React** | 0.577 | Biblioteca de icones para componentes React |
| **Material Symbols** | CDN | Icones do sistema principal (Google) |
| **Google Fonts** | CDN | Inter (body) + Helvetica Now (display) |

### APIs & Integracoes

| Servico | Uso |
|:---|:---|
| **OpenAI GPT-4o-mini** | Chat IA flutuante com personalidade de agente mentor |
| **OpenAI TTS (tts-1)** | Text-to-Speech com vozes unicas por agente (onyx, echo, fable, nova) |
| **OpenRouter** | 9 modelos LLM (3 tiers: Budget/Mid/Pro) para geracao de PRD e Prompt Base |
| **GitHub API v3** | Dados de repositorios para comparacao de tecnologias (stars, forks, commit activity) |
| **Supabase Auth** | Autenticacao email/password, session management, password recovery |
| **Supabase Storage** | Upload e serving publico de avatares de usuario (bucket `avatars`) |
| **Supabase Admin API** | Criacao/delecao de usuarios via service role key (server-side only) |
| **Asaas** | Integracao de pagamentos para os planos do SaaS |

### Bibliotecas & Dependencias

| Pacote | Uso |
|:---|:---|
| **@supabase/supabase-js** | Cliente Supabase para auth, database e storage |
| **@astrojs/react** | Integracao React como component islands no Astro |
| **@astrojs/node** | Adapter SSR para deploy com Node.js |
| **recharts** | Graficos interativos (AreaChart, BarChart, LineChart, RadarChart, PieChart) |
| **framer-motion** | Animacoes declarativas para React (fade, slide, scale) |
| **lucide-react** | +1000 icones SVG como componentes React |
| **three** | Engine 3D para particulas animadas no background do wizard |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────┐ │
│  │  Wizard   │  │Analytics │  │Biblioteca │  │ Perfil │ │
│  │  (Astro)  │  │ (React)  │  │  (Astro)  │  │(Astro) │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └───┬────┘ │
│       │              │              │             │       │
│  ┌────┴──────────────┴──────────────┴─────────────┴────┐ │
│  │           Supabase Client (supabase-js)              │ │
│  │        Auth · Database · Storage · Realtime           │ │
│  └──────────────────────┬───────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────┐
│                   SERVIDOR (Astro SSR)                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ /api/github  │  │ /api/chat    │  │ /api/invite-user│ │
│  │ GitHub proxy │  │ OpenAI proxy │  │ Admin ops       │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ /api/tts    │  │ /api/signup  │  │ /api/asaas/*    │ │
│  │ TTS proxy   │  │ User register│  │ Pagamentos      │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────┬────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────┐
│                     SUPABASE CLOUD                        │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │   Auth    │  │PostgreSQL│  │ Storage │  │   RPC    │  │
│  │  (JWT)    │  │  + RLS   │  │(Avatars)│  │Functions │  │
│  └──────────┘  └──────────┘  └─────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Sistema de Roles & Permissoes

```
Master ─── Pode tudo: gerenciar usuarios, alterar roles, deletar perfis
  │
Admin ──── Pode convidar novos usuarios (user/admin)
  │
User ───── Acesso ao wizard, biblioteca, analytics + perfil proprio
```

Implementado via **Row Level Security (RLS)** no PostgreSQL com `SECURITY DEFINER` functions.

---

## Getting Started

### Pre-requisitos

- **Node.js** 18+
- **npm** ou **pnpm**
- Conta no **Supabase** (projeto criado)

### 1. Clone o repositorio

```bash
git clone https://github.com/seu-usuario/buildcode.git
cd buildcode
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Configure as variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
GITHUB_TOKEN="seu-github-pat"
OPENAI_API_KEY="sua-openai-key"
```

> **Seguranca:** `SUPABASE_SERVICE_ROLE_KEY` e `OPENAI_API_KEY` sao server-only (sem prefixo `PUBLIC_`). Nunca exponha no client-side.

### 4. Configure o banco de dados

Execute o conteudo de `supabase/dataall.sql` no **Supabase SQL Editor**. Isso cria:

- Tabelas: `profiles`, `projects`, `subscriptions`, `usage_logs`, `api_costs`
- Triggers: criacao automatica de perfil, updated_at
- Functions: `get_my_role()`, `set_user_role()`, `handle_new_user()`
- Politicas RLS completas
- Bucket `avatars` no Storage com policies

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O sistema estara disponivel em `http://localhost:4321`

---

## Comandos

| Comando | Acao |
|:---|:---|
| `npm run dev` | Inicia o servidor de desenvolvimento em `localhost:4321` |
| `npm run build` | Build de producao para `./dist/` |
| `npm run preview` | Preview do build de producao local |

---

## Design System

O BuildCode utiliza um design system proprietario construido sobre Tailwind CSS 4.2 com variaveis CSS customizadas:

| Token | Valor | Uso |
|:---|:---|:---|
| `--color-primary` | `#2E748B` | Cor principal (teal) |
| `--color-primary-dark` | `#1C4D5E` | Variante escura |
| `--color-secondary` | `#5A9DB5` | Cor secundaria |
| `--color-cta` | `#F2AB6D` | Call-to-action (amber) |
| `--color-background-dark` | `#0D0D0D` | Background principal |
| `--color-surface-dark` | `#121415` | Superficies elevadas |
| `--color-border-color` | `#2A3135` | Bordas |

### Utilities Customizadas

- **`glass-panel`** — Glassmorphism com backdrop-blur e borda translucida
- **`glow-border`** — Borda com gradiente luminoso animado

### Suporte a Temas

- **Dark mode** (padrao) — Tema escuro premium
- **Light mode** — Tema claro com overrides CSS fora de `@layer` (fix Tailwind v4) com `!important`
- Persistencia via `localStorage` + coluna `theme` no Supabase profiles
- Logo swap dinamico: `data-dark`/`data-light` + MutationObserver

---

## Seguranca

- **Row Level Security (RLS)** em todas as tabelas do Supabase
- **Service Role Key** isolada em API routes server-side (nunca no browser)
- **JWT validation** em endpoints protegidos
- **Role verification** antes de operacoes admin
- **SECURITY DEFINER** functions para operacoes que bypasam RLS de forma controlada
- **Storage policies** garantem que cada usuario so modifica seu proprio avatar
- **API routes** como proxy para todas as APIs externas (OpenAI, GitHub, Asaas)

---

## Roadmap

- [ ] Integracao completa Asaas/Stripe para pagamentos
- [ ] Persistencia de respostas do questionario como projetos
- [ ] Historico de geracoes por usuario
- [ ] Sistema de templates de projeto pre-configurados
- [ ] Modo colaborativo (equipes)
- [ ] Integracao com Vercel/Railway para deploy direto
- [ ] SEO e Open Graph tags

---

## Tecnologias & Ferramentas

<div align="center">

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub_API-181717?style=flat-square&logo=github&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-F56565?style=flat-square&logo=lucide&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=googlefonts&logoColor=white)

</div>

---

## License

Este projeto e **proprietario** e de uso restrito. Todos os direitos reservados.

CNPJ: 62.829.190/0001-01

---

<div align="center">

**BuildCode** — Engenharia de Elite para Projetos Visionarios

*Sistemas de design que transcendem o comum. Sua visao, orquestrada por inteligencia artificial.*

<br />

Built with precision by **Stenio Mello**

</div>
