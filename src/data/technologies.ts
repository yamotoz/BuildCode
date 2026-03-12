export interface Technology {
    name: string;
    category: string;
    tagline: string;
    description: string;
    language: string;
    pros: string[];
    cons: string[];
    useCases: string;
    typeIcon: string;
    role: string;
    logo: string;
    website: string;
    tags?: string[];
}

// Helper: Local icons (downloaded SVGs for maximum performance)
const si = (slug: string) => `/icons/${slug}.svg`;
// Devicons colored SVGs (good for branded colors)
const di = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;

export const technologies: Technology[] = [
    { "name": "React", "category": "frontend", "tagline": "Declarative UI", "description": "Construção de interfaces através de componentes reativos.", "language": "JavaScript", "pros": ["Ecossistema massivo e imbatível.", "Reaproveitamento de código na web.", "Vasta comunidade."], "cons": ["Curva de aprendizado contínua.", "Overhead de re-renderizações complexas."], "useCases": "Desenvolvimento rápido, SaaS e dashboards.", "typeIcon": "web", "role": "Ecosystem Leader", "logo": si("react"), "website": "https://react.dev" },
    { "name": "Next.js", "category": "frontend", "tagline": "Fullstack React", "description": "Framework React para produção com suporte a SSR e rotas API.", "language": "TypeScript", "pros": ["SEO impecável (Server Components).", "Integração com Vercel nativa.", "Roteamento simplificado."], "cons": ["Vendor lock-in para Vercel.", "Curva com App Router da nova versão."], "useCases": "Portais SEO-friendly e projetos em larga escala.", "typeIcon": "web", "role": "Industry Standard", "logo": si("nextdotjs"), "website": "https://nextjs.org" },
    { "name": "Vue.js", "category": "frontend", "tagline": "Progressive Framework", "description": "Framework flexível para SPAs com integração facilitada.", "language": "JavaScript", "pros": ["Curva de aprendizado baixíssima.", "Reatividade elegante.", "Ótima doc oficial."], "cons": ["Menor adoção corporativa que React.", "Plugin ecosystem fragmentado."], "useCases": "Projetos médios e de rápida entrega.", "typeIcon": "web", "role": "Community Favorite", "logo": si("vuedotjs"), "website": "https://vuejs.org" },
    { "name": "Astro", "category": "frontend", "tagline": "Content-Driven Web", "description": "Geração de sites rápidos focados em conteúdo e performance.", "language": "TypeScript", "pros": ["Shipping zero-JS por padrão.", "Component islands.", "Framework agnostic."], "cons": ["Aplicativos ricos em estado são complexos.", "Ainda jovem."], "useCases": "Blogs, Landing Pages, Portfólios, Docs.", "typeIcon": "rocket_launch", "role": "Performance King", "logo": si("astro"), "website": "https://astro.build" },
    { "name": "Node.js", "category": "backend", "tagline": "V8 Runtime", "description": "Ambiente de execução asssíncrono JavaScript lado servidor.", "language": "JavaScript", "pros": ["Performance impecável em I/O.", "Ecossistema NPM infinito.", "Mão de obra acessível."], "cons": ["Bloqueio de Event Loop em processos intensivos (CPU).", "Node_modules gigante."], "useCases": "APIs escaláveis em microserviços.", "typeIcon": "dns", "role": "Market Standard", "logo": si("nodedotjs"), "website": "https://nodejs.org" },
    { "name": "Bun", "category": "backend", "tagline": "Ultra-fast Runtime", "description": "Substituto para Node com instalador ultrarrápido nativo.", "language": "C++", "pros": ["Velocidade 4x+ nativa.", "TypeScript nativo."], "cons": ["Ainda apresenta bugs na comunidade.", "APIs de compatibilidade não finalizadas."], "useCases": "Testes e prototipação fulminante.", "typeIcon": "bolt", "role": "Bleeding Edge", "logo": si("bun"), "website": "https://bun.sh" },
    { "name": "Go (Golang)", "category": "backend", "tagline": "Scalable Systems", "description": "Linguagem simples, concorrente e nativamente compilada.", "language": "Go", "pros": ["Goroutines incríveis.", "Compilação nativa em cross-platform.", "Tipagem estrita."], "cons": ["Verbosidade com error handling.", "Semântica Go pode confundir (OOP)."], "useCases": "Cloud native, Kubernetes pods.", "typeIcon": "memory", "role": "DevOps Standard", "logo": si("go"), "website": "https://go.dev" },
    { "name": "PostgreSQL", "category": "data", "tagline": "Relational Database", "description": "O banco de dados relacional (SQL) mais robusto e maduro da atualidade.", "language": "SQL", "pros": ["Integridade ACID rigorosa.", "JSONB para document-like.", "PostGIS para rotas geográficas."], "cons": ["Requer experiência para tunning em load alto.", "Custos em nuvem elevados em instâncias DB."], "useCases": "Praticamente todos os casos de negócio sério.", "typeIcon": "schema", "role": "Rock Solid", "logo": si("postgresql"), "website": "https://www.postgresql.org" },
    { "name": "Redis", "category": "data", "tagline": "Caching Layer", "description": "DB in-memory baseado em chaves e valores focado em ultra velocidade.", "language": "C", "pros": ["Latência de milisegundos.", "Estruturas complexas."], "cons": ["Por padrão, os dados desaparecem no reboot (se sem dump).", "Requer infra adicional para sync."], "useCases": "Caching de queries, filas, rate limits.", "typeIcon": "electric_bolt", "role": "Instant Access", "logo": si("redis"), "website": "https://redis.io" },
    { "name": "MongoDB", "category": "data", "tagline": "NoSQL DB", "description": "Banco de dados baseado em documentos (JSON-like).", "language": "C++", "pros": ["Esquemas flexíveis (sem migrations duras).", "Adoção imensa em Node.js."], "cons": ["Pode criar relações ineficientes (DB normalization difícil).", "Consumo de disco alto."], "useCases": "Sistemas flexíveis e logs em larga escala.", "typeIcon": "table_view", "role": "Document Store", "logo": si("mongodb"), "website": "https://www.mongodb.com" },
    { "name": "AWS", "category": "infra", "tagline": "Cloud Provider", "description": "Provedora gigantesca de nuvem com mais de 200 serviços de IaaS/PaaS.", "language": "Cloud", "pros": ["Serviço disponível de infinita escalabilidade.", "Tudo pode ser feito nela."], "cons": ["Cobrança complexa e dolorosa.", "Requer conhecimento de SysAdmin ou Cloud Engineer."], "useCases": "Aplicações Enterprise com conformidades rígidas.", "typeIcon": "cloud", "role": "Enterprise Grade", "logo": si("amazonaws"), "website": "https://aws.amazon.com" },
    { "name": "Docker", "category": "infra", "tagline": "Container Engine", "description": "Isolamento de aplicações através de conteinerização na máquina host.", "language": "Go", "pros": ["Acaba com o 'funciona na minha máquina'.", "Distribuição facil de software.", "Leve e rápido comparado a VMs."], "cons": ["Imagens excessivas lotam HDDs.", "Rede de containers pode ser confusa."], "useCases": "Deploy seguro de qualquer serviço back-end ou front-end.", "typeIcon": "hub", "role": "DevOps Tool", "logo": si("docker"), "website": "https://www.docker.com" },
    { "name": "Vercel", "category": "infra", "tagline": "Frontend Cloud", "description": "Plataforma Edge Network serverless focada no ecossistema UX/Frontend.", "language": "Cloud", "pros": ["Deploy instantâneo vinculando o GitHub.", "Integração imbatível com Next.js."], "cons": ["Preços corporativos altos (Bandwidth caríssima).", "Vendor-lockin forte com features Edge próprias."], "useCases": "Projetos modernos JAMStack, Next.js ou SSRs independentes.", "typeIcon": "speed", "role": "Deploy Hub", "logo": si("vercel"), "website": "https://vercel.com" },
    { "name": "Tailwind CSS", "category": "libs", "tagline": "Utility-First CSS", "description": "Framework CSS utilitário para estilização atômica diretamente na classHTML.", "language": "CSS", "pros": ["Escreve estilos absurdamente rápidos.", "Sem dezenas de arquivos .css para gerenciar."], "cons": ["O HTML vira um caos visual nas primeiras sessões de debug.", "Necessidade de memorizar as utility classes."], "useCases": "Construção frenética de UI moderna.", "typeIcon": "brush", "role": "Styling Meta", "logo": si("tailwindcss"), "website": "https://tailwindcss.com" },
    { "name": "Shadcn/ui", "category": "libs", "tagline": "Accessible Components", "description": "Repositório de componentes com design deslumbrante que você copa (via CLI) no projeto.", "language": "TypeScript", "pros": ["Você é o guardião do código fonte.", "Acessível via Radix e lindo."], "cons": ["Como você detém o código, atualizações exigem manutenção paralela."], "useCases": "Componentes premium para Dashboards React e Saas robustos.", "typeIcon": "widgets", "role": "UI Library", "logo": si("shadcnui"), "website": "https://ui.shadcn.com" },
    { "name": "Prisma", "category": "data", "tagline": "TypeScript ORM", "description": "ORM moderno NodeJS e TypeScript de extrema fluência para lidar com bases relacionais (e Mongo).", "language": "TypeScript", "pros": ["Typescript puro! Se o tipo quebrar, não roda (Zero-bug inference).", "Prisma Studio incrível."], "cons": ["Performance não nativa para queries imensas / analíticas avançadas.", "Sem suporte nativo para DBs Edges sem drivers remotos."], "useCases": "CRUD rápido com type safety absoluto.", "typeIcon": "data_object", "role": "Modern ORM", "logo": si("prisma"), "website": "https://www.prisma.io" },
    { "name": "VS Code", "category": "devex", "tagline": "Editor Default", "description": "A IDE open-source baseada em Chromium mais usada no planeta.", "language": "TypeScript", "pros": ["Incontáveis extensões para qualquer linguagem de programação e utilitário.", "Extremamente customizável."], "cons": ["Baseado em Electron (come RAM com dezenas de tabs e lógicas em loop)."], "useCases": "Basicamente 85% do mercado global o utiliza diariamente.", "typeIcon": "code", "role": "Market Leader", "logo": si("visualstudiocode"), "website": "https://code.visualstudio.com" },
    { "name": "Cursor", "category": "devex", "tagline": "AI Native Editor", "description": "Um fork imensamente melhorado do VSCode, construído com foco intrínseco em Inteligência Artificial para gerar arquiteturas em cliques.", "language": "Agnostic", "pros": ["Geração de código surreal analisando seu ambiente inteiro.", "Ferramentas avançadas do Copilot já prontas na interface."], "cons": ["Custo da API ou da mensalidade da Pro.", "Ainda baseado no ecossistema (fork) mantido externamente do mainstream."], "useCases": "Maior throughput (velocity) em times ou indies.", "typeIcon": "smart_toy", "role": "Future IDE", "logo": si("cursor"), "website": "https://cursor.com" },

    // ══════════════════════════════
    //  IA GENERATIVA & LLMs
    // ══════════════════════════════
    { "name": "Venice AI", "category": "ai", "tagline": "Uncensored AI", "description": "Plataforma de IA generativa sem censura com foco em privacidade total — sem logs, sem filtros, sem restrições de conteúdo.", "language": "Multi-Model", "pros": ["Privacidade absoluta — zero data retention.", "Modelos sem censura para criação livre.", "Interface limpa e responsiva."], "cons": ["Qualidade varia entre modelos disponíveis.", "Menos integrações corporativas que concorrentes."], "useCases": "Geração de conteúdo criativo sem restrições e brainstorming livre.", "typeIcon": "lock_open", "role": "Privacy First", "logo": si("openai"), "website": "https://venice.ai/chat", "tags": ["IA sem Censura"] },
    { "name": "Arena AI", "category": "ai", "tagline": "LLM Leaderboard", "description": "Plataforma de ranking e comparação das melhores LLMs do mercado em tempo real — vote, compare e descubra qual modelo lidera.", "language": "Benchmarks", "pros": ["Rankings atualizados pela comunidade em tempo real.", "Comparação side-by-side entre modelos.", "Dados transparentes e open-source."], "cons": ["Focado em benchmarks — não é uma ferramenta de uso direto.", "Rankings podem variar por tipo de tarefa."], "useCases": "Escolher a melhor LLM para seu caso de uso antes de integrar.", "typeIcon": "leaderboard", "role": "AI Compass", "logo": si("openai"), "website": "https://arena.ai/leaderboard/code" },
    { "name": "Chat Z.AI", "category": "ai", "tagline": "Open-Source AI", "description": "Acesso direto ao GLM e outros modelos open-source de IA generativa para chat, código e análise.", "language": "GLM Models", "pros": ["Modelos open-source de alta qualidade.", "Gratuito para uso básico.", "Sem vendor lock-in."], "cons": ["Menos polish que ChatGPT/Claude.", "Velocidade pode variar sob demanda alta."], "useCases": "Desenvolvimento e testes com modelos open-source sem custos.", "typeIcon": "smart_toy", "role": "Open Source", "logo": si("openai"), "website": "https://chat.z.ai/" },

    // ══════════════════════════════
    //  DESIGN & INSPIRAÇÃO
    // ══════════════════════════════
    { "name": "Spline", "category": "design", "tagline": "3D Design Tool", "description": "Ferramenta de design 3D colaborativa no navegador — crie cenas, animações e experiências interativas sem instalar nada.", "language": "WebGL/3D", "pros": ["Interface intuitiva drag-and-drop para 3D.", "Exporta para React, iframes e vídeo.", "Colaboração em tempo real no browser."], "cons": ["Performance pode cair com cenas muito complexas.", "Plano gratuito limitado em exportações."], "useCases": "Landing pages 3D, elementos interativos para web e protótipos visuais.", "typeIcon": "view_in_ar", "role": "3D Pioneer", "logo": si("threedotjs"), "website": "https://spline.design/" },
    { "name": "Freepik", "category": "design", "tagline": "Assets & Vetores", "description": "Maior acervo gratuito de vetores, fotos, PSD, ícones e mockups para designers e desenvolvedores.", "language": "Recursos", "pros": ["Milhões de assets gratuitos de alta qualidade.", "IA generativa integrada para criação rápida.", "Filtros avançados por estilo e formato."], "cons": ["Atribuição obrigatória no plano free.", "Muitos assets premium requerem assinatura."], "useCases": "Prototipação rápida, criação de mockups e assets para UI.", "typeIcon": "image", "role": "Asset Library", "logo": si("figma"), "website": "https://br.freepik.com/" },
    { "name": "Behance", "category": "design", "tagline": "Portfolio Showcase", "description": "Plataforma da Adobe para descoberta e showcase de trabalhos criativos — UI, branding, ilustração e mais.", "language": "Portfólio", "pros": ["Comunidade global de designers profissionais.", "Integração com Adobe Creative Cloud.", "Curadoria de projetos de altíssima qualidade."], "cons": ["Difícil se destacar em meio a milhões de projetos.", "Focado em showcase, não em colaboração ativa."], "useCases": "Buscar inspiração de UI/UX, referências visuais e tendências de design.", "typeIcon": "brush", "role": "Creative Hub", "logo": si("figma"), "website": "https://www.behance.net/" },

    // ══════════════════════════════
    //  MCP SERVERS
    // ══════════════════════════════
    { "name": "Smithery", "category": "mcp", "tagline": "MCP Hub", "description": "Marketplace e buscador de MCP Servers — encontre, instale e configure MCPs com base na sua necessidade sem esforço.", "language": "MCP Protocol", "pros": ["Catálogo centralizado de centenas de MCPs.", "Busca inteligente por caso de uso.", "Instalação simplificada com um clique."], "cons": ["Ainda em crescimento — nem todos os MCPs estão listados.", "Qualidade varia entre MCPs da comunidade."], "useCases": "Descobrir e instalar MCPs para expandir capacidades de agentes de IA.", "typeIcon": "hub", "role": "MCP Marketplace", "logo": si("anthropic"), "website": "https://smithery.ai/" },
    { "name": "TestSprite", "category": "mcp", "tagline": "Security Testing MCP", "description": "MCP Server focado em testes de segurança automatizados — integre análise de vulnerabilidades diretamente no seu agente de IA.", "language": "Security", "pros": ["Testes de segurança automatizados via MCP.", "Integração direta com IDEs e agentes.", "Relatórios detalhados de vulnerabilidades."], "cons": ["Focado em segurança — escopo limitado.", "Requer configuração inicial do ambiente."], "useCases": "Análise de segurança automatizada durante o desenvolvimento com IA.", "typeIcon": "shield", "role": "Security Guard", "logo": si("anthropic"), "website": "https://www.testsprite.com/" },
    { "name": "Context7", "category": "mcp", "tagline": "Context MCP", "description": "MCP Server da Upstash que fornece documentação atualizada de bibliotecas e frameworks diretamente para seu agente de IA.", "language": "Docs Engine", "pros": ["Docs sempre atualizadas em tempo real.", "Elimina alucinações de versões antigas.", "Open-source e fácil de instalar."], "cons": ["Cobertura depende das libs indexadas.", "Requer Node.js/npx para rodar."], "useCases": "Garantir que o agente de IA use a documentação mais recente de qualquer lib.", "typeIcon": "menu_book", "role": "Docs Provider", "logo": si("upstash"), "website": "https://github.com/upstash/context7" },
];

