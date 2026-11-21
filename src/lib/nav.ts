import type { NoteName } from './sound';

export type NavKey = 'home' | 'music' | 'games' | 'apps' | 'about';

export interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  /** a bar note, or the rolled C chord for Home */
  sound: NoteName | 'chord';
}

/** One list for the header tabs, the Hotbar and the logo, so their notes never drift apart. */
export const NAV: readonly NavItem[] = [
  { key: 'home', href: '/', label: 'Home', sound: 'chord' },
  { key: 'music', href: '/music', label: 'Music', sound: 'C4' },
  { key: 'games', href: '/games', label: 'Games', sound: 'E4' },
  { key: 'apps', href: '/apps', label: 'Apps', sound: 'G4' },
  { key: 'about', href: '/about', label: 'About', sound: 'A4' },
];

/** The nav section a path belongs to: "/games/chesslord" -> "games". */
export function navKeyOf(pathname: string): NavKey {
  const first = pathname.split('/').filter(Boolean)[0];
  const hit = NAV.find((item) => item.key !== 'home' && item.key === first);
  return hit ? hit.key : 'home';
}
