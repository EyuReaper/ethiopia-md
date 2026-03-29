/**
 * ethiopiamd graph <slug> — 文章關聯圖
 *
 * Extracts [[wikilinks]] from an article and draws a radial ASCII graph.
 */

import chalk from 'chalk';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  getArticleFiles,
  readArticle,
  getKnowledgePath,
} from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Extract [[wikilinks]] from markdown body.
 * Returns array of link targets (title strings, no brackets).
 */
function extractWikilinks(body) {
  if (!body) return [];
  const regex = /\[\[([^\]|#]+?)(?:\|[^\]]+?)?\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(body)) !== null) {
    const target = match[1].trim();
    if (target) links.push(target);
  }
  // Deduplicate
  return [...new Set(links)];
}

/**
 * Find an article by slug or title match.
 * Returns the readArticle result or null.
 */
function findArticleData(slugOrTitle, articleFiles) {
  const q = slugOrTitle.toLowerCase().replace(/[\s_]+/g, '-');

  for (const fp of articleFiles) {
    const base = fp.split('/').pop().replace(/\.md$/i, '');
    const baseNorm = base.toLowerCase().replace(/[\s_]+/g, '-');
    if (baseNorm === q || base === slugOrTitle) {
      return readArticle(fp);
    }
  }

  // Fuzzy: filename includes query or vice versa
  for (const fp of articleFiles) {
    const base = fp.split('/').pop().replace(/\.md$/i, '').toLowerCase();
    if (base.includes(q) || q.includes(base)) {
      return readArticle(fp);
    }
  }

  // Title match
  for (const fp of articleFiles) {
    try {
      const a = readArticle(fp);
      if (a && a.frontmatter && a.frontmatter.title) {
        const titleNorm = a.frontmatter.title
          .toLowerCase()
          .replace(/[\s_]+/g, '-');
        if (titleNorm.includes(q) || q.includes(titleNorm)) {
          return a;
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Look up category info for a wikilink target.
 * Returns { title, category, emoji, label } or a fallback.
 */
function lookupLinked(linkTarget, articleFiles) {
  const q = linkTarget.toLowerCase().replace(/[\s_]+/g, '-');

  for (const fp of articleFiles) {
    const base = fp.split('/').pop().replace(/\.md$/i, '');
    if (
      base === linkTarget ||
      base.toLowerCase().replace(/[\s_]+/g, '-') === q ||
      base.toLowerCase().includes(q) ||
      q.includes(base.toLowerCase())
    ) {
      try {
        const a = readArticle(fp);
        if (a && a.frontmatter) {
          const cat = (a.frontmatter.category || 'misc').toLowerCase();
          return {
            title: a.frontmatter.title || base,
            category: cat,
            emoji: categoryEmoji[cat] || '📄',
            label: categoryLabel[cat] || cat,
          };
        }
      } catch {}
    }
  }

  // Not found — return placeholder
  return {
    title: linkTarget,
    category: 'misc',
    emoji: '📄',
    label: '?',
  };
}

/**
 * Draw a radial ASCII relationship graph.
 *
 *              ┌─ emoji title
 *              │
 *   center ───┼─ emoji title
 *              │
 *              └─ emoji title
 */
function drawGraph(centerTitle, centerCat, links) {
  const centerEmoji = categoryEmoji[centerCat] || '📄';
  const centerLabel = chalk.bold.cyan(`${centerEmoji} ${centerTitle}`);
  const pad = '  ';

  if (links.length === 0) {
    console.log('');
    console.log(`${pad}${centerLabel}`);
    console.log('');
    console.log(chalk.gray('  (無 [[wikilink]] 關聯)'));
    return;
  }

  // Build right-side lines (one entry per link, with separators between)
  // rightLines[i] = { text, isLink } — isLink marks it as a branch line
  const rightLines = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const isFirst = i === 0;
    const isLast = i === links.length - 1;
    const isSingle = links.length === 1;
    const linkStr = `${link.emoji} ${chalk.white(link.title)} ${chalk.dim('[' + link.label + ']')}`;

    if (isSingle) {
      rightLines.push({
        text: `──── ${linkStr}`,
        isLink: true,
        isSingle: true,
      });
    } else if (isFirst) {
      rightLines.push({ text: `┌─ ${linkStr}`, isLink: true });
      rightLines.push({ text: '│', isLink: false });
    } else if (isLast) {
      rightLines.push({ text: `└─ ${linkStr}`, isLink: true });
    } else {
      rightLines.push({ text: `├─ ${linkStr}`, isLink: true });
      rightLines.push({ text: '│', isLink: false });
    }
  }

  // Find the middle *link* line (skip separator │ lines)
  const linkLineIdxs = rightLines.reduce((acc, r, i) => {
    if (r.isLink) acc.push(i);
    return acc;
  }, []);
  const midLinkPos = Math.floor((linkLineIdxs.length - 1) / 2);
  const centerRowIdx = links.length === 1 ? 0 : linkLineIdxs[midLinkPos];

  console.log('');
  for (let i = 0; i < rightLines.length; i++) {
    const r = rightLines[i];
    if (i === centerRowIdx) {
      // This line gets the center label
      if (r.isSingle) {
        console.log(`${pad}${centerLabel} ${r.text}`);
      } else {
        // Replace branch char with ┤ (continuation from center)
        const junction = r.text.startsWith('┌')
          ? '┬'
          : r.text.startsWith('├')
            ? '┤'
            : r.text.startsWith('└')
              ? '┴'
              : '─';
        const rest = r.text.slice(2); // strip "┌─ " etc → keep title
        console.log(`${pad}${centerLabel} ─${junction}─ ${rest}`);
      }
    } else {
      console.log(`${pad}           ${r.text}`);
    }
  }
  console.log('');
}

export function graphCommand(program) {
  program
    .command('graph <slug>')
    .description('顯示文章的 [[wikilink]] 關聯圖')
    .action(async (slug) => {
      try {
        await ensureData();
        const articleFiles = getArticleFiles();

        if (!articleFiles || articleFiles.length === 0) {
          console.log(chalk.yellow('\n  找不到文章，請先執行 ethiopiamd sync\n'));
          return;
        }

        // Find the main article
        const article = findArticleData(slug, articleFiles);

        if (!article) {
          console.log(chalk.yellow(`\n  找不到文章「${slug}」\n`));
          console.log(chalk.gray('  💡 試試搜尋:'));
          console.log(chalk.cyan(`  ethiopiamd search ${slug}\n`));
          return;
        }

        const fm = article.frontmatter;
        const centerTitle = fm.title || slug;
        const centerCat = (fm.category || 'misc').toLowerCase();

        // Extract wikilinks
        const wikilinkTargets = extractWikilinks(article.body || '');

        console.log('');
        console.log(chalk.bold(`  🕸️  ${centerTitle} 的關聯圖`));
        console.log(chalk.gray('  ' + '─'.repeat(50)));

        if (wikilinkTargets.length === 0) {
          const centerEmoji = categoryEmoji[centerCat] || '📄';
          console.log('');
          console.log(`  ${centerEmoji} ${chalk.bold.cyan(centerTitle)}`);
          console.log('');
          console.log(chalk.gray('  (此文章沒有 [[wikilink]] 關聯)'));
          console.log('');
          return;
        }

        // Resolve each wikilink to category + title
        const links = wikilinkTargets.map((target) =>
          lookupLinked(target, articleFiles),
        );

        // Draw the graph
        drawGraph(centerTitle, centerCat, links);

        console.log(chalk.dim(`  共 ${links.length} 個關聯文章\n`));
      } catch (err) {
        console.error(chalk.red(`graph 失敗: ${err.message}`));
        process.exit(1);
      }
    });
}
