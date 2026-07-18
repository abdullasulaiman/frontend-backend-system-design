// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

import { rehypeBaseUrl } from './src/lib/rehype-base-url.mjs';

// Deployed as a GitHub Pages *project* site, so the app is served from a
// subpath, not the domain root. `base` must match the repo name.
const BASE = '/frontend-backend-system-design';

// https://astro.build/config
export default defineConfig({
  // NOTE: replace `your-username` with your GitHub username before deploying.
  // `site` only affects sitemap/canonical URLs — the functional subpath is `base`.
  site: 'https://your-username.github.io',
  base: BASE,
  devToolbar: { enabled: false },
  integrations: [react(), mdx()],
  // The rehype plugin prefixes root-absolute links written inside MDX content
  // (e.g. `/system-design/<slug>`) with the base path at build time, so lesson
  // authors keep writing base-agnostic links. @astrojs/mdx extends this
  // markdown config by default, so it applies to .mdx too.
  markdown: {
    rehypePlugins: [[rehypeBaseUrl, { base: BASE }]],
  },
  vite: { plugins: [tailwindcss()] },
});
