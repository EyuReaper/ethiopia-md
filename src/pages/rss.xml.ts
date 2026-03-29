import rss from '@astrojs/rss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(context) {
  // [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context]
  const knowledgeDir = path.join(process.cwd(), 'knowledge');
  const articles = [];

  // [Amharic translation needed - original Taiwan context]
  function scanDir(dir, category = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (
        stat.isDirectory() &&
        !file.startsWith('_') &&
        file !== 'en' &&
        file !== 'about'
      ) {
        scanDir(full, file);
      } else if (file.endsWith('.md') && !file.startsWith('_')) {
        try {
          const content = fs.readFileSync(full, 'utf-8');
          const { data } = matter(content);
          if (data.title) {
            articles.push({
              title: data.title,
              description: data.description || '',
              pubDate: data.date ? new Date(data.date) : new Date(),
              link: `/${(data.category || category).toLowerCase()}/${file.replace('.md', '')}`,
              category: data.category || category,
            });
          }
        } catch {
          // YAML parse error, skip this file
        }
      }
    }
  }

  scanDir(knowledgeDir);

  // [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] 50 [Amharic translation needed - original Taiwan context]
  articles.sort((a, b) => b.pubDate - a.pubDate);

  return rss({
    title: 'Ethiopia.md — [Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]',
    description: '[Amharic translation needed - original Taiwan context] Markdown [Amharic translation needed - original Taiwan context]Ethiopia，[Amharic translation needed - original Taiwan context]',
    site: context.site || 'https://ethiopia.md',
    items: articles.slice(0, 50),
    customData: '<language>am</language>',
  });
}
