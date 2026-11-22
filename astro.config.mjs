// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Temporary address until the domain moves (#7, #8): the deploy workflow sets SITE_BASE=/assafelad-site.
  // Locally it is unset, so localhost stays at "/".
  site: 'https://bussuf.github.io',
  // read through globalThis: the project has no Node type definitions, and adding @types/node for one line is not worth it
  // CSS goes inside each page: a page cached from before a deploy never points at a CSS file that is gone
  // (pages loaded unstyled right after a push, his note)
  build: { inlineStylesheets: 'always' },
  // every link on screen is fetched ahead (pages are ~20KB): a phone has no hover, and the wait for
  // GitHub Pages made each Hotbar tap take ~2s (his note)
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  base: /** @type {any} */ (globalThis).process?.env?.SITE_BASE || '/',
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
  vite: {
    plugins: [tailwindcss()]
  }
});
