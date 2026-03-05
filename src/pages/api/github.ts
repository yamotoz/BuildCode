import type { APIRoute } from 'astro';

export const prerender = false;

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

const REPO_MAP: Record<string, string> = {
  // Frameworks Frontend
  'react': 'facebook/react',
  'next.js': 'vercel/next.js',
  'nextjs': 'vercel/next.js',
  'vue': 'vuejs/core',
  'vue.js': 'vuejs/core',
  'nuxt': 'nuxt/nuxt',
  'nuxt.js': 'nuxt/nuxt',
  'angular': 'angular/angular',
  'svelte': 'sveltejs/svelte',
  'sveltekit': 'sveltejs/kit',
  'astro': 'withastro/astro',
  'solid': 'solidjs/solid',
  'solidjs': 'solidjs/solid',
  'remix': 'remix-run/remix',
  'gatsby': 'gatsbyjs/gatsby',
  'preact': 'preactjs/preact',
  'qwik': 'QwikDev/qwik',
  'lit': 'lit/lit',
  'htmx': 'bigskysoftware/htmx',
  'alpine.js': 'alpinejs/alpine',
  'alpinejs': 'alpinejs/alpine',
  'ember': 'emberjs/ember.js',
  'ember.js': 'emberjs/ember.js',

  // Backend / Runtime
  'node': 'nodejs/node',
  'node.js': 'nodejs/node',
  'nodejs': 'nodejs/node',
  'deno': 'denoland/deno',
  'bun': 'oven-sh/bun',
  'express': 'expressjs/express',
  'fastify': 'fastify/fastify',
  'nestjs': 'nestjs/nest',
  'nest': 'nestjs/nest',
  'django': 'django/django',
  'flask': 'pallets/flask',
  'fastapi': 'fastapi/fastapi',
  'spring boot': 'spring-projects/spring-boot',
  'spring': 'spring-projects/spring-boot',
  'rails': 'rails/rails',
  'ruby on rails': 'rails/rails',
  'laravel': 'laravel/laravel',
  'phoenix': 'phoenixframework/phoenix',
  'gin': 'gin-gonic/gin',
  'fiber': 'gofiber/fiber',
  'actix': 'actix/actix-web',
  'rocket': 'rwf2/Rocket',
  'hono': 'honojs/hono',
  'elysia': 'elysiajs/elysia',
  'koa': 'koajs/koa',
  'adonis': 'adonisjs/core',
  'adonisjs': 'adonisjs/core',

  // Mobile
  'react native': 'facebook/react-native',
  'flutter': 'flutter/flutter',
  'expo': 'expo/expo',
  'ionic': 'ionic-team/ionic-framework',
  'capacitor': 'ionic-team/capacitor',
  'tauri': 'tauri-apps/tauri',
  'electron': 'electron/electron',

  // Databases
  'postgresql': 'postgres/postgres',
  'postgres': 'postgres/postgres',
  'mysql': 'mysql/mysql-server',
  'mongodb': 'mongodb/mongo',
  'redis': 'redis/redis',
  'sqlite': 'sqlite/sqlite',
  'supabase': 'supabase/supabase',
  'firebase': 'firebase/firebase-js-sdk',
  'prisma': 'prisma/prisma',
  'drizzle': 'drizzle-team/drizzle-orm',
  'typeorm': 'typeorm/typeorm',
  'sequelize': 'sequelize/sequelize',
  'mongoose': 'Automattic/mongoose',

  // DevOps / Infra
  'docker': 'moby/moby',
  'kubernetes': 'kubernetes/kubernetes',
  'k8s': 'kubernetes/kubernetes',
  'terraform': 'hashicorp/terraform',
  'ansible': 'ansible/ansible',
  'nginx': 'nginx/nginx',
  'grafana': 'grafana/grafana',
  'prometheus': 'prometheus/prometheus',

  // CSS / UI
  'tailwindcss': 'tailwindlabs/tailwindcss',
  'tailwind': 'tailwindlabs/tailwindcss',
  'bootstrap': 'twbs/bootstrap',
  'chakra ui': 'chakra-ui/chakra-ui',
  'material ui': 'mui/material-ui',
  'mui': 'mui/material-ui',
  'shadcn': 'shadcn-ui/ui',
  'radix': 'radix-ui/primitives',

  // Tools / Bundlers
  'vite': 'vitejs/vite',
  'webpack': 'webpack/webpack',
  'turbopack': 'vercel/turborepo',
  'turborepo': 'vercel/turborepo',
  'esbuild': 'evanw/esbuild',
  'rollup': 'rollup/rollup',
  'swc': 'swc-project/swc',
  'biome': 'biomejs/biome',
  'eslint': 'eslint/eslint',
  'prettier': 'prettier/prettier',

  // Testing
  'jest': 'jestjs/jest',
  'vitest': 'vitest-dev/vitest',
  'playwright': 'microsoft/playwright',
  'cypress': 'cypress-io/cypress',
  'storybook': 'storybookjs/storybook',

  // State / Data
  'redux': 'reduxjs/redux',
  'zustand': 'pmndrs/zustand',
  'tanstack query': 'TanStack/query',
  'react query': 'TanStack/query',
  'trpc': 'trpc/trpc',
  'graphql': 'graphql/graphql-js',
  'apollo': 'apollographql/apollo-client',

  // AI / ML
  'tensorflow': 'tensorflow/tensorflow',
  'pytorch': 'pytorch/pytorch',
  'langchain': 'langchain-ai/langchain',
  'hugging face': 'huggingface/transformers',
  'transformers': 'huggingface/transformers',

  // Languages
  'typescript': 'microsoft/TypeScript',
  'rust': 'rust-lang/rust',
  'go': 'golang/go',
  'python': 'python/cpython',
  'kotlin': 'JetBrains/kotlin',
  'swift': 'swiftlang/swift',
  'zig': 'ziglang/zig',
};

