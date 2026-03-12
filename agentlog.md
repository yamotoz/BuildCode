# BuildCode — Guia Completo para Agentes de IA
# aqui é seu diario pessoal ia, o seu diario de bordo do projeto.
> **Leia este documento INTEIRO antes de fazer qualquer alteracao.**
> Ultima atualizacao: 2026-03-12

---

## 1. O QUE E O BUILDCODE

**BuildCode** e um SaaS de arquitetura de software assistida por IA. O usuario responde um questionario de 20 perguntas sobre seu projeto e recebe dois documentos:

- **PRD Estrategico** — Documento tecnico com stack, custos, seguranca, roadmap
- **Prompt Base** — Prompt otimizado para colar no Cursor/Claude Code/VS Code e iniciar o projeto com a IA

**Publico:** Desenvolvedores Junior/Pleno, estudantes, agencias, devs solo.

**Modelo de negocio:** Freemium com 3 planos — Explorador (gratis), Consultor (R$35/mes), Arquiteto (R$50/mes).

---

## 2. TECH STACK

| Camada | Tecnologia | Detalhes |
|--------|-----------|----------|
| **Framework** | Astro 5.x | SSG + SSR (`prerender = false` em `/app`, `/perfil`, `/api/*`). Zero-JS por padrao. |
| **React Islands** | React 18 + @astrojs/react | Componentes interativos via `client:load`. Usado na pagina Analytics. |
| **CSS** | Tailwind CSS 4.x | Tokens customizados em `global.css`. Utilitarios: `glass-panel`, `glow-border`. Light theme overrides FORA de @layer (com !important) para vencer utilities. |
| **Charts** | Recharts | Graficos React (Area, Bar, Line, Radar). Usado no Analytics dashboard. |
| **Animacoes** | Framer Motion + Three.js | Framer Motion para transicoes React. Three.js para particulas 3D no `/app`. |
| **Icones** | Lucide React + Material Symbols + SVGs locais | Lucide React nos componentes React. Material Symbols via CDN. Logos em `public/icons/`. |
| **Backend** | Supabase | Auth + PostgreSQL + Storage + RLS. Totalmente integrado. |
| **API Routes** | Astro Server Endpoints | `/api/github.ts`, `/api/chat.ts`, `/api/tts.ts`, `/api/invite-user`, `/api/skills-search.ts` |
| **Chat IA** | OpenAI gpt-4o-mini | Chat flutuante com personalidade de agente mentor. PROIBIDO gerar codigo. |
| **TTS** | OpenAI tts-1 | Audio de respostas longas (>780 chars) com vozes unicas por agente |
| **Deploy** | Node adapter | `@astrojs/node` para SSR standalone. |

---

