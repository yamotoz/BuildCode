<div align="center">

# BuildCode

### AI-Powered Software Architecture Engine

[![Astro](https://img.shields.io/badge/Astro-5.17-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![Supabase](https://img.shields.io/badge/Supabase-2.98-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-SSR-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#license)

<br />

**Decisões inteligentes de arquitetura, potencializadas por Inteligência Artificial.**

Selecione stacks, mitigue riscos e escale com integridade — tudo em um único sistema.

<br />

<img src="public/img/Buildcodeprint.png" alt="BuildCode — Software Architecture Engine" width="100%" style="border-radius: 16px; border: 1px solid #2A3135;" />

<br />

</div>

---

## Sobre o Projeto

**BuildCode** é um SaaS de engenharia de software que atua como um **arquiteto virtual inteligente**. Através de um wizard interativo de 20 etapas, o sistema conduz o usuário por decisões críticas de arquitetura — desde a escolha de ferramentas e frameworks até estratégias de deploy e infraestrutura — gerando ao final um **PRD (Product Requirements Document)** completo e prompts otimizados para LLMs.

O sistema combina uma base de dados proprietária de tecnologias, análise comparativa via GitHub API, e um motor de decisão que considera senioridade, tipo de projeto, escala e restrições técnicas para recomendar a stack ideal.

---

## Funcionalidades Principais

| Funcionalidade | Descrição |
|:---|:---|
| **Wizard de Arquitetura** | 20 etapas guiadas cobrindo ferramenta, frontend, backend, banco de dados, infra, testes, CI/CD e mais |
| **Motor de Decisão IA** | Análise inteligente baseada em senioridade, escopo, escala e restrições do projeto |
| **Gerador de PRD** | Documento de requisitos completo gerado automaticamente ao final do wizard |
| **Prompt Engineering** | Prompts base otimizados para LLMs (Claude, GPT, Gemini) prontos para uso |
| **Analytics Dashboard** | Comparação lado-a-lado de tecnologias com dados em tempo real do GitHub |
| **Biblioteca Técnica** | Catálogo curado de 40+ tecnologias com prós, contras, use cases e métricas |
| **Sistema de Perfis** | Gestão completa de usuário com avatar, senioridade e temas (dark/light) |
| **Controle de Acesso** | Hierarquia de roles: Master → Admin → User com RLS no Supabase |
| **Convite de Usuários** | Sistema seguro de invite via API server-side com service role key |
| **Internacionalização** | Suporte completo PT-BR ↔ EN com troca instantânea |
| **Background 3D** | Cena Three.js imersiva no wizard para experiência premium |

---

## Stack Tecnológica

### Core Framework

| Tecnologia | Versão | Papel |
|:---|:---|:---|
| **Astro** | 5.17 | Framework principal — SSR com Node adapter, component islands |
| **React** | 19.2 | Componentes interativos (Analytics Dashboard) |
| **TypeScript** | Strict | Tipagem estática em todo o codebase |

### Backend & Dados

| Tecnologia | Versão | Papel |
|:---|:---|:---|
| **Supabase** | 2.98 | Auth, PostgreSQL, Storage (avatars), RLS, RPC functions |
| **Node.js** | SSR | Adapter Astro para server-side rendering (`@astrojs/node`) |
| **PostgreSQL** | via Supabase | Banco relacional com Row Level Security e triggers |

### Frontend & UI

| Tecnologia | Versão | Papel |
|:---|:---|:---|
| **Tailwind CSS** | 4.2 | Utility-first CSS com custom theme (design system proprietário) |
| **Three.js** | 0.183 | Background 3D interativo no wizard |
| **Framer Motion** | 12.35 | Animações no React (Analytics) |
| **Recharts** | 3.7 | Gráficos e visualizações de dados |
| **Lucide React** | 0.577 | Biblioteca de ícones |
| **Material Symbols** | CDN | Ícones do sistema principal |
| **Google Fonts** | CDN | Inter (body) + Helvetica Now (display) |

### APIs & Integrações

| Serviço | Uso |
|:---|:---|
| **GitHub API v3** | Dados de repositórios para comparação de tecnologias (stars, forks, commit activity) |
| **Supabase Auth** | Autenticação email/password, session management, password recovery |
| **Supabase Storage** | Upload e serving público de avatares de usuário |
| **Supabase Admin API** | Criação de usuários via service role key (server-side only) |

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
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │  /api/github.ts   │  │  /api/invite-user.ts         │  │
│  │  GitHub API proxy │  │  Admin ops (service role key) │  │
│  └──────────────────┘  └──────────────────────────────┘  │
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

### Fluxo de Autenticação

```
Login → signInWithPassword() → Session (localStorage)
                                      │
                     onAuthStateChange(INITIAL_SESSION)
                                      │
                              ┌───────┴───────┐
                              │  session?      │
                              │  ├─ Yes → Pill │
                              │  └─ No → Login │
                              └────────────────┘
```

### Sistema de Roles & Permissões

```
Master ─── Pode tudo: gerenciar usuários, alterar roles, deletar perfis
  │
Admin ──── Pode convidar novos usuários (user/admin)
  │
User ───── Acesso ao wizard, biblioteca, analytics + perfil próprio
```

Implementado via **Row Level Security (RLS)** no PostgreSQL com `SECURITY DEFINER` functions.

---

## Estrutura do Projeto

```
BuildCode/
├── public/
│   ├── icons/              # SVGs de tecnologias (local, máxima performance)
│   ├── img/                # Imagens do projeto
│   ├── *.mp4               # Vídeos de background (hero)
│   └── *.png               # Logos e favicons
│
├── src/
│   ├── components/
│   │   ├── Header.astro         # Header da landing page (auth pill)
│   │   ├── Footer.astro         # Footer global
│   │   └── analytics/           # Componentes React do dashboard
│   │
│   ├── data/
│   │   ├── technologies.ts      # Base de 40+ tecnologias curadas
│   │   ├── wizard-config.ts     # Configuração das 20 etapas do wizard
│   │   ├── categories.ts        # Categorias da biblioteca
│   │   ├── tooltips.ts          # Tooltips contextuais do wizard
│   │   ├── skills-map.ts        # Mapa de skills por tecnologia
│   │   └── i18n.ts              # Traduções PT-BR ↔ EN
│   │
│   ├── layouts/
│   │   └── Layout.astro         # Layout base (i18n system, theme, fonts)
│   │
│   ├── lib/
│   │   └── supabase.ts          # Cliente Supabase + auth/profile helpers
│   │
│   ├── pages/
│   │   ├── index.astro          # Landing page
│   │   ├── app.astro            # Wizard de arquitetura (core do sistema)
│   │   ├── login.astro          # Autenticação
│   │   ├── perfil.astro         # Perfil do usuário
│   │   ├── analytics.astro      # Dashboard de analytics
│   │   ├── biblioteca.astro     # Biblioteca técnica
│   │   ├── termos.astro         # Termos de uso
│   │   ├── privacidade.astro    # Política de privacidade
│   │   └── api/
│   │       ├── github.ts        # Proxy GitHub API (150+ repos mapeados)
│   │       └── invite-user.ts   # Convite de usuários (server-side)
│   │
│   └── styles/
│       └── global.css           # Design system + Tailwind config + light theme
│
├── astro.config.mjs             # Astro config (Node SSR + React + Tailwind)
├── supabase_setup.sql           # Setup completo do banco (tabelas, RLS, triggers)
├── package.json
└── .env                         # Variáveis de ambiente (não commitado)
```

---

## Getting Started

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **pnpm**
- Conta no **Supabase** (projeto criado)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/buildcode.git
cd buildcode
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
GITHUB_TOKEN="seu-github-pat"
```

> **Segurança:** `SUPABASE_SERVICE_ROLE_KEY` é server-only (sem prefixo `PUBLIC_`). Nunca exponha no client-side.

### 4. Configure o banco de dados

Execute o conteúdo de `supabase_setup.sql` no **Supabase SQL Editor**. Isso cria:

- Tabela `profiles` com RLS
- Triggers de auto-criação de perfil no registro
- Functions de controle de role (master only)
- Bucket `avatars` no Storage com policies

### 5. Crie o usuário master

No **Supabase Dashboard** → Authentication → Users → Add User:
- Defina email e senha
- Marque **Auto Confirm User**
- O trigger automaticamente atribui `role: 'master'` ao email configurado

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:4321`

---

## Comandos

| Comando | Ação |
|:---|:---|
| `npm run dev` | Inicia o servidor de desenvolvimento em `localhost:4321` |
| `npm run build` | Build de produção para `./dist/` |
| `npm run preview` | Preview do build de produção local |
| `npm run astro` | CLI do Astro (e.g., `astro add`, `astro check`) |

---

## Design System

O BuildCode utiliza um design system proprietário construído sobre Tailwind CSS 4.2 com variáveis CSS customizadas:

| Token | Valor | Uso |
|:---|:---|:---|
| `--color-primary` | `#2E748B` | Cor principal (teal) |
| `--color-primary-dark` | `#1C4D5E` | Variante escura |
| `--color-secondary` | `#5A9DB5` | Cor secundária |
| `--color-cta` | `#F2AB6D` | Call-to-action (amber) |
| `--color-background-dark` | `#0D0D0D` | Background principal |
| `--color-surface-dark` | `#121415` | Superfícies elevadas |
| `--color-border-color` | `#2A3135` | Bordas |

### Utilities Customizadas

- **`glass-panel`** — Glassmorphism com backdrop-blur e borda translúcida
- **`glow-border`** — Borda com gradiente luminoso animado

### Suporte a Temas

- **Dark mode** (padrão) — Tema escuro premium
- **Light mode** — Tema claro com override de variáveis via `html.light`
- Persistência via `localStorage` com aplicação instantânea (sem flash)

---

## Segurança

- **Row Level Security (RLS)** em todas as tabelas do Supabase
- **Service Role Key** isolada em API routes server-side (nunca no browser)
- **JWT validation** em endpoints protegidos
- **Role verification** antes de operações admin
- **SECURITY DEFINER** functions para operações que bypasam RLS de forma controlada
- **Storage policies** garantem que cada usuário só modifica seu próprio avatar

---

## Roadmap

- [ ] Integração direta com LLMs (Gemini, Claude) para decisão de arquitetura
- [ ] Sistema de templates de projeto pré-configurados
- [ ] Exportação de PRD em PDF
- [ ] Histórico de decisões de arquitetura por projeto
- [ ] Dashboard de métricas de uso do sistema
- [ ] Modo colaborativo (equipes)
- [ ] Integração com Vercel/Railway para deploy direto

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
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub_API-181717?style=flat-square&logo=github&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## License

Este projeto é **proprietário** e de uso restrito. Todos os direitos reservados.

---

<div align="center">

**BuildCode** — Engenharia de Elite para Projetos Visionários

*Sistemas de design que transcendem o comum. Sua visão, orquestrada por inteligência artificial.*

<br />

Built with precision by **Stenio Mello**

</div>
