import { describe, expect, it } from 'vitest';
import { absoluteUrl } from './seo';

const TEMP = 'https://bussuf.github.io';
const DOMAIN = 'https://assafelad.com';

describe('absoluteUrl', () => {
  it('keeps the temporary base and ends a page in "/"', () => {
    expect(absoluteUrl('/assafelad-site/games/chesslord', TEMP)).toBe('https://bussuf.github.io/assafelad-site/games/chesslord/');
  });

  it('gives the home page with and without a base', () => {
    expect(absoluteUrl('/assafelad-site/', TEMP)).toBe('https://bussuf.github.io/assafelad-site/');
    expect(absoluteUrl('/', DOMAIN)).toBe('https://assafelad.com/');
  });

  it('does not add a second slash', () => {
    expect(absoluteUrl('/music/', DOMAIN)).toBe('https://assafelad.com/music/');
    expect(absoluteUrl('//assafelad-site//about', TEMP)).toBe('https://bussuf.github.io/assafelad-site/about/');
  });

  it('leaves a file name as it is', () => {
    expect(absoluteUrl('/assafelad-site/_astro/about-02.abc.jpg', TEMP)).toBe('https://bussuf.github.io/assafelad-site/_astro/about-02.abc.jpg');
    expect(absoluteUrl('/sitemap-index.xml', DOMAIN)).toBe('https://assafelad.com/sitemap-index.xml');
  });

  it('ignores a path on the site value (the base is part of the path)', () => {
    expect(absoluteUrl('/music', 'https://assafelad.com/anything/')).toBe('https://assafelad.com/music/');
  });
});
