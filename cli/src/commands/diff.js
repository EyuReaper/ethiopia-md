/**
 * ethiopiamd diff — 顯示近 7 天知識庫變更
 *
 * Parses git log of the knowledge base.
 * Falls back to file mtime if git is unavailable.
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { execSync, spawnSync } from 'child_process';
import { statSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import os from 'os';
import { getKnowledgePath } from '../lib/knowledge.js';
import { categoryEmoji, categoryLabel } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Derive category from a git filename like "knowledge/history/二二八事件.md"
 */
function categoryFromPath(filePath) {
  const parts = filePath.replace(/\\/g, '/').split('/');
  // Typical: knowledge/<category>/<title>.md
  const kIdx = parts.findIndex((p) => p === 'knowledge');
  if (kIdx !== -1 && parts.length > kIdx + 2) {
    return parts[kIdx + 1].toLowerCase();
  }
  // Fallback: second segment
  if (parts.length >= 2) return parts[parts.length - 2].toLowerCase();
  return 'misc';
}

/**
 * Extract a human-readable title from a filename (no extension).
 */
function titleFromFile(filePath) {
  return basename(filePath, '.md');
}

/**
 * Try to get git log entries since 7 days ago.
 * Returns array of { date, category, title } or null if git fails.
 */
function getGitLog(repoPath) {
  try {
    const result = spawnSync(
      'git',
      [
        '-C',
        repoPath,
        'log',
        '--oneline',
        '--format=%ci|%s|%H',
        '--since=7 days ago',
        '--',
        'knowledge/',
      ],
      { encoding: 'utf8', timeout: 8000 },
    );

    if (result.status !== 0 || result.error) return null;

    const output = (result.stdout || '').trim();
    if (!output) return [];

    // Also get the files changed per commit
    const detailedResult = spawnSync(
      'git',
      [
        '-C',
        repoPath,
        'log',
        '--name-only',
        '--format=%ci',
        '--since=7 days ago',
        '--',
        'knowledge/',
      ],
      { encoding: 'utf8', timeout: 8000 },
    );

    if (detailedResult.status !== 0 || detailedResult.error) {
      // Fallback: just use commit messages
      return output.split('\n').map((line) => {
        const [dateStr, ...rest] = line.split('|');
        const date = dateStr ? dateStr.slice(0, 10) : '?';
        const subject = rest[0] || '';
        return { date, category: '—', title: subject };
      });
    }

    // Parse detailed output: date lines followed by filenames
    const entries = [];
    let currentDate = null;
    for (const rawLine of detailedResult.stdout.split('\n')) {
      const line = rawLine.trim();
      if (!line) continue;

      // Date line: e.g. "2026-01-20 10:30:00 +0800"
      if (/^\d{4}-\d{2}-\d{2}/.test(line) && !line.includes('/')) {
        currentDate = line.slice(0, 10);
        continue;
      }

      // File path line
      if (line.includes('/') && line.endsWith('.md')) {
        const cat = categoryFromPath(line);
        const title = titleFromFile(line);
        if (!title.startsWith('_')) {
          entries.push({ date: currentDate || '?', category: cat, title });
        }
      }
    }

    return entries;
  } catch {
    return null;
  }
}

/**
 * Get the most recent mtime from the knowledge directory.
 */
function getLastMtime(knowledgeDir) {
  let latest = new Date(0);

  function scan(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const fp = join(dir, e.name);
        if (e.isDirectory()) {
          scan(fp);
        } else if (
          e.isFile() &&
          e.name.endsWith('.md') &&
          !e.name.startsWith('_')
        ) {
          try {
            const mtime = statSync(fp).mtime;
            if (mtime > latest) latest = mtime;
          } catch {}
        }
      }
    } catch {}
  }

  scan(knowledgeDir);
  return latest;
}

export function diffCommand(program) {
  program
    .command('diff')
    .description('顯示近 7 天知識庫的文章變更')
    .option('--days <n>', '顯示最近 N 天', '7')
    .action(async (opts) => {
      try {
        await ensureData();

        const knowledgeDir = getKnowledgePath();

        if (!existsSync(knowledgeDir)) {
          console.log(
            chalk.yellow('\n  找不到知識庫目錄，請先執行 ethiopiamd sync\n'),
          );
          return;
        }

        console.log(chalk.bold('\n  📋 知識庫近期變更\n'));

        // Determine the repo root to run git against
        // knowledge dir might be ~/.ethiopiamd/knowledge (standalone)
        // or <repo>/knowledge (in-repo)
        const standaloneKnowledge = join(
          os.homedir(),
          '.ethiopiamd',
          'knowledge',
        );
        let gitRoot;

        if (
          knowledgeDir === standaloneKnowledge ||
          knowledgeDir.startsWith(join(os.homedir(), '.ethiopiamd'))
        ) {
          // Standalone: git repo is one level up from knowledge
          gitRoot = join(os.homedir(), '.ethiopiamd');
        } else {
          // In-repo: git root is parent of knowledge/
          gitRoot = join(knowledgeDir, '..');
        }

        const entries = getGitLog(gitRoot);

        if (entries === null || entries === undefined) {
          // Git failed — show fallback
          const mtime = getLastMtime(knowledgeDir);
          const dateStr =
            mtime > new Date(0) ? mtime.toLocaleString('am') : '無法判斷';
          console.log(chalk.gray(`  上次同步: ${dateStr}\n`));
          console.log(chalk.dim('  (無法讀取 git 紀錄，顯示最後修改時間)'));
          console.log('');
          return;
        }

        if (entries.length === 0) {
          console.log(chalk.gray('  過去 7 天內沒有文章變更。\n'));
          return;
        }

        // Deduplicate by title
        const seen = new Set();
        const unique = entries.filter((e) => {
          const key = `${e.date}|${e.title}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Table output
        const table = new Table({
          head: [
            chalk.bold.cyan('日期'),
            chalk.bold.cyan('分類'),
            chalk.bold.cyan('文章'),
          ],
          style: { head: [], border: ['gray'] },
          colWidths: [14, 16, 40],
          wordWrap: true,
        });

        for (const e of unique.slice(0, 50)) {
          const cat = e.category.toLowerCase();
          const emoji = categoryEmoji[cat] || '📄';
          const label = categoryLabel[cat] || e.category;
          table.push([
            chalk.gray(e.date),
            `${emoji} ${label}`,
            chalk.white(e.title),
          ]);
        }

        console.log(table.toString());
        console.log(
          chalk.gray(`\n  共 ${unique.length} 筆變更（顯示最多 50 筆）\n`),
        );
      } catch (err) {
        console.error(chalk.red(`diff 失敗: ${err.message}`));
        process.exit(1);
      }
    });
}
