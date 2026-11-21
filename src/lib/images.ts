import type { ImageMetadata } from 'astro';

/* Real images live in src/assets/images/, named as in the assets checklist. A slot whose file is not there yet
   shows a placeholder instead. */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{png,jpg,jpeg,webp}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

export const findImage = (file: string): ImageMetadata | undefined => byName.get(file);

/** Phone-shaped (portrait) screenshots get a gallery of tall cells instead of wide ones. */
export const isTall = (file: string): boolean => {
  const img = byName.get(file);
  return !!img && img.height > img.width * 1.2;
};
