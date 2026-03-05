# BuildCode — Guia Completo para Agentes de IA

> **Leia este documento INTEIRO antes de fazer qualquer alteração.**
> Última atualização: 2026-03-05

---

## 1. O QUE É O BUILDCODE

**BuildCode** é um SaaS de arquitetura de software assistida por IA. O usuário responde um questionário de 20 perguntas sobre seu projeto e recebe dois documentos:

- **PRD Estratégico** — Documento técnico com stack, custos, segurança, roadmap
- **Prompt Base** — Prompt otimizado para colar no Cursor/Claude Code/VS Code e iniciar o projeto com a IA

**Público:** Desenvolvedores Júnior/Pleno, estudantes, agências, devs solo.

**Modelo de negócio:** Freemium (3 gerações grátis → assinatura ~R$15/mês via Stripe).

---

## 2. TECH STACK

| Camada | Tecnologia | Detalhes |
|--------|-----------|----------|
| **Framework** | Astro 5.x | SSG + SSR (`prerender = false` em `/app`, `/analytics`, `/api/*`). Zero-JS por padrão. |
| **React Islands** | React 18 + @astrojs/react | Componentes interativos via `client:load`. Usado na página Analytics. |
| **CSS** | Tailwind CSS 4.x | Tokens customizados em `global.css`. Utilitários: `glass-panel`, `glow-border`. |
| **Charts** | Recharts | Gráficos React (Area, Bar, Line, Radar). Usado no Analytics dashboard. |
| **Animações** | Framer Motion + Three.js | Framer Motion para transições React. Three.js para partículas 3D no `/app`. |
| **Ícones** | Lucide React + Material Symbols + SVGs locais | Lucide React nos componentes React. Material Symbols via CDN. Logos em `public/icons/`. |
| **Backend (futuro)** | Supabase | Auth + PostgreSQL + Storage. Ainda não implementado. |
| **API Routes** | Astro Server Endpoints | `src/pages/api/github.ts` — proxy seguro para GitHub API. |
| **Deploy** | Node adapter | `@astrojs/node` para SSR standalone. |

---

## 3. ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── Header.astro              # Nav da landing (links: Problema, Solução, Analytics, Biblioteca)
│   ├── Footer.astro              # Rodapé
│   └── analytics/                # ★ Componentes React do Analytics Dashboard
│       ├── AnalyticsDashboard.tsx # Orquestrador principal + Autocomplete de stacks
│       ├── MetricCard.tsx         # Cards de métricas (Stars, Commits, Issues, Forks)
│       ├── StarsChart.tsx         # Gráfico configurável (Area/Bar/Line × Semana/Mês/Trimestre)
│       ├── RadarChart.tsx         # Radar chart 5 eixos (Popularidade, Comunidade, etc.)
│       ├── PulseGrid.tsx          # Heatmap estilo GitHub (52 semanas × 7 dias)
│       └── AIInsight.tsx          # Card "Saúde do Projeto" (score, barras, quick facts)
├── data/
│   ├── wizard-config.ts          # 20 perguntas do questionário
│   ├── technologies.ts           # 150+ tecnologias (nome, logo, pros, cons, website)
│   ├── categories.ts             # Categorias: frontend, backend, data, infra, libs, devex
│   ├── skills-map.ts             # URLs de referência técnica por tecnologia
│   ├── tooltips.ts               # Glossário de termos técnicos (hover tooltips)
│   └── i18n.ts                   # ★ Traduções PT-BR ↔ EN (200+ chaves)
├── layouts/
│   └── Layout.astro              # Layout base (dark mode, fonts, meta, i18n script global)
├── pages/
│   ├── index.astro               # Landing page
│   ├── app.astro                 # ★ Questionário de 20 etapas
│   ├── analytics.astro           # ★ Dashboard de comparação de stacks (React island)
│   ├── biblioteca.astro          # Biblioteca de tecnologias (grid + detalhe lateral)
│   ├── login.astro               # Tela de login (UI pronta, auth pendente)
│   ├── privacidade.astro         # Política de privacidade
│   ├── termos.astro              # Termos de uso
│   └── api/
│       └── github.ts             # ★ API proxy — GitHub REST API (token seguro no server)
└── styles/
    └── global.css                # Design tokens, cores, fontes, utilitários Tailwind
