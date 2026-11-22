import type { NoteName } from './sound';

export type NavKey = 'home' | 'music' | 'games' | 'apps' | 'about';

export interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  /** a bar note, or the rolled C chord for Home */
  sound: NoteName | 'chord';
}

/* Until step 8 the site lives under /assafelad-site/ on GitHub Pages (#7): every internal link goes through here.
   Locally the base is "/", so nothing changes. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
/** "/music" -> "/assafelad-site/music" on the temporary address. */
export const withBase = (path: string): string => BASE + path;
/** "/assafelad-site/music" -> "/music". */
export const stripBase = (path: string): string => (BASE && path.startsWith(BASE) ? path.slice(BASE.length) || '/' : path);

/** One list for the header tabs, the Hotbar and the logo, so their notes never drift apart. */
export const NAV: readonly NavItem[] = [
  { key: 'home', href: withBase('/'), label: 'Home', sound: 'chord' },
  { key: 'music', href: withBase('/music'), label: 'Music', sound: 'C4' },
  { key: 'games', href: withBase('/games'), label: 'Games', sound: 'E4' },
  { key: 'apps', href: withBase('/apps'), label: 'Apps', sound: 'G4' },
  { key: 'about', href: withBase('/about'), label: 'About', sound: 'A4' },
];

/** The nav section a path belongs to: "/games/chesslord" -> "games". */
export function navKeyOf(pathname: string): NavKey {
  const first = stripBase(pathname).split('/').filter(Boolean)[0];
  const hit = NAV.find((item) => item.key !== 'home' && item.key === first);
  return hit ? hit.key : 'home';
}