function resolveRepo(input: string): string | null {
  const normalized = input.trim().toLowerCase();
  if (REPO_MAP[normalized]) return REPO_MAP[normalized];

  // Try direct owner/repo format
  if (/^[\w.-]+\/[\w.-]+$/.test(input.trim())) return input.trim();

  return null;
}

async function fetchRepoData(repo: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BuildCode-Analytics',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }

  const [repoRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${repo}/stats/commit_activity`, { headers }),
  ]);

  if (!repoRes.ok) {
    throw new Error(`GitHub API error: ${repoRes.status} for ${repo}`);
  }

  const repoData = await repoRes.json();

  let commitActivity: number[] = [];
  if (commitsRes.ok) {
    const commitData = await commitsRes.json();
    if (Array.isArray(commitData)) {
      commitActivity = commitData.map((week: { total: number }) => week.total);
    }
  }

  const totalCommitsLast30Days = commitActivity.slice(-4).reduce((a, b) => a + b, 0);

  return {
    name: repoData.full_name,
    description: repoData.description,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    language: repoData.language,
    pushedAt: repoData.pushed_at,
    createdAt: repoData.created_at,
    license: repoData.license?.spdx_id || null,
    commitActivity,
    commitsLast30Days: totalCommitsLast30Days,
  };
}

export const GET: APIRoute = async ({ url }) => {
  const repoA = url.searchParams.get('a');
  const repoB = url.searchParams.get('b');

  if (!repoA || !repoB) {
    return new Response(JSON.stringify({ error: 'Parameters "a" and "b" are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resolvedA = resolveRepo(repoA);
  const resolvedB = resolveRepo(repoB);

  if (!resolvedA || !resolvedB) {
    return new Response(JSON.stringify({
      error: `Could not resolve repository: ${!resolvedA ? repoA : repoB}`,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [dataA, dataB] = await Promise.all([
      fetchRepoData(resolvedA),
      fetchRepoData(resolvedB),
    ]);

    return new Response(JSON.stringify({ a: dataA, b: dataB }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
