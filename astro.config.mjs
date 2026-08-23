import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  trailingSlash: 'always',
  integrations: [svelte(), mdx(), sitemap()],

  vite: {
      plugins: [tailwindcss()],
	},

  adapter: vercel(),
});
