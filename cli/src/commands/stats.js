import chalk from 'chalk';
import Table from 'cli-table3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Load a JSON file from the API path.
 */
function loadJson(filename) {
  const apiPath = getApiPath();
  const filePath = join(apiPath, filename);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Get a colored score string based on value (0-100 scale).
 */
function colorScore(score) {
  const num = typeof score === 'number' ? score : parseFloat(score) || 0;
  if (num >= 80) return chalk.green(num.toFixed(1));
  if (num >= 50) return chalk.yellow(num.toFixed(1));
  return chalk.red(num.toFixed(1));
}

/**
 * Get an emoji for an organism organ.
 */
function getOrganDisplay(organ) {
  // Use emoji from the JSON data itself
  return organ.emoji || '🔬';
}

export function statsCommand(program) {
  program
    .command('stats')
    .description('Show Ethiopia.md project statistics')
    .option('--json', 'Output as JSON')
    .action(async (opts) => {
      try {
        await ensureData();
        let vitals, organism;

        try {
          vitals = loadJson('dashboard-vitals.json');
        } catch {
          vitals = null;
        }

        try {
          organism = loadJson('dashboard-organism.json');
        } catch {
          organism = null;
        }

        if (!vitals && !organism) {
          console.log(chalk.yellow('\n  No statistics data found.\n'));
          console.log(chalk.gray('  💡 Run ethiopiamd sync first.\n'));
          return;
        }

        // JSON output
        if (opts.json) {
          console.log(JSON.stringify({ vitals, organism }, null, 2));
          return;
        }

        console.log(chalk.bold('\n  📊 Ethiopia.md project statistics\n'));

        // Project vitals table
        if (vitals) {
          const table = new Table({
            style: { head: [], border: [] },
          });

          const v = vitals;

          table.push([
            chalk.gray('Total articles'),
            chalk.white(String(v.totalArticles || 0)),
          ]);
          if (v.languageCoverage) {
            const langs = Object.entries(v.languageCoverage)
              .map(([k, n]) => `${k}: ${n}`)
              .join(', ');
            table.push([chalk.gray('Language coverage'), chalk.white(langs)]);
          }
          const reviewPct = v.humanReviewedPercent || 0;
          const reviewColor =
            reviewPct >= 80
              ? chalk.green
              : reviewPct >= 50
                ? chalk.yellow
                : chalk.red;
          table.push([
            chalk.gray('Human reviewed'),
            reviewColor(`${reviewPct}%`),
          ]);
          table.push([
            chalk.gray('Featured articles'),
            chalk.cyan(`${v.featuredPercent || 0}%`),
          ]);
          table.push([
            chalk.gray('Average revision'),
            chalk.white(`×${v.avgRevision || 0}`),
          ]);
          table.push([
            chalk.gray('Added in the last 7 days'),
            chalk.white(String(v.articlesLast7Days || 0)),
          ]);
          if (v.lastUpdated) {
            table.push([
              chalk.gray('Last updated'),
              chalk.gray(new Date(v.lastUpdated).toLocaleDateString('en-US')),
            ]);
          }

          console.log(table.toString());
        }

        // Organism health
        if (organism) {
          console.log(chalk.bold('\n  🏥  Knowledge base health\n'));

          const organs = organism.organs || organism.dimensions || organism;

          if (Array.isArray(organs)) {
            const lines = organs.map((organ) => {
              const emoji = getOrganDisplay(organ);
              // Use nameEn if available, then name, then id
              const name = organ.nameEn || organ.name || organ.id || '—';
              const score = organ.score ?? organ.value ?? 0;
              const meta = organ.metaphor
                ? chalk.dim(` ${organ.metaphor}`)
                : '';
              return `  ${emoji} ${chalk.white(name)}${meta} ${colorScore(score)}`;
            });
            console.log(lines.join('\n'));
          } else if (typeof organs === 'object') {
            const lines = Object.entries(organs).map(([key, value]) => {
              const emoji = '🔬'; // Default emoji
              const score =
                typeof value === 'number'
                  ? value
                  : (value?.score ?? value?.value ?? 0);
              return `  ${emoji} ${chalk.white(key)} ${colorScore(score)}`;
            });
            console.log(lines.join('\n'));
          }
        }

        console.log('');
      } catch (err) {
        console.error(chalk.red(`Failed to load statistics: ${err.message}`));
        console.log(chalk.gray('\n  💡 Run ethiopiamd sync first.\n'));
        process.exit(1);
      }
    });
}