## 3. ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── Header.astro              # Nav da landing (Criador, Precos, Analytics, Biblioteca)
│   ├── Footer.astro              # Rodape
│   └── analytics/                # Componentes React do Analytics Dashboard
│       ├── AnalyticsDashboard.tsx  # Dashboard de comparacao de stacks
│       ├── AdminDashboard.tsx     # Dashboard SaaS admin (MRR, Churn, ARPU, LTV, burn rate)
│       ├── MetricCard.tsx
│       ├── StarsChart.tsx
│       ├── RadarChart.tsx
│       ├── PulseGrid.tsx
│       └── AIInsight.tsx
├── data/
│   ├── wizard-config.ts          # 20 perguntas + 9 modelos LLM (budget/mid/pro)
│   ├── technologies.ts           # 150+ tecnologias (nome, logo, pros, cons, website)
│   ├── categories.ts             # Categorias: frontend, backend, data, infra, libs, devex, ai, design, mcp
│   ├── skills-map.ts             # URLs de referencia tecnica por tecnologia
│   ├── tooltips.ts               # Glossario de termos tecnicos (hover tooltips)
│   ├── agents.ts                 # 4 agentes mentores (The Boss, Azrael, Rizler, Anastasia)
│   └── i18n.ts                   # Traducoes PT-BR <-> EN (350+ chaves)
├── layouts/
│   └── Layout.astro              # Layout base (dark mode, fonts, meta, i18n script global)
├── lib/
│   └── supabase.ts               # Cliente Supabase + helpers (auth, profile, storage, user mgmt)
├── pages/
│   ├── index.astro               # Landing page
│   ├── app.astro                 # Questionario de 20 etapas + chat IA + geracao PRD/Prompt
│   ├── perfil.astro              # Perfil (dados, prefs, idioma, agente, LLM, uso, senha, admin)
│   ├── precos.astro              # Pagina de precos (3 planos, toggle mensal/anual, FAQ)
│   ├── admin.astro               # Dashboard admin (React island, acesso master/admin only)
│   ├── analytics.astro           # Dashboard de comparacao de stacks (React island)
│   ├── biblioteca.astro          # Biblioteca de tecnologias (grid + detalhe lateral)
│   ├── login.astro               # Tela de login (Supabase Auth funcional)
│   ├── privacidade.astro
│   ├── termos.astro
│   └── api/
│       ├── github.ts             # Proxy seguro para GitHub API
│       ├── chat.ts               # Proxy para OpenAI com personalidade de agente (PROIBIDO gerar codigo)
│       ├── tts.ts                # Text-to-Speech OpenAI tts-1 (vozes por agente)
│       ├── invite-user.ts        # Convite de usuario (server-side, service role key)
│       └── skills-search.ts      # Busca de skills/referencias tecnicas
├── styles/
│   └── global.css                # Design tokens, cores, fontes, utilitarios Tailwind
public/
├── agentes/                      # Imagens dos 4 agentes (Theboss.png, Azrael.png, etc + icons)
├── icons/                        # 150+ SVGs de logos de tecnologias
supabase/
└── dataall.sql                   # SQL COMPLETO do banco (tabelas, funcoes, triggers, RLS, storage)
```

---

## 4. AUTENTICACAO E PERFIL (Supabase)

### Auth
- Login via email/senha (Supabase Auth)
- Session gerenciada pelo Supabase client-side
- Token JWT disponivel via `supabase.auth.getSession()`

### Perfil (`profiles` table)
Campos: `id`, `full_name`, `avatar_url`, `seniority` (junior/pleno/senior), `theme` (dark/light), `role` (master/admin/user), `agent` (theboss/azrael/rizler/anastasia), `llm_model` (modelo OpenRouter), `preferred_language` (pt/en), `created_at`, `updated_at`

### RLS (Row Level Security)
- Usuarios veem/editam apenas seu proprio perfil
- Master/Admin podem ver todos os perfis
- Apenas master pode deletar perfis e alterar roles
- Projetos seguem a mesma logica (user_id based)

### Roles
- **master** — Acesso total, gestao de usuarios, unico (miguel@steniomello.com.br)
- **admin** — Pode ver todos os perfis/projetos
- **user** — Acesso apenas aos seus dados

### Storage
- Bucket `avatars` (publico para leitura)
- Upload: `{userId}/avatar.{ext}` com upsert
- Politicas RLS garantem que so o dono pode fazer upload/update/delete

### Variaveis de ambiente
```
PUBLIC_SUPABASE_URL="https://..."
PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."    # SERVER-ONLY — nunca expor no browser
GITHUB_TOKEN="github_pat_..."
OPENAI_API_KEY="sk-..."               # Para o chat proxy
```

**IMPORTANTE:** `.env` changes requerem restart do dev server (Astro/Vite nao faz hot-reload de env vars).

---

## 5. SISTEMA DE AGENTES MENTORES

### Os 4 Agentes
| ID | Nome | Personalidade | Cor |
|----|------|--------------|-----|
| `theboss` | The Boss | Gordon Ramsay + J. Jonah Jameson. Direto, pragmatico, foco em performance. | `#C0392B` |
| `azrael` | Azrael | Steve Jobs + Elon Musk. Visionario, UX-obsessivo, pensa 3 passos a frente. | `#8E44AD` |
| `rizler` | Rizler | Elliot Alderson. Paranoico, seguranca extrema, dark humor. | `#27AE60` |
| `anastasia` | Anastasia | Femme Fatale + Senior Lead. Fullstack, charme, harmonia front+back. | `#E91E63` |

### Arquitetura
- **`src/data/agents.ts`** — Interface `Agent` com id, name, title, image, icon, color, quote, description, tips, systemPrompt
- **Perfil (`/perfil`)** — Cards estilo champion-select do LoL com hover effects e loading screen animada
- **Chat widget (`/app`)** — Avatar, nome e greeting dinamicos baseados no agente selecionado
- **API chat (`/api/chat.ts`)** — Combina systemPrompt do agente + regras base, temperature 0.85, max_tokens 400
- **API TTS (`/api/tts.ts`)** — Vozes unicas por agente: theboss=onyx, azrael=echo, rizler=fable, anastasia=nova
- **REGRA CRITICA: Agentes NUNCA geram codigo.** Sao mentores — explicam conceitos, dao direcao, tiram duvidas.
- **Persistencia** — `localStorage('bc-agent')` + coluna `agent` no Supabase profiles

