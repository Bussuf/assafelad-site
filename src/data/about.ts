/* About page copy, from mockup v7. File names follow the assets checklist (about-01 ... about-20). */
import type { Shot } from './home';
import { withBase } from '../lib/nav';

export interface TextTodo {
  what: string;
  words: number;
}

export interface TopicPart {
  heading: string;
  paragraphs: string[];
  gallery: Shot[];
  todo?: TextTodo;
  go?: { href: string; label: string };
}

export interface Topic {
  id: 'music' | 'games' | 'apps' | 'ai' | 'excel' | 'play';
  icon: 'music' | 'games' | 'apps' | 'ai' | 'excel' | 'star';
  title: string;
  oneLine: string;
  image: Shot;
  body?: string;
  /** door topics: the door, and a few highlights only (the full list is on the door page) */
  door?: 'music' | 'games' | 'apps';
  highlights?: string[];
  go?: { href: string; label: string };
  gallery?: Shot[];
  todo?: TextTodo;
  parts?: TopicPart[];
  hint?: string;
}

export const INTRO = {
  /** pools: every reveal brings the next photo, so one visit plays through all of them (his idea, #12).
      More childhood photos go here as he finds them. */
  then: [{ caption: 'Then: me at my first computer, 1992', file: 'about-01.jpg', kind: 'photo' }] as Shot[],
  now: [
    { caption: 'Now: me at the Acropolis', file: 'about-02.jpg', kind: 'photo' },
    { caption: 'Now: me at my desk', file: 'about-02-2.jpg', kind: 'photo' },
    { caption: 'Now: me playing guitar at a show', file: 'about-02-3.jpg', kind: 'photo' },
  ] as Shot[],
  todo: { what: 'From that kid to music, games and apps: the rest of the intro', words: 50 },
};

export const TOPICS: readonly Topic[] = [
  {
    id: 'music',
    icon: 'music',
    title: 'Music',
    oneLine: 'Sing-alongs, lessons, songs',
    image: { caption: 'Assaf with guitar at a sing-along', file: 'home-13.jpg', kind: 'photo' },
    body: 'Sing-along evenings, including at care homes. Guitar and music lessons. Original songs, and השכנים (The Neighbors), a band on a break.',
    door: 'music',
    highlights: ['sing-alongs', 'original-songs'],
    go: { href: withBase('/music'), label: 'Open Music' },
    hint: 'Fun fact: my nav bar is tuned like a ukulele. Apps, Music, Games, About: G, C, E, A. Turn the sound on and strum it three times.',
  },
  {
    id: 'games',
    icon: 'games',
    title: 'Making games',
    oneLine: 'Unity, 2D and 3D',
    image: { caption: 'ChessLord key art', file: 'home-14.png', kind: 'screen' },
    body: 'Games I made in Unity. ChessLord is the big one, and NewChessLord rebuilds it from scratch.',
    door: 'games',
    highlights: ['chesslord', 'space-janitor'],
    go: { href: withBase('/games'), label: 'Open Games' },
  },
  {
    id: 'apps',
    icon: 'apps',
    title: 'Apps',
    oneLine: 'Systems and Flutter apps',
    image: { caption: 'Collage of app screens, data blurred', file: 'home-15.png', kind: 'screen' },
    body: 'Management systems, Flutter apps and a final project with Omer. Private systems are shown as screenshots only.',
    door: 'apps',
    highlights: ['music-studio', 'pets'],
    go: { href: withBase('/apps'), label: 'Open Apps' },
  },
  {
    id: 'ai',
    icon: 'ai',
    title: 'AI talks',
    oneLine: 'Talks and rollouts',
    image: { caption: 'AI talk, the room seen from the back', file: 'about-03.jpg', kind: 'photo' },
    body: 'Talks for lawyers and organizations, and AI rollouts in two law firms.',
    gallery: [
      { caption: 'A slide from a talk', file: 'about-04.png', kind: 'screen' },
      { caption: 'Close-up: talking with the audience', file: 'about-05.jpg', kind: 'photo' },
    ],
    todo: { what: 'What the talks cover, and who they are for', words: 40 },
  },
  {
    id: 'excel',
    icon: 'excel',
    title: 'Excel and BI',
    oneLine: 'Dashboards, and an alliance spreadsheet',
    image: { caption: 'A dashboard I built, data blurred', file: 'about-06.png', kind: 'screen' },
    body: 'Charts and dashboards.',
    parts: [
      {
        heading: 'My degree final project: AgriLab-PRO',
        paragraphs: ['Built with Omer at Sapir. The result is a full BI report in Google Looker Studio.'],
        gallery: [
          { caption: 'AgriLab-PRO: the Looker Studio report, main page', file: 'agrilab-pro-01.png', kind: 'screen' },
          { caption: 'Looker Studio report, a drill-down view', file: 'agrilab-pro-02.png', kind: 'screen' },
        ],
        todo: { what: 'What the report shows and what it answered', words: 40 },
        go: { href: withBase('/apps/agrilab-pro'), label: 'Open AgriLab-PRO' },
      },
      {
        heading: 'Side story: the Travian alliance',
        paragraphs: [
          'Travian is a browser game with a lot of players. I built an Excel sheet to run our alliance: planning attacks and timing the landings, with different armies and bonuses, from different places to different targets, to win the treasures.',
          'For a while, across several servers, the alliance was unbeatable. The community still asks me to come back.',
        ],
        gallery: [
          { caption: 'The alliance spreadsheet, player names blurred', file: 'about-07.png', kind: 'screen' },
          { caption: 'Attack planning: landing times, names blurred', file: 'about-08.png', kind: 'screen' },
        ],
      },
    ],
  },
  {
    id: 'play',
    icon: 'star',
    title: 'Games I play',
    oneLine: 'Builders, colonies and survival',
    image: { caption: 'A favorite base or factory, my own screenshot', file: 'about-10.png', kind: 'screen' },
  },
];

/** Steam favorites with over 100 hours. Hours are fixed (updated by hand), from his library screenshot. */
export const STEAM_LIBRARY: readonly { name: string; hours: number; file: string }[] = [
  { name: 'RimWorld', hours: 1547.4, file: 'about-11.png' },
  { name: 'Cities: Skylines', hours: 986.8, file: 'about-12.png' },
  { name: 'Satisfactory', hours: 956.7, file: 'about-13.png' },
  { name: 'Factorio', hours: 916.2, file: 'about-14.png' },
  { name: 'Oxygen Not Included', hours: 758, file: 'about-15.png' },
  { name: 'Valheim', hours: 717.4, file: 'about-16.png' },
  { name: 'Surviving Mars', hours: 547.9, file: 'about-17.png' },
  { name: 'Kerbal Space Program', hours: 413.3, file: 'about-18.png' },
  { name: 'Schedule I', hours: 267.1, file: 'about-19.png' },
  { name: 'Subnautica', hours: 171, file: 'about-20.png' },
];

/** Where to find him as a player. Epic and Discord stay off until he picks what to share. */
export const PLATFORMS: readonly { name: string; label: string; url?: string }[] = [
  { name: 'Steam', label: 'My Steam profile', url: 'https://steamcommunity.com/profiles/76561198107536619/' },
];
