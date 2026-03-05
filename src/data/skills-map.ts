/**
 * BuildCode — Skills.sh URL Mapping
 * Maps chosen technologies to relevant skills/references for prompt enrichment.
 * These URLs are fetched and embedded into the Prompt Base output.
 */
export interface SkillRef {
    name: string;
    url: string;
    desc: string;
}

export const skillsMap: Record<string, SkillRef[]> = {
    // ---------- Frontend ----------
    "React": [
        { name: "React Best Practices", url: "https://skills.sh/react", desc: "Hooks, Suspense, Server Components patterns" },
        { name: "React Performance", url: "https://skills.sh/react-performance", desc: "Memoization, lazy loading, profiling" },
    ],
    "Next.js": [
        { name: "Next.js App Router", url: "https://skills.sh/nextjs", desc: "Server Components, Streaming SSR, Route Handlers" },
    ],
    "Vue.js": [
        { name: "Vue 3 Composition API", url: "https://skills.sh/vue", desc: "Composables, Reactivity, Pinia state" },
    ],
    "Astro": [
        { name: "Astro Islands", url: "https://skills.sh/astro", desc: "Partial hydration, content collections, SSG" },
    ],
    "Svelte": [
        { name: "Svelte & SvelteKit", url: "https://skills.sh/svelte", desc: "Runes, server functions, form actions" },
    ],
    "Angular": [
        { name: "Angular Signals", url: "https://skills.sh/angular", desc: "Signals, standalone components, SSR" },
    ],

    // ---------- Backend ----------
    "Node.js": [
        { name: "Node.js Patterns", url: "https://skills.sh/nodejs", desc: "Event loop, streams, clustering" },
    ],
    "Express.js": [
        { name: "Express Middleware", url: "https://skills.sh/express", desc: "Middleware chains, error handling, security" },
    ],
    "NestJS": [
        { name: "NestJS Architecture", url: "https://skills.sh/nestjs", desc: "Modules, DI, Guards, Interceptors" },
    ],
    "Fastify": [
        { name: "Fastify Performance", url: "https://skills.sh/fastify", desc: "Schema validation, hooks, plugins" },
    ],
    "FastAPI": [
        { name: "FastAPI Async", url: "https://skills.sh/fastapi", desc: "Async endpoints, Pydantic, dependency injection" },
    ],
    "Go": [
        { name: "Go Concurrency", url: "https://skills.sh/golang", desc: "Goroutines, channels, context patterns" },
    ],
    "Rust": [
        { name: "Rust Web", url: "https://skills.sh/rust-web", desc: "Actix/Axum, ownership in web context" },
    ],
    "Supabase": [
        { name: "Supabase Full Stack", url: "https://skills.sh/supabase", desc: "Auth, RLS, Edge Functions, Realtime" },
    ],
    "Firebase": [
        { name: "Firebase Stack", url: "https://skills.sh/firebase", desc: "Firestore, Functions, Auth, Hosting" },
    ],
    "Django": [
        { name: "Django Patterns", url: "https://skills.sh/django", desc: "ORM, views, middleware, REST framework" },
    ],
    "Laravel": [
        { name: "Laravel Ecosystem", url: "https://skills.sh/laravel", desc: "Eloquent, Blade, queues, Sanctum" },
    ],
    "Spring Boot": [
        { name: "Spring Boot Enterprise", url: "https://skills.sh/spring-boot", desc: "DI, JPA, Security, microservices" },
    ],

    // ---------- Data ----------
    "PostgreSQL": [
        { name: "PostgreSQL Advanced", url: "https://skills.sh/postgresql", desc: "Indexing, JSONB, RLS, partitioning" },
    ],
    "MongoDB": [
        { name: "MongoDB Patterns", url: "https://skills.sh/mongodb", desc: "Aggregation, indexes, schema design" },
    ],
    "Redis": [
        { name: "Redis Caching", url: "https://skills.sh/redis", desc: "Caching strategies, pub/sub, streams" },
    ],
    "Prisma": [
        { name: "Prisma ORM", url: "https://skills.sh/prisma", desc: "Schema, migrations, relations, transactions" },
    ],
    "Drizzle": [
        { name: "Drizzle ORM", url: "https://skills.sh/drizzle", desc: "Type-safe queries, migrations, edge support" },
    ],

    // ---------- Infra ----------
    "Docker": [
        { name: "Docker Best Practices", url: "https://skills.sh/docker", desc: "Multi-stage builds, compose, security" },
    ],
    "Kubernetes": [
        { name: "K8s Patterns", url: "https://skills.sh/kubernetes", desc: "Pods, services, ingress, helm charts" },
    ],
    "AWS": [
        { name: "AWS Serverless", url: "https://skills.sh/aws", desc: "Lambda, API Gateway, DynamoDB, S3" },
    ],
    "Vercel": [
        { name: "Vercel Deploy", url: "https://skills.sh/vercel", desc: "Edge functions, ISR, analytics" },
    ],
    "Terraform": [
        { name: "Terraform IaC", url: "https://skills.sh/terraform", desc: "Modules, state, providers, workspaces" },
    ],

    // ---------- Libs ----------
    "Tailwind CSS": [
        { name: "Tailwind Advanced", url: "https://skills.sh/tailwind", desc: "Custom themes, plugins, dark mode" },
    ],
    "Zod": [
        { name: "Zod Validation", url: "https://skills.sh/zod", desc: "Schema validation, transform, refinements" },
    ],
    "Stripe": [
        { name: "Stripe Integration", url: "https://skills.sh/stripe", desc: "Checkout, webhooks, subscriptions, billing" },
    ],

    // ---------- Testing ----------
    "Vitest": [
        { name: "Vitest Unit Tests", url: "https://skills.sh/vitest", desc: "Fast unit testing for Vite projects" },
    ],
    "Playwright": [
        { name: "Playwright E2E", url: "https://skills.sh/playwright", desc: "Cross-browser E2E testing, codegen" },
    ],
};

/**
 * Given selected tech names, returns all matching skills
 */
export function getSkillsForStack(selections: string[]): SkillRef[] {
    const skills: SkillRef[] = [];
    for (const tech of selections) {
        if (skillsMap[tech]) {
            skills.push(...skillsMap[tech]);
        }
    }
    return skills;
}