### Imagens
- **Pasta:** `public/agentes/` (lowercase)
- **Arquivos:** `Theboss.png`, `Azrael.png`, `Rizler.png`, `Anastasia.png` (full art)
- **Icones:** `Thebossicon.png`, `Azraelicon.png`, `Rizlericon.png`, `Anastasiaicon.png` (circular)

---

## 6. SELECAO DE MODELO LLM

### No Perfil (Modelo do Mentor)
O usuario escolhe qual LLM alimenta o chat do agente mentor. 9 modelos disponiveis:

| Tier | Modelos | Cor |
|------|---------|-----|
| **Budget (Free)** | Gemma 3 4B, Llama 3.1 8B, Mistral Small 3.1 | Emerald |
| **Mid** | Gemini 2.0 Flash, GPT-4o Mini, Claude 3.5 Haiku | Amber |
| **Pro** | Claude Sonnet 4, GPT-4o, Gemini 2.5 Pro | Purple |

- **Padrao:** `google/gemma-3-4b-it:free` (gratuito)
- **Persistencia:** `localStorage('bc-llm-model')` + coluna `llm_model` no Supabase profiles
- **Busca:** Campo de pesquisa filtra por nome, provider ou tier

### No Wizard (Step 21 — Idioma do Prompt)
9 idiomas pre-definidos (PT-BR, EN, ES, FR, DE, IT, JA, KO, ZH) + opcao "Outro" com input custom.
Seleciona em qual idioma o PRD e Prompt Base serao escritos.

### No Wizard (Step 22 — Modelo para Geracao)
Modelo separado selecionado no questionario para gerar o PRD e Prompt Base via OpenRouter.

---

## 7. ARQUITETURA DO APP (`/app` — O CORACAO)

### Fluxo do Questionario
20 perguntas divididas em 4 fases:

| Fase | Perguntas | Conteudo |
|------|-----------|----------|
| 1. Contexto | Q1-Q5 | Descricao do projeto, senioridade, escala, tipo, ferramenta |
| 2. Stack Tecnica | Q6-Q12 | Frontend, backend, MCPs, banco, skills, infra, persistencia |
| 3. Qualidade | Q13-Q20 | Auth, seguranca, realtime, codestyle, erros, i18n, integracoes, SEO, testes |
| 4. Resultado | Steps 21-24 | Idioma do Prompt -> Selecao LLM -> Loading -> Resultado (PRD + Prompt Base) |

### Visibilidade Dinamica de Steps
- Steps tem `visibleFor` (filtra por tipo de projeto: hobby/saas/enterprise)
- Steps tem `optionalFor` (steps pulaveis para certos tipos)
- Navegacao automaticamente pula steps escondidos

### Chat Widget (Pre-geracao)
1. Apos todas as perguntas, abre o chat com contexto do wizard
2. Agente pergunta se o usuario quer complementar algo
3. Usuario adiciona contexto extra via conversa
4. Ao confirmar, chat fecha automaticamente e geracao inicia
5. Contexto extra da conversa e incluido no prompt base gerado

### Geracao de Documentos
- **PRD Estrategico** — Stack justificada, arquitetura, estimativa de custo, roadmap, seguranca
- **Prompt Base** — Best practices por tecnologia, design system obrigatorio, regras de clean code, regra do agentlog.md
- **Exports:** PDF (via window.print), Word (Blob HTML), Markdown (Blob .md)

### Cuidados Criticos
- **NUNCA use backtick escapado dentro de `<script define:vars>`** — causa SyntaxError silencioso
- **Delegacao de eventos** para elementos dinamicos (resultados de busca)
- **Three.js canvas** precisa z-index `z-[2]` para ficar acima dos backgrounds decorativos

---

## 8. ANALYTICS (`/analytics`)

Dashboard React de comparacao de stacks via GitHub API:
- API proxy segura em `/api/github.ts` (token no server)
- Autocomplete com 90+ stacks agrupadas por categoria
- 4 Metric Cards, grafico configuravel (3 tipos x 3 periodos), Radar Chart, Pulse Grid, AI Insight
- React islands via `client:load` com Recharts + Framer Motion

---

## 9. SISTEMA i18n (PT-BR <-> EN)

