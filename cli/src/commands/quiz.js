/**
 * ethiopiamd quiz — Ethiopia knowledge quiz
 *
 * 5-question true/false quiz about Ethiopia articles.
 * Single-keypress input via raw stdin. No extra deps.
 */

import chalk from 'chalk';
import { loadArticleRecords } from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

const TOTAL_QUESTIONS = 5;

/**
 * Load visible (published) article records.
 */
function loadArticles() {
  return loadArticleRecords('am');
}

/**
 * Fisher-Yates shuffle (in-place). Returns the array.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Read a single keypress from stdin in raw mode.
 * Returns a Promise<string> (the key character, lowercased).
 */
function readKey() {
  return new Promise((resolve) => {
    const onData = (buf) => {
      process.stdin.removeListener('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      const ch = buf.toString('utf8').toLowerCase();
      resolve(ch);
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', onData);
  });
}

/**
 * Get a final rating string based on score.
 */
function getRating(score) {
  if (score === TOTAL_QUESTIONS)
    return chalk.bold.yellow('🏆 Perfect score! You know your Ethiopia!');
  if (score >= 4) return chalk.bold.green('🎉 Excellent!');
  if (score >= 3) return chalk.bold.cyan('👍 Nice work!');
  if (score >= 2) return chalk.bold.white('📚 Keep learning!');
  return chalk.bold.red('🐣 Just getting started. Read more and try again!');
}

export function quizCommand(program) {
  program
    .command('quiz')
    .description('Quick quiz: five true/false questions about Ethiopia')
    .action(async () => {
      try {
        await ensureData();
        const articles = loadArticles();

        if (!articles || articles.length < 10) {
          console.log(
            chalk.yellow(
              '\n  Not enough articles. Run ethiopiamd sync first.\n',
            ),
          );
          return;
        }

        // Build a list of all unique categories
        const allCats = [
          ...new Set(articles.map((a) => (a.category || 'misc').toLowerCase())),
        ];

        // Pick TOTAL_QUESTIONS articles
        const questions = shuffle(articles.slice()).slice(0, TOTAL_QUESTIONS);

        console.log('');
        console.log(chalk.bold.cyan('  ══════════════════════════════════'));
        console.log(chalk.bold.white('   🇪🇹  Ethiopia knowledge quiz'));
        console.log(chalk.gray('   Press Y (yes) or N (no) to answer'));
        console.log(chalk.bold.cyan('  ══════════════════════════════════\n'));

        let score = 0;

        for (let i = 0; i < questions.length; i++) {
          const article = questions[i];
          const correctCat = (article.category || 'misc').toLowerCase();
          const correctEmoji = categoryEmoji[correctCat] || '📄';
          const correctLabel = categoryLabel[correctCat] || correctCat;

          // 50% chance to show wrong category
          const showWrong = Math.random() < 0.5;
          let displayLabel, displayEmoji, isCorrect;

          if (showWrong) {
            const otherCats = allCats.filter((c) => c !== correctCat);
            const wrongCat =
              otherCats.length > 0
                ? otherCats[Math.floor(Math.random() * otherCats.length)]
                : correctCat;
            displayLabel = categoryLabel[wrongCat] || wrongCat;
            displayEmoji = categoryEmoji[wrongCat] || '📄';
            isCorrect = false;
          } else {
            displayLabel = correctLabel;
            displayEmoji = correctEmoji;
            isCorrect = true;
          }

          // Article preview (first ~50 chars of description)
          const desc = article.description || article.excerpt || '';
          const preview = desc.length > 50 ? desc.slice(0, 50) + '…' : desc;

          console.log(
            chalk.bold.white(`  Question ${i + 1}/${TOTAL_QUESTIONS}`),
          );
          console.log('');
          if (preview) {
            console.log(chalk.gray(`  "${preview}"`));
            console.log('');
          }
          console.log(
            chalk.white(
              `  Does "${chalk.bold(article.title)}" belong to ${displayEmoji} ${chalk.bold(displayLabel)}?`,
            ),
          );
          console.log('');
          process.stdout.write(chalk.cyan('  (Y) yes  /  (N) no  → '));

          const answer = await readKey();

          // Handle Ctrl+C
          if (answer === '\x03') {
            console.log(chalk.gray('\n\n  Quiz cancelled.\n'));
            process.exit(0);
          }

          const userSaysYes = answer === 'y';
          const correct = userSaysYes === isCorrect;

          if (correct) {
            score++;
            console.log(
              chalk.bold.green('\n  ✅ Correct!') +
                chalk.gray(
                  `  Correct category: ${correctEmoji} ${correctLabel}`,
                ),
            );
          } else {
            console.log(
              chalk.bold.red('\n  ❌ Wrong!') +
                chalk.gray(
                  `  Correct category: ${correctEmoji} ${correctLabel}`,
                ),
            );
          }
          console.log('');
        }

        // Final result
        console.log(chalk.bold.cyan('  ══════════════════════════════════'));
        console.log(
          chalk.bold.white(`  📊 Final score: ${score} / ${TOTAL_QUESTIONS}`),
        );
        console.log(`  ${getRating(score)}`);
        console.log(chalk.bold.cyan('  ══════════════════════════════════\n'));

        // Cleanup stdin
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
      } catch (err) {
        console.error(chalk.red(`Quiz failed: ${err.message}`));
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
        process.exit(1);
      }
    });
}
