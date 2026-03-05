/**
 * BuildCode — Wizard Configuration (20 Questions)
 * Data-driven config for the Software Decision System.
 * Each question is rendered dynamically by app.astro.
 *
 * Phases: 1=Contexto, 2=Stack Técnica, 3=Qualidade, 4=Final
 * minLevel: 1=Junior, 2=Pleno, 3=Senior (option visibility filter)
 */

export interface QuestionOption {
    value: string;
    label: string;
    icon: string;
    desc: string;
    minLevel?: number; // 1=all, 2=pleno+, 3=senior only
    website?: string;  // official site — enables the ⓘ info button on the card
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
    isOptionalForHobby?: boolean;
    options?: QuestionOption[];
    /** If true, renders a search bar that queries technologies.ts by dbCategory */
    searchable?: boolean;
    /** Category key in technologies.ts to search against */
    dbCategory?: string;
}

export const phases = [
    { id: 1, label: "Contexto", icon: "lightbulb" },
    { id: 2, label: "Stack", icon: "code" },
    { id: 3, label: "Qualidade", icon: "shield" },
    { id: 4, label: "Final", icon: "rocket_launch" },
];

export const questions: WizardQuestion[] = [
    // ═══════════════════════════════════════
    //  PHASE 1: CONTEXTO (Q1–Q5)
    // ═══════════════════════════════════════
    {
        step: 1, phase: 1, type: 'textarea', name: 'contexto',
        titlePre: 'Descreva a', titleHighlight: 'Alma', titlePost: 'do seu Projeto.',
        subtitle: 'Qual o propósito real do sistema? Que problema ele resolve?',
        placeholder: 'Ex: Quero criar um SaaS para barbearias gerenciarem agendamentos e finanças. Os usuários marcarão horários via link ou WhatsApp...',
    },
    {
        step: 2, phase: 1, type: 'radio', name: 'senioridade', cols: 3,
        titlePre: 'Qual seu nível de', titleHighlight: 'Senioridade', titlePost: '?',
        subtitle: 'Isso adapta as recomendações ao seu nível de experiência.',
        options: [
            { value: 'junior', label: 'Júnior', icon: 'school', desc: 'Aprendendo a codar. Foco em simplicidade e time-to-market rápido.' },
            { value: 'pleno', label: 'Pleno', icon: 'engineering', desc: 'Experiência sólida. Busca equilíbrio entre performance e agilidade.' },
            { value: 'senior', label: 'Sênior', icon: 'military_tech', desc: 'Domina arquitetura. Exige padrões SOLID, escalabilidade e testes.' },
        ],
    },
    {
        step: 3, phase: 1, type: 'radio', name: 'escala', cols: 3,
        titlePre: 'Quantos', titleHighlight: 'usuários simultâneos', titlePost: 'o sistema suportará?',
        subtitle: 'Nos primeiros 6-12 meses. Isso define a arquitetura de infraestrutura.',
        options: [
            { value: '50', label: 'Até 50', icon: 'person', desc: 'Projeto pessoal, protótipo ou ferramenta interna.' },
            { value: '1000', label: 'Até 1.000', icon: 'group', desc: 'Startup em validação, app com tração inicial.' },
            { value: '10000', label: 'Até 10.000', icon: 'groups', desc: 'Produto em crescimento, API com alta frequência.' },
            { value: '50000', label: '50.000+', icon: 'public', desc: 'Escala global, multi-region, alta disponibilidade.' },
        ],
    },
    {
        step: 4, phase: 1, type: 'radio', name: 'tipo', cols: 3,
        titlePre: 'Qual a', titleHighlight: 'natureza', titlePost: 'do projeto?',
        subtitle: 'Isso define o nível de rigor arquitetural necessário.',
        options: [
            { value: 'hobby', label: 'Pessoal / Hobby', icon: 'emoji_objects', desc: 'Aprendizado, portfólio ou side-project.' },
            { value: 'saas', label: 'SaaS', icon: 'cloud', desc: 'Produto com cobrança recorrente e múltiplos clientes.' },
            { value: 'enterprise', label: 'Larga Escala', icon: 'hub', desc: 'Governança, compliance, integrações complexas.' },
        ],
    },
    {
        step: 5, phase: 1, type: 'radio', name: 'ferramenta', cols: 3,
        titlePre: 'Qual sua', titleHighlight: 'IDE / Ferramenta', titlePost: 'principal?',
        subtitle: 'Personalizamos o Prompt Base para a ferramenta que você usa.',
        options: [
            { value: 'cursor', label: 'Cursor', icon: 'smart_toy', desc: 'Fork do VS Code com IA nativa. Geração de código surreal.' },
            { value: 'claude-code', label: 'Claude Code', icon: 'terminal', desc: 'Terminal AI da Anthropic. Poder de raciocínio máximo.' },
            { value: 'antigravity', label: 'Anti-Gravity', icon: 'rocket', desc: 'Extensão AI do Google DeepMind para VS Code.' },
            { value: 'vscode', label: 'VS Code', icon: 'code', desc: 'Editor padrão mundial. Compatível com Copilot e extensões.' },
            { value: 'windsurf', label: 'Windsurf', icon: 'air', desc: 'IDE AI-first da Codeium. Fluxos guiados por IA.' },
            { value: 'outro', label: 'Outro', icon: 'more_horiz', desc: 'WebStorm, Neovim, Replit ou qualquer outro.' },
        ],
    },

    // ═══════════════════════════════════════
    //  PHASE 2: STACK TÉCNICA (Q6–Q12)
    //  Three.js "camera dive" happens on Q5→Q6
    // ═══════════════════════════════════════
    {
        step: 6, phase: 2, type: 'radio', name: 'frontend', cols: 3,
        searchable: true, dbCategory: 'frontend',
        titlePre: 'Escolha o', titleHighlight: 'Frontend', titlePost: 'principal.',
        subtitle: 'Opções filtradas pela sua senioridade. Não encontrou? Pesquise abaixo.',
        options: [
            { value: 'html-css', label: 'HTML + CSS Puro', icon: 'code', desc: 'Sem framework. Máximo controle e aprendizado.', minLevel: 1, website: 'https://developer.mozilla.org/pt-BR/docs/Web' },
            { value: 'astro', label: 'Astro', icon: 'rocket_launch', desc: 'Zero-JS por padrão. Perfeito para sites content-driven.', minLevel: 1, website: 'https://astro.build' },
            { value: 'react', label: 'React', icon: 'web', desc: 'Ecossistema massivo. Ideal para SPAs e dashboards.', minLevel: 1, website: 'https://react.dev' },
            { value: 'vue', label: 'Vue.js', icon: 'web', desc: 'Curva de aprendizado suave. Reatividade elegante.', minLevel: 1, website: 'https://vuejs.org' },
            { value: 'nextjs', label: 'Next.js', icon: 'web', desc: 'React fullstack. SSR, SSG, API Routes em um só.', minLevel: 2, website: 'https://nextjs.org' },
            { value: 'nuxt', label: 'Nuxt.js', icon: 'web', desc: 'Vue fullstack. SSR + auto-imports. DX incrível.', minLevel: 2, website: 'https://nuxt.com' },
            { value: 'svelte', label: 'Svelte / SvelteKit', icon: 'web', desc: 'Compila para JS puro. Performance absurda.', minLevel: 2, website: 'https://svelte.dev' },
            { value: 'angular', label: 'Angular', icon: 'web', desc: 'Framework enterprise completo. TypeScript nativo.', minLevel: 3, website: 'https://angular.dev' },
            { value: 'solid', label: 'SolidJS', icon: 'web', desc: 'Reatividade fine-grained. Sem Virtual DOM.', minLevel: 3, website: 'https://www.solidjs.com' },
            { value: 'remix', label: 'Remix', icon: 'web', desc: 'Web standards first. Nested routes, loaders.', minLevel: 3, website: 'https://remix.run' },
        ],
    },
    {
        step: 7, phase: 2, type: 'radio', name: 'backend', cols: 3,
        searchable: true, dbCategory: 'backend',
        titlePre: 'Defina o', titleHighlight: 'Backend', titlePost: 'do sistema.',
        subtitle: 'O motor que roda por trás da sua aplicação. Não encontrou? Pesquise abaixo.',
        options: [
            { value: 'supabase', label: 'Supabase (BaaS)', icon: 'database', desc: 'Auth + DB + Storage + Edge Functions. Tudo pronto.', minLevel: 1, website: 'https://supabase.com' },
            { value: 'firebase', label: 'Firebase (BaaS)', icon: 'local_fire_department', desc: 'Google BaaS. Firestore, Functions, Auth.', minLevel: 1, website: 'https://firebase.google.com' },
            { value: 'express', label: 'Node.js + Express', icon: 'dns', desc: 'O servidor HTTP mais utilizado do ecossistema JS.', minLevel: 1, website: 'https://expressjs.com' },
            { value: 'nestjs', label: 'NestJS', icon: 'dns', desc: 'Framework Node.js enterprise. DI, modules, guards.', minLevel: 2, website: 'https://nestjs.com' },
            { value: 'fastify', label: 'Fastify', icon: 'bolt', desc: 'HTTP server ultra rápido para Node.js. Schema-first.', minLevel: 2, website: 'https://fastify.dev' },
            { value: 'fastapi', label: 'FastAPI (Python)', icon: 'dns', desc: 'API async em Python. Pydantic + OpenAPI auto.', minLevel: 2, website: 'https://fastapi.tiangolo.com' },
            { value: 'django', label: 'Django (Python)', icon: 'dns', desc: 'Framework Python completo. ORM, admin, auth.', minLevel: 2, website: 'https://www.djangoproject.com' },
            { value: 'go', label: 'Go (Gin/Fiber)', icon: 'memory', desc: 'Compilado, concorrente. DevOps standard.', minLevel: 3, website: 'https://go.dev' },
            { value: 'rust', label: 'Rust (Actix/Axum)', icon: 'memory', desc: 'Performance máxima. Segurança de memória garantida.', minLevel: 3, website: 'https://www.rust-lang.org' },
            { value: 'spring', label: 'Spring Boot (Java)', icon: 'dns', desc: 'Enterprise robusto. Bilhões de empresas usam.', minLevel: 3, website: 'https://spring.io/projects/spring-boot' },
            { value: 'laravel', label: 'Laravel (PHP)', icon: 'dns', desc: 'Eloquent ORM, Blade, queues. PHP moderno.', minLevel: 2, website: 'https://laravel.com' },
        ],
    },
    {
        step: 8, phase: 2, type: 'checkbox', name: 'mcps', cols: 3,
        titlePre: 'Conecte', titleHighlight: 'MCPs', titlePost: 'ao seu projeto.',
        subtitle: 'Model Context Protocol — conectores de IA para potencializar seu fluxo de desenvolvimento.',
        options: [
            { value: 'supabase-mcp', label: 'Supabase MCP', icon: 'database', desc: 'Conecta IA ao seu banco Supabase. CRUD direto.' },
            { value: 'stripe-mcp', label: 'Stripe MCP', icon: 'payments', desc: 'IA gerencia pagamentos, subscriptions, webhooks.' },
            { value: 'github-mcp', label: 'GitHub MCP', icon: 'code', desc: 'IA acessa repos, issues, PRs diretamente.' },
            { value: 'context7', label: 'Context7', icon: 'psychology', desc: 'Documentação atualizada de qualquer lib direto na IA.' },
            { value: 'openai-mcp', label: 'OpenAI MCP', icon: 'smart_toy', desc: 'Conecta modelos GPT como ferramenta auxiliar.' },
            { value: 'custom', label: 'Custom MCP', icon: 'build', desc: 'Construa seu próprio conector MCP personalizado.' },
        ],
    },
    {
        step: 9, phase: 2, type: 'radio', name: 'database', cols: 2,
        searchable: true, dbCategory: 'data',
        titlePre: 'Como você quer', titleHighlight: 'gerenciar dados', titlePost: '?',
        subtitle: 'O tipo de banco de dados define como seus dados são organizados e consultados. Prefere algo específico? Pesquise.',
        options: [
            { value: 'sql-managed', label: 'SQL Managed', icon: 'schema', desc: 'PostgreSQL gerenciado (Supabase, Neon, PlanetScale). Zero infra.', minLevel: 1, website: 'https://www.postgresql.org' },
            { value: 'sql-raw', label: 'SQL Dedicado', icon: 'schema', desc: 'PostgreSQL/MySQL em servidor próprio. Controle total.', minLevel: 2, website: 'https://www.postgresql.org' },
            { value: 'nosql', label: 'NoSQL', icon: 'table_view', desc: 'MongoDB, DynamoDB. Esquema flexível. Ideal para dados variáveis.', minLevel: 2, website: 'https://www.mongodb.com' },
            { value: 'vetorial', label: 'Vetorial (AI)', icon: 'psychology', desc: 'Pinecone, Milvus. Para busca semântica e embeddings de IA.', minLevel: 3, website: 'https://www.pinecone.io' },
        ],
    },
    {
        step: 10, phase: 2, type: 'checkbox', name: 'skills', cols: 2,
        titlePre: 'Selecione', titleHighlight: 'Skills Técnicas', titlePost: 'extras.',
        subtitle: 'References e boas práticas que serão injetadas diretamente no Prompt Base.',
        options: [
            { value: 'clean-arch', label: 'Clean Architecture', icon: 'account_tree', desc: 'Separação de camadas: domain, application, infra.' },
            { value: 'design-system', label: 'Design System', icon: 'palette', desc: 'Tokens, componentes reutilizáveis, guidelines visuais.' },
            { value: 'api-design', label: 'API Design (REST)', icon: 'api', desc: 'Contratos OpenAPI, versionamento, paginação.' },
            { value: 'testing', label: 'Testing Strategy', icon: 'bug_report', desc: 'Pirâmide de testes, mocks, fixtures, coverage.' },
            { value: 'security', label: 'Security Hardening', icon: 'shield', desc: 'OWASP Top 10, headers, sanitization, secrets.' },
            { value: 'performance', label: 'Web Performance', icon: 'speed', desc: 'Core Web Vitals, lazy loading, bundle optimization.' },
            { value: 'a11y', label: 'Acessibilidade (A11y)', icon: 'accessibility', desc: 'WCAG compliance, screen readers, navegação por teclado.' },
            { value: 'devops', label: 'DevOps & CI/CD', icon: 'settings', desc: 'Pipelines, deploys automatizados, monitoramento.' },
        ],
    },
    {
        step: 11, phase: 2, type: 'radio', name: 'infra', cols: 3,
        searchable: true, dbCategory: 'infra',
        titlePre: 'Onde será o', titleHighlight: 'Deploy', titlePost: 'do sistema?',
        subtitle: 'A infraestrutura onde seu código vai rodar em produção. Não encontrou sua cloud? Pesquise.',
        options: [
            { value: 'vercel', label: 'Vercel', icon: 'speed', desc: 'Deploy instantâneo. Ideal para Next.js e frontend.', minLevel: 1, website: 'https://vercel.com' },
            { value: 'railway', label: 'Railway', icon: 'train', desc: 'PaaS moderno. Deploy de qualquer coisa em minutos.', minLevel: 1, website: 'https://railway.app' },
            { value: 'supabase', label: 'Supabase Host', icon: 'database', desc: 'Hospeda Edge Functions + Banco. Ecossistema completo.', minLevel: 1, website: 'https://supabase.com' },
            { value: 'netlify', label: 'Netlify', icon: 'cloud', desc: 'JAMStack. CDN global, forms, functions.', minLevel: 1, website: 'https://www.netlify.com' },
            { value: 'cloudflare', label: 'Cloudflare', icon: 'public', desc: 'Edge Computing global. Workers, Pages, R2.', minLevel: 2, website: 'https://www.cloudflare.com' },
            { value: 'digitalocean', label: 'DigitalOcean', icon: 'cloud', desc: 'VPS acessível. App Platform ou Droplets.', minLevel: 2, website: 'https://www.digitalocean.com' },
            { value: 'aws', label: 'AWS', icon: 'cloud', desc: '200+ serviços. Infinita escalabilidade enterprise.', minLevel: 3, website: 'https://aws.amazon.com' },
            { value: 'docker-vps', label: 'Docker + VPS', icon: 'hub', desc: 'Máximo controle. Hetzner, Fly.io, Coolify.', minLevel: 3, website: 'https://www.docker.com' },
        ],
    },
    {
        step: 12, phase: 2, type: 'radio', name: 'persistencia', cols: 3,
        titlePre: 'Modelo de', titleHighlight: 'Persistência', titlePost: 'dos dados.',
        subtitle: 'Como os dados serão estruturados e armazenados no banco.',
        options: [
            { value: 'relacional', label: 'Relacional (SQL)', icon: 'grid_on', desc: 'Tabelas, relações, migrations. ACID rigoroso.' },
            { value: 'documentos', label: 'Documentos (NoSQL)', icon: 'description', desc: 'JSON flexível. Sem schema rígido. Rápido para prototipar.' },
            { value: 'hibrido', label: 'Híbrido', icon: 'merge_type', desc: 'SQL principal + Redis Cache. Melhor dos dois mundos.' },
        ],
    },

    // ═══════════════════════════════════════
    //  PHASE 3: QUALIDADE & SEGURANÇA (Q13–Q18)
    // ═══════════════════════════════════════
    {
        step: 13, phase: 3, type: 'radio', name: 'auth', cols: 2,
        titlePre: 'Nível de', titleHighlight: 'Autenticação', titlePost: 'necessário.',
        subtitle: 'Quem pode acessar o sistema e com quais permissões?',
        options: [
            { value: 'nenhum', label: 'Sem Auth', icon: 'lock_open', desc: 'App público sem login. Landing pages, blogs.' },
            { value: 'basico', label: 'Email + Senha', icon: 'lock', desc: 'Login básico. Cadastro e recuperação de senha.' },
            { value: 'oauth', label: 'OAuth Social', icon: 'supervisor_account', desc: 'Google, GitHub, Apple. Sem senha para o usuário.' },
            { value: 'rbac', label: 'RBAC Completo', icon: 'admin_panel_settings', desc: 'Múltiplos papéis: Admin, Editor, Viewer. Granular.' },
            { value: 'enterprise', label: 'Enterprise (SSO)', icon: 'shield', desc: 'SAML, SSO, MFA obrigatório. Compliance total.', minLevel: 3 },
        ],
    },
    {
        step: 14, phase: 3, type: 'checkbox', name: 'seguranca', cols: 3,
        titlePre: 'Camadas de', titleHighlight: 'Segurança', titlePost: 'ativas.',
        subtitle: 'Proteções essenciais para seu sistema. Passe o mouse em cada termo para entender.',
        isOptionalForHobby: true,
        options: [
            { value: 'https', label: 'HTTPS/TLS Forçado', icon: 'https', desc: 'Criptografia em trânsito obrigatória.' },
            { value: 'sanitizacao', label: 'Sanitização de Dados', icon: 'cleaning_services', desc: 'Previne XSS, SQL Injection e ataques de input.' },
            { value: 'rate-limit', label: 'Rate Limiting', icon: 'speed', desc: 'Limita requisições por IP. Anti-DDoS e anti-abuso.' },
            { value: 'mfa', label: 'MFA', icon: 'security', desc: 'Autenticação Multi-Fator. Senha + código celular.', minLevel: 2 },
            { value: 'csrf', label: 'CSRF Protection', icon: 'shield', desc: 'Impede ações forjadas por sites maliciosos.', minLevel: 2 },
            { value: 'helmet', label: 'Security Headers', icon: 'policy', desc: 'Helmet, HSTS, CSP. Blindagem no nível HTTP.', minLevel: 3 },
        ],
    },
    {
        step: 15, phase: 3, type: 'radio', name: 'realtime', cols: 2,
        titlePre: 'Precisa de', titleHighlight: 'Real-time', titlePost: '?',
        subtitle: 'Comunicação instantânea entre servidor e cliente.',
        options: [
            { value: 'nao', label: 'Não Preciso', icon: 'block', desc: 'Sem necessidade de dados em tempo real.' },
            { value: 'websocket', label: 'WebSocket', icon: 'sync_alt', desc: 'Bidirecional. Chat, notificações live, dashboards.', minLevel: 1 },
            { value: 'sse', label: 'Server-Sent Events', icon: 'arrow_downward', desc: 'Unidirecional do servidor. Feeds, atualizações.', minLevel: 2 },
            { value: 'polling', label: 'Polling', icon: 'refresh', desc: 'Requisições periódicas. Simples mas menos eficiente.' },
        ],
    },
    {
        step: 16, phase: 3, type: 'radio', name: 'codestyle', cols: 3,
        titlePre: 'Seu', titleHighlight: 'Estilo de Código', titlePost: 'preferido.',
        subtitle: 'Define como a IA vai estruturar o código gerado.',
        options: [
            { value: 'functional', label: 'Funcional', icon: 'function', desc: 'Pure functions, composition, imutabilidade. React-style.' },
            { value: 'oop', label: 'Orientado a Objetos', icon: 'class', desc: 'Classes, herança, encapsulamento. Java/C#-style.' },
            { value: 'misto', label: 'Misto / Pragmático', icon: 'merge_type', desc: 'Funcional onde faz sentido, OOP quando necessário.' },
        ],
    },
    {
        step: 17, phase: 3, type: 'radio', name: 'erros', cols: 3,
        titlePre: 'Estratégia de', titleHighlight: 'Tratamento de Erros', titlePost: '.',
        subtitle: 'Como o sistema reage quando algo dá errado.',
        options: [
            { value: 'graceful', label: 'Graceful Degradation', icon: 'healing', desc: 'Sistema continua parcialmente. UX resiliente.' },
            { value: 'strict', label: 'Strict (Fail-Fast)', icon: 'error', desc: 'Falha rápido e explícito. Logs detalhados. Seguro.' },
            { value: 'hibrido', label: 'Híbrido', icon: 'tune', desc: 'Graceful no front, strict no back. Pragmático.' },
        ],
    },
    {
        step: 18, phase: 3, type: 'radio', name: 'i18n', cols: 3,
        titlePre: 'Precisa de', titleHighlight: 'Multi-Idioma', titlePost: '(i18n)?',
        subtitle: 'Internacionalização prepara seu software para o mundo.',
        options: [
            { value: 'nao', label: 'Não (Monolíngue)', icon: 'translate', desc: 'Apenas um idioma. Mais simples e rápido.' },
            { value: 'poucos', label: 'Sim (2-3 idiomas)', icon: 'language', desc: 'PT-BR + EN ou similar. Arquivos de tradução.' },
            { value: 'global', label: 'Sim (Muitos)', icon: 'public', desc: 'Sistema global. RTL support, formatação de datas.' },
        ],
    },

    // ═══════════════════════════════════════
    //  PHASE 4: FINAL (Q19–Q20)
    // ═══════════════════════════════════════
    {
        step: 19, phase: 4, type: 'checkbox', name: 'integracoes', cols: 3,
        titlePre: 'Quais', titleHighlight: 'Integrações', titlePost: 'externas?',
        subtitle: 'Serviços terceiros que o sistema precisa se comunicar.',
        options: [
            { value: 'webhooks', label: 'Webhooks', icon: 'webhook', desc: 'Notificações automáticas entre sistemas.' },
            { value: 'pagamentos', label: 'Pagamentos', icon: 'payments', desc: 'Stripe, MercadoPago, PIX. Cobranças online.' },
            { value: 'apis-rest', label: 'APIs REST Externas', icon: 'api', desc: 'Consumir dados de serviços de terceiros.' },
            { value: 'email', label: 'Email Transacional', icon: 'email', desc: 'Resend, SendGrid. Emails automáticos do sistema.' },
            { value: 'push', label: 'Push Notifications', icon: 'notifications', desc: 'Alertas mobile/web em tempo real.' },
            { value: 'storage', label: 'Cloud Storage', icon: 'cloud_upload', desc: 'S3, Cloudflare R2. Upload de arquivos e mídia.' },
            { value: 'analytics', label: 'Analytics', icon: 'analytics', desc: 'Mixpanel, PostHog. Métricas de uso e comportamento.' },
        ],
    },
    {
        step: 20, phase: 4, type: 'radio', name: 'seo', cols: 2,
        titlePre: '', titleHighlight: 'SEO & Testes', titlePost: '— última etapa.',
        subtitle: 'Indexação nos buscadores e estratégia de qualidade de código.',
        options: [
            { value: 'seo-full', label: 'SEO Crítico', icon: 'search', desc: 'Google indexação, meta tags, sitemap, structured data.' },
            { value: 'seo-none', label: 'App Privado', icon: 'lock', desc: 'Sem SEO. Dashboard interno ou app autenticado.' },
            { value: 'seo-partial', label: 'Parcial', icon: 'tune', desc: 'Landing com SEO + app interno sem indexação.' },
        ],
    },
];

/** Testes options rendered separately under Q20 */
export const testesOptions: QuestionOption[] = [
    { value: 'unitarios', label: 'Testes Unitários', icon: 'check_circle', desc: 'Vitest, Jest. Testa funções isoladas.' },
    { value: 'e2e', label: 'Testes E2E', icon: 'integration_instructions', desc: 'Playwright, Cypress. Simula o usuário real.' },
    { value: 'integracao', label: 'Testes de Integração', icon: 'hub', desc: 'Testa a comunicação entre módulos e APIs.' },
    { value: 'nenhum', label: 'Nenhum por enquanto', icon: 'block', desc: 'Sem testes neste momento.' },
];
