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
