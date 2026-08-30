import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

const hiddenProductPaths = [
  '/products/ai-prospecting-system/',
  '/products/ai-prospecting-starter/',
  '/products/chatgpt-client-acquisition-system/',
  '/products/automated-lead-engine/',
  '/products/production-lead-engine/',
  '/products/saas-validation-before-you-build/',
  '/products/micro-saas-launch-system/',
  '/products/the-first-10-saas-customers/',
  '/products/ai-powered-one-person-dev-business/',
];

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  trailingSlash: 'always',
  redirects: {
    '/compare/': { status: 301, destination: '/products/' },
    '/how-it-works/': { status: 301, destination: '/products/' },
  },
  integrations: [
    svelte(),
    mdx(),
    sitemap({
      filter: (page) => !hiddenProductPaths.some((path) => page.endsWith(path)),
    }),
  ],

  vite: {
      plugins: [tailwindcss()],
	},

  adapter: vercel(),
});
