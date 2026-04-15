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
          console.log(chalk.yellow('\n  ምንም የናሙና መረጃ አልተገኘም ።\n'));
          console.log(chalk.gray('  💡 እባክዎ አስቀድመው ethiopiamd sync ያካሂዱ ።\n'));
          return;
        }

        // JSON output
        if (opts.json) {
          console.log(JSON.stringify({ vitals, organism }, null, 2));
          return;
        }

        console.log(chalk.bold('\n  📊 የ Ethiopia.md  ፕሮጀክት ናሙና\n'));

        // Project vitals table
        if (vitals) {
          const table = new Table({
            style: { head: [], border: [] },
          });

          const v = vitals;

          table.push([
            chalk.gray('ጠቅላላ የጽሁፎች ብዛት'),
            chalk.white(String(v.totalArticles || 0)),
          ]);
          if (v.languageCoverage) {
            const langs = Object.entries(v.languageCoverage)
              .map(([k, n]) => `${k}: ${n}`)
              .join(', ');
            table.push([chalk.gray('የቋንቋ ሽፋን'), chalk.white(langs)]);
          }
          const reviewPct = v.humanReviewedPercent || 0;
          const reviewColor =
            reviewPct >= 80
              ? chalk.green
              : reviewPct >= 50
                ? chalk.yellow
                : chalk.red;
          table.push([chalk.gray('በሰው የተገመገመ'), reviewColor(`${reviewPct}%`)]);
          table.push([
            chalk.gray('የተመረጡ ጽሁፎች'),
            chalk.cyan(`${v.featuredPercent || 0}%`),
          ]);
          table.push([
            chalk.gray('አማካይ ክለሳ'),
            chalk.white(`×${v.avgRevision || 0}`),
          ]);
          table.push([
            chalk.gray('ባለፉት 7 ቀናት የተጨመሩ'),
            chalk.white(String(v.articlesLast7Days || 0)),
          ]);
          if (v.lastUpdated) {
            table.push([
              chalk.gray('መጨረሻ የተሻሻለው'),
              chalk.gray(new Date(v.lastUpdated).toLocaleDateString('en-US')),
            ]);
          }

          console.log(table.toString());
        }

        // Organism health
        if (organism) {
          console.log(chalk.bold('\n  🏥  የእውቀት መሰረት ጤናማነት\n'));

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
        console.error(chalk.red(`ናሙናውን መጫን አልተሳካም: ${err.message}`));
        console.log(chalk.gray('\n  💡 እባክዎ አስቀድመው ethiopiamd sync ያሂዱ።\n'));
        process.exit(1);
      }
    });
}
