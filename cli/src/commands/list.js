import chalk from 'chalk';
import Table from 'cli-table3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import {
  categoryEmoji,
  categoryLabel,
  formatArticleRow,
} from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Load dashboard-articles.json from the API path.
 */
function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Sort articles by a given field.
 */
function sortArticles(articles, field) {
  return [...articles].sort((a, b) => {
    switch (field) {
      case 'date':
        return (b.date || '').localeCompare(a.date || '');
      case 'words':
        return (b.words || 0) - (a.words || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
    }
  });
}

/**
 * Show a summary table of all categories.
 */
function showCategories(articles) {
  const categoryMap = new Map();

  for (const article of articles) {
    const cat = article.category || 'other';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { count: 0, reviewed: 0, latestDate: '' });
    }
    const entry = categoryMap.get(cat);
    entry.count++;
    if (article.humanReviewed || article.human_reviewed) entry.reviewed++;
    const date = article.date || '';
    if (date > entry.latestDate) entry.latestDate = date;
  }

  const table = new Table({
    head: [
      chalk.gray('分類'),
      chalk.gray('文章數'),
      chalk.gray('審閱率'),
      chalk.gray('最新日期'),
    ],
    style: { head: [], border: [] },
  });

  for (const [cat, data] of [...categoryMap.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )) {
    const emoji = categoryEmoji[cat] || '📄';
    const label = categoryLabel[cat] || cat;
    const reviewPct =
      data.count > 0 ? Math.round((data.reviewed / data.count) * 100) : 0;
    const pctColor =
      reviewPct >= 80
        ? chalk.green
        : reviewPct >= 50
          ? chalk.yellow
          : chalk.red;

    table.push([
      `${emoji} ${label}`,
      chalk.white(String(data.count)),
      pctColor(`${reviewPct}%`),
      chalk.gray(data.latestDate || '—'),
    ]);
  }

  console.log(chalk.bold('\n  📂 所有分類\n'));
  console.log(table.toString());
  console.log(chalk.gray(`\n  💡 ethiopiamd list <category>  →  瀏覽分類文章\n`));
}

/**
 * Show articles in a specific category.
 */
function showArticlesTable(articles, category) {
  const emoji = categoryEmoji[category] || '📄';
  const label = categoryLabel[category] || category;

  console.log(
    chalk.bold(
      `\n  ${emoji} ${label} — ${chalk.green(articles.length)} 篇文章\n`,
    ),
  );

  const table = new Table({
    head: [
      chalk.gray('#'),
      chalk.gray('標題'),
      chalk.gray('字數'),
      chalk.gray('日期'),
      chalk.gray('狀態'),
    ],
    style: { head: [], border: [] },
    colWidths: [5, 40, 10, 14, 10],
    wordWrap: true,
  });

  articles.forEach((article, i) => {
    const reviewed =
      article.humanReviewed || article.human_reviewed
        ? chalk.green('✓ 審閱')
        : chalk.gray('—');
    const featured = article.featured ? chalk.yellow(' ★') : '';

    table.push([
      chalk.gray(String(i + 1)),
      chalk.white(article.title || '—') + featured,
      chalk.dim(String(article.words || '—')),
      chalk.gray(article.date || '—'),
      reviewed,
    ]);
  });

  console.log(table.toString());
  console.log(chalk.gray(`\n  💡 ethiopiamd read <slug>  →  閱讀全文\n`));
}

export function listCommand(program) {
  program
    .command('list [category]')
    .description('List articles by category')
    .option('--categories', 'List all categories')
    .option('-s, --sort <field>', 'Sort by: date, words, title', 'date')
    .option('--reviewed', 'Only human-reviewed')
    .option('--featured', 'Only featured')
    .option('--json', 'Output as JSON')
    .action(async (category, opts) => {
      try {
        await ensureData();
        const data = loadArticles();
        let articles = Array.isArray(data) ? data : data.articles || [];

        // Show categories summary
        if (opts.categories || !category) {
          if (opts.categories) {
            showCategories(articles);
            return;
          }
          // No category specified: show categories overview
          showCategories(articles);
          return;
        }

        // Filter by category
        articles = articles.filter(
          (a) => (a.category || '').toLowerCase() === category.toLowerCase(),
        );

        // Apply filters
        if (opts.reviewed) {
          articles = articles.filter(
            (a) => a.humanReviewed || a.human_reviewed,
          );
        }
        if (opts.featured) {
          articles = articles.filter((a) => a.featured);
        }

        // Sort
        articles = sortArticles(articles, opts.sort);

        if (articles.length === 0) {
          console.log(chalk.yellow(`\n  找不到分類「${category}」的文章。\n`));
          console.log(
            chalk.gray('  💡 ethiopiamd list --categories  →  查看所有分類\n'),
          );
          return;
        }

        // JSON output
        if (opts.json) {
          console.log(JSON.stringify(articles, null, 2));
          return;
        }

        showArticlesTable(articles, category);
      } catch (err) {
        console.error(chalk.red(`載入失敗: ${err.message}`));
        console.log(chalk.gray('\n  💡 請先執行 ethiopiamd sync 同步知識庫。\n'));
        process.exit(1);
      }
    });
}
