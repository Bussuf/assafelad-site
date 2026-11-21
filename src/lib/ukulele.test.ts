import { describe, expect, it } from 'vitest';
import { stringHz, ukeStep } from './ukulele';

const ORDER = ['apps', 'music', 'games', 'about'];

function play(keys: string[], start = '') {
  let sequence = start;
  const opened: number[] = [];
  keys.forEach((k, i) => {
    const r = ukeStep(sequence, k);
    sequence = r.sequence;
    if (r.done) opened.push(i);
  });
  return { sequence, opened };
}

describe('ukeStep', () => {
  it('opens after Apps, Music, Games, About three times in a row', () => {
    const r = play([...ORDER, ...ORDER, ...ORDER]);
    expect(r.opened).toEqual([11]);
  });

  it('twice is not enough', () => {
    expect(play([...ORDER, ...ORDER]).opened).toEqual([]);
  });

  it('a wrong tab in the middle breaks it', () => {
    expect(play([...ORDER, 'apps', 'music', 'about', 'games', ...ORDER]).opened).toEqual([]);
  });

  it('Home in the middle breaks it', () => {
    expect(play([...ORDER, 'home', ...ORDER, ...ORDER]).opened).toEqual([]);
  });

  it('clicks before the sequence do not matter', () => {
    const r = play(['about', 'games', 'home', ...ORDER, ...ORDER, ...ORDER]);
    expect(r.opened).toEqual([14]);
  });

  it('starts over after opening, so a fourth round does not reopen it', () => {
    const r = play([...ORDER, ...ORDER, ...ORDER, ...ORDER]);
    expect(r.opened).toEqual([11]);
  });
});

describe('stringHz', () => {
  it('open strings are G4 C4 E4 A4', () => {
    expect([0, 1, 2, 3].map((s) => stringHz(s, 'Open'))).toEqual([392, 261.63, 329.63, 440]);
  });

  it('a fret is a semitone: C chord puts the A string on C5', () => {
    expect(stringHz(3, 'C')).toBeCloseTo(523.25, 1);
  });

  it('two frets on G gives A (Am chord)', () => {
    expect(stringHz(0, 'Am')).toBeCloseTo(440, 1);
  });

  it('rejects a string that does not exist', () => {
    expect(() => stringHz(4, 'Open')).toThrow(RangeError);
  });
});
