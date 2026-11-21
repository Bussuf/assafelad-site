/*
 * Site sounds, synthesized with Web Audio until Assaf records his own.
 * Off by default and remembered per visitor. Nothing plays unless the visitor clicks.
 */

const STORAGE_KEY = 'assaf-sound';

export const NOTES = {
  C4: 261.63,
  E4: 329.63,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  E5: 659.25,
} as const;
export type NoteName = keyof typeof NOTES;

let enabled = false;
try {
  enabled = localStorage.getItem(STORAGE_KEY) === '1';
} catch {
  // storage blocked (private mode): stay off
}

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export const isSoundOn = (): boolean => enabled;

/** Turning sound on plays the ta-da; turning it off is silent (the visitor asked for quiet). */
export function setSound(on: boolean): void {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
  } catch {
    // not remembered, still works for this visit
  }
  if (on) tada();
}

/** A plucked string (Karplus-Strong), the voice of the bar notes and chords. */
function pluck(freq: number, vol = 0.22, dur = 1.3, when = 0): void {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const sr = c.sampleRate;
  const period = Math.max(2, Math.round(sr / freq));
  const len = Math.round(sr * dur);
  const buffer = c.createBuffer(1, len, sr);
  const data = buffer.getChannelData(0);
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
  let x = 0;
  for (let i = 0; i < len; i++) {
    const next = (x + 1) % period;
    const v = ring[x]!;
    data[i] = v;
    ring[x] = (v + ring[next]!) * 0.5 * 0.996;
    x = next;
  }
  const src = c.createBufferSource();
  const gain = c.createGain();
  src.buffer = buffer;
  gain.gain.value = vol;
  src.connect(gain).connect(c.destination);
  src.start(c.currentTime + when);
}

function tone(freq: number, dur: number, vol: number, when = 0): void {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** A short burst of filtered noise: the wood tap (band-pass) or the dice tick (high-pass). */
function noise(hz: number, ms: number, vol: number, type: BiquadFilterType, when = 0, jitter = 0): void {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const j = 1 + (Math.random() - 0.5) * jitter;
  const len = Math.max(1, Math.round((c.sampleRate * ms * j) / 1000));
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  filter.type = type;
  filter.frequency.value = hz * j;
  filter.Q.value = 1.4;
  gain.gain.value = vol * (1 + (Math.random() - 0.5) * jitter);
  src.buffer = buffer;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(c.currentTime + when);
}

/** The default sound of every button: slightly different on each press. */
export const tap = (): void => noise(1400, 12, 0.55, 'bandpass', 0, 0.16);
/** Close / back. */
export const tapLow = (): void => noise(850, 12, 0.55, 'bandpass', 0, 0.16);

export const note = (name: NoteName): void => pluck(NOTES[name]);

/** Any pitch, for the ukulele's chords. */
export const pluckHz = (freq: number, when = 0): void => pluck(freq, 0.2, 1.1, when);

/** Home in the bar and the game window: the rolled C chord. */
export const chord = (): void =>
  [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5].forEach((f, i) => pluck(f, 0.16, 1.2, i * 0.07));

/** Sound on: a short G, then a full strummed C chord. */
export function tada(): void {
  pluck(NOTES.G4, 0.2, 0.5);
  [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5, NOTES.E5].forEach((f, i) => pluck(f, 0.15, 1.9, 0.2 + i * 0.018));
}

/** Surprise me: ticks while the dice rolls, ending on B (an open question). */
export function dice(): void {
  [0, 0.08, 0.17, 0.27, 0.39, 0.52].forEach((w) => noise(1800, 30, 0.08, 'highpass', w));
  pluck(NOTES.B4, 0.18, 1.2, 0.62);
}

/** Then/Now: a chime glissando, up on reveal, softer and down on leave. */
export function magic(up = true): void {
  const steps = [1046.5, 1318.5, 1568, 1975.5, 2349.3, 2637];
  (up ? steps : [...steps].reverse()).forEach((f, i) => tone(f, 0.7, up ? 0.045 : 0.03, i * 0.04));
}