- **`src/data/i18n.ts`** — 350+ chaves com `{ pt: "...", en: "..." }`
- **`Layout.astro`** — Script global aplica traducoes via `[data-i18n]`
- **localStorage:** chave `bc-lang`, padrao `'pt'`
- **API:** `window.bcGetLang()`, `window.bcSetLang(lang)`, `window.bcApplyTranslations(lang)`
- **Header** — Botao `#lang-toggle` alterna PT/EN (visivel apenas em telas >= 1400px)

---

## 10. DESIGN SYSTEM

### Cores (NUNCA use cores brutas do Tailwind)
```
primary:         #2E748B    -> text-primary, bg-primary, border-primary
primary-dark:    #1C4D5E    -> bg-primary-dark
secondary:       #5A9DB5    -> text-secondary
cta:             #F2AB6D    -> bg-cta, text-cta (botoes de acao)
background-dark: #0D0D0D    -> bg-background-dark
background-light:#151515    -> bg-background-light
surface-dark:    #121415    -> bg-surface-dark (cards, paineis)
surface-light:   #1A1C1E    -> bg-surface-light
border-color:    #2A3135    -> border-border-color
```

### Tipografia
- **Titulos/Branding:** `font-display` (Helvetica Now / Helvetica Neue)
- **Corpo/Descricoes:** `font-body` (Inter)
- **Labels tecnicos:** `text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400`
- **Monospace:** `font-mono` para outputs de codigo

### Padroes de UI
- **Dark Mode por padrao.** Light Mode disponivel (toggle no perfil, persiste via localStorage + Supabase).
- **Glass panels:** `glass-panel` para cards flutuantes com backdrop-blur
- **Transicoes:** `transition-all duration-300` em interacoes
- **Sombras glow:** `shadow-[0_0_20px_rgba(46,116,139,0.2)]` para elementos ativos
- **Cards de selecao (perfil):** border colorida + box-shadow + checkmark no selecionado

---

## 11. BANCO DE DADOS (Supabase)

### Arquivo unico: `supabase/dataall.sql`
Contem TUDO necessario para o funcionamento do backend:
1. Reset (comentado por seguranca)
2. Tabelas: `profiles`, `projects`
3. Funcoes: `get_my_role()`, `set_user_role()`, `handle_new_user()`, `handle_updated_at()`
4. Triggers: criacao automatica de perfil, updated_at
5. Politicas RLS: profiles e projects
6. Storage: bucket avatars + politicas
7. **Tabelas SaaS:** `subscriptions` (planos), `usage_logs` (consumo), `api_costs` (custos API)
8. Migracoes (comentadas, para bancos existentes)
9. Reload schema

### Tabelas SaaS (v2.3)
- **subscriptions** — Plano do usuario (explorador/consultor/arquiteto), ciclo (monthly/yearly), status, periodo
- **usage_logs** — Cada acao (prd_generation, chat_message, tts_audio, analytics_compare) com modelo, tokens, custo
- **api_costs** — Custos agregados por dia/provider/modelo para dashboard admin

### Trigger de novo usuario
Ao registrar no Auth, `handle_new_user()` cria automaticamente o perfil com:
- Nome e avatar do metadata do OAuth/signup
- Role `master` se email = `miguel@steniomello.com.br`, senao `user`

---

## 12. FUNCIONALIDADES IMPLEMENTADAS

