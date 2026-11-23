// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// read through globalThis: the project has no Node type definitions, and adding @types/node for one line is not worth it
const env = /** @type {any} */ (globalThis).process?.env ?? {};

// https://astro.build/config
export default defineConfig({
  // Temporary address until the domain moves (#7, #8): the deploy workflow sets SITE_URL and SITE_BASE=/assafelad-site.
  // At #8 only the workflow changes. Locally both are unset, so localhost stays at "/".
  site: env.SITE_URL || 'https://bussuf.github.io',
  base: env.SITE_BASE || '/',
  // CSS goes inside each page: a page cached from before a deploy never points at a CSS file that is gone
  // (pages loaded unstyled right after a push, his note)
  build: { inlineStylesheets: 'always' },
  // every link on screen is fetched ahead (pages are ~20KB): a phone has no hover, and the wait for
  // GitHub Pages made each Hotbar tap take ~2s (his note)
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  // Rubik is downloaded at build time and served from the site itself (no Google Fonts link).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Rubik',
      cssVariable: '--font-rubik',
      weights: ['400 800'],
      styles: ['normal'],
      // hebrew: the band name השכנים
      subsets: ['latin', 'hebrew'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  // the 404 page is not a page to find (#6)
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: {
    plugins: [tailwindcss()]
  }
});
