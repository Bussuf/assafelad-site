/*
 * Ukulele mode. The bar notes are Apps G, Music C, Games E, About A: a ukulele's open strings (re-entrant G C E A).
 * Playing them in that order three times in a row opens a small ukulele.
 */

export const STRINGS = ['G', 'C', 'E', 'A'] as const;
/** G4 C4 E4 A4 */
export const OPEN_HZ = [392, 261.63, 329.63, 440] as const;

/** Fret per string (G, C, E, A). */
export const CHORDS = {
  Open: [0, 0, 0, 0],
  C: [0, 0, 0, 3],
  Am: [2, 0, 0, 0],
  F: [2, 0, 1, 0],
  G: [0, 2, 3, 2],
} as const;
export type ChordName = keyof typeof CHORDS;
export const CHORD_NAMES = Object.keys(CHORDS) as ChordName[];

/** The pitch of one string in a chord: each fret is a semitone. */
export function stringHz(string: number, chord: ChordName): number {
  const open = OPEN_HZ[string];
  const fret = CHORDS[chord][string];
  if (open === undefined || fret === undefined) throw new RangeError(`No string ${string}`);
  return open * 2 ** (fret / 12);
}

/** Which letter each bar item adds; anything else (Home) breaks the sequence. */
export const BAR_LETTER: Readonly<Record<string, string>> = { apps: 'G', music: 'C', games: 'E', about: 'A' };
export const SECRET = 'GCEA'.repeat(3);

/**
 * Add one bar click to the sequence. Returns the sequence to keep and whether the secret was just completed
 * (the sequence then starts over).
 */
export function ukeStep(sequence: string, navKey: string): { sequence: string; done: boolean } {
  const next = (sequence + (BAR_LETTER[navKey] ?? 'x')).slice(-SECRET.length);
  return next === SECRET ? { sequence: '', done: true } : { sequence: next, done: false };
}