- [x] Questionario de 20 etapas com navegacao dinamica por tipo de projeto
- [x] Geracao de PRD Estrategico e Prompt Base
- [x] Export: PDF, Word (.doc), Markdown (.md)
- [x] Best practices por tecnologia no Prompt Base (20+ frameworks)
- [x] Design System obrigatorio no Prompt Base
- [x] Chat IA flutuante com personalidade de agente mentor
- [x] Pre-geracao: chat abre para contexto extra antes de gerar
- [x] 4 Agentes mentores com champion-select UI e loading screen LoL-style
- [x] Selecao de modelo LLM para o chat do agente (9 modelos, 3 tiers)
- [x] Autenticacao Supabase (login/registro/logout)
- [x] Perfil completo: avatar upload, nome, senioridade, tema, agente, modelo LLM, senha
- [x] Sistema de roles (master/admin/user) com RLS
- [x] Painel de gestao de usuarios (master only): listar, alterar role, convidar, deletar
- [x] Busca de tecnologias no questionario (filtra por categoria)
- [x] Biblioteca com 200+ tecnologias em 9 categorias, busca, filtro, detalhe lateral, mobile bottom nav
- [x] Three.js particulas animadas no background do `/app`
- [x] Analytics Dashboard: comparacao de stacks via GitHub API
- [x] Sistema i18n completo (PT-BR <-> EN) com 350+ chaves em todas as paginas
- [x] Responsive design (breakpoints otimizados)
- [x] GitHub analytics comparison API
- [x] TTS audio nas respostas do agente (vozes unicas por agente, >780 chars)
- [x] Agentes humanizados com regra anti-codigo (mentores only)
- [x] Pagina de precos com 3 planos (Explorador/Consultor/Arquiteto), toggle mensal/anual, FAQ
- [x] Seletor de idioma persistente no perfil (PT/EN) com tooltip informativo
- [x] Selecao de idioma do prompt no wizard (9 idiomas + custom)
- [x] Aba de Uso no perfil (plano atual, creditos, grafico por modelo)
- [x] Dashboard administrativo (MRR, Churn, ARPU, LTV, burn rate, graficos Recharts)
- [x] Tema claro/escuro funcional em todo o site (localStorage + Supabase persist)
- [x] Tabelas SaaS no banco (subscriptions, usage_logs, api_costs)
- [x] Badges "nao recomendado" para opcoes inadequadas ao tipo de projeto
- [x] Biblioteca: 3 novas categorias (IA Generativa, Design & Inspiracao, MCP Servers) com 40+ ferramentas
- [x] Biblioteca: tags especiais (ex: "IA sem Censura" com badge pulsante vermelho)
- [x] Biblioteca: barra de categorias mobile (bottom nav com scroll horizontal)
- [x] Precos: permissoes reais por plano (agentes, PRDs, LLMs, caracteres, import, audio)
- [x] SQL idempotente: DROP IF EXISTS antes de CREATE TRIGGER/POLICY no dataall.sql
- [x] Dark/Light mode: CSS overrides movidos para fora de @layer com !important (fix Tailwind v4)
- [x] User management: guard `usersLoading` + event delegation com `{ once: true }` (fix loop infinito)
- [x] i18n global: data-i18n em precos.astro (56), perfil.astro (32), admin.astro (6)
- [x] 13 novos SVGs de logos em public/icons/ (perplexity, huggingface, poe, ollama, etc)
- [x] Landing page redesign completo: 9 secoes (Hero, O Problema, Realidade do Mercado, Por Que BuildCode, Diferenciais, A Solucao, Cyberdyne Security, Serenity QA, CTA Final)
- [x] Footer profissional: 4 colunas (Brand+CNPJ, Produto, Recursos, Legal) + frase inspiracional
- [x] Cyberdyne Section: tema dark permanente (preto + vermelho), preservado em light mode via CSS scoped
- [x] Serenity Section: tema claro/dourado/marmore, preservado em ambos os temas
- [x] CTA Card: classe `.cta-card-dark` para manter fundo escuro em light mode
- [x] Avatares dos agentes na landing: imagens reais (Thebossicon.png, etc) em vez de iniciais texto
- [x] Remocao de todos os em dashes " — " dos textos visiveis
- [x] Fix: aceite de termos travando — fallback direto via Supabase client + alert() para erros
- [x] Light mode global: CSS overrides completos para todas as paginas (60+ regras)
- [x] Logo swap dinamico: `data-dark`/`data-light` + MutationObserver em TODAS as paginas
- [x] Logo Logowhitemodeloff.png para tema claro, logo_backofff.png para tema escuro
- [x] Biblioteca light mode: `.tech-card .bg-black` preserva fundo escuro para icones SVG brancos
- [x] Admin Dashboard light mode: classe `.admin-dashboard` + CSS overrides para React inline styles
- [x] Analytics Dashboard theme-aware: hook `useTheme()` reativo em todos os 6 componentes React
- [x] Analytics: cores de graficos, grids, tooltips, eixos, dots, controles — todos adaptam ao tema
- [x] Wizard tip text visivel em light mode (override `bg-surface-dark/70`)
- [x] Hero subtitle mais escuro em light mode (`text-slate-400` → `#4b5563`)
- [x] API `/api/accept-terms.ts` para registrar aceite de termos com IP
- [x] API `/api/signup.ts` para registro de novos usuarios
- [x] Integracao Asaas (pasta `/api/asaas/`) para pagamentos

## 13. FUNCIONALIDADES PENDENTES / ROADMAP

- [ ] Integracao Stripe/Asaas para pagamento dos planos (em andamento)
- [ ] Persistencia de respostas (salvar progresso do questionario como projeto)
- [ ] Historico de geracoes por usuario (tabela projects funcional, UI pendente)
- [ ] Integracao real com OpenRouter para geracao de PRD/Prompt via LLM
- [ ] Mobile responsiveness avancado (biblioteca OK, outras telas podem precisar ajuste)
- [ ] SEO e Open Graph tags
- [ ] Animacoes de transicao entre fases (Three.js camera dive)

