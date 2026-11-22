/* Home page copy and image slots, from mockup v7. File names follow the assets checklist (home-01 ... home-15). */

export type DoorKey = 'music' | 'games' | 'apps';

export interface Shot {
  caption: string;
  file: string;
  kind: 'photo' | 'screen';
}

export interface BannerWord {
  word: string;
  /** the door color the word takes; "home" (green) for the RimWorld joke */
  color: DoorKey | 'home';
  caption: string;
  shots: [Shot, Shot, Shot];
}

/** Each word stays this long; Pause freezes it, Play continues from the same point. */
export const WORD_MS = 5200;

export const BANNER: readonly BannerWord[] = [
  {
    word: 'guitar',
    color: 'music',
    caption: 'At sing-alongs, in lessons and in songs of my own.',
    shots: [
      { caption: 'A sing-along evening in a living room', file: 'home-01.jpg', kind: 'photo' },
      { caption: 'Guitar lesson, hands on the fretboard', file: 'home-02.jpg', kind: 'photo' },
      { caption: 'Assaf with guitar, portrait', file: 'home-03.jpg', kind: 'photo' },
    ],
  },
  {
    word: 'games',
    color: 'games',
    caption: 'And I make them. ChessLord is the big one.',
    shots: [
      { caption: 'ChessLord board, mid-game', file: 'home-04.png', kind: 'screen' },
      { caption: 'Space Janitor, inside the station', file: 'home-05.png', kind: 'screen' },
      { caption: 'Laser Defender, boss fight', file: 'home-06.png', kind: 'screen' },
    ],
  },
  {
    word: 'with code',
    color: 'apps',
    caption: 'Apps, systems and tools I use every day.',
    shots: [
      { caption: 'music-studio dashboard, data blurred', file: 'home-07.png', kind: 'screen' },
      { caption: 'PETS app on an Android phone', file: 'home-08.png', kind: 'screen' },
      { caption: 'trip-companion on the phone', file: 'home-09.png', kind: 'screen' },
    ],
  },
  {
    word: 'too much RimWorld',
    color: 'home',
    caption: '1,547 hours and counting. Send help.',
    shots: [
      { caption: 'My RimWorld colony', file: 'home-10.png', kind: 'screen' },
      { caption: 'A colony having a very bad day', file: 'home-11.png', kind: 'screen' },
      { caption: 'Steam library: 1,547.4 hours in RimWorld', file: 'home-12.png', kind: 'screen' },
    ],
  },
];

export interface Door {
  key: DoorKey;
  title: string;
  sub: string;
  /** the opening line of the door page */
  intro: string;
  href: string;
  cover: Shot;
}

export const DOORS: readonly Door[] = [
  {
    key: 'music',
    title: 'Music',
    sub: 'Sing-alongs, lessons, songs',
    intro: 'Sing-alongs, guitar lessons, songs of my own, and a band on a break.',
    href: '/music',
    cover: { caption: 'Assaf with guitar at a sing-along', file: 'home-13.jpg', kind: 'photo' },
  },
  {
    key: 'games',
    title: 'Games',
    sub: 'Games I made in Unity',
    intro: 'Games I made in Unity, from small classics to ChessLord.',
    href: '/games',
    cover: { caption: 'ChessLord key art', file: 'home-14.png', kind: 'screen' },
  },
  {
    key: 'apps',
    title: 'Apps',
    sub: 'Apps and systems I built',
    intro: 'Management systems, Flutter apps and a final project. Private systems are shown as screenshots only.',
    href: '/apps',
    cover: { caption: 'Collage of app screens, data blurred', file: 'home-15.png', kind: 'screen' },
  },
];
