// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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
