import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/seo';

/* Built per deploy, so the sitemap address carries the right site and base (#6). Search engines read it only at a
   domain's root: on the temporary address it is ignored, and the pages' noindex keeps them out until #8. */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(`${import.meta.env.BASE_URL}/sitemap-index.xml`, site!)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