// --- Logos mapeados para techs secundárias ---
const logoMap: Record<string, string> = {
    // Frontend
    "Nuxt.js": si("nuxtdotjs"), "Svelte": si("svelte"), "SvelteKit": si("svelte"),
    "Angular": si("angular"), "SolidJS": si("solid"), "Remix": si("remix"),
    "React Native": si("react"), "TanStack Query": si("reactquery"),
    "Three.js": si("threedotjs"), "Framer Motion": si("framer"),
    "Storybook": si("storybook"), "Qwik": si("qwik"), "HTMX": si("htmx"),
    "Flutter Web": si("flutter"), "Alpine.js": si("alpinedotjs"),
    "Preact": si("preact"), "Lit": si("lit"), "Gatsby": si("gatsby"),
    "Expo": si("expo"), "Vite": si("vite"), "Playwright": si("playwright"),
    "Capacitor": si("capacitor"),
    // Backend
    "Deno": si("deno"), "Rust": si("rust"), "Python": si("python"),
    "Fastify": si("fastify"), "NestJS": si("nestjs"), "FastAPI": si("fastapi"),
    "Elixir": si("elixir"), "Ruby on Rails": si("rubyonrails"),
    "Laravel": si("laravel"), "Spring Boot": si("springboot"),
    ".NET": si("dotnet"), "Hono": si("hono"), "Gin": si("go"),
    "Django": si("django"), "Cloudflare Workers": si("cloudflareworkers"),
    "Express.js": si("express"), "tRPC": si("trpc"),
    "Strapi": si("strapi"), "Payload CMS": si("payloadcms"),
    "Koa": si("koa"),
    // Data
    "MySQL": si("mysql"), "SQLite": si("sqlite"), "Turso": si("turso"),
    "Pinecone": si("pinecone"), "Upstash": si("upstash"),
    "DynamoDB": si("amazondynamodb"), "Supabase DB": si("supabase"),
    "Drizzle": si("drizzle"), "ClickHouse": si("clickhouse"),
    "Meilisearch": si("meilisearch"), "Algolia": si("algolia"),
    "Cassandra": si("apachecassandra"), "MariaDB": si("mariadb"),
    "Neo4j": si("neo4j"), "PocketBase": si("pocketbase"),
    "Firebase DB": si("firebase"), "SurrealDB": si("surrealdb"),
    // Infra
    "Google Cloud": si("googlecloud"), "Azure": si("microsoftazure"),
    "Netlify": si("netlify"), "Railway": si("railway"),
    "Render": si("render"), "DigitalOcean": si("digitalocean"),
    "Supabase": si("supabase"), "Kubernetes": si("kubernetes"),
    "Fly.io": si("flydotio"), "Neon": si("neon"),
    "Hetzner": si("hetzner"), "Appwrite": si("appwrite"),
    "Coolify": si("coolify"), "Terraform": si("terraform"),
    "Pulumi": si("pulumi"), "GitHub Actions": si("githubactions"),
    "GitLab CI": si("gitlab"), "Jenkins": si("jenkins"),
    "Sentry": si("sentry"), "Grafana": si("grafana"),
    "Prometheus": si("prometheus"), "Cloudflare": si("cloudflare"),
    "Nginx": si("nginx"),
    // Libs
    "Radix UI": si("radixui"), "Zod": si("zod"), "Zustand": si("zustand"),
    "Redux Toolkit": si("redux"), "Jotai": si("jotai"),
    "Emotion/Styled": si("styledcomponents"), "I18next": si("i18next"),
    "Axios": si("axios"), "Lucide React": si("lucide"),
    "Lodash": si("lodash"), "React Hook Form": si("reacthookform"),
    "Mongoose": si("mongoose"), "Resend": si("resend"),
    "Stripe SDK": si("stripe"), "Auth.js (NextAuth)": si("authdotjs"),
    "Clerk": si("clerk"), "Puppeteer": si("puppeteer"),
    "Sharp": si("sharp"), "BullMQ": si("bull"),
    // DevEx
    "Windsurf": si("codeium"), "Copilot": si("githubcopilot"),
    "ChatGPT": si("openai"), "Claude (Anthropic)": si("anthropic"),
    "MCP (Model Context Protocol)": si("anthropic"),
    "Prettier": si("prettier"), "ESLint": si("eslint"),
    "Biome": si("biome"), "Turborepo": si("turborepo"),
    "Nx": si("nx"), "Git": si("git"), "Neovim": si("neovim"),
    "Docker Desktop": si("docker"), "Postman": si("postman"),
    "Insomnia": si("insomnia"), "Warp": si("warp"),
    "Raycast": si("raycast"), "Figma": si("figma"),
    "Excalidraw": si("excalidraw"), "Linear": si("linear"),
    "Trello": si("trello"), "Obsidian": si("obsidian"),
    "V0.dev": si("vercel"), "Replit": si("replit"),
    "Stencil": si("stencil"),
    // AI & LLMs
    "Skynet Chat": si("openai"), "DeepHat": si("openai"),
    "Perplexity": si("perplexity"), "HuggingChat": si("huggingface"),
    "Poe": si("poe"), "Groq": si("openai"), "Ollama": si("ollama"),
    "LM Studio": si("openai"), "Mistral Le Chat": si("openai"),
    "DeepSeek": si("openai"), "Together AI": si("openai"),
    "Phind": si("openai"), "You.com": si("openai"), "Jan": si("openai"),
    "Grok (xAI)": si("x"),
    // Design & Inspiração
    "Pexels": si("figma"), "Pinterest": si("pinterest"), "Land-book": si("figma"),
    "Aura": si("figma"), "Dribbble": si("dribbble"), "Awwwards": si("figma"),
    "Unsplash": si("unsplash"), "Mobbin": si("figma"), "Coolors": si("figma"),
    "Muzli": si("figma"), "Canva": si("canva"), "Lottiefiles": si("figma"),
    "CSS Design Awards": si("css3"), "Godly": si("figma"), "SiteInspire": si("figma"),
    // MCP Servers
    "Filesystem MCP": si("anthropic"), "GitHub MCP": si("github"),
    "Puppeteer MCP": si("puppeteer"), "Brave Search MCP": si("brave"),
    "Slack MCP": si("slack"), "Sequential Thinking MCP": si("anthropic"),
    "Memory MCP": si("anthropic"), "Supabase MCP": si("supabase"),
    "Cloudflare MCP": si("cloudflare"), "PostgreSQL MCP": si("postgresql"),
    "Exa MCP": si("anthropic"), "Sentry MCP": si("sentry"),
    // DevEx additions
    "OpenCode": si("openai"), "BrowserAct": si("puppeteer"),
};

