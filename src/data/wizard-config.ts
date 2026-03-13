/**
 * BuildCode — Wizard Configuration
 * Data-driven config for the Software Decision System.
 *
 * Phases: 1=Contexto, 2=Stack Tecnica, 3=Qualidade, 4=Final
 * difficulty: 'easy' | 'medium' | 'hard' — visual tag on each option
 * recommendedFor: 'junior' | 'pleno' | 'senior' — "Recomendado" badge
 * minLevel: 1=Junior, 2=Pleno+, 3=Senior only (visibility filter)
 *
 * visibleFor: controls which project types show this step
 *   - 'all' = always visible
 *   - Array of specific types e.g. ['hobby','saas','enterprise']
 *
 * optionalFor: project types where this step can be skipped
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type SeniorityLevel = 'junior' | 'pleno' | 'senior';
export type ProjectType = 'hobby' | 'saas' | 'enterprise';

export interface QuestionOption {
    value: string;
    label: string;
    icon: string;
    desc: string;
    minLevel?: number;
    difficulty?: Difficulty;
    recommendedFor?: SeniorityLevel[];
    notRecommendedFor?: ProjectType[];
    website?: string;
}

export interface WizardQuestion {
    step: number;
    phase: number;
    type: 'textarea' | 'radio' | 'checkbox';
    name: string;
    titlePre: string;
    titleHighlight: string;
    titlePost: string;
    subtitle: string;
    placeholder?: string;
    cols?: number;
    visibleFor?: ProjectType[] | 'all';
    optionalFor?: ProjectType[];
    isOptionalForHobby?: boolean;
    options?: QuestionOption[];
    searchable?: boolean;
    dbCategory?: string;
}

export const phases = [
    { id: 1, label: "Contexto", icon: "lightbulb" },
    { id: 2, label: "Stack", icon: "code" },
    { id: 3, label: "Qualidade", icon: "shield" },
    { id: 4, label: "Final", icon: "rocket_launch" },
];

/**
 * LLM Models for OpenRouter selection
 * 3 baratos + 3 medianos + 3 avancados = 9 total
 */
