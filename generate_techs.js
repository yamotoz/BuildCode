const fs = require('fs');

const frontend = ["React", "Next.js", "Vue.js", "Nuxt.js", "Svelte", "SvelteKit", "Astro", "Angular", "SolidJS", "Remix", "React Native", "TanStack Query", "Three.js", "Framer Motion", "Storybook", "Qwik", "RedwoodJS", "Stencil", "HTMX", "Flutter Web", "Alpine.js", "Preact", "Lit", "Gatsby", "Phoenix LiveView", "Expo", "Blade/Edge", "Capacitor", "Playwright", "Vite"];
const backend = ["Node.js", "Bun", "Deno", "Go (Golang)", "Rust", "Python", "Fastify", "NestJS", "FastAPI", "Elixir", "Phoenix", "Bunchi", "Koa", "Strapi", "Payload CMS", "Ruby on Rails", "Laravel", "Spring Boot", ".NET", "ElysiaJS", "Hono", "Fiber", "Actix", "Axum", "Gin", "Django", "Cloudflare Workers", "Express.js", "Directus", "tRPC"];
const data = ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite", "Turso", "Pinecone", "Milvus", "Upstash", "PlanetScale", "Convex", "DynamoDB", "Supabase DB", "Prisma", "Drizzle", "ClickHouse", "Meilisearch", "Algolia", "Cassandra", "MariaDB", "InfluxDB", "SurrealDB", "CouchDB", "ScyllaDB", "Neo4j", "PocketBase", "Firebase DB", "DuckDB", "TiDB", "EdgeDB"];
const infra = ["AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Railway", "Render", "DigitalOcean", "Supabase", "Docker", "Kubernetes", "Fly.io", "Neon", "Hetzner", "Appwrite", "Coolify", "Terraform", "Pulumi", "GitHub Actions", "GitLab CI", "Jenkins", "Sentry", "LogRocket", "Grafana", "Prometheus", "Cloudflare", "Kong", "Akamai", "Nginx", "Traefik"];
const libs = ["Tailwind CSS", "Radix UI", "Shadcn/ui", "Zod", "Zustand", "Redux Toolkit", "Jotai", "TanStack Table", "Framer Motion (Lib)", "Panda CSS", "Emotion/Styled", "I18next", "Valibot", "Day.js", "Sharp", "Axios", "Lucide React", "Date-fns", "Lodash", "React Hook Form", "Formik", "Kysely", "Mongoose", "BullMQ", "Resend", "Stripe SDK", "Auth.js (NextAuth)", "Clerk", "Winston", "Puppeteer"];
const devex = ["VS Code", "Cursor", "Windsurf", "Copilot", "ChatGPT", "Claude (Anthropic)", "MCP (Model Context Protocol)", "Prettier", "ESLint", "Biome", "Turborepo", "Nx", "Bun Shell", "Git", "Neovim", "Oh My Zsh", "Docker Desktop", "OrbStack", "TablePlus", "Postman", "Insomnia", "Warp", "Raycast", "Figma", "Excalidraw", "Linear", "Trello", "Obsidian", "V0.dev", "Replit"];