const websiteMap: Record<string, string> = {
    "Nuxt.js": "https://nuxt.com", "Svelte": "https://svelte.dev",
    "SvelteKit": "https://kit.svelte.dev", "Angular": "https://angular.dev",
    "SolidJS": "https://www.solidjs.com", "Remix": "https://remix.run",
    "React Native": "https://reactnative.dev", "TanStack Query": "https://tanstack.com/query",
    "Three.js": "https://threejs.org", "Framer Motion": "https://www.framer.com/motion",
    "Storybook": "https://storybook.js.org", "Qwik": "https://qwik.dev",
    "HTMX": "https://htmx.org", "Flutter Web": "https://flutter.dev",
    "Alpine.js": "https://alpinejs.dev", "Preact": "https://preactjs.com",
    "Lit": "https://lit.dev", "Gatsby": "https://www.gatsbyjs.com",
    "Expo": "https://expo.dev", "Vite": "https://vitejs.dev",
    "Playwright": "https://playwright.dev", "Capacitor": "https://capacitorjs.com",
    "RedwoodJS": "https://redwoodjs.com", "Stencil": "https://stenciljs.com",
    "Deno": "https://deno.com", "Rust": "https://www.rust-lang.org",
    "Python": "https://www.python.org", "Fastify": "https://fastify.dev",
    "NestJS": "https://nestjs.com", "FastAPI": "https://fastapi.tiangolo.com",
    "Elixir": "https://elixir-lang.org", "Phoenix": "https://www.phoenixframework.org",
    "Koa": "https://koajs.com", "Strapi": "https://strapi.io",
    "Payload CMS": "https://payloadcms.com", "Ruby on Rails": "https://rubyonrails.org",
    "Laravel": "https://laravel.com", "Spring Boot": "https://spring.io/projects/spring-boot",
    ".NET": "https://dotnet.microsoft.com", "ElysiaJS": "https://elysiajs.com",
    "Hono": "https://hono.dev", "Fiber": "https://gofiber.io",
    "Actix": "https://actix.rs", "Axum": "https://github.com/tokio-rs/axum",
    "Gin": "https://gin-gonic.com", "Django": "https://www.djangoproject.com",
    "Cloudflare Workers": "https://workers.cloudflare.com", "Express.js": "https://expressjs.com",
    "Directus": "https://directus.io", "tRPC": "https://trpc.io",
    "Bunchi": "https://bun.sh",
    "MySQL": "https://www.mysql.com", "SQLite": "https://www.sqlite.org",
    "Turso": "https://turso.tech", "Pinecone": "https://www.pinecone.io",
    "Milvus": "https://milvus.io", "Upstash": "https://upstash.com",
    "PlanetScale": "https://planetscale.com", "Convex": "https://www.convex.dev",
    "DynamoDB": "https://aws.amazon.com/dynamodb", "Supabase DB": "https://supabase.com",
    "Drizzle": "https://orm.drizzle.team", "ClickHouse": "https://clickhouse.com",
    "Meilisearch": "https://www.meilisearch.com", "Algolia": "https://www.algolia.com",
    "Cassandra": "https://cassandra.apache.org", "MariaDB": "https://mariadb.org",
    "InfluxDB": "https://www.influxdata.com", "SurrealDB": "https://surrealdb.com",
    "CouchDB": "https://couchdb.apache.org", "ScyllaDB": "https://www.scylladb.com",
    "Neo4j": "https://neo4j.com", "PocketBase": "https://pocketbase.io",
    "Firebase DB": "https://firebase.google.com", "DuckDB": "https://duckdb.org",
    "TiDB": "https://www.pingcap.com", "EdgeDB": "https://www.edgedb.com",
    "Google Cloud": "https://cloud.google.com", "Azure": "https://azure.microsoft.com",
    "Netlify": "https://www.netlify.com", "Railway": "https://railway.app",
    "Render": "https://render.com", "DigitalOcean": "https://www.digitalocean.com",
    "Supabase": "https://supabase.com", "Kubernetes": "https://kubernetes.io",
    "Fly.io": "https://fly.io", "Neon": "https://neon.tech",
    "Hetzner": "https://www.hetzner.com", "Appwrite": "https://appwrite.io",
    "Coolify": "https://coolify.io", "Terraform": "https://www.terraform.io",
    "Pulumi": "https://www.pulumi.com", "GitHub Actions": "https://github.com/features/actions",
    "GitLab CI": "https://gitlab.com", "Jenkins": "https://www.jenkins.io",
    "Sentry": "https://sentry.io", "LogRocket": "https://logrocket.com",
    "Grafana": "https://grafana.com", "Prometheus": "https://prometheus.io",
    "Cloudflare": "https://www.cloudflare.com", "Kong": "https://konghq.com",
    "Akamai": "https://www.akamai.com", "Nginx": "https://nginx.org",
    "Traefik": "https://traefik.io",
    "Radix UI": "https://www.radix-ui.com", "Zod": "https://zod.dev",
    "Zustand": "https://zustand-demo.pmnd.rs", "Redux Toolkit": "https://redux-toolkit.js.org",
    "Jotai": "https://jotai.org", "TanStack Table": "https://tanstack.com/table",
    "Framer Motion (Lib)": "https://www.framer.com/motion",
    "Panda CSS": "https://panda-css.com", "Emotion/Styled": "https://emotion.sh",
    "I18next": "https://www.i18next.com", "Valibot": "https://valibot.dev",
    "Day.js": "https://day.js.org", "Sharp": "https://sharp.pixelplumbing.com",
    "Axios": "https://axios-http.com", "Lucide React": "https://lucide.dev",
    "Date-fns": "https://date-fns.org", "Lodash": "https://lodash.com",
    "React Hook Form": "https://react-hook-form.com", "Formik": "https://formik.org",
    "Kysely": "https://kysely.dev", "Mongoose": "https://mongoosejs.com",
    "BullMQ": "https://bullmq.io", "Resend": "https://resend.com",
    "Stripe SDK": "https://stripe.com/docs", "Auth.js (NextAuth)": "https://authjs.dev",
    "Clerk": "https://clerk.com", "Winston": "https://github.com/winstonjs/winston",
    "Puppeteer": "https://pptr.dev",
    "Windsurf": "https://codeium.com/windsurf", "Copilot": "https://github.com/features/copilot",
    "ChatGPT": "https://chat.openai.com", "Claude (Anthropic)": "https://claude.ai",
    "MCP (Model Context Protocol)": "https://modelcontextprotocol.io",
    "Prettier": "https://prettier.io", "ESLint": "https://eslint.org",
    "Biome": "https://biomejs.dev", "Turborepo": "https://turbo.build",
    "Nx": "https://nx.dev", "Bun Shell": "https://bun.sh",
    "Git": "https://git-scm.com", "Neovim": "https://neovim.io",
    "Oh My Zsh": "https://ohmyz.sh", "Docker Desktop": "https://www.docker.com/products/docker-desktop",
    "OrbStack": "https://orbstack.dev", "TablePlus": "https://tableplus.com",
    "Postman": "https://www.postman.com", "Insomnia": "https://insomnia.rest",
    "Warp": "https://www.warp.dev", "Raycast": "https://www.raycast.com",
    "Figma": "https://www.figma.com", "Excalidraw": "https://excalidraw.com",
    "Linear": "https://linear.app", "Trello": "https://trello.com",
    "Obsidian": "https://obsidian.md", "V0.dev": "https://v0.dev",
    "Replit": "https://replit.com",
    "Phoenix LiveView": "https://www.phoenixframework.org",
    "Blade/Edge": "https://laravel.com/docs/blade",
    // AI & LLMs
    "Skynet Chat": "https://skynetchat.net/", "DeepHat": "https://app.deephat.ai/",
    "Perplexity": "https://www.perplexity.ai/", "HuggingChat": "https://huggingface.co/chat",
    "Poe": "https://poe.com/", "Groq": "https://groq.com/",
    "Ollama": "https://ollama.com/", "LM Studio": "https://lmstudio.ai/",
    "Mistral Le Chat": "https://chat.mistral.ai/", "DeepSeek": "https://chat.deepseek.com/",
    "Together AI": "https://www.together.ai/", "Phind": "https://www.phind.com/",
    "You.com": "https://you.com/", "Jan": "https://jan.ai/",
    "Grok (xAI)": "https://grok.x.ai/",
    // Design & Inspiração
    "Pexels": "https://www.pexels.com/", "Pinterest": "https://www.pinterest.com/",
    "Land-book": "https://land-book.com/", "Aura": "https://www.aura.build/",
    "Dribbble": "https://dribbble.com/", "Awwwards": "https://www.awwwards.com/",
    "Unsplash": "https://unsplash.com/", "Mobbin": "https://mobbin.com/",
    "Coolors": "https://coolors.co/", "Muzli": "https://muz.li/",
    "Canva": "https://www.canva.com/", "Lottiefiles": "https://lottiefiles.com/",
    "CSS Design Awards": "https://www.cssdesignawards.com/",
    "Godly": "https://godly.website/", "SiteInspire": "https://www.siteinspire.com/",
    // MCP Servers
    "Filesystem MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    "GitHub MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    "Puppeteer MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    "Brave Search MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    "Slack MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    "Sequential Thinking MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    "Memory MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    "Supabase MCP": "https://github.com/supabase-community/supabase-mcp",
    "Cloudflare MCP": "https://github.com/cloudflare/mcp-server-cloudflare",
    "PostgreSQL MCP": "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    "Exa MCP": "https://github.com/exa-labs/exa-mcp-server",
    "Sentry MCP": "https://github.com/getsentry/sentry-mcp",
    // DevEx additions
    "OpenCode": "https://opencode.ai/", "BrowserAct": "https://www.browseract.com/",
};

