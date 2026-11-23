# assafelad.com - project rules

Layer 2 for this project (`F:\Projects\Web` has no domain CLAUDE.md). `C:\Users\Owner\.claude\CLAUDE.md` applies in full; this file narrows or widens it only where it says so.

## What this is
- Assaf's personal site, assafelad.com. Theme: PLAY (music, games he made, apps he built). For him, not for clients.
- Static site: Astro + TypeScript (strict) + Tailwind v4 (via `@tailwindcss/vite`). No server, no database.
- Hosting: GitHub Pages from a **public** repo. Domain stays at Site123 until step 8.
- Drive task: **#86** in `G:\My Drive\BACKLOG.md`. Build tasks use the local numbers in `BACKLOG.md` here.

## Sources of truth
| What | Where |
|---|---|
| Design, copy, humor, sound, ukulele mode | Final mockup v7: https://claude.ai/artifact/KxXpNeNGDPTcHRSRJkJ244 (read with Artifact read). Its code is a prototype, not code to copy |
| Design-phase decisions (frozen) | `G:\My Drive\08 פרויקטים אישיים\אתר אישי\מיצוב ומצב טכני.md`, sections 4-5 |
| Projects picked | `G:\My Drive\08 פרויקטים אישיים\אתר אישי\מלאי פרויקטים.md` |
| Assets and texts checklist | `G:\My Drive\08 פרויקטים אישיים\אתר אישי\נכסים וטקסטים לאתר - v3.xlsx` (photo hunt, #16), generated from the site's content files by a script he runs. Older versions are not used. Claude never writes it |
| Build state and new decisions | `BACKLOG.md` here |

## Public repo rules
- No secrets, no phone number, no personal data in the repo.
- Private systems (music-studio, Vilakula OS) appear only as blurred screenshots.
- Client names (AI rollouts) only with their approval; otherwise "two law firms".

## Language
- The site is English and LTR. The Hebrew band name goes inside `<bdi lang="he">` (השכנים (The Neighbors)).
- Replies to Assaf in Hebrew. Code, commands and identifiers in English.

## Design rules (from v7)
- Dark by default, light toggle, remembered per visitor, no flash on load.
- Font: Rubik through Astro's built-in Fonts API (`fontProviders.fontsource()`, latin + hebrew, variable 400-800). Files are downloaded at build time and served from the site itself: no Google Fonts link, no font package. The build needs internet.
- Theme: always dark on the first visit (the OS setting is ignored), light only by the toggle.
- Colors: the v7 tokens (paper/raise/cloud/ink/soft/rule + sun/berry/sky/grass/plum). Door colors: Music berry, Games sun, Apps sky, About plum.
- Nav: desktop = tabs in a sticky header; phone = bottom Hotbar. No breadcrumbs. No sideways scroll on phone.
- Motion: varied entrance motion once per view, transform/opacity only, no `transition: all`. Hover effects only under `(hover: hover) and (pointer: fine)`. Honor `prefers-reduced-motion`.
- Astro ClientRouter (view transitions), so nav notes are not cut by page loads and the ukulele sequence survives navigation. Every page opens at its top.
- Accessibility: full keyboard use, visible focus, `<dialog>` for the game window and ukulele.

## Interaction standard (his rule, 2026-11-23: one look on every page, phone and computer)
Every element is one of three kinds (his definitions). The list of which elements belong to which kind lives in ONE place in code (`src/scripts/ui.ts` + `src/styles/global.css`); a component never invents its own.

| Kind | What (his words) | Examples |
|---|---|---|
| Button | Anything that takes a click and changes navigation or the UI, also when it sits inside a card | header tools, Hotbar slots, Play, Close, Peek, gallery arrows and thumbnails, Previous/Next, "Open ...", "All topics", doors, room project list, About topics, About project rows |
| Card | Shows information only, not clickable | the project info box, About topic panels, Steam library rows, the banner caption |
| Text | A text link, like the header tabs, the footer links, links inside a sentence | header tabs (Music Games Apps About), footer, "Where to see it" |

| State | Button | Card | Text |
|---|---|---|---|
| Hover (real pointer only) | door-color border + soft fill (14%). A picture button comes to full strength instead of a fill | a soft highlight (border to the door color) | very, very subtle: the text moves a little toward the door color |
| Press (pointerdown) | sinks (scale 0.94; 0.98 for wide ones) and stays down while held | - | its own effect, not the button's: a quick underline that draws out from the center |
| Release (pointerup) | springs back, and the highlight ring grows out of it (outline 0 to 7px) and fades | - | - |
| Selected | door-color border + soft fill + its mark leans in (icon tilt / chevron nudge). Picture buttons: border + the others at 72% | - | the nav mark below |
| Focus (keyboard) | the visible focus ring | - | the visible focus ring |

Navigation keeps its own "where you are" mark (Hotbar: lifted + ring; header tabs: underline), not the card style.

Timing tokens (do not invent others): press 300ms; color/fill change 150ms; icon move 200ms; auto-scroll after a press waits 160ms; a link that opens a page waits 200ms so the press is seen; a content fade after a scroll 180ms. Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
Rules: never two motions on the same thing at once (press, then scroll, then content); no motion longer than 400ms on a tap; `prefers-reduced-motion` keeps only the fade of the ring. Android's own tap highlight stays off.

## Sound rules (final)
| Action | Sound |
|---|---|
| Default | Off; the speaker toggle is remembered. Sounds only on clicks, never autoplay |
| Every button | Wood tap, slightly different each press, unless it has its own sound |
| Close / back | Low wood tap |
| Bar (tabs, Hotbar, logo) | Music C4, Games E4, Apps G4, About A4; Home = rolled C chord |
| Surprise me (dice) | Ticks, ending on B4 |
| Sound on / off | Ta-da / silent |
| Game window | Chord |
| Then/Now (not a button) | Magic chime: up on reveal, softer down on leave |
| Ukulele mode | With sound on: Apps, Music, Games, About three times in a row (G C E A) |
Sounds are synthesized with Web Audio (no library) until Assaf supplies recordings.

## Phone mode (widens the global terminal rule, his approval 2026-11-23)
For days he works from his phone through Remote Control.
- On only when he writes "מצב טלפון", for that session only. Off when he writes "סוף מצב טלפון" or the session ends.
- Allowed to Claude while on: `npm run check`, `npm run build`, `npm run test`, then `git add` + `git commit` + `git push` to `main` of this repo only, and only when check and build are clean.
- Still not allowed: installing or removing packages, deleting or moving files, anything outside this repo, secrets, settings.
- Before every push: show the list of files and the commit message, and wait for "יאללה push" from him. That is his explicit approval, per push.
- After every push: report the message, the files, and what to look at on the live site.

## Terminal and checks
- Assaf runs every command that writes, installs, builds or commits (global rule, not widened here).
- Dev server: `npm run dev` at http://localhost:4321. Stop it before installing or removing packages.
- Checks before handing off a step: `npm run check` and `npm run build`, both clean (no warnings).
- Claude may check localhost in the built-in browser without asking (global exception).

## Packages and files
| Package | Why |
|---|---|
| `astro` | The framework |
| `tailwindcss`, `@tailwindcss/vite` | Styling (Tailwind v4) |
| `typescript`, `@astrojs/check` | `npm run check` |
| `vitest` (dev) | `npm run test`: logic tests (banner countdown; later the ukulele sequence) |
| `@astrojs/sitemap` | Approved, installed only in step 6 |
No other package, and no new file, without explaining why and getting approval.

## Deleting
- Claude never deletes. "Delete" = move to `F:\Projects\Web\_Moved` (outside the repo). Assaf deletes.

## Git
- Default branch `main`. Conventional messages with local backlog ids: `feat(#3): ...`, `fix(#4): ...`, `chore: ...`, `docs: ...`.
- Claude may commit and push only when every staged change is a `.md` file (global rule). Everything else Assaf commits.

## Working mode
- coding-partner (Writer mode) + backlog-manager. No code before an approved spec and an explicit go-ahead.