```

**Outros arquivos importantes na raiz:**
- `.env` — Variáveis de ambiente (`GITHUB_TOKEN`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`)
- `public/icons/` — 150+ SVGs de logos de tecnologias (servidos localmente)
- `astro.config.mjs` — Configuração com `@astrojs/react`, `@astrojs/node`, `@tailwindcss/vite`

---

## 4. ARQUITETURA DO APP (`/app` — O CORAÇÃO)

### Fluxo do Questionário
O wizard tem **20 perguntas** divididas em **4 fases**:

| Fase | Perguntas | Conteúdo |
|------|-----------|----------|
| 1. Contexto | Q1–Q5 | Descrição do projeto, senioridade, escala, tipo, ferramenta |
| 2. Stack Técnica | Q6–Q12 | Frontend, backend, MCPs, banco, skills, infra, persistência |
| 3. Qualidade | Q13–Q20 | Auth, segurança, realtime, codestyle, erros, i18n, integrações, SEO, testes |
| 4. Resultado | Steps 21–22 | Loading animado → Resultado (PRD + Prompt Base) |

### Como funciona tecnicamente

1. **Server-side (Astro):** Renderiza os 20 steps como divs com classe `.step`. Apenas step 1 é visível, os outros têm `.hidden`.
2. **Client-side (Vanilla JS via `<script define:vars>`):**
   - `showStep(n)` — Esconde todos os steps e mostra o step `n`
   - `next-btn` e `prev-btn` — Navegação entre steps
   - Tech search — Filtra `availableTechs` (serializado do server como `techDB`) por categoria
   - Modal de info — Abre detalhes de tecnologia (pros, cons, website)
   - `generateOutputs()` — Gera o PRD e Prompt Base a partir das respostas
3. **Dados passados ao client:** `techDB`, `tooltipData`, `skillsData` via `<script define:vars>`

### ⚠️ CUIDADOS CRÍTICOS NO `/app`

- **NUNCA use `\`` (backtick escapado) dentro de `<script define:vars>`**. O Astro compila isso como JS puro — backticks escapados causam SyntaxError e matam TODO o script silenciosamente.
- **Delegação de eventos:** Elementos dinâmicos (resultados de busca) são recriados no DOM. Use `document.addEventListener('click', ...)` delegado, não listeners diretos.
- **CSS de steps:** `.step { display: flex; }` e `.step.hidden { display: none; }` garantem visibilidade correta.
- **Diagnósticos falsos:** O TypeScript language server pode mostrar erros em `<script define:vars>` — são falsos positivos. O Astro compila corretamente.

---

## 5. ANALYTICS (`/analytics` — DASHBOARD DE COMPARAÇÃO)

### Visão Geral
Página de comparação de stacks tecnológicas usando dados reais do GitHub. O usuário seleciona duas tecnologias e visualiza métricas lado a lado com gráficos interativos.

### Arquitetura
- **Astro page** (`analytics.astro`) com `prerender = false` (SSR)
- **React island** via `client:load` — todo o dashboard é um componente React (`AnalyticsDashboard.tsx`)
- **API proxy** (`src/pages/api/github.ts`) — busca dados do GitHub sem expor o token no frontend

### Fluxo de dados
```
[Input do Usuário] → [Autocomplete (90+ stacks)]
        ↓
[/api/github?a=Next.js&b=Astro]
        ↓
[REPO_MAP resolve nome → owner/repo]  (ex: "next.js" → "vercel/next.js")
        ↓
[GitHub API: /repos/{owner}/{repo} + /repos/{owner}/{repo}/stats/commit_activity]
        ↓
[Dados: stars, forks, openIssues, pushedAt, commitActivity[52 weeks]]
        ↓
[Dashboard React renderiza 6 componentes]
```

### API Proxy (`src/pages/api/github.ts`)
- Token GitHub salvo em `.env` como `GITHUB_TOKEN` — NUNCA expor no frontend
- `REPO_MAP` — dicionário com 120+ mapeamentos nome→repo (ex: `'react' → 'facebook/react'`)
- Aceita também formato direto `owner/repo`
- Retorna JSON com dados de ambos os repos em paralelo (`Promise.all`)

### Componentes React (todos em `src/components/analytics/`)