const frontends = ["Nuxt.js", "Svelte", "SvelteKit", "Angular", "SolidJS", "Remix", "React Native", "TanStack Query", "Three.js", "Framer Motion", "Storybook", "Qwik", "RedwoodJS", "Stencil", "HTMX", "Flutter Web", "Alpine.js", "Preact", "Lit", "Gatsby", "Phoenix LiveView", "Expo", "Blade/Edge", "Capacitor", "Playwright", "Vite"];
const backends = ["Deno", "Rust", "Python", "Fastify", "NestJS", "FastAPI", "Elixir", "Phoenix", "Bunchi", "Koa", "Strapi", "Payload CMS", "Ruby on Rails", "Laravel", "Spring Boot", ".NET", "ElysiaJS", "Hono", "Fiber", "Actix", "Axum", "Gin", "Django", "Cloudflare Workers", "Express.js", "Directus", "tRPC"];
const datasets = ["MySQL", "SQLite", "Turso", "Pinecone", "Milvus", "Upstash", "PlanetScale", "Convex", "DynamoDB", "Supabase DB", "Drizzle", "ClickHouse", "Meilisearch", "Algolia", "Cassandra", "MariaDB", "InfluxDB", "SurrealDB", "CouchDB", "ScyllaDB", "Neo4j", "PocketBase", "Firebase DB", "DuckDB", "TiDB", "EdgeDB"];
const infras = ["Google Cloud", "Azure", "Netlify", "Railway", "Render", "DigitalOcean", "Supabase", "Kubernetes", "Fly.io", "Neon", "Hetzner", "Appwrite", "Coolify", "Terraform", "Pulumi", "GitHub Actions", "GitLab CI", "Jenkins", "Sentry", "LogRocket", "Grafana", "Prometheus", "Cloudflare", "Kong", "Akamai", "Nginx", "Traefik"];
const libris = ["Radix UI", "Zod", "Zustand", "Redux Toolkit", "Jotai", "TanStack Table", "Framer Motion (Lib)", "Panda CSS", "Emotion/Styled", "I18next", "Valibot", "Day.js", "Sharp", "Axios", "Lucide React", "Date-fns", "Lodash", "React Hook Form", "Formik", "Kysely", "Mongoose", "BullMQ", "Resend", "Stripe SDK", "Auth.js (NextAuth)", "Clerk", "Winston", "Puppeteer"];
const devexs = ["Windsurf", "Copilot", "ChatGPT", "Claude (Anthropic)", "MCP (Model Context Protocol)", "Prettier", "ESLint", "Biome", "Turborepo", "Nx", "Bun Shell", "Git", "Neovim", "Oh My Zsh", "Docker Desktop", "OrbStack", "TablePlus", "Postman", "Insomnia", "Warp", "Raycast", "Figma", "Excalidraw", "Linear", "Trello", "Obsidian", "V0.dev", "Replit", "OpenCode", "BrowserAct"];
const ais = ["Skynet Chat", "DeepHat", "Perplexity", "HuggingChat", "Poe", "Groq", "Ollama", "LM Studio", "Mistral Le Chat", "DeepSeek", "Together AI", "Phind", "You.com", "Jan", "Grok (xAI)"];
const designs = ["Pexels", "Pinterest", "Land-book", "Aura", "Dribbble", "Awwwards", "Unsplash", "Mobbin", "Coolors", "Muzli", "Canva", "Lottiefiles", "CSS Design Awards", "Godly", "SiteInspire"];
const mcps = ["Filesystem MCP", "GitHub MCP", "Puppeteer MCP", "Brave Search MCP", "Slack MCP", "Sequential Thinking MCP", "Memory MCP", "Supabase MCP", "Cloudflare MCP", "PostgreSQL MCP", "Exa MCP", "Sentry MCP"];

