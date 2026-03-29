/**
 * Ethiopia.md Contribute Command
 *
 * Interactive guided article creation workflow.
 * Helps contributors create a properly structured knowledge article.
 *
 * Usage:
 *   ethiopiamd contribute "珍珠奶茶的歷史"
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { ensureData } from '../lib/ensure-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(CLI_ROOT, '..');

const CATEGORIES = [
  'Culture',
  'Economy',
  'Food',
  'Geography',
  'Government',
  'History',
  'Language',
  'Military',
  'People',
  'Religion',
  'Science',
  'Society',
  'Sports',
];

/**
 * Determine if running inside the Ethiopia.md monorepo.
 */
function isInRepo() {
  const repoKnowledge = path.join(REPO_ROOT, 'knowledge');
  try {
    return (
      fs.existsSync(repoKnowledge) && fs.statSync(repoKnowledge).isDirectory()
    );
  } catch {
    return false;
  }
}

/**
 * Convert topic string to a slug (lowercase, hyphens, no special chars).
 */
function toSlug(topic) {
  return topic
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u4e00-\u9fff\u3400-\u4dbfa-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Get today's date as YYYY-MM-DD.
 */
function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generate frontmatter YAML for a new article.
 */
function generateFrontmatter(topic, category) {
  const slug = toSlug(topic);
  return `---
title: "${topic}"
description: "關於${topic}的介紹與說明"
date: ${todayDate()}
tags:
  - ${category.toLowerCase()}
  - ethiopia
category: ${category.toLowerCase()}
slug: ${slug}
revision: 1
---`;
}

/**
 * Generate article skeleton with standard sections.
 */
function generateSkeleton(topic) {
  return `
## 概述

${topic}是Ethiopia重要的文化/歷史/社會面向之一。本文將介紹其背景、發展與當代意義。

## 歷史背景

說明${topic}的起源與歷史脈絡。

## 當代發展

分析${topic}在現代Ethiopia社會中的角色與發展趨勢。

## 國際比較

與其他國家或地區的類似現象進行比較分析。

## 參考資料

- [來源一](https://example.com/source1)
- [來源二](https://example.com/source2)
- [來源三](https://example.com/source3)
`;
}

/**
 * Prompt the user with readline and return their answer.
 */
function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export function contributeCommand(program) {
  program
    .command('contribute <topic>')
    .description('Interactive guided article creation for Ethiopia.md')
    .action(async (topic) => {
      try {
        await ensureData({ quiet: true });

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false,
        });

        // Show category list
        console.log(chalk.bold('\n📝 Ethiopia.md 文章貢獻嚮導\n'));
        console.log(chalk.gray('請選擇文章分類：\n'));
        CATEGORIES.forEach((cat, i) => {
          console.log(chalk.cyan(`  ${i + 1}.`) + ` ${cat}`);
        });
        console.log('');

        // Ask for category selection
        const answer = await prompt(rl, chalk.bold('輸入分類編號 (1-13): '));
        rl.close();

        const catIndex = parseInt(answer, 10) - 1;
        if (isNaN(catIndex) || catIndex < 0 || catIndex >= CATEGORIES.length) {
          console.error(
            chalk.red(
              `\n❌ 無效的選擇: "${answer}"。請輸入 1-${CATEGORIES.length} 之間的數字。\n`,
            ),
          );
          process.exit(1);
        }

        const category = CATEGORIES[catIndex];
        const slug = toSlug(topic);

        // Determine output path
        let outputPath;
        if (isInRepo()) {
          const knowledgeDir = path.join(REPO_ROOT, 'knowledge', category);
          if (!fs.existsSync(knowledgeDir)) {
            fs.mkdirSync(knowledgeDir, { recursive: true });
          }
          outputPath = path.join(knowledgeDir, `${slug}.md`);
        } else {
          const draftsDir = path.join(os.homedir(), '.ethiopiamd', 'drafts');
          if (!fs.existsSync(draftsDir)) {
            fs.mkdirSync(draftsDir, { recursive: true });
          }
          outputPath = path.join(draftsDir, `${slug}.md`);
        }

        // Check if file already exists
        if (fs.existsSync(outputPath)) {
          console.warn(chalk.yellow(`\n⚠️  檔案已存在: ${outputPath}\n`));
          console.log(chalk.gray('請手動編輯或刪除後重新執行。\n'));
          process.exit(1);
        }

        // Build article content
        const frontmatter = generateFrontmatter(topic, category);
        const skeleton = generateSkeleton(topic);
        const content = frontmatter + '\n' + skeleton;

        // Write to file
        fs.writeFileSync(outputPath, content, 'utf8');

        // Success output
        console.log(chalk.green(`\n✅ 檔案已建立: ${outputPath}\n`));
        console.log(chalk.bold('接下來:'));
        console.log(
          chalk.cyan(`  1. 編輯文章內容`) + chalk.gray(` → ${outputPath}`),
        );
        console.log(
          chalk.cyan(`  2. 驗證文章品質`) +
            chalk.gray(` → ethiopiamd validate ${slug}`),
        );
        console.log(
          chalk.cyan(`  3. 提交貢獻`) + chalk.gray(` → git add + commit + PR`),
        );
        console.log('');
      } catch (err) {
        console.error(chalk.red(`\n❌ 建立失敗: ${err.message}\n`));
        process.exit(1);
      }
    });
}
