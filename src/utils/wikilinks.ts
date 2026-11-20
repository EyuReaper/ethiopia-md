// Resolves [[slug]] / [[slug|label]] wikilinks in article bodies to real links.
// Targets resolve within the page's own language tree (knowledge/ for am,
// knowledge/en/ for en) so an English article never links into Amharic pages.
// Only published articles resolve; anything else renders as bold text.
import { readdirSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import matter from 'gray-matter';

type Lang = 'am' | 'en';
type Target = { title: string; url: string };

const cache = new Map<Lang, Map<string, Target>>();

export function buildWikilinkMap(
  lang: Lang,
  categoryMapping: Record<string, string>,
): Map<string, Target> {
  const cached = cache.get(lang);
  if (cached) return cached;

  const map = new Map<string, Target>();
  const root = resolve(
    process.cwd(),
    'knowledge',
    ...(lang === 'en' ? ['en'] : []),
  );
  const prefix = lang === 'en' ? '/en' : '';

  for (const [catSlug, folder] of Object.entries(categoryMapping)) {
    let files: string[];
    try {
      files = readdirSync(join(root, folder));
    } catch {
      continue;
    }
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const name = basename(file, '.md');
      let data: Record<string, unknown>;
      try {
        data = matter(readFileSync(join(root, folder, file), 'utf-8')).data;
      } catch {
        continue;
      }
      if (data.status === 'draft' || data.status === 'archived') continue;
      const title =
        typeof data.title === 'string' && data.title ? data.title : name;
      // Hubs (`_History Hub.md`) are rendered as the category index page.
      const url = name.startsWith('_')
        ? `${prefix}/${catSlug}`
        : `${prefix}/${catSlug}/${encodeURIComponent(name)}`;
      map.set(name, { title, url });
    }
  }

  cache.set(lang, map);
  return map;
}

export function resolveWikilinks(md: string, map: Map<string, Target>): string {
  if (!md) return md;
  return md.replace(
    /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g,
    (_, rawTarget: string, display?: string) => {
      const target = rawTarget.trim();
      const hit = map.get(target);
      const label = (display || hit?.title || target).replace(/[[\]]/g, '');
      return hit ? `[${label}](${hit.url})` : `**${label}**`;
    },
  );
}