frontends.forEach(f => { technologies.push({ name: f, category: "frontend", tagline: "Frontend Native", description: "Ferramenta moderna voltada para estabilidade ou desempenho do client.", language: "JavaScript/Multi", pros: ["Estabilidade de mercado.", "Funcionalidades robustas da comunidade."], cons: ["Demandam curadoria específica e leitura da doc.", "Risco de obsolescência rápida."], useCases: "Componentização e manipulação do cliente/navegador.", typeIcon: "web", role: "Reliable", logo: logoMap[f] || si("javascript"), website: websiteMap[f] || "#" }); });
backends.forEach(f => { technologies.push({ name: f, category: "backend", tagline: "Backend Logic", description: "Infraestrutura escalável para gestão de permissão, regras customizadas ou microserviços densos em nuvem nativa.", language: "Agnostic", pros: ["Boa perfomance a longo prazo.", "Ótima adoção empresarial (enterprise-grade)."], cons: ["Escalada íngreme para dominar do zero.", "Configuração manual às vezes incômoda."], useCases: "Regras de negócio isoladas ou arquiteturas de alto rendimento.", typeIcon: "dns", role: "Scalable", logo: logoMap[f] || si("nodedotjs"), website: websiteMap[f] || "#" }); });
datasets.forEach(f => { technologies.push({ name: f, category: "data", tagline: "Data Engine", description: "Software complexo lidando com armazenamento assíncrono, síncrono ou rotinas diárias gigantes em data centers.", language: "Data Structure", pros: ["Desempenho aprovado no mercado mundial.", "Ferramental gigante disponível."], cons: ["Migração de esquema requer maturidade extração e tempo de deploy.", "Manutenção das instâncias exige infra."], useCases: "Conserva e centraliza todo o motor lógico contigencial da empresa.", typeIcon: "schema", role: "Essential", logo: logoMap[f] || si("postgresql"), website: websiteMap[f] || "#" }); });
infras.forEach(f => { technologies.push({ name: f, category: "infra", tagline: "Cloud Infra", description: "Fornecimento de infraestrutura ágil focada em entrega (CI/CD) com menor estresse ou total flexibilidade de servidor.", language: "DevOps", pros: ["Remove abstrações e fricção com OSs crus ou setups falhos.", "Acelera deploys com workflows robustos integrados do dia um."], cons: ["Requer um aprendente pragmático ou custos ocultos para scale up.", "Vendor lock-in para IaaS/PaaS modernos fechados."], useCases: "Manter seu ecosistema acessível à internet 24h sem apagão surpresa.", typeIcon: "cloud", role: "Network Backbone", logo: logoMap[f] || si("amazonaws"), website: websiteMap[f] || "#" }); });
libris.forEach(f => { technologies.push({ name: f, category: "libs", tagline: "Component Utility", description: "Utilitário minucioso engenhado especificamente para eliminar redundância de códigos base no seu build source natural do frontend ou backend moderno.", language: "NPM Package", pros: ["Velocidade máxima por abster centenas de linhas difíceis em um call API claro.", "Totalmente validadas, testadas em stress publicamente open-source."], cons: ["Empilhamento excessivo acaba com as métricas Web Vitals.", "Dependência frágil em atualizações."], useCases: "Reduzir o boilerplate severo ou manipulações maçantes (datas, tokens).", typeIcon: "extension", role: "Productivity Boost", logo: logoMap[f] || si("npm"), website: websiteMap[f] || "#" }); });
devexs.forEach(f => { technologies.push({ name: f, category: "devex", tagline: "DevEx Workflow", description: "Auxiliar absoluto na formatação do dia a dia garantindo qualidade de layout ou escrita limpa antes mesmo do build para não estourar a IDE em bugs caóticos.", language: "Terminal/App", pros: ["Extenso arsenal de automação focada.", "Qualidade nativa sem re-esforço repetitivo em todos commits de branch global."], cons: ["Múltiplos terminais pesam a carga mental e tempo de setup para devs juniores.", "Demandam familiaridade com command line prompt ou shells robustas."], useCases: "Produtividade de 10x focados em automação local/remota ou IAs genarativas.", typeIcon: "smart_toy", role: "Quality Ensurance", logo: logoMap[f] || si("windowsterminal"), website: websiteMap[f] || "#" }); });

