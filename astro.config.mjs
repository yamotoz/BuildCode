// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://buildcode.com.br',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/app') &&
        !page.includes('/perfil') &&
        !page.includes('/admin') &&
        !page.includes('/cyberdyne-scan') &&
        !page.includes('/serenity-scan') &&
        !page.includes('/marketing') &&
        !page.includes('/api/'),
      i18n: {
        defaultLocale: 'pt-BR',
        locales: {
          'pt-BR': 'pt-BR',
          'en': 'en',
        },
      },
    }),
  ]
});
