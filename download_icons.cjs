/**
 * download_icons.js — Baixa todos os ícones do Simple Icons para public/icons/
 * Uso: node download_icons.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// Todos os slugs usados em technologies.ts
const slugs = [
  // Base technologies
  'react', 'nextdotjs', 'vuedotjs', 'astro', 'nodedotjs', 'bun', 'go',
  'postgresql', 'redis', 'mongodb', 'amazonaws', 'docker', 'vercel',
  'tailwindcss', 'shadcnui', 'prisma', 'visualstudiocode', 'cursor',
  // Frontend
  'nuxtdotjs', 'svelte', 'angular', 'solid', 'remix', 'reactquery',
  'threedotjs', 'framer', 'storybook', 'qwik', 'htmx', 'flutter',
  'alpinedotjs', 'preact', 'lit', 'gatsby', 'expo', 'vite',
  'playwright', 'capacitor',
  // Backend
  'deno', 'rust', 'python', 'fastify', 'nestjs', 'fastapi', 'elixir',
  'rubyonrails', 'laravel', 'springboot', 'dotnet', 'hono',
  'django', 'cloudflareworkers', 'express', 'trpc', 'strapi',
  'payloadcms', 'koa',
  // Data
  'mysql', 'sqlite', 'turso', 'pinecone', 'upstash', 'amazondynamodb',
  'supabase', 'drizzle', 'clickhouse', 'meilisearch', 'algolia',
  'apachecassandra', 'mariadb', 'neo4j', 'pocketbase', 'firebase',
  'surrealdb',
  // Infra
  'googlecloud', 'microsoftazure', 'netlify', 'railway', 'render',
  'digitalocean', 'kubernetes', 'flydotio', 'neon', 'hetzner',
  'appwrite', 'coolify', 'terraform', 'pulumi', 'githubactions',
  'gitlab', 'jenkins', 'sentry', 'grafana', 'prometheus', 'cloudflare',
  'nginx',
  // Libs
  'radixui', 'zod', 'zustand', 'redux', 'jotai', 'styledcomponents',
  'i18next', 'axios', 'lucide', 'lodash', 'reacthookform', 'mongoose',
  'resend', 'stripe', 'authjs', 'clerk', 'puppeteer', 'sharp', 'bull',
  // DevEx
  'codeium', 'githubcopilot', 'openai', 'anthropic', 'prettier',
  'eslint', 'biome', 'turborepo', 'nx', 'git', 'neovim', 'postman',
  'insomnia', 'warp', 'raycast', 'figma', 'excalidraw', 'linear',
  'trello', 'obsidian', 'replit', 'stencil',
  // Wizard options extras
  'html5', 'javascript', 'npm', 'windowsterminal',
];

// Deduplicate
const uniqueSlugs = [...new Set(slugs)];

function downloadIcon(slug) {
  return new Promise((resolve) => {
    const url = `https://cdn.simpleicons.org/${slug}/ffffff`;
    const filePath = path.join(ICONS_DIR, `${slug}.svg`);

    // Skip if already exists
    if (fs.existsSync(filePath)) {
      resolve({ slug, status: 'exists' });
      return;
    }

    https.get(url, { headers: { 'User-Agent': 'BuildCode-IconDownloader/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        https.get(res.headers.location, (res2) => {
          let data = '';
          res2.on('data', chunk => data += chunk);
          res2.on('end', () => {
            if (data.includes('<svg')) {
              fs.writeFileSync(filePath, data);
              resolve({ slug, status: 'downloaded' });
            } else {
              resolve({ slug, status: 'failed (not SVG)' });
            }
          });
        }).on('error', () => resolve({ slug, status: 'failed' }));
        return;
      }

      if (res.statusCode !== 200) {
        resolve({ slug, status: `failed (${res.statusCode})` });
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.includes('<svg')) {
          fs.writeFileSync(filePath, data);
          resolve({ slug, status: 'downloaded' });
        } else {
          resolve({ slug, status: 'failed (not SVG)' });
        }
      });
    }).on('error', () => resolve({ slug, status: 'failed' }));
  });
}

async function main() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log('  BuildCode — Icon Downloader');
  console.log(`  ${uniqueSlugs.length} ícones para baixar`);
  console.log(`${'═'.repeat(50)}\n`);

  let downloaded = 0, existed = 0, failed = 0;

  // Process in batches of 10 to avoid overwhelming the server
  for (let i = 0; i < uniqueSlugs.length; i += 10) {
    const batch = uniqueSlugs.slice(i, i + 10);
    const results = await Promise.all(batch.map(downloadIcon));

    results.forEach(r => {
      if (r.status === 'downloaded') {
        downloaded++;
        console.log(`  ✅ ${r.slug}`);
      } else if (r.status === 'exists') {
        existed++;
      } else {
        failed++;
        console.log(`  ❌ ${r.slug}: ${r.status}`);
      }
    });
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  ✅ ${downloaded} baixados | 📦 ${existed} já existiam | ❌ ${failed} falharam`);
  console.log(`  Ícones salvos em: public/icons/`);
  console.log(`${'═'.repeat(50)}\n`);
}

main();