| Componente | Função |
|-----------|--------|
| **AnalyticsDashboard.tsx** | Orquestrador: estado, fetch, layout. Inclui `AutocompleteInput` com dropdown de 90+ stacks agrupados por categoria (Frontend, Backend, Database, etc.) com cores por categoria e navegação por teclado. |
| **MetricCard.tsx** | 4 cards de métricas (Stars, Commits/Mês, Issues, Forks). Mostra valores de ambas stacks, calcula % de diferença, indica o líder. |
| **StarsChart.tsx** | Gráfico principal configurável pelo usuário: **3 tipos** (Área, Barras, Linha) × **3 períodos** (Semana, Mês, Trimestre) + toggles de Pontos ON/OFF e curva Suave/Linear. Usa Recharts. |
| **RadarChart.tsx** | Radar 5 eixos: Popularidade, Comunidade, Atividade, Consistência, Engajamento. Valores normalizados 0–100. Mostra "Confiança Geral" calculada. |
| **PulseGrid.tsx** | Heatmap visual estilo GitHub contributions (52 colunas × 7 linhas). Combina dados de ambas stacks. Intensidade por cor `#2E748B`. |
| **AIInsight.tsx** | Card "Saúde do Projeto": score circular animado (SVG) para cada tech com label (Excelente/Saudável/Moderado/Atenção), barras comparativas de Popularidade/Atividade/Comunidade, quick facts (linguagem, último push), vencedor geral. |

