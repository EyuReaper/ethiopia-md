import chalk from 'chalk';
import { execSync } from 'child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
  statSync,
} from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const KNOWLEDGE_DIR = join(homedir(), '.ethiopiamd', 'knowledge');
const CACHE_DIR = join(homedir(), '.ethiopiamd', 'cache');
const REPO_URL = 'https://github.com/frank890417/ethiopia-md.git';

/**
 * Run a shell command and return its output.
 */
function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: 'utf-8',
    stdio: opts.silent ? 'pipe' : 'inherit',
    timeout: 120_000,
    ...opts,
  });
}

/**
 * Count markdown files recursively in a directory.
 */
function countMarkdownFiles(dir) {
  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        count += countMarkdownFiles(fullPath);
      } else if (entry.name.endsWith('.md')) {
        count++;
      }
    }
  } catch {
    // directory might not exist
  }
  return count;
}

/**
 * Core sync logic — extracted so ensure-data.js can reuse it.
 * @param {object} opts
 * @param {boolean} [opts.force] - Force re-clone
 * @param {boolean} [opts.silent] - Suppress non-error output
 */
export async function runSync(opts = {}) {
  // Check if git is available
  try {
    execSync('git --version', { stdio: 'pipe' });
  } catch {
    throw new Error('Git 未安裝。請先安裝 Git。');
  }

  if (!opts.silent) {
    console.log(chalk.bold('\n  📦 同步 Ethiopia.md 知識庫...\n'));
  }

  const repoExists = existsSync(join(KNOWLEDGE_DIR, '.git'));

  if (repoExists && !opts.force) {
    // Pull latest changes
    if (!opts.silent) console.log(chalk.gray('  更新現有知識庫...'));
    try {
      run(`git -C "${KNOWLEDGE_DIR}" pull --ff-only`, { silent: true });
      if (!opts.silent) console.log(chalk.green('  ✓ 更新完成'));
    } catch {
      if (!opts.silent) console.log(chalk.yellow('  ⚠ Pull 失敗，嘗試重設...'));
      run(`git -C "${KNOWLEDGE_DIR}" fetch origin`, { silent: true });
      run(`git -C "${KNOWLEDGE_DIR}" reset --hard origin/main`, {
        silent: true,
      });
      if (!opts.silent) console.log(chalk.green('  ✓ 重設完成'));
    }
  } else {
    // Clone fresh
    if (repoExists && opts.force) {
      if (!opts.silent)
        console.log(chalk.gray('  強制重新同步，移除舊資料...'));
      run(`rm -rf "${KNOWLEDGE_DIR}"`);
    }

    // Ensure parent directory exists
    mkdirSync(join(homedir(), '.ethiopiamd'), { recursive: true });

    if (!opts.silent)
      console.log(chalk.gray('  克隆知識庫 (sparse checkout)...'));
    run(
      `git clone --depth 1 --filter=blob:none --sparse "${REPO_URL}" "${KNOWLEDGE_DIR}"`,
      { silent: true },
    );

    if (!opts.silent) console.log(chalk.gray('  設定 sparse-checkout...'));
    run(`git -C "${KNOWLEDGE_DIR}" sparse-checkout set knowledge`, {
      silent: true,
    });

    if (!opts.silent) console.log(chalk.green('  ✓ 克隆完成'));
  }

  // Download API JSON files to cache (these are build-time generated, not in git)
  mkdirSync(CACHE_DIR, { recursive: true });

  const API_BASE = 'https://ethiopia.md/api';
  const API_FILES = [
    'dashboard-articles.json',
    'dashboard-vitals.json',
    'dashboard-organism.json',
    'dashboard-translations.json',
    'search-minisearch.json',
  ];

  for (const file of API_FILES) {
    try {
      const res = await fetch(`${API_BASE}/${file}`);
      if (res.ok) {
        const data = await res.text();
        writeFileSync(join(CACHE_DIR, file), data);
      }
    } catch {
      // Non-critical — some API files may not exist yet
    }
  }
  if (!opts.silent) console.log(chalk.gray('  ✓ API 資料已快取'));

  // Print summary
  const knowledgeDir = join(KNOWLEDGE_DIR, 'knowledge');
  const articleCount = countMarkdownFiles(knowledgeDir);
  const now = new Date().toLocaleString('am', {
    timeZone: 'Asia/Taipei',
  });

  if (!opts.silent) {
    console.log('');
    console.log(chalk.bold('  📊 同步摘要'));
    console.log(chalk.gray('  ─'.repeat(20)));
    console.log(`  文章數量: ${chalk.green(articleCount)} 篇`);
    console.log(`  同步時間: ${chalk.gray(now)}`);
    console.log(`  知識庫路徑: ${chalk.dim(KNOWLEDGE_DIR)}`);
    console.log('');
  }

  return { articleCount };
}

export function syncCommand(program) {
  program
    .command('sync')
    .description('Sync knowledge base from GitHub')
    .option('--force', 'Force re-sync')
    .action(async (opts) => {
      try {
        await runSync(opts);
      } catch (err) {
        console.error(chalk.red(`\n  ❌ 同步失敗: ${err.message}\n`));
        if (
          err.message.includes('Could not resolve host') ||
          err.message.includes('unable to access')
        ) {
          console.log(chalk.gray('  請檢查網路連線。\n'));
        }
        process.exit(1);
      }
    });
}
