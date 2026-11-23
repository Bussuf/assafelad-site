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

/* Interaction standard (CLAUDE.md, his definitions). The kinds live here, once:
   - BUTTON: takes a click and changes navigation or the UI. Press = sinks on pointerdown and stays down while held;
     release = springs back and a highlight ring (the control's own outline) grows out and fades.
   - TEXT: a text link (header tabs, footer, links in a sentence). Its own press: a short underline drawn from the center.
   Web Animations only: no class is added, so a control's CSS animations (entrance motion) never restart.
   `scale`, not `transform`, so it adds to a control's own lift (the Hotbar slot).
   The one exception to "transform/opacity only": outline and the underline's background-size, paint only. */
const BUTTON =
  'button, [role="button"], .hotbar a, .go-btn, .play-btn, [data-door] .dmain, .room .item, [data-topics] .hl, .pg';
const TEXT = 'header nav a[data-nav], .logo-link, footer a, .text-link, .door-title';
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

const colorOf = (el: Element): string => {
  const style = getComputedStyle(el);
  return style.getPropertyValue('--c').trim() || style.getPropertyValue('--link').trim() || 'currentColor';
};
const isWide = (el: Element) => el.getBoundingClientRect().width > 220;

const held = new WeakMap<HTMLElement, Animation>();
function sink(el: HTMLElement): void {
  if (reduceMotion()) return;
  held.get(el)?.cancel();
  held.set(el, el.animate([{ scale: '1' }, { scale: isWide(el) ? '0.98' : '0.94' }], { duration: 110, easing: 'ease-out', fill: 'forwards' }));
}
function release(el: HTMLElement): void {
  const down = held.get(el);
  held.delete(el);
  if (!reduceMotion()) {
    const from = down ? String(getComputedStyle(el).scale === 'none' ? 1 : getComputedStyle(el).scale) : '1';
    down?.cancel();
    el.animate([{ scale: from }, { scale: isWide(el) ? '1.01' : '1.04', offset: 0.55 }, { scale: '1' }], { duration: 300, easing: EASE });
  }
  el.animate(
    [
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: colorOf(el), outlineOffset: '0px' },
      { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: 'transparent', outlineOffset: reduceMotion() ? '0px' : '7px' },
    ],
    { duration: 300, easing: EASE },
  );
}
function underline(el: HTMLElement): void {
  const line = `linear-gradient(${colorOf(el)}, ${colorOf(el)})`;
  const base = { backgroundImage: line, backgroundRepeat: 'no-repeat', backgroundPosition: '50% 100%' };
  el.animate(
    [
      { ...base, backgroundSize: '0% 2px', opacity: 1 },
      { ...base, backgroundSize: '100% 2px', offset: 0.6 },
      { ...base, backgroundSize: '100% 2px', opacity: 1 },
    ],
    { duration: reduceMotion() ? 150 : 300, easing: EASE },
  );
}

const usable = (el: HTMLElement | null): el is HTMLElement => !!el && !(el as HTMLButtonElement).disabled;
document.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  const target = e.target as Element;
  const btn = target.closest<HTMLElement>(BUTTON);
  if (usable(btn)) return sink(btn);
  const text = target.closest<HTMLElement>(TEXT);
  if (text) underline(text);
});
const letGo = (e: PointerEvent) => {
  const btn = (e.target as Element).closest<HTMLElement>(BUTTON);
  if (btn && held.has(btn)) release(btn);
};
document.addEventListener('pointerup', letGo);
// a finger that slides away (a scroll) puts the button back quietly, without the ring
document.addEventListener('pointercancel', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>(BUTTON);
  const down = btn && held.get(btn);
  if (down) {
    down.cancel();
    held.delete(btn);
  }
});
// keyboard (Enter / Space) has no pointer: the whole press on click
document.addEventListener('click', (e) => {
  if (e.detail !== 0) return;
  const target = e.target as Element;
  const btn = target.closest<HTMLElement>(BUTTON);
  if (usable(btn)) release(btn);
  else {
    const text = target.closest<HTMLElement>(TEXT);
    if (text) underline(text);
  }
});

/* A link that opens a page here waits 200ms, so its press is seen before the page swaps (prefetch made the
   swap instant and cut the effect). Capture on window: runs before the ClientRouter, which skips prevented clicks. */
addEventListener(
  'click',
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-back-top')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    if (url.href === location.href) return;
    e.preventDefault();
    setTimeout(() => void navigate(url.href), 200);
  },
  { capture: true },
);

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
