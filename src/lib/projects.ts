import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './nav';

export type Project = CollectionEntry<'projects'>;
export type DoorKey = Project['data']['door'];

/** All projects, in their door order. */
export async function allProjects(): Promise<Project[]> {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}

export async function projectsOf(door: DoorKey): Promise<Project[]> {
  return (await allProjects()).filter((p) => p.data.door === door);
}

/** "/games/chesslord": the door path, then the file name. */
export const projectHref = (p: Project): string => withBase(`/${p.data.door}/${p.id}`);

/** The count line on the home doors and the door pages. */
export function countLine(door: DoorKey, items: Project[]): string {
  const n = items.length;
  if (door === 'games') return `${n} games, ${items.filter((p) => p.data.play && p.data.play !== 'song').length} playable`;
  if (door === 'music') return `${n} pages, ${items.filter((p) => p.data.state === 'live').length} active`;
  return `${n} projects, ${items.filter((p) => p.data.private).length} private systems`;
}

export function playLabel(p: Project): string {
  if (p.data.play === 'song') return 'Play a song';
  if (p.data.play === 'download') return 'Download (Windows)';
  return 'Play now';
}

/** lang="he" for Hebrew names (the band), so screen readers switch voice. */
export const langOf = (s: string): 'he' | undefined => (/[֐-׿]/.test(s) ? 'he' : undefined);
