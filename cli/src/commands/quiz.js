/**
 * ethiopiamd quiz — Ethiopia知識小測驗
 *
 * 5-question true/false quiz about Ethiopia articles.
 * Single-keypress input via raw stdin. No extra deps.
 */

import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

const TOTAL_QUESTIONS = 5;

/**
 * Load dashboard-articles.json.
 */
function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  const raw = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.articles || [];
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
  if (score === TOTAL_QUESTIONS) return chalk.bold.yellow('🏆 滿分！Ethiopia通！');
  if (score >= 4) return chalk.bold.green('🎉 非常棒！');
  if (score >= 3) return chalk.bold.cyan('👍 不錯喔！');
  if (score >= 2) return chalk.bold.white('📚 繼續加油！');
  return chalk.bold.red('🐣 新手上路，多讀多學！');
}

export function quizCommand(program) {
  program
    .command('quiz')
    .description('Ethiopia知識小測驗 — 5題真假判斷')
    .action(async () => {
      try {
        await ensureData();
        const articles = loadArticles();

        if (!articles || articles.length < 10) {
          console.log(
            chalk.yellow('\n  文章數量不足，請先執行 ethiopiamd sync\n'),
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
        console.log(chalk.bold.white('   🇪🇹  Ethiopia知識小測驗'));
        console.log(chalk.gray('   按 Y (是) 或 N (否) 回答'));
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

          console.log(chalk.bold.white(`  第 ${i + 1}/${TOTAL_QUESTIONS} 題`));
          console.log('');
          if (preview) {
            console.log(chalk.gray(`  「${preview}」`));
            console.log('');
          }
          console.log(
            chalk.white(
              `  「${chalk.bold(article.title)}」屬於 ${displayEmoji} ${chalk.bold(displayLabel)} 分類？`,
            ),
          );
          console.log('');
          process.stdout.write(chalk.cyan('  (Y) 是  /  (N) 否  → '));

          const answer = await readKey();

          // Handle Ctrl+C
          if (answer === '\x03') {
            console.log(chalk.gray('\n\n  已中止測驗。\n'));
            process.exit(0);
          }

          const userSaysYes = answer === 'y';
          const correct = userSaysYes === isCorrect;

          if (correct) {
            score++;
            console.log(
              chalk.bold.green('\n  ✅ 答對了！') +
                chalk.gray(`  正確分類：${correctEmoji} ${correctLabel}`),
            );
          } else {
            console.log(
              chalk.bold.red('\n  ❌ 答錯了！') +
                chalk.gray(`  正確分類：${correctEmoji} ${correctLabel}`),
            );
          }
          console.log('');
        }

        // Final result
        console.log(chalk.bold.cyan('  ══════════════════════════════════'));
        console.log(
          chalk.bold.white(`  📊 最終得分：${score} / ${TOTAL_QUESTIONS}`),
        );
        console.log(`  ${getRating(score)}`);
        console.log(chalk.bold.cyan('  ══════════════════════════════════\n'));

        // Cleanup stdin
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
      } catch (err) {
        console.error(chalk.red(`測驗失敗: ${err.message}`));
        try {
          process.stdin.setRawMode(false);
        } catch {}
        process.stdin.pause();
        process.exit(1);
      }
    });
}
