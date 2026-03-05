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
    "Stripe SDK": si("stripe"), "Auth.js (NextAuth)": si("authjs"),
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
};

const frontends = ["Nuxt.js", "Svelte", "SvelteKit", "Angular", "SolidJS", "Remix", "React Native", "TanStack Query", "Three.js", "Framer Motion", "Storybook", "Qwik", "RedwoodJS", "Stencil", "HTMX", "Flutter Web", "Alpine.js", "Preact", "Lit", "Gatsby", "Phoenix LiveView", "Expo", "Blade/Edge", "Capacitor", "Playwright", "Vite"];
const backends = ["Deno", "Rust", "Python", "Fastify", "NestJS", "FastAPI", "Elixir", "Phoenix", "Bunchi", "Koa", "Strapi", "Payload CMS", "Ruby on Rails", "Laravel", "Spring Boot", ".NET", "ElysiaJS", "Hono", "Fiber", "Actix", "Axum", "Gin", "Django", "Cloudflare Workers", "Express.js", "Directus", "tRPC"];
const datasets = ["MySQL", "SQLite", "Turso", "Pinecone", "Milvus", "Upstash", "PlanetScale", "Convex", "DynamoDB", "Supabase DB", "Drizzle", "ClickHouse", "Meilisearch", "Algolia", "Cassandra", "MariaDB", "InfluxDB", "SurrealDB", "CouchDB", "ScyllaDB", "Neo4j", "PocketBase", "Firebase DB", "DuckDB", "TiDB", "EdgeDB"];
const infras = ["Google Cloud", "Azure", "Netlify", "Railway", "Render", "DigitalOcean", "Supabase", "Kubernetes", "Fly.io", "Neon", "Hetzner", "Appwrite", "Coolify", "Terraform", "Pulumi", "GitHub Actions", "GitLab CI", "Jenkins", "Sentry", "LogRocket", "Grafana", "Prometheus", "Cloudflare", "Kong", "Akamai", "Nginx", "Traefik"];
const libris = ["Radix UI", "Zod", "Zustand", "Redux Toolkit", "Jotai", "TanStack Table", "Framer Motion (Lib)", "Panda CSS", "Emotion/Styled", "I18next", "Valibot", "Day.js", "Sharp", "Axios", "Lucide React", "Date-fns", "Lodash", "React Hook Form", "Formik", "Kysely", "Mongoose", "BullMQ", "Resend", "Stripe SDK", "Auth.js (NextAuth)", "Clerk", "Winston", "Puppeteer"];
const devexs = ["Windsurf", "Copilot", "ChatGPT", "Claude (Anthropic)", "MCP (Model Context Protocol)", "Prettier", "ESLint", "Biome", "Turborepo", "Nx", "Bun Shell", "Git", "Neovim", "Oh My Zsh", "Docker Desktop", "OrbStack", "TablePlus", "Postman", "Insomnia", "Warp", "Raycast", "Figma", "Excalidraw", "Linear", "Trello", "Obsidian", "V0.dev", "Replit"];

frontends.forEach(f => { technologies.push({ name: f, category: "frontend", tagline: "Frontend Native", description: "Ferramenta moderna voltada para estabilidade ou desempenho do client.", language: "JavaScript/Multi", pros: ["Estabilidade de mercado.", "Funcionalidades robustas da comunidade."], cons: ["Demandam curadoria específica e leitura da doc.", "Risco de obsolescência rápida."], useCases: "Componentização e manipulação do cliente/navegador.", typeIcon: "web", role: "Reliable", logo: logoMap[f] || si("javascript"), website: websiteMap[f] || "#" }); });
backends.forEach(f => { technologies.push({ name: f, category: "backend", tagline: "Backend Logic", description: "Infraestrutura escalável para gestão de permissão, regras customizadas ou microserviços densos em nuvem nativa.", language: "Agnostic", pros: ["Boa perfomance a longo prazo.", "Ótima adoção empresarial (enterprise-grade)."], cons: ["Escalada íngreme para dominar do zero.", "Configuração manual às vezes incômoda."], useCases: "Regras de negócio isoladas ou arquiteturas de alto rendimento.", typeIcon: "dns", role: "Scalable", logo: logoMap[f] || si("nodedotjs"), website: websiteMap[f] || "#" }); });
datasets.forEach(f => { technologies.push({ name: f, category: "data", tagline: "Data Engine", description: "Software complexo lidando com armazenamento assíncrono, síncrono ou rotinas diárias gigantes em data centers.", language: "Data Structure", pros: ["Desempenho aprovado no mercado mundial.", "Ferramental gigante disponível."], cons: ["Migração de esquema requer maturidade extração e tempo de deploy.", "Manutenção das instâncias exige infra."], useCases: "Conserva e centraliza todo o motor lógico contigencial da empresa.", typeIcon: "schema", role: "Essential", logo: logoMap[f] || si("postgresql"), website: websiteMap[f] || "#" }); });
infras.forEach(f => { technologies.push({ name: f, category: "infra", tagline: "Cloud Infra", description: "Fornecimento de infraestrutura ágil focada em entrega (CI/CD) com menor estresse ou total flexibilidade de servidor.", language: "DevOps", pros: ["Remove abstrações e fricção com OSs crus ou setups falhos.", "Acelera deploys com workflows robustos integrados do dia um."], cons: ["Requer um aprendente pragmático ou custos ocultos para scale up.", "Vendor lock-in para IaaS/PaaS modernos fechados."], useCases: "Manter seu ecosistema acessível à internet 24h sem apagão surpresa.", typeIcon: "cloud", role: "Network Backbone", logo: logoMap[f] || si("amazonaws"), website: websiteMap[f] || "#" }); });
libris.forEach(f => { technologies.push({ name: f, category: "libs", tagline: "Component Utility", description: "Utilitário minucioso engenhado especificamente para eliminar redundância de códigos base no seu build source natural do frontend ou backend moderno.", language: "NPM Package", pros: ["Velocidade máxima por abster centenas de linhas difíceis em um call API claro.", "Totalmente validadas, testadas em stress publicamente open-source."], cons: ["Empilhamento excessivo acaba com as métricas Web Vitals.", "Dependência frágil em atualizações."], useCases: "Reduzir o boilerplate severo ou manipulações maçantes (datas, tokens).", typeIcon: "extension", role: "Productivity Boost", logo: logoMap[f] || si("npm"), website: websiteMap[f] || "#" }); });
devexs.forEach(f => { technologies.push({ name: f, category: "devex", tagline: "DevEx Workflow", description: "Auxiliar absoluto na formatação do dia a dia garantindo qualidade de layout ou escrita limpa antes mesmo do build para não estourar a IDE em bugs caóticos.", language: "Terminal/App", pros: ["Extenso arsenal de automação focada.", "Qualidade nativa sem re-esforço repetitivo em todos commits de branch global."], cons: ["Múltiplos terminais pesam a carga mental e tempo de setup para devs juniores.", "Demandam familiaridade com command line prompt ou shells robustas."], useCases: "Produtividade de 10x focados em automação local/remota ou IAs genarativas.", typeIcon: "smart_toy", role: "Quality Ensurance", logo: logoMap[f] || si("windowsterminal"), website: websiteMap[f] || "#" }); });

