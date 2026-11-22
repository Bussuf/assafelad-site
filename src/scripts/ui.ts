/*
 * Site-wide behavior. A bundled module runs once; the ClientRouter keeps this document alive between
 * pages, so the listeners below stay, and a note started by a click is not cut by the navigation.
 */
import { navigate } from 'astro:transitions/client';
import * as sound from '../lib/sound';
import { ukeStep } from '../lib/ukulele';
import { stripBase } from '../lib/nav';

const THEME_KEY = 'assaf-theme';
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Every button and link makes a sound; the wood tap unless it has its own (data-sound). */
document.addEventListener(
  'click',
  (event) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('a, button, [role="button"]');
    if (!el || el.hasAttribute('data-sound-toggle') || el.hasAttribute('data-dice')) return;
    if (el.dataset.nav) trackBar(el.dataset.nav);
    const kind = el.dataset.sound;
    if (kind === 'chord') sound.chord();
    else if (kind === 'low') sound.tapLow();
    else if (kind === 'none') return;
    else if (kind && kind in sound.NOTES) sound.note(kind as sound.NoteName);
    else sound.tap();
  },
  { capture: true },
);

/* Press feedback, one for the whole site (his note: taps felt dead on the phone, also with sound off;
   tested on About first). Buttons and button-like cards only, never a link inside text: the list is here, once.
   The ring is the control's own outline, growing out and fading, so it moves with the control when the page
   scrolls and is gone when the control is gone. A short pop goes with it, on the `scale` property, so it adds to
   a control's own lift (the Hotbar slot) instead of replacing it.
   Web Animations only: no class is added, so a control's CSS animations (entrance motion) are never restarted.
   The one exception to "transform/opacity only": outline-offset and outline-color, paint only, no layout. */
const PRESSABLE =
  'button, [role="button"], a[data-nav], .go-btn, .play-btn, [data-door] .dmain, .room .item, [data-topics] .hl';
function pressFx(el: HTMLElement): void {
  const style = getComputedStyle(el);
  const color = style.getPropertyValue('--c').trim() || style.getPropertyValue('--link').trim() || 'currentColor';
  const timing = { duration: 300, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' };
  if (!reduceMotion()) {
    const big = el.getBoundingClientRect().width > 220;
    el.animate([{ scale: '1' }, { scale: big ? '0.98' : '0.94', offset: 0.35 }, { scale: '1' }], timing);
  }
  el.animate(
    [
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: color, outlineOffset: '0px' },
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'transparent', outlineOffset: reduceMotion() ? '0px' : '7px' },
    ],
    timing,
  );
}

document.addEventListener('click', (event) => {
  const el = (event.target as Element | null)?.closest<HTMLElement>(PRESSABLE);
  if (el && !(el as HTMLButtonElement).disabled) pressFx(el);
});

/* The three header tools get a move of their own on top (his pick, option A). */
function iconMove(btn: Element, frames: Keyframe[], duration: number): void {
  if (reduceMotion()) return;
  // the visible icon: the toggles keep both icons and hide one with CSS
  const svg = [...btn.querySelectorAll('svg')].find((s) => s.getClientRects().length > 0);
  svg?.animate(frames, { duration, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
}

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;

  const soundBtn = target?.closest<HTMLButtonElement>('[data-sound-toggle]');
  if (soundBtn) {
    sound.setSound(!sound.isSoundOn());
    syncSoundButton();
    // on: the speaker shakes as if it plays; off: it sinks and comes back
    iconMove(
      soundBtn,
      sound.isSoundOn()
        ? [{ rotate: '0deg' }, { rotate: '-14deg', scale: '1.2' }, { rotate: '10deg' }, { rotate: '-5deg' }, { rotate: '0deg', scale: '1' }]
        : [{ scale: '1' }, { scale: '0.7', opacity: 0.5 }, { scale: '1', opacity: 1 }],
      420,
    );
    return;
  }

  const themeBtn = target?.closest<HTMLButtonElement>('[data-theme-toggle]');
  if (themeBtn) {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // not remembered, still switched for this visit
    }
    syncThemeButton();
    // the new sun or moon turns in
    iconMove(themeBtn, [{ rotate: '-180deg', scale: '0.5', opacity: 0 }, { rotate: '0deg', scale: '1', opacity: 1 }], 480);
    return;
  }

  const diceBtn = target?.closest<HTMLButtonElement>('[data-dice]');
  if (diceBtn) rollDice(diceBtn);
});

/* Ukulele mode: the bar notes in the order G C E A, three times. This module lives across page swaps, so the
   sequence does too. The window opens after the last note has had time to ring. */
let barSequence = '';
let navigating = false;
let ukeWaiting = false;
const openUke = () => window.dispatchEvent(new Event('assaf:ukulele'));
document.addEventListener('astro:before-preparation', () => (navigating = true));
document.addEventListener('astro:page-load', () => {
  navigating = false;
  // the last note's page swap finished after the 700ms: open on the new page, or the window would be swapped away
  if (ukeWaiting) {
    ukeWaiting = false;
    openUke();
  }
});
function trackBar(navKey: string): void {
  const r = ukeStep(barSequence, navKey);
  barSequence = r.sequence;
  if (!r.done || !sound.isSoundOn()) return;
  setTimeout(() => {
    if (navigating) ukeWaiting = true;
    else openUke();
  }, 700);
}

/* Surprise me: a random project page (the list comes from the content, on the button), never the one open now. */
function rollDice(btn: HTMLButtonElement): void {
  if (btn.classList.contains('rolling')) return;
  const here = location.pathname.replace(/\/$/, '') || '/';
  let targets: string[] = [];
  try {
    targets = JSON.parse(btn.dataset.targets ?? '[]') as string[];
  } catch {
    return;
  }
  const choices = targets.filter((href) => href !== here);
  const pick = choices[Math.floor(Math.random() * choices.length)];
  if (!pick) return;
  sound.dice();
  if (reduceMotion()) {
    void navigate(pick);
    return;
  }
  btn.classList.add('rolling');
  const label = btn.querySelector('[data-dice-label]');
  if (label) label.textContent = 'Rolling...';
  setTimeout(() => void navigate(pick), 650);
}

function syncSoundButton(): void {
  document.querySelectorAll('[data-sound-toggle]').forEach((btn) => btn.setAttribute('aria-pressed', String(sound.isSoundOn())));
}

function syncThemeButton(): void {
  const light = document.documentElement.dataset.theme === 'light';
  document
    .querySelectorAll('[data-theme-toggle]')
    .forEach((btn) => btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode'));
}

/* The header shadow and smaller padding once the page scrolls. */
function syncStuck(): void {
  document.querySelector('.site-top')?.classList.toggle('stuck', scrollY > 4);
}
addEventListener('scroll', syncStuck, { passive: true });

/* Inside one door's room, moving between projects keeps the room still: no entrance animation for the columns,
   only a short fade on the project (his pick, #13 - "like About"). */
document.addEventListener('astro:before-swap', (e) => {
  const door = (path: string) => stripBase(path).split('/').filter(Boolean)[0] ?? '';
  const from = door(location.pathname);
  const to = door(e.to.pathname);
  if (from && from === to && ['music', 'games', 'apps'].includes(from)) e.newDocument.documentElement.classList.add('calm');
});

/* After every page swap the header is new markup: bring its state back. */
document.addEventListener('astro:page-load', () => {
  syncSoundButton();
  syncThemeButton();
  syncStuck();
});