const uncensoredAIs = ["Skynet Chat", "DeepHat"];
ais.forEach(f => { technologies.push({ name: f, category: "ai", tagline: "AI Platform", description: "Plataforma de inteligência artificial generativa para chat, geração de código, análise de texto e assistência criativa com modelos de última geração.", language: "Multi-Model", pros: ["Modelos de IA acessíveis via interface web.", "Múltiplas capacidades: texto, código, análise."], cons: ["Limites de uso em planos gratuitos.", "Qualidade de resposta varia entre modelos."], useCases: "Assistência em desenvolvimento, brainstorming, geração de conteúdo e análise.", typeIcon: "psychology", role: "AI Assistant", logo: logoMap[f] || si("openai"), website: websiteMap[f] || "#", ...(uncensoredAIs.includes(f) ? { tags: ["IA sem Censura"] } : {}) }); });
designs.forEach(f => { technologies.push({ name: f, category: "design", tagline: "Design Resource", description: "Recurso essencial para designers e desenvolvedores frontend — inspiração visual, assets, paletas de cores e referências de UI/UX de altíssima qualidade.", language: "Visual", pros: ["Acervo gigante de referências visuais curadas.", "Inspiração para projetos de UI/UX e branding."], cons: ["Pode consumir tempo excessivo navegando referências.", "Conteúdo premium pode exigir assinatura."], useCases: "Buscar inspiração, referências visuais, paletas de cores e assets para projetos.", typeIcon: "palette", role: "Creative Source", logo: logoMap[f] || si("figma"), website: websiteMap[f] || "#" }); });
mcps.forEach(f => { technologies.push({ name: f, category: "mcp", tagline: "MCP Server", description: "Servidor MCP (Model Context Protocol) que expande as capacidades de agentes de IA — conecte ferramentas, APIs e serviços diretamente ao seu assistente.", language: "MCP Protocol", pros: ["Integração direta com agentes de IA (Claude, Cursor, etc).", "Protocolo aberto e padronizado."], cons: ["Requer configuração inicial e ambiente Node.js/Python.", "Ainda em fase de adoção — documentação pode ser escassa."], useCases: "Expandir capacidades de agentes de IA com ferramentas e serviços externos.", typeIcon: "hub", role: "AI Extension", logo: logoMap[f] || si("anthropic"), website: websiteMap[f] || "#" }); });