---

## 14. COMANDOS

```bash
npm run dev        # Dev server (http://localhost:4321)
npm run build      # Build de producao
npm run preview    # Preview do build
```

---

## 15. REGRAS PARA O AGENTE

1. **Leia antes de alterar.** Nunca modifique codigo que voce nao leu.
2. **Use as cores do design system.** Zero `text-blue-500` ou cores brutas do Tailwind.
3. **Cuidado com `<script define:vars>`.** Nao escape backticks. Nao use TypeScript puro dentro.
4. **Delegacao de eventos** para elementos dinamicos. Listeners diretos se perdem ao recriar DOM.
5. **Teste o build** (`npx astro build`) apos alteracoes significativas.
6. **Sem over-engineering.** O projeto prioriza simplicidade e velocidade.
7. **Estetica e prioridade.** A UI e o pilar de credibilidade. Cada pixel importa.
8. **Portugues (PT-BR)** para todo texto visivel ao usuario. Adicione chaves i18n para novos textos.
9. **Performance:** Icones locais, zero-JS onde possivel, lazy load para imagens.
10. **Nao crie arquivos desnecessarios.** Edite os existentes.
11. **API routes** — Toda comunicacao com APIs externas deve passar por `src/pages/api/`. Nunca exponha tokens no frontend.
12. **SUPABASE_SERVICE_ROLE_KEY** e server-only. Nunca use no client. Operacoes admin (createUser, deleteUser) vao por API routes.
13. **Imagens dos agentes** estao em `public/agentes/` (lowercase). Paths: `/agentes/Theboss.png`, etc.
14. **Agente e LLM do perfil** sao para o chat mentor, nao para geracao de PRD/Prompt.
15. **SQL do banco** esta em `supabase/dataall.sql`. Arquivo unico com tudo.
16. **Restart do dev server** apos alterar `.env` — Astro/Vite nao faz hot-reload de env vars.
17. **Nav da landing:** Criador | Precos | Analytics | Biblioteca (nesta ordem).
18. **Planos:** Explorador (gratis), Consultor (R$35/mes), Arquiteto (R$50/mes, elite).
19. **Dashboard admin** (`/admin`) — Acesso apenas master/admin. Usa React island com Recharts.
20. **Tailwind v4 cascade layers:** Light theme overrides DEVEM ficar FORA de `@layer base` e usar `!important`, pois utilities tem prioridade maior que base layer no Tailwind v4.
21. **Event listeners em listas dinamicas:** Use event delegation no container (tbody, ul) em vez de listeners por elemento. Use `{ once: true }` ou guarda booleana para evitar stacking/loops.
22. **SQL idempotente:** Sempre use `DROP ... IF EXISTS` antes de `CREATE TRIGGER/POLICY` no dataall.sql para que o arquivo possa ser executado multiplas vezes.
23. **Simple Icons:** Slug correto e `authdotjs` (nao `authjs`). CDN fallback: `cdn.jsdelivr.net/npm/simple-icons@latest/icons/`.
24. **Biblioteca mobile:** Sidebar escondida em mobile (`hidden md:flex`), barra de categorias fixa no bottom (`fixed bottom-0`).
25. **Technologies tags:** Interface `Technology` suporta `tags?: string[]` para badges especiais (ex: "IA sem Censura").
26. **Light mode logo swap:** Toda pagina que exibe o logo deve ter `data-dark="/logo_backofff.png"` e `data-light="/Logowhitemodeloff.png"` no `<img>`, com script `updatePageLogo()` + MutationObserver.
27. **React theme-aware components:** Componentes React com inline styles devem usar o hook `useTheme()` de `src/components/analytics/useTheme.ts` para adaptar cores ao tema claro/escuro.
28. **CSS [style*=] selectors:** Para override de inline styles em server-rendered HTML, use seletores `html.light [style*="background: #xxx"]` no global.css. Nao e confiavel para React (browser normaliza cores).
29. **Secoes com tema fixo:** Cyberdyne (`.cyberdyne-section`) sempre dark, Serenity (`.serenity-section`) sempre claro, CTA (`.cta-card-dark`) sempre escuro — scoped overrides no CSS.
30. **Footer CNPJ:** 62.829.190/0001-01 — deve aparecer no footer de toda pagina que usa Footer.astro.
