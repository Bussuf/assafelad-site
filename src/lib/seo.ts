/* Full addresses for canonical, Open Graph and the sitemap link (#6). The site and base come from the deploy
   (SITE_URL, SITE_BASE), so the same code is right on the temporary address and on the real domain (#8). */

/**
 * "/assafelad-site/games/chesslord" on "https://bussuf.github.io" -> "https://bussuf.github.io/assafelad-site/games/chesslord/".
 * Pages end in "/" (GitHub Pages serves each page as a folder, and the sitemap lists them that way);
 * a file ("/og.jpg", "/sitemap-index.xml") keeps its name.
 */
export function absoluteUrl(path: string, site: URL | string): string {
  let clean = ('/' + path).replace(/\/{2,}/g, '/');
  const last = clean.split('/').pop() ?? '';
  if (!clean.endsWith('/') && !last.includes('.')) clean += '/';
  return new URL(clean, site).href;
}
