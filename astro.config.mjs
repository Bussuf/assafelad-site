// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Temporary address until the domain moves (#7, #8): the deploy workflow sets SITE_BASE=/assafelad-site.
  // Locally it is unset, so localhost stays at "/".
  site: 'https://bussuf.github.io',
  // read through globalThis: the project has no Node type definitions, and adding @types/node for one line is not worth it
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