### Autocomplete de Stacks
- 90+ tecnologias com `label` e `category`
- Cores por categoria em `CATEGORY_COLORS` (Frontend=#2E748B, Backend=#22c55e, Database=#F2AB6D, etc.)
- Dropdown com glassmorphism (`bg: #1a1a1a`, shadow, border)
- Filtra por nome OU categoria ao digitar
- Navegação: `ArrowDown/Up` para navegar, `Enter` para selecionar, `Escape` para fechar, click outside fecha

### Bibliotecas React usadas
- **recharts** — AreaChart, BarChart, LineChart, RadarChart, ResponsiveContainer, Tooltip
- **framer-motion** — `motion.div` com variants `fadeUp` para animação sequencial, `AnimatePresence` para loading
- **lucide-react** — Ícones: Star, GitFork, AlertCircle, Activity, Search, Loader2, Shield, Clock, etc.

---

## 6. SISTEMA i18n (PT-BR ↔ EN)

### Como funciona
1. **`src/data/i18n.ts`** — Objeto `translations` com 200+ chaves. Cada chave tem `{ pt: "...", en: "..." }`.
2. **`Layout.astro`** — Script global que:
   - Salva idioma em `localStorage` (chave `bc-lang`, padrão `'pt'`)
   - Aplica traduções via `document.querySelectorAll('[data-i18n]')`
   - Suporta `data-i18n` (textContent), `data-i18n-placeholder` (placeholder), `data-i18n-title` (title)
   - Expõe `window.bcGetLang()`, `window.bcSetLang(lang)`, `window.bcApplyTranslations(lang)`
3. **Header** — Botão `#lang-toggle` alterna entre PT e EN

### Para adicionar texto traduzível
1. Adicione a chave em `i18n.ts`: `"secao.chave": { pt: "Texto PT", en: "Text EN" }`
2. No HTML: `<span data-i18n="secao.chave">Texto PT</span>`
3. Para conteúdo dinâmico (innerHTML injection): chamar `bcApplyTranslations(bcGetLang())` após inserir

### Prefixos de chaves
- `nav.*` — Header/Navegação
- `hero.*` — Hero section da landing
- `problema.*` — Seção Problema
- `solucao.*` — Seção Solução
- `beneficios.*` — Seção Benefícios (mantida na landing, removida do menu)
- `cta.*` — Call to action final
- `footer.*` — Rodapé
- `bib.*` — Biblioteca
- `analytics.*` — Página Analytics
- `app.*` — Questionário/Wizard

### ⚠️ Componentes React e i18n
Os componentes React do Analytics usam `data-i18n` nos elementos HTML, mas como são renderizados client-side após o script i18n do Layout, **as traduções dos labels estáticos funcionam via Astro i18n normalmente**. Textos dinâmicos gerados por lógica JS (como o insight de saúde) são escritos diretamente em português e não passam pelo sistema i18n.

---

## 7. BANCO DE TECNOLOGIAS (`technologies.ts`)

### Estrutura de cada tecnologia:
```typescript
interface Technology {
  name: string;        // "React"
  category: string;    // "frontend" | "backend" | "data" | "infra" | "libs" | "devex"
  tagline: string;     // "Declarative UI"
  description: string; // Descrição completa
  language: string;    // "JavaScript"
  pros: string[];      // Vantagens
  cons: string[];      // Desvantagens
  useCases: string;    // Cena ideal de uso
  typeIcon: string;    // Material Symbol fallback ("web", "dns", etc.)
  role: string;        // "Ecosystem Leader"
  logo: string;        // "/icons/react.svg" (local)
  website: string;     // "https://react.dev"
}
```

### Como logos funcionam:
- Helper `si(slug)` retorna `/icons/{slug}.svg` (arquivo local)
- 18 tecnologias base definidas diretamente no array
- ~150 tecnologias secundárias adicionadas via arrays (`frontends`, `backends`, `datasets`, `infras`, `libris`, `devexs`) usando `logoMap` e `websiteMap`
- Fallback: se SVG não carrega, mostra Material Symbol via `onerror`

---

## 8. BIBLIOTECA (`/biblioteca`)

- **Grid responsivo** com cards de tecnologias (1–5 colunas)
- **Sidebar esquerda** colapsável com categorias (hover expande de 80px → 260px)
- **Sidebar direita** (drawer) com detalhes ao clicar num card
- **Busca** com `Ctrl+K` e filtro por categoria
- Detalhe mostra: logo grande, linguagem, descrição, pros, cons, cena ideal, link do site oficial
- Botão inferior do sidebar: **"Visualizar Analytics"** → linka para `/analytics`
- Dados vêm de `technologies.ts` passados via `<script define:vars={{ techData: technologies }}>`

---

## 9. DESIGN SYSTEM — REGRAS OBRIGATÓRIAS

### Cores (NUNCA use cores brutas do Tailwind)
```
primary:         #2E748B    → text-primary, bg-primary, border-primary
primary-dark:    #1C4D5E    → bg-primary-dark
secondary:       #5A9DB5    → text-secondary
cta:             #F2AB6D    → bg-cta, text-cta (botões de ação)
background-dark: #0D0D0D    → bg-background-dark
background-light:#151515    → bg-background-light
surface-dark:    #121415    → bg-surface-dark (cards, painéis)
surface-light:   #1A1C1E    → bg-surface-light
border-color:    #2A3135    → border-border-color
```

**Nos componentes React (Analytics):** como Tailwind tokens customizados nem sempre funcionam em React islands, os componentes usam cores hardcoded (`#121212`, `#2A3135`, `#2E748B`, `#F2AB6D`). Isso é intencional — mantenha consistência com os valores acima.

### Tipografia
- **Títulos/Branding:** `font-display` (Helvetica Now / Helvetica Neue)
- **Corpo/Descrições:** `font-body` (Inter)
- **Labels técnicos:** `text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400`
- **Monospace:** `font-mono` para outputs de código

### Padrões de UI
- **Dark Mode SEMPRE.** Não existe modo claro.
- **Glass panels:** Use `glass-panel` para cards flutuantes com backdrop-blur. Nos React components: `background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1)`.
- **Transições:** Sempre `transition-all duration-300` em interações. Em React: Framer Motion `fadeUp` variants.
- **States:** `peer-checked:`, `group-hover:`, `focus-within:` com glows suaves.
- **Sombras glow:** `shadow-[0_0_20px_rgba(46,116,139,0.2)]` para elementos ativos.

---

## 10. FUNCIONALIDADES IMPLEMENTADAS

- [x] Questionário de 20 etapas com navegação funcional
- [x] Geração de PRD Estratégico e Prompt Base
- [x] Busca de tecnologias no questionário (filtra por categoria, max 9 resultados)
- [x] Modal de info de tecnologia (descrição, pros, cons, cena ideal, link website)
- [x] Botão "Personalizar" para tecnologias customizadas não presentes no banco
- [x] Biblioteca com 150+ tecnologias, busca, filtro por categoria
- [x] Painel de detalhes lateral na biblioteca com logo, info completa e link oficial
- [x] Ícones SVG locais (153 logos em `public/icons/`)
- [x] Three.js partículas animadas no background do `/app`
- [x] Insights em tempo real no sidebar esquerdo (custo, complexidade, TTM)
- [x] Tooltips de glossário técnico (hover em termos)
- [x] Sistema de fases com progress bar visual
- [x] Filtragem por senioridade (opções mudam conforme nível)
- [x] Landing page com seções: Problema, Solução, Benefícios
- [x] Header centralizado com nav (Problema, Solução, Analytics, Biblioteca)
- [x] **Sistema i18n completo** (PT-BR ↔ EN) com 200+ chaves, switcher no header, localStorage
- [x] **Analytics Dashboard** — Comparação de stacks via GitHub API com:
  - API proxy segura (token no server)
  - Autocomplete com 90+ stacks agrupadas por categoria
  - 4 Metric Cards (Stars, Commits, Issues, Forks)
  - Gráfico configurável: 3 tipos (Área/Barras/Linha) × 3 períodos (Semana/Mês/Trimestre) + Pontos + Suave/Linear
  - Radar Chart 5 eixos
  - Pulse Grid (heatmap 52 semanas)
  - Card Saúde do Projeto (score, barras comparativas, quick facts, vencedor)
  - Framer Motion animations em todos os elementos

## 11. FUNCIONALIDADES PENDENTES / ROADMAP

- [ ] Autenticação (Supabase Auth) — Login/Registro funcional
- [ ] Persistência de respostas (salvar progresso do questionário)
- [ ] Sistema de pagamento (Stripe — 3 grátis → assinatura)
- [ ] Histórico de gerações por usuário
- [ ] Export PDF do PRD
- [ ] Dashboard do usuário
- [ ] Mobile responsiveness completo (algumas telas precisam ajuste)
- [ ] SEO e Open Graph tags
- [ ] Integração com LLMs para geração inteligente de PRD/Prompt
- [ ] Animações de transição entre fases (Three.js camera dive planejado)

---

## 12. SCRIPTS UTILITÁRIOS

### `change_photoSVG.py`
Converte imagens raster (PNG/JPG/WEBP) em SVGs vetorizados otimizados para ícones.
```bash
pip install Pillow rembg vtracer  # dependências
python change_photoSVG.py imagem.png
python change_photoSVG.py pasta/    # processa todas
```
Remove fundo, redimensiona para 128x128, vetoriza, apaga o original.

### `download_icons.cjs`
Baixa SVGs do Simple Icons para `public/icons/`.
```bash
node download_icons.cjs
```

---

## 13. VARIÁVEIS DE AMBIENTE (`.env`)

```
GITHUB_TOKEN="github_pat_..."       # Token GitHub para API proxy (NUNCA expor no frontend)
PUBLIC_SUPABASE_URL="https://..."    # URL do projeto Supabase
PUBLIC_SUPABASE_ANON_KEY="eyJ..."    # Chave anônima Supabase (pública)
```

⚠️ `GITHUB_TOKEN` é acessado via `import.meta.env.GITHUB_TOKEN` apenas em server endpoints (`src/pages/api/`). Nunca passe para componentes client-side.

---

## 14. COMANDOS

```bash
npm run dev        # Dev server (http://localhost:4321)
npm run build      # Build de produção
npm run preview    # Preview do build
```

---

## 15. REGRAS PARA O AGENTE

1. **Leia antes de alterar.** Nunca modifique código que você não leu.
2. **Use as cores do design system.** Zero `text-blue-500` ou cores brutas do Tailwind. Em React, use hex hardcoded do design system.
3. **Cuidado com `<script define:vars>`.** Não escape backticks. Não use TypeScript puro dentro.
4. **Delegação de eventos** para elementos dinâmicos. Listeners diretos se perdem ao recriar DOM.
5. **Teste o build** (`npx astro build`) após alterações significativas.
6. **Sem over-engineering.** O projeto prioriza simplicidade e velocidade.
7. **Estética é prioridade.** A UI é o pilar de credibilidade. Cada pixel importa.
8. **Português (PT-BR)** para todo texto visível ao usuário. Adicione chaves i18n para novos textos.
9. **Performance:** Ícones locais, zero-JS onde possível, lazy load para imagens.
10. **Não crie arquivos desnecessários.** Edite os existentes.
11. **React components** — Use Recharts para gráficos, Framer Motion para animações, Lucide React para ícones. Mantenha o padrão.
12. **API routes** — Toda comunicação com APIs externas deve passar por `src/pages/api/`. Nunca exponha tokens no frontend.
13. **i18n** — Todo novo texto visível precisa de chave em `i18n.ts`. Use `data-i18n` nos elementos HTML.
14. **Astro + React** — Componentes React são "islands" com `client:load`. Não use React para páginas inteiras, apenas para interatividade complexa.