export const llmModels = [
    { value: 'google/gemma-3-4b-it:free', label: 'Gemma 3 4B', tier: 'budget', icon: 'savings', desc: 'Modelo leve do Google. Gratuito. Ideal para tarefas simples.', provider: 'Google' },
    { value: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B', tier: 'budget', icon: 'savings', desc: 'Meta Llama 3.1. Gratuito. Boa qualidade para o custo zero.', provider: 'Meta' },
    { value: 'mistralai/mistral-small-3.1-24b-instruct:free', label: 'Mistral Small 3.1', tier: 'budget', icon: 'savings', desc: 'Mistral compacto. Gratuito. Rapido e eficiente.', provider: 'Mistral' },
    { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash', tier: 'mid', icon: 'bolt', desc: 'Google Gemini Flash. Rapido, barato e muito capaz.', provider: 'Google' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', tier: 'mid', icon: 'bolt', desc: 'OpenAI modelo medio. Excelente custo-beneficio.', provider: 'OpenAI' },
    { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', tier: 'mid', icon: 'bolt', desc: 'Anthropic Haiku. Rapido, inteligente e acessivel.', provider: 'Anthropic' },
    { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4', tier: 'pro', icon: 'auto_awesome', desc: 'Anthropic Sonnet 4. Top tier para codigo e raciocinio.', provider: 'Anthropic' },
    { value: 'openai/gpt-4o', label: 'GPT-4o', tier: 'pro', icon: 'auto_awesome', desc: 'OpenAI flagship. Multimodal, rapido e poderoso.', provider: 'OpenAI' },
    { value: 'google/gemini-2.5-pro-preview', label: 'Gemini 2.5 Pro', tier: 'pro', icon: 'auto_awesome', desc: 'Google Gemini Pro. Contexto massivo, raciocinio avancado.', provider: 'Google' },
];

/**
 * Step visibility rules by project type:
 *
 * HOBBY (Portfolio/Landing):
 *   Show: #1 Contexto, #2 Senioridade, #3 Escala, #4 Tipo, #5 Ferramenta,
 *         #6 Frontend, #11 Deploy, #10 Skills, #19 Integracoes, #20 SEO+Testes
 *   Hide: Backend, DB, Cache, Auth, Seguranca, Websockets, etc.
 *
 * SAAS (MVP):
 *   Show: All 20, but #15 Realtime and #18 i18n are optional/skippable
 *
 * ENTERPRISE:
 *   Show: All 20 as mandatory
 */

export const questions: WizardQuestion[] = [
    // PHASE 1: CONTEXTO (Q1-Q5)
    {
        step: 1, phase: 1, type: 'textarea', name: 'contexto',
        visibleFor: 'all',
        titlePre: 'Descreva a', titleHighlight: 'Alma', titlePost: 'do seu Projeto.',
        subtitle: 'Qual o proposito real do sistema? Que problema ele resolve?',
        placeholder: 'Ex: Quero criar um SaaS para barbearias gerenciarem agendamentos e financas. Os usuarios marcarao horarios via link ou WhatsApp...',
    },
    {
        step: 2, phase: 1, type: 'radio', name: 'senioridade', cols: 3,
        visibleFor: 'all',
        titlePre: 'Qual seu nivel de', titleHighlight: 'Senioridade', titlePost: '?',
        subtitle: 'Isso adapta as recomendacoes ao seu nivel de experiencia.',
        options: [
            { value: 'junior', label: 'Junior', icon: 'school', desc: 'Aprendendo a codar. Foco em simplicidade e time-to-market rapido.' },
            { value: 'pleno', label: 'Pleno', icon: 'engineering', desc: 'Experiencia solida. Busca equilibrio entre performance e agilidade.' },
            { value: 'senior', label: 'Senior', icon: 'military_tech', desc: 'Domina arquitetura. Exige padroes SOLID, escalabilidade e testes.' },
        ],
    },
    {
        step: 3, phase: 1, type: 'radio', name: 'escala', cols: 3,
        visibleFor: 'all',
        titlePre: 'Quantos', titleHighlight: 'usuarios simultaneos', titlePost: 'o sistema suportara?',
        subtitle: 'Nos primeiros 6-12 meses. Isso define a arquitetura de infraestrutura.',
        options: [
            { value: '50', label: 'Ate 50', icon: 'person', desc: 'Projeto pessoal, prototipo ou ferramenta interna.', difficulty: 'easy' },
            { value: '1000', label: 'Ate 1.000', icon: 'group', desc: 'Startup em validacao, app com tracao inicial.', difficulty: 'medium' },
            { value: '10000', label: 'Ate 10.000', icon: 'groups', desc: 'Produto em crescimento, API com alta frequencia.', difficulty: 'hard' },
            { value: '50000', label: '50.000+', icon: 'public', desc: 'Escala global, multi-region, alta disponibilidade.', difficulty: 'hard' },
        ],
    },
    {
        step: 4, phase: 1, type: 'radio', name: 'tipo', cols: 3,
        visibleFor: 'all',
        titlePre: 'Qual a', titleHighlight: 'natureza', titlePost: 'do projeto?',
        subtitle: 'Isso define o nivel de rigor arquitetural e quais etapas serao exibidas.',
        options: [
            { value: 'hobby', label: 'Pessoal / Portfolio', icon: 'emoji_objects', desc: 'Aprendizado, portfolio ou side-project. Apenas o essencial.', difficulty: 'easy' },
            { value: 'saas', label: 'SaaS / MVP', icon: 'cloud', desc: 'Produto com cobranca recorrente e multiplos clientes.', difficulty: 'medium' },
            { value: 'enterprise', label: 'Larga Escala', icon: 'hub', desc: 'Governanca, compliance, integracoes complexas. Todas as etapas.', difficulty: 'hard' },
        ],
    },
    {
        step: 5, phase: 1, type: 'radio', name: 'ferramenta', cols: 3,
        visibleFor: 'all',
        titlePre: 'Qual sua', titleHighlight: 'IDE / Ferramenta', titlePost: 'principal?',
        subtitle: 'Personalizamos o Prompt Base para a ferramenta que voce usa.',
        options: [
            { value: 'cursor', label: 'Cursor', icon: 'smart_toy', desc: 'Fork do VS Code com IA nativa. Geracao de codigo surreal.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'claude-code', label: 'Claude Code', icon: 'terminal', desc: 'Terminal AI da Anthropic. Poder de raciocinio maximo.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'antigravity', label: 'Anti-Gravity', icon: 'rocket', desc: 'Extensao AI do Google DeepMind para VS Code.', difficulty: 'easy', recommendedFor: ['junior', 'pleno'] },
            { value: 'vscode', label: 'VS Code', icon: 'code', desc: 'Editor padrao mundial. Compativel com Copilot e extensoes.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'windsurf', label: 'Windsurf', icon: 'air', desc: 'IDE AI-first da Codeium. Fluxos guiados por IA.', difficulty: 'easy', recommendedFor: ['junior', 'pleno'] },
            { value: 'outro', label: 'Outro', icon: 'more_horiz', desc: 'WebStorm, Neovim, Replit ou qualquer outro.', difficulty: 'medium' },
        ],
    },

    // PHASE 2: STACK TECNICA (Q6-Q12)
    {
        step: 6, phase: 2, type: 'checkbox', name: 'frontend', cols: 3,
        visibleFor: 'all',
        searchable: true, dbCategory: 'frontend',
        titlePre: 'Escolha o(s)', titleHighlight: 'Frontend(s)', titlePost: 'do projeto.',
        subtitle: 'Selecione um ou mais. Opcoes com tags de dificuldade. Nao encontrou? Pesquise abaixo.',
        options: [
            { value: 'html-css', label: 'HTML + CSS Puro', icon: 'code', desc: 'Sem framework. Maximo controle e aprendizado.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior'], website: 'https://developer.mozilla.org/pt-BR/docs/Web' },
            { value: 'astro', label: 'Astro', icon: 'rocket_launch', desc: 'Zero-JS por padrao. Perfeito para sites content-driven.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://astro.build' },
            { value: 'react', label: 'React', icon: 'web', desc: 'Ecossistema massivo. Ideal para SPAs e dashboards.', minLevel: 1, difficulty: 'medium', recommendedFor: ['junior', 'pleno', 'senior'], website: 'https://react.dev' },
            { value: 'vue', label: 'Vue.js', icon: 'web', desc: 'Curva de aprendizado suave. Reatividade elegante.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://vuejs.org' },
            { value: 'nextjs', label: 'Next.js', icon: 'web', desc: 'React fullstack. SSR, SSG, API Routes em um so.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'], website: 'https://nextjs.org' },
            { value: 'nuxt', label: 'Nuxt.js', icon: 'web', desc: 'Vue fullstack. SSR + auto-imports. DX incrivel.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://nuxt.com' },
            { value: 'svelte', label: 'Svelte / SvelteKit', icon: 'web', desc: 'Compila para JS puro. Performance absurda.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'], website: 'https://svelte.dev' },
            { value: 'angular', label: 'Angular', icon: 'web', desc: 'Framework enterprise completo. TypeScript nativo.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://angular.dev' },
            { value: 'solid', label: 'SolidJS', icon: 'web', desc: 'Reatividade fine-grained. Sem Virtual DOM.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://www.solidjs.com' },
            { value: 'remix', label: 'Remix', icon: 'web', desc: 'Web standards first. Nested routes, loaders.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://remix.run' },
        ],
    },
    {
        step: 7, phase: 2, type: 'radio', name: 'backend', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        searchable: true, dbCategory: 'backend',
        titlePre: 'Defina o', titleHighlight: 'Backend', titlePost: 'do sistema.',
        subtitle: 'O motor que roda por tras da sua aplicacao.',
        options: [
            { value: 'supabase', label: 'Supabase (BaaS)', icon: 'database', desc: 'Auth + DB + Storage + Edge Functions. Tudo pronto.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://supabase.com' },
            { value: 'firebase', label: 'Firebase (BaaS)', icon: 'local_fire_department', desc: 'Google BaaS. Firestore, Functions, Auth.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior'], website: 'https://firebase.google.com' },
            { value: 'express', label: 'Node.js + Express', icon: 'dns', desc: 'O servidor HTTP mais utilizado do ecossistema JS.', minLevel: 1, difficulty: 'medium', recommendedFor: ['junior', 'pleno'], website: 'https://expressjs.com' },
            { value: 'nestjs', label: 'NestJS', icon: 'dns', desc: 'Framework Node.js enterprise. DI, modules, guards.', minLevel: 2, difficulty: 'hard', recommendedFor: ['pleno', 'senior'], website: 'https://nestjs.com' },
            { value: 'fastify', label: 'Fastify', icon: 'bolt', desc: 'HTTP server ultra rapido para Node.js. Schema-first.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://fastify.dev' },
            { value: 'fastapi', label: 'FastAPI (Python)', icon: 'dns', desc: 'API async em Python. Pydantic + OpenAPI auto.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'], website: 'https://fastapi.tiangolo.com' },
            { value: 'django', label: 'Django (Python)', icon: 'dns', desc: 'Framework Python completo. ORM, admin, auth.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://www.djangoproject.com' },
            { value: 'go', label: 'Go (Gin/Fiber)', icon: 'memory', desc: 'Compilado, concorrente. DevOps standard.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://go.dev' },
            { value: 'rust', label: 'Rust (Actix/Axum)', icon: 'memory', desc: 'Performance maxima. Seguranca de memoria garantida.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://www.rust-lang.org' },
            { value: 'spring', label: 'Spring Boot (Java)', icon: 'dns', desc: 'Enterprise robusto. Bilhoes de empresas usam.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://spring.io/projects/spring-boot' },
            { value: 'laravel', label: 'Laravel (PHP)', icon: 'dns', desc: 'Eloquent ORM, Blade, queues. PHP moderno.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://laravel.com' },
        ],
    },
    {
        step: 8, phase: 2, type: 'checkbox', name: 'mcps', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        titlePre: 'Conecte', titleHighlight: 'MCPs', titlePost: 'ao seu projeto.',
        subtitle: 'Model Context Protocol — conectores de IA para potencializar seu fluxo.',
        options: [
            { value: 'supabase-mcp', label: 'Supabase MCP', icon: 'database', desc: 'Conecta IA ao seu banco Supabase. CRUD direto.', difficulty: 'easy' },
            { value: 'stripe-mcp', label: 'Stripe MCP', icon: 'payments', desc: 'IA gerencia pagamentos, subscriptions, webhooks.', difficulty: 'medium' },
            { value: 'github-mcp', label: 'GitHub MCP', icon: 'code', desc: 'IA acessa repos, issues, PRs diretamente.', difficulty: 'easy' },
            { value: 'context7', label: 'Context7', icon: 'psychology', desc: 'Documentacao atualizada de qualquer lib direto na IA.', difficulty: 'easy' },
            { value: 'openai-mcp', label: 'OpenAI MCP', icon: 'smart_toy', desc: 'Conecta modelos GPT como ferramenta auxiliar.', difficulty: 'medium' },
            { value: 'custom', label: 'Custom MCP', icon: 'build', desc: 'Construa seu proprio conector MCP personalizado.', difficulty: 'hard' },
        ],
    },
    {
        step: 9, phase: 2, type: 'radio', name: 'database', cols: 2,
        visibleFor: ['saas', 'enterprise'],
        searchable: true, dbCategory: 'data',
        titlePre: 'Como voce quer', titleHighlight: 'gerenciar dados', titlePost: '?',
        subtitle: 'O tipo de banco de dados define como seus dados sao organizados.',
        options: [
            { value: 'sql-managed', label: 'SQL Managed', icon: 'schema', desc: 'PostgreSQL gerenciado (Supabase, Neon). Zero infra.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://www.postgresql.org' },
            { value: 'sql-raw', label: 'SQL Dedicado', icon: 'schema', desc: 'PostgreSQL/MySQL em servidor proprio. Controle total.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'], website: 'https://www.postgresql.org' },
            { value: 'nosql', label: 'NoSQL', icon: 'table_view', desc: 'MongoDB, DynamoDB. Esquema flexivel.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://www.mongodb.com' },
            { value: 'vetorial', label: 'Vetorial (AI)', icon: 'psychology', desc: 'Pinecone, Milvus. Para busca semantica e embeddings.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://www.pinecone.io' },
        ],
    },
    {
        step: 10, phase: 2, type: 'checkbox', name: 'skills', cols: 2,
        visibleFor: 'all',
        titlePre: 'Selecione', titleHighlight: 'Skills Tecnicas', titlePost: 'extras.',
        subtitle: 'Boas praticas injetadas no Prompt Base.',
        options: [
            { value: 'clean-arch', label: 'Clean Architecture', icon: 'account_tree', desc: 'Separacao de camadas: domain, application, infra.', difficulty: 'hard', recommendedFor: ['senior'], notRecommendedFor: ['hobby'] },
            { value: 'design-system', label: 'Design System', icon: 'palette', desc: 'Tokens, componentes reutilizaveis, guidelines visuais.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'api-design', label: 'API Design (REST)', icon: 'api', desc: 'Contratos OpenAPI, versionamento, paginacao.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'testing', label: 'Testing Strategy', icon: 'bug_report', desc: 'Piramide de testes, mocks, fixtures, coverage.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'security', label: 'Security Hardening', icon: 'shield', desc: 'OWASP Top 10, headers, sanitization, secrets.', difficulty: 'hard', recommendedFor: ['senior'], notRecommendedFor: ['hobby'] },
            { value: 'performance', label: 'Web Performance', icon: 'speed', desc: 'Core Web Vitals, lazy loading, bundle optimization.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'a11y', label: 'Acessibilidade (A11y)', icon: 'accessibility', desc: 'WCAG compliance, screen readers, navegacao por teclado.', difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'devops', label: 'DevOps & CI/CD', icon: 'settings', desc: 'Pipelines, deploys automatizados, monitoramento.', difficulty: 'hard', recommendedFor: ['senior'], notRecommendedFor: ['hobby'] },
        ],
    },
    {
        step: 11, phase: 2, type: 'radio', name: 'infra', cols: 3,
        visibleFor: 'all',
        searchable: true, dbCategory: 'infra',
        titlePre: 'Onde sera o', titleHighlight: 'Deploy', titlePost: 'do sistema?',
        subtitle: 'A infraestrutura onde seu codigo vai rodar em producao.',
        options: [
            { value: 'vercel', label: 'Vercel', icon: 'speed', desc: 'Deploy instantaneo. Ideal para Next.js e frontend.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://vercel.com' },
            { value: 'railway', label: 'Railway', icon: 'train', desc: 'PaaS moderno. Deploy de qualquer coisa em minutos.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior', 'pleno'], website: 'https://railway.app' },
            { value: 'supabase', label: 'Supabase Host', icon: 'database', desc: 'Hospeda Edge Functions + Banco. Ecossistema completo.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior'], website: 'https://supabase.com' },
            { value: 'netlify', label: 'Netlify', icon: 'cloud', desc: 'JAMStack. CDN global, forms, functions.', minLevel: 1, difficulty: 'easy', recommendedFor: ['junior'], website: 'https://www.netlify.com' },
            { value: 'cloudflare', label: 'Cloudflare', icon: 'public', desc: 'Edge Computing global. Workers, Pages, R2.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'], website: 'https://www.cloudflare.com' },
            { value: 'digitalocean', label: 'DigitalOcean', icon: 'cloud', desc: 'VPS acessivel. App Platform ou Droplets.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'], website: 'https://www.digitalocean.com' },
            { value: 'aws', label: 'AWS', icon: 'cloud', desc: '200+ servicos. Infinita escalabilidade enterprise.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://aws.amazon.com' },
            { value: 'docker-vps', label: 'Docker + VPS', icon: 'hub', desc: 'Maximo controle. Hetzner, Fly.io, Coolify.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'], website: 'https://www.docker.com' },
        ],
    },
    {
        step: 12, phase: 2, type: 'radio', name: 'persistencia', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        titlePre: 'Modelo de', titleHighlight: 'Persistencia', titlePost: 'dos dados.',
        subtitle: 'Como os dados serao estruturados e armazenados no banco.',
        options: [
            { value: 'relacional', label: 'Relacional (SQL)', icon: 'grid_on', desc: 'Tabelas, relacoes, migrations. ACID rigoroso.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'documentos', label: 'Documentos (NoSQL)', icon: 'description', desc: 'JSON flexivel. Sem schema rigido. Rapido para prototipar.', difficulty: 'easy', recommendedFor: ['junior', 'pleno'] },
            { value: 'hibrido', label: 'Hibrido', icon: 'merge_type', desc: 'SQL principal + Redis Cache. Melhor dos dois mundos.', difficulty: 'hard', recommendedFor: ['senior'] },
        ],
    },

    // PHASE 3: QUALIDADE & SEGURANCA (Q13-Q18)
    {
        step: 13, phase: 3, type: 'checkbox', name: 'auth', cols: 2,
        visibleFor: ['saas', 'enterprise'],
        titlePre: 'Niveis de', titleHighlight: 'Autenticacao', titlePost: 'necessarios.',
        subtitle: 'Selecione um ou mais. Quem pode acessar o sistema e com quais permissoes?',
        options: [
            { value: 'nenhum', label: 'Sem Auth', icon: 'lock_open', desc: 'App publico sem login. Landing pages, blogs.', difficulty: 'easy', recommendedFor: ['junior'] },
            { value: 'basico', label: 'Email + Senha', icon: 'lock', desc: 'Login basico. Cadastro e recuperacao de senha.', difficulty: 'easy', recommendedFor: ['junior', 'pleno'] },
            { value: 'oauth', label: 'OAuth Social', icon: 'supervisor_account', desc: 'Google, GitHub, Apple. Sem senha para o usuario.', difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'rbac', label: 'RBAC Completo', icon: 'admin_panel_settings', desc: 'Multiplos papeis: Admin, Editor, Viewer. Granular.', difficulty: 'hard', recommendedFor: ['pleno', 'senior'] },
            { value: 'enterprise', label: 'Enterprise (SSO)', icon: 'shield', desc: 'SAML, SSO, MFA obrigatorio. Compliance total.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'] },
        ],
    },
    {
        step: 14, phase: 3, type: 'checkbox', name: 'seguranca', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        isOptionalForHobby: true,
        titlePre: 'Camadas de', titleHighlight: 'Seguranca', titlePost: 'ativas.',
        subtitle: 'Protecoes essenciais para seu sistema.',
        options: [
            { value: 'https', label: 'HTTPS/TLS Forcado', icon: 'https', desc: 'Criptografia em transito obrigatoria.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'sanitizacao', label: 'Sanitizacao de Dados', icon: 'cleaning_services', desc: 'Previne XSS, SQL Injection e ataques de input.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
            { value: 'rate-limit', label: 'Rate Limiting', icon: 'speed', desc: 'Limita requisicoes por IP. Anti-DDoS.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'mfa', label: 'MFA', icon: 'security', desc: 'Autenticacao Multi-Fator.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'csrf', label: 'CSRF Protection', icon: 'shield', desc: 'Impede acoes forjadas por sites maliciosos.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'helmet', label: 'Security Headers', icon: 'policy', desc: 'Helmet, HSTS, CSP. Blindagem no nivel HTTP.', minLevel: 3, difficulty: 'hard', recommendedFor: ['senior'] },
        ],
    },
    {
        step: 15, phase: 3, type: 'radio', name: 'realtime', cols: 2,
        visibleFor: ['saas', 'enterprise'],
        optionalFor: ['saas'],
        titlePre: 'Precisa de', titleHighlight: 'Real-time', titlePost: '?',
        subtitle: 'Comunicacao instantanea. Opcional para MVP.',
        options: [
            { value: 'nao', label: 'Nao Preciso', icon: 'block', desc: 'Sem necessidade de dados em tempo real.', difficulty: 'easy' },
            { value: 'websocket', label: 'WebSocket', icon: 'sync_alt', desc: 'Bidirecional. Chat, notificacoes live.', minLevel: 1, difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'sse', label: 'Server-Sent Events', icon: 'arrow_downward', desc: 'Unidirecional do servidor.', minLevel: 2, difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'polling', label: 'Polling', icon: 'refresh', desc: 'Requisicoes periodicas. Simples.', difficulty: 'easy', recommendedFor: ['junior'] },
        ],
    },
    {
        step: 16, phase: 3, type: 'radio', name: 'codestyle', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        titlePre: 'Seu', titleHighlight: 'Estilo de Codigo', titlePost: 'preferido.',
        subtitle: 'Define como a IA vai estruturar o codigo gerado.',
        options: [
            { value: 'functional', label: 'Funcional', icon: 'function', desc: 'Pure functions, composition, imutabilidade.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'oop', label: 'Orientado a Objetos', icon: 'class', desc: 'Classes, heranca, encapsulamento.', difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'misto', label: 'Misto / Pragmatico', icon: 'merge_type', desc: 'Funcional onde faz sentido, OOP quando necessario.', difficulty: 'easy', recommendedFor: ['junior', 'pleno', 'senior'] },
        ],
    },
    {
        step: 17, phase: 3, type: 'radio', name: 'erros', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        titlePre: 'Estrategia de', titleHighlight: 'Tratamento de Erros', titlePost: '.',
        subtitle: 'Como o sistema reage quando algo da errado.',
        options: [
            { value: 'graceful', label: 'Graceful Degradation', icon: 'healing', desc: 'Sistema continua parcialmente. UX resiliente.', difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'strict', label: 'Strict (Fail-Fast)', icon: 'error', desc: 'Falha rapido e explicito. Logs detalhados.', difficulty: 'hard', recommendedFor: ['senior'] },
            { value: 'hibrido', label: 'Hibrido', icon: 'tune', desc: 'Graceful no front, strict no back.', difficulty: 'medium', recommendedFor: ['junior', 'pleno', 'senior'] },
        ],
    },
    {
        step: 18, phase: 3, type: 'radio', name: 'i18n', cols: 3,
        visibleFor: ['saas', 'enterprise'],
        optionalFor: ['saas'],
        titlePre: 'Precisa de', titleHighlight: 'Multi-Idioma', titlePost: '(i18n)?',
        subtitle: 'Internacionalizacao. Opcional para MVP.',
        options: [
            { value: 'nao', label: 'Nao (Monolingue)', icon: 'translate', desc: 'Apenas um idioma.', difficulty: 'easy', recommendedFor: ['junior'] },
            { value: 'poucos', label: 'Sim (2-3 idiomas)', icon: 'language', desc: 'PT-BR + EN ou similar.', difficulty: 'medium', recommendedFor: ['pleno'] },
            { value: 'global', label: 'Sim (Muitos)', icon: 'public', desc: 'Sistema global. RTL support.', difficulty: 'hard', recommendedFor: ['senior'] },
        ],
    },

    // PHASE 4: FINAL (Q19-Q20)
    {
        step: 19, phase: 4, type: 'checkbox', name: 'integracoes', cols: 3,
        visibleFor: 'all',
        titlePre: 'Quais', titleHighlight: 'Integracoes', titlePost: 'externas?',
        subtitle: 'Servicos terceiros que o sistema precisa se comunicar.',
        options: [
            { value: 'webhooks', label: 'Webhooks', icon: 'webhook', desc: 'Notificacoes automaticas entre sistemas.', difficulty: 'medium' },
            { value: 'pagamentos', label: 'Pagamentos', icon: 'payments', desc: 'Stripe, MercadoPago, PIX.', difficulty: 'medium' },
            { value: 'apis-rest', label: 'APIs REST Externas', icon: 'api', desc: 'Consumir dados de servicos terceiros.', difficulty: 'easy' },
            { value: 'email', label: 'Email Transacional', icon: 'email', desc: 'Resend, SendGrid. Emails automaticos.', difficulty: 'easy' },
            { value: 'push', label: 'Push Notifications', icon: 'notifications', desc: 'Alertas mobile/web em tempo real.', difficulty: 'medium' },
            { value: 'storage', label: 'Cloud Storage', icon: 'cloud_upload', desc: 'S3, Cloudflare R2. Upload de arquivos.', difficulty: 'easy' },
            { value: 'analytics', label: 'Analytics', icon: 'analytics', desc: 'Mixpanel, PostHog. Metricas de uso.', difficulty: 'easy' },
        ],
    },
    {
        step: 20, phase: 4, type: 'radio', name: 'seo', cols: 2,
        visibleFor: 'all',
        titlePre: '', titleHighlight: 'SEO & Testes', titlePost: '— ultima etapa.',
        subtitle: 'Indexacao nos buscadores e estrategia de qualidade.',
        options: [
            { value: 'seo-full', label: 'SEO Critico', icon: 'search', desc: 'Google indexacao, meta tags, sitemap.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
            { value: 'seo-none', label: 'App Privado', icon: 'lock', desc: 'Sem SEO. Dashboard interno.', difficulty: 'easy', recommendedFor: ['junior'] },
            { value: 'seo-partial', label: 'Parcial', icon: 'tune', desc: 'Landing com SEO + app sem indexacao.', difficulty: 'easy', recommendedFor: ['junior', 'pleno'] },
        ],
    },
];

/** Prompt language selection — asked after SEO/Testes, before LLM */
export const promptLanguageOptions: QuestionOption[] = [
    { value: 'pt-br', label: 'Português (BR)', icon: 'translate', desc: 'Prompt gerado em Português Brasileiro.' },
    { value: 'en', label: 'English', icon: 'translate', desc: 'Prompt generated in English.' },
    { value: 'es', label: 'Español', icon: 'translate', desc: 'Prompt generado en Español.' },
    { value: 'fr', label: 'Français', icon: 'translate', desc: 'Prompt généré en Français.' },
    { value: 'de', label: 'Deutsch', icon: 'translate', desc: 'Prompt auf Deutsch generiert.' },
    { value: 'it', label: 'Italiano', icon: 'translate', desc: 'Prompt generato in Italiano.' },
    { value: 'ja', label: '日本語', icon: 'translate', desc: 'プロンプトは日本語で生成されます。' },
    { value: 'ko', label: '한국어', icon: 'translate', desc: '프롬프트가 한국어로 생성됩니다.' },
    { value: 'zh', label: '中文', icon: 'translate', desc: '提示将以中文生成。' },
    { value: 'custom', label: 'Outro Idioma', icon: 'edit', desc: 'Digite o idioma desejado manualmente.' },
];

/** Testes options rendered separately under Q20 */
export const testesOptions: QuestionOption[] = [
    { value: 'unitarios', label: 'Testes Unitarios', icon: 'check_circle', desc: 'Vitest, Jest. Testa funcoes isoladas.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
    { value: 'e2e', label: 'Testes E2E', icon: 'integration_instructions', desc: 'Playwright, Cypress. Simula o usuario real.', difficulty: 'hard', recommendedFor: ['senior'] },
    { value: 'integracao', label: 'Testes de Integracao', icon: 'hub', desc: 'Testa a comunicacao entre modulos e APIs.', difficulty: 'medium', recommendedFor: ['pleno', 'senior'] },
    { value: 'nenhum', label: 'Nenhum por enquanto', icon: 'block', desc: 'Sem testes neste momento.', difficulty: 'easy', recommendedFor: ['junior'] },
];

/** Difficulty display config */
export const difficultyConfig = {
    easy: { label: 'Facil', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
    medium: { label: 'Medio', color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
    hard: { label: 'Dificil', color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' },
};