function generateData() {
    const result = [];

    const categories = [
        { id: "frontend", items: frontend, icon: 'web', descMap: 'Framework ou biblioteca UI para construir interfaces modernas.' },
        { id: "backend", items: backend, icon: 'dns', descMap: 'Motor lógico, runtime ou framework para regras de negócio no servidor.' },
        { id: "data", items: data, icon: 'database', descMap: 'Solução robusta para armazenamento, fluxo e persistência de dados.' },
        { id: "infra", items: infra, icon: 'cloud', descMap: 'Infraestrutura foca em hospedagem, CI/CD, deploy ou containerização.' },
        { id: "libs", items: libs, icon: 'extension', descMap: 'Pacote utilitário focado em resolver problemas estritos de desenvolvimento.' },
        { id: "devex", items: devex, icon: 'smart_toy', descMap: 'Ferramenta avançada para potencializar o workflow e a experiência de dev.' },
    ];

    /* Detailed Overrides for the most crucial generic entries */
    const overrides = {
        "React": { tag: "Declarative UI", desc: "Construção de interfaces através de componentes reativos.", pros: ["Ecossistema massivo e imbatível.", "Reaproveitamento de código em web e mobile.", "Vasta comunidade."], cons: ["Curva de aprendizado inicial abrupta.", "Overhead de re-renderizações complexas."], lang: "JavaScript", role: "Ecosystem Leader" },
        "Next.js": { tag: "Fullstack React", desc: "O framework React para produção, suportando SSR, SSG e rotas API.", pros: ["SEO impecável com Server Components.", "Integração nativa com Vercel.", "Roteamento baseado no file-system."], cons: ["Forte vendor lock-in e complexidade extra com App Router.", "Tamanho do bundle pode crescer rapidamente."], lang: "TypeScript", role: "Industry Standard" },
        "Tailwind CSS": { tag: "Utility-First", desc: "Framework CSS pragmático baseado em design de utilitários rápidos.", pros: ["Construção ultra-rápida de protótipos.", "Menos arquivos CSS separados.", "Altamente customizável."], cons: ["HTML fica poluído com dezenas de classes.", "Curva inicial para lembrar das classes abreviadas."], lang: "CSS", role: "Styling Meta" },
        "PostgreSQL": { tag: "Relational DB", desc: "O banco de dados relacional open source mais avançado do mundo.", pros: ["Estabilidade indiscutível.", "Extensibilidade (PostGIS, vector).", "Conformidade ACID severa."], cons: ["Pode consumir mais RAM verticalmente.", "Setup inicial de alta performance é técnico."], lang: "SQL", role: "Rock Solid" },
        "AWS": { tag: "Cloud Provider", desc: "O principal ecossistema na nuvem, oferecendo serviços completos e robustos.", pros: ["Quase todas as soluções do planeta suportam AWS.", "Catálogo e ecossistema monumental."], cons: ["A interface e a documentação são intimidadores.", "Precificação surpresa e complexa."], lang: "Cloud", role: "Enterprise Grade" },
        "FastAPI": { tag: "High Performance", desc: "Framework web ultra-veloz para APIs modernas em Python.", pros: ["Validação nativa ultra-rápida com Pydantic.", "Swagger UI nativo.", "Velocidade comparável a NodeJS."], cons: ["Depende muito de bibliotecas assíncronas do ecosistema.", "Pydantic V2 mudou padrões recentemente."], lang: "Python", role: "Architect's Choice" }
    };

    categories.forEach(cat => {
        cat.items.forEach(itemName => {
            let data = {
                name: itemName,
                category: cat.id,
                tagline: "Standard Tooling",
                description: cat.descMap,
                language: "Multi/Agnostic",
                pros: ["Desempenho aprovado no mercado.", "Documentação acessível."],
                cons: ["Pode conter complexidade acidental para projetos simples.", "Demanda proficiência técnica."],
                useCases: "Desenvolvimento rápido, prototipação escalar e ambientes modernos.",
                typeIcon: cat.icon,
                role: "Standard Tool"
            };

            if (overrides[itemName]) {
                data = { ...data, ...overrides[itemName] };
                data.tagline = overrides[itemName].tag;
                data.description = overrides[itemName].desc;
                data.pros = overrides[itemName].pros;
                data.cons = overrides[itemName].cons;
                data.language = overrides[itemName].lang;
                data.role = overrides[itemName].role;
            }

            result.push(data);
        });
    });

    const fileContent = `export const technologies = ${JSON.stringify(result, null, 2)};`;
    fs.writeFileSync('src/data/technologies.ts', fileContent);
    console.log("technologies.ts gravado.");
}

generateData();
