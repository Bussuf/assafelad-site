/*
 * Site-wide behavior. A bundled module runs once; the ClientRouter keeps this document alive between
 * pages, so the listeners below stay, and a note started by a click is not cut by the navigation.
 */
import { navigate } from 'astro:transitions/client';
import * as sound from '../lib/sound';
import { NAV } from '../lib/nav';

const THEME_KEY = 'assaf-theme';
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Every button and link makes a sound; the wood tap unless it has its own (data-sound). */
document.addEventListener(
  'click',
  (event) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('a, button, [role="button"]');
    if (!el || el.hasAttribute('data-sound-toggle') || el.hasAttribute('data-dice')) return;
    const kind = el.dataset.sound;
    if (kind === 'chord') sound.chord();
    else if (kind === 'low') sound.tapLow();
    else if (kind === 'none') return;
    else if (kind && kind in sound.NOTES) sound.note(kind as sound.NoteName);
    else sound.tap();
  },
  { capture: true },
);

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;

  const soundBtn = target?.closest<HTMLButtonElement>('[data-sound-toggle]');
  if (soundBtn) {
    sound.setSound(!sound.isSoundOn());
    syncSoundButton();
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
    return;
  }

  const diceBtn = target?.closest<HTMLButtonElement>('[data-dice]');
  if (diceBtn) rollDice(diceBtn);
});

/* Surprise me: until the projects exist (step 4) it opens a random other page. */
function rollDice(btn: HTMLButtonElement): void {
  if (btn.classList.contains('rolling')) return;
  const here = location.pathname.replace(/\/$/, '') || '/';
  const choices = NAV.map((item) => item.href).filter((href) => href !== here);
  const pick = choices[Math.floor(Math.random() * choices.length)] ?? '/';
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

/* After every page swap the header is new markup: bring its state back. */
document.addEventListener('astro:page-load', () => {
  syncSoundButton();
  syncThemeButton();
  syncStuck();
});
