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
| **Framework** | Astro 5.x | SSG + SSR (`prerender = false` em `/app`). Zero-JS por padrão. |
| **CSS** | Tailwind CSS 4.x | Tokens customizados em `global.css`. Utilitários: `glass-panel`, `glow-border`. |
| **3D/Animações** | Three.js | Partículas no canvas de background do `/app`. |
| **Backend (futuro)** | Supabase | Auth + PostgreSQL + Storage. Ainda não implementado. |
| **Deploy** | Node adapter | `@astrojs/node` para SSR. |
| **Ícones** | Material Symbols + SVGs locais | Material Symbols via CDN Google. Logos de tecnologias em `public/icons/` (SVGs locais). |

---

## 3. ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── Header.astro          # Nav da landing page (centralizado)
│   └── Footer.astro          # Rodapé
├── data/
│   ├── wizard-config.ts      # 20 perguntas do questionário (opções, tipos, fases)
│   ├── technologies.ts       # 150+ tecnologias (nome, logo, pros, cons, website)
│   ├── categories.ts         # Categorias: frontend, backend, data, infra, libs, devex
│   ├── skills-map.ts         # URLs de referência técnica por tecnologia
│   └── tooltips.ts           # Glossário de termos técnicos (hover tooltips)
├── layouts/
│   └── Layout.astro          # Layout base (dark mode, fonts, meta)
├── pages/
│   ├── index.astro           # Landing page
│   ├── app.astro             # ★ PÁGINA PRINCIPAL — Questionário de 20 etapas
│   ├── biblioteca.astro      # Biblioteca de tecnologias (grid + detalhe lateral)
│   ├── login.astro           # Tela de login (UI pronta, auth pendente)
│   ├── privacidade.astro     # Política de privacidade
│   └── termos.astro          # Termos de uso
└── styles/
    └── global.css            # Design tokens, cores, fontes, utilitários Tailwind
```

**Outros arquivos importantes na raiz:**
- `public/icons/` — 150+ SVGs de logos de tecnologias (servidos localmente)
- `change_photoSVG.py` — Script Python para converter imagens em SVG otimizado
- `download_icons.cjs` — Script Node para baixar ícones do Simple Icons

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

## 5. BANCO DE TECNOLOGIAS (`technologies.ts`)

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

## 6. BIBLIOTECA (`/biblioteca`)

- **Grid responsivo** com cards de tecnologias (1–5 colunas)
- **Sidebar esquerda** colapsável com categorias
- **Sidebar direita** (drawer) com detalhes ao clicar num card
- **Busca** com `Ctrl+K` e filtro por categoria
- Detalhe mostra: logo grande, linguagem, descrição, pros, cons, cena ideal, link do site oficial
- Dados vêm de `technologies.ts` passados via `<script define:vars={{ techData: technologies }}>`

---

## 7. DESIGN SYSTEM — REGRAS OBRIGATÓRIAS

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

### Tipografia
- **Títulos/Branding:** `font-display` (Helvetica Now / Helvetica Neue)
- **Corpo/Descrições:** `font-body` (Inter)
- **Labels técnicos:** `text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400`
- **Monospace:** `font-mono` para outputs de código

### Padrões de UI
- **Dark Mode SEMPRE.** Não existe modo claro.
- **Glass panels:** Use `glass-panel` para cards flutuantes com backdrop-blur.
- **Transições:** Sempre `transition-all duration-300` em interações.
- **States:** `peer-checked:`, `group-hover:`, `focus-within:` com glows suaves.
- **Sombras glow:** `shadow-[0_0_20px_rgba(46,116,139,0.2)]` para elementos ativos.

---

## 8. FUNCIONALIDADES IMPLEMENTADAS

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
- [x] Header centralizado com nav

## 9. FUNCIONALIDADES PENDENTES / ROADMAP

- [ ] Autenticação (Supabase Auth) — Login/Registro funcional
- [ ] Persistência de respostas (salvar progresso do questionário)
- [ ] Sistema de pagamento (Stripe — 3 grátis → assinatura)
- [ ] Histórico de gerações por usuário
- [ ] Export PDF do PRD
- [ ] Dashboard do usuário
- [ ] Mobile responsiveness completo (algumas telas precisam ajuste)
- [ ] SEO e Open Graph tags
- [ ] Analytics (Plausible ou similar)
- [ ] Animações de transição entre fases (Three.js camera dive planejado)

---

## 10. SCRIPTS UTILITÁRIOS

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

## 11. COMANDOS

```bash
npm run dev        # Dev server (http://localhost:4321)
npm run build      # Build de produção
npm run preview    # Preview do build
```

---

## 12. REGRAS PARA O AGENTE

1. **Leia antes de alterar.** Nunca modifique código que você não leu.
2. **Use as cores do design system.** Zero `text-blue-500` ou cores brutas.
3. **Cuidado com `<script define:vars>`.** Não escape backticks. Não use TypeScript puro dentro.
4. **Delegação de eventos** para elementos dinâmicos. Listeners diretos se perdem ao recriar DOM.
5. **Teste o build** (`npx astro build`) após alterações significativas.
6. **Sem over-engineering.** O projeto prioriza simplicidade e velocidade.
7. **Estética é prioridade.** A UI é o pilar de credibilidade. Cada pixel importa.
8. **Português (PT-BR)** para todo texto visível ao usuário.
9. **Performance:** Ícones locais, zero-JS onde possível, lazy load para imagens.
10. **Não crie arquivos desnecessários.** Edite os existentes.
