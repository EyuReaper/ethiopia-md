import chalk from 'chalk';
import Table from 'cli-table3';
import { searchArticles } from '../lib/search.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Build a visual score bar (8 chars wide).
 * @param {number} score - The article's search score.
 * @param {number} maxScore - The highest score in the result set.
 * @returns {string} A bar like "█████░░░"
 */
function scoreBar(score, maxScore) {
  const width = 8;
  const filled = Math.round((score / maxScore) * width);
  const empty = width - filled;
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

export function searchCommand(program) {
  program
    .command('search <query>')
    .description('Search Ethiopia.md knowledge base')
    .option('-l, --limit <n>', 'Max results', '10')
    .option('--lang <lang>', 'Language', 'am')
    .option('--json', 'Output as JSON')
    .action(async (query, opts) => {
      try {
        await ensureData();
        const limit = parseInt(opts.limit, 10) || 10;
        const results = await searchArticles(query, { limit, lang: opts.lang });

        if (!results || results.length === 0) {
          console.log(chalk.yellow(`\n  🔍 搜尋「${query}」— 找到 0 篇\n`));
          console.log(
            chalk.gray('  試試其他關鍵字，或用 ethiopiamd list 瀏覽所有文章。\n'),
          );
          return;
        }

        if (opts.json) {
          console.log(JSON.stringify(results, null, 2));
          return;
        }

        const maxScore = Math.max(...results.map((r) => r.score || 1));

        console.log(
          chalk.bold(
            `\n  🔍 搜尋「${chalk.cyan(query)}」— 找到 ${chalk.green(results.length)} 篇\n`,
          ),
        );

        const table = new Table({
          head: [
            chalk.gray('#'),
            chalk.gray('分類'),
            chalk.gray('標題'),
            chalk.gray('相關度'),
          ],
          chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '  ',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
            middle: ' │ ',
          },
          style: { 'padding-left': 0, 'padding-right': 0 },
        });

        results.forEach((article, i) => {
          const cat = article.category || '';
          const emoji = categoryEmoji[cat] || '📄';
          const label = categoryLabel[cat] || cat;
          const title = article.title || article.id || '';
          const score = article.score || 0;

          table.push([
            chalk.gray(String(i + 1)),
            `${emoji} ${chalk.dim(label)}`,
            chalk.white(title),
            scoreBar(score, maxScore),
          ]);
        });

        console.log(table.toString());
        console.log(chalk.gray(`\n  💡 ethiopiamd read <slug>  →  閱讀全文\n`));
      } catch (err) {
        console.error(chalk.red(`搜尋失敗: ${err.message}`));
        process.exit(1);
      }
    });
}
