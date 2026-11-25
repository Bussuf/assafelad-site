import type { ImageMetadata } from 'astro';

/* Real images live in src/assets/images/, named as in the assets checklist. A slot whose file is not there yet
   shows a placeholder instead. */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{png,jpg,jpeg,webp}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

export const findImage = (file: string): ImageMetadata | undefined => byName.get(file);

/* Videos (#15) live in src/assets/videos/: the build copies each one with a hashed name and gives its URL. */
const videoFiles = import.meta.glob<string>('/src/assets/videos/*.mp4', { eager: true, query: '?url', import: 'default' });
const videoByName = new Map(Object.entries(videoFiles).map(([path, url]) => [path.split('/').pop()!, url]));

/* Songs (#19) live in src/assets/audio/, the same way. */
const audioFiles = import.meta.glob<string>('/src/assets/audio/*.mp3', { eager: true, query: '?url', import: 'default' });
const audioByName = new Map(Object.entries(audioFiles).map(([path, url]) => [path.split('/').pop()!, url]));

/** The URL of a song file; a missing file stops the build. */
export const findAudio = (file: string): string => {
  const url = audioByName.get(file);
  if (!url) throw new Error(`Song not found in src/assets/audio/: ${file}`);
  return url;
};

/** The URL of a video file; a missing file stops the build, since a video slot has no placeholder. */
export const findVideo = (file: string): string => {
  const url = videoByName.get(file);
  if (!url) throw new Error(`Video not found in src/assets/videos/: ${file}`);
  return url;
};

/** Phone-shaped (portrait) screenshots get a gallery of tall cells instead of wide ones. */
export const isTall = (file: string): boolean => {
  const img = byName.get(file);
  return !!img && img.height > img.width * 1.2;
};
