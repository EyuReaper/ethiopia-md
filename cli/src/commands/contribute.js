/**
 * Ethiopia.md Contribute Command
 *
 * Interactive guided article creation workflow.
 * Helps contributors create a properly structured knowledge article.
 *
 * Usage:
 *   ethiopiamd contribute "The history of injera"
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
description: "An introduction to ${topic}"
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
## Overview

Introduce ${topic} and explain why it matters in Ethiopia.

## Background

Explain the origins and history of ${topic}, with sources.

## Modern context

Describe the role of ${topic} in Ethiopia today.

## Sources

- [Source one](https://example.com/source1)
- [Source two](https://example.com/source2)
- [Source three](https://example.com/source3)
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
        console.log(
          chalk.bold('\n📝 Ethiopia.md article contribution wizard\n'),
        );
        console.log(chalk.gray('Choose an article category:\n'));
        CATEGORIES.forEach((cat, i) => {
          console.log(chalk.cyan(`  ${i + 1}.`) + ` ${cat}`);
        });
        console.log('');

        // Ask for category selection
        const answer = await prompt(
          rl,
          chalk.bold('Enter a category number (1-13): '),
        );
        rl.close();

        const catIndex = parseInt(answer, 10) - 1;
        if (isNaN(catIndex) || catIndex < 0 || catIndex >= CATEGORIES.length) {
          console.error(
            chalk.red(
              `\n❌ Invalid choice: "${answer}". Enter a number from 1 to ${CATEGORIES.length}.\n`,
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
          console.warn(
            chalk.yellow(`\n⚠️  File already exists: ${outputPath}\n`),
          );
          console.log(
            chalk.gray(
              'Edit or delete it manually, then run this command again.\n',
            ),
          );
          process.exit(1);
        }

        // Build article content
        const frontmatter = generateFrontmatter(topic, category);
        const skeleton = generateSkeleton(topic);
        const content = frontmatter + '\n' + skeleton;

        // Write to file
        fs.writeFileSync(outputPath, content, 'utf8');

        // Success output
        console.log(chalk.green(`\n✅ File created: ${outputPath}\n`));
        console.log(chalk.bold('Next steps:'));
        console.log(
          chalk.cyan(`  1. Edit the article`) + chalk.gray(` → ${outputPath}`),
        );
        console.log(
          chalk.cyan(`  2. Validate the article`) +
            chalk.gray(` → ethiopiamd validate ${slug}`),
        );
        console.log(
          chalk.cyan(`  3. Submit your contribution`) +
            chalk.gray(` → git add + commit + PR`),
        );
        console.log('');
      } catch (err) {
        console.error(chalk.red(`\n❌ Failed to create: ${err.message}\n`));
        process.exit(1);
      }
    });
}
