import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One image slot. Until the real file exists, it renders as a captioned placeholder. */
const shot = z.object({
  caption: z.string().min(3),
  /** the file name from the assets checklist, e.g. "chesslord-01.png" */
  file: z.string().regex(/^[a-z0-9-]+\.(jpg|png)$/),
  kind: z.enum(['photo', 'screen']),
  /** a video in src/assets/videos/ (#15); `file` is then its cover picture */
  video: z.string().regex(/^[a-z0-9-]+\.mp4$/).optional(),
});

/** A game inside the window: an embed page and the game's own size (sets the window's shape). */
const embed = z.object({ url: z.url(), width: z.number().int().positive(), height: z.number().int().positive() });

/** A project page: one Markdown file per project. The body is the "About" text (step 4). */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    door: z.enum(['music', 'games', 'apps']),
    /** position on the door page and in the home Peek list */
    order: z.number().int().positive(),
    /** the "Start here" project of its door: exactly one per door (checked on the home page) */
    featured: z.boolean().default(false),
    status: z.string(),
    state: z.enum(['live', 'dev', 'none']),
    made: z.string(),
    /** one line under the name; missing = still to write */
    summary: z.string().optional(),
    summaryTodo: z.string().optional(),
    link: z.object({ label: z.string(), url: z.url().optional() }).optional(),
    /** a management system with real data: screenshots only, never a live link */
    private: z.boolean().default(false),
    /** what Play opens: a game in a window, the Windows download page, a song player, or the app's own page (link.url) */
    play: z.enum(['window', 'download', 'song', 'app']).optional(),
    /** the game inside the window: an official embed page and the game's own size */
    embed: embed.optional(),
    /** a second Play button, for an extra playable version (ChessLord's early version) */
    demo: z.object({ label: z.string(), link: z.url(), embed }).optional(),
    /** the song in the player window (#19): a file in src/assets/audio/, the credit line and the lyrics
        (stanzas apart by a blank line) */
    song: z
      .object({ title: z.string(), file: z.string().regex(/^[a-z0-9-]+\.mp3$/), credit: z.string(), lyrics: z.string().optional() })
      .optional(),
    hero: shot,
    gallery: z.array(shot).default([]),
  }).refine((p) => p.summary || p.summaryTodo, { message: 'Give a summary, or a summaryTodo saying what to write' })
    .refine((p) => !(p.private && p.link?.url), { message: 'A private system must not link to the live system' })
    .refine((p) => !p.embed || p.play === 'window', { message: 'embed only makes sense with play: window' })
    .refine((p) => p.play !== 'app' || p.link?.url, { message: 'play: app opens link.url, so give one' })
    .refine((p) => !p.song || p.play === 'song', { message: 'song only makes sense with play: song' }),
});

export const collections = { projects };
