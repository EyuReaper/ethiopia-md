import chalk from 'chalk';
import Table from 'cli-table3';
import { searchArticles } from '../lib/search.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';
import { SUPPORTED_LANGS, isSupportedLang } from '../lib/knowledge.js';

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
    .description('Search published Ethiopia.md articles (Amharic by default)')
    .option('-l, --limit <n>', 'Maximum number of results', '10')
    .option('--lang <lang>', `Language: ${SUPPORTED_LANGS.join(' or ')}`, 'am')
    .option('--en', 'Search the English translations (shorthand for --lang en)')
    .option('--json', 'Output as JSON')
    .action(async (query, opts) => {
      try {
        const lang = opts.en ? 'en' : opts.lang;
        if (!isSupportedLang(lang)) {
          console.error(
            chalk.red(
              `Unsupported language "${lang}". Use: ${SUPPORTED_LANGS.join(', ')}.`,
            ),
          );
          process.exit(1);
        }

        await ensureData();
        const limit = parseInt(opts.limit, 10) || 10;
        const results = await searchArticles(query, { limit, lang });

        if (!results || results.length === 0) {
          console.log(
            chalk.yellow(`\n  No published articles match "${query}".\n`),
          );
          console.log(
            chalk.gray(
              '  Try other keywords, or run "ethiopiamd list" to browse by category.\n',
            ),
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
            `\n  Results for "${chalk.cyan(query)}": ${chalk.green(results.length)} article(s)\n`,
          ),
        );

        const table = new Table({
          head: [
            chalk.gray('#'),
            chalk.gray('Category'),
            chalk.gray('Title'),
            chalk.gray('Relevance'),
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
        console.log(
          chalk.gray(`\n  Read an article: ethiopiamd read <slug>\n`),
        );
      } catch (err) {
        console.error(chalk.red(`Search failed: ${err.message}`));
        process.exit(1);
      }
    });
}
