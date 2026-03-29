// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import remarkWikilinks from './plugins/remark-wikilinks.mjs';

export default defineConfig({
  site: 'https://ethiopia.md',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Customize priority and changefreq for different pages
      customPages: [
        'https://ethiopia.md/?changefreq=daily&priority=1.0',
        'https://ethiopia.md/en?changefreq=daily&priority=1.0',
      ],
      i18n: {
        defaultLocale: 'am',
        locales: {
          'am': 'am',
          en: 'en',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'am',
    locales: ['am', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    remarkPlugins: [remarkWikilinks],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank', rel: ['noopener', 'noreferrer'] },
      ],
    ],
  },
});
