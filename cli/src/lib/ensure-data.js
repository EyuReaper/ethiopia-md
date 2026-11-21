/**
 * ensure-data.js
 *
 * Checks whether the local knowledge base is present.
 * If not, automatically runs a sync before continuing.
 * Used by all data-reading commands (search, read, list, random, stats).
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { runSync } from '../commands/sync.js';

const STANDALONE_KNOWLEDGE_DIR = path.join(
  os.homedir(),
  '.ethiopiamd',
  'knowledge',
);
const STANDALONE_CACHE_DIR = path.join(os.homedir(), '.ethiopiamd', 'cache');

// CLI package root: cli/src/lib -> cli/
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(CLI_ROOT, '..');

/**
 * Returns true if we're running inside the monorepo (so knowledge/ is local).
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
 * Returns true if the standalone knowledge base has been populated.
 */
function hasLocalData() {
  if (isInRepo()) return true;

  if (!fs.existsSync(STANDALONE_KNOWLEDGE_DIR)) return false;
  try {
    const entries = fs.readdirSync(STANDALONE_KNOWLEDGE_DIR);
    // Must have at least one subdirectory (a category folder)
    return entries.some((e) => {
      try {
        return fs
          .statSync(path.join(STANDALONE_KNOWLEDGE_DIR, e))
          .isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

let _synced = false; // avoid running sync more than once per process

/**
 * Ensure the knowledge base is available.
 * If not, automatically triggers a sync with user-facing progress messages.
 *
 * @param {object} [options]
 * @param {boolean} [options.quiet] - Suppress the "syncing…" banner
 */
export async function ensureData(options = {}) {
  if (_synced) return;
  if (hasLocalData()) return;

  if (!options.quiet) {
    console.log(
      chalk.bold(
        '\n  Ethiopia.md knowledge base not found locally; syncing...\n',
      ),
    );
    console.log(
      chalk.gray('  (The first sync takes a moment; later runs are fast.)\n'),
    );
  }

  try {
    await runSync({ silent: false });
    _synced = true;
  } catch (err) {
    console.error(chalk.red(`\n  Automatic sync failed: ${err.message}\n`));
    console.log(chalk.gray('  Run "ethiopiamd sync" manually.\n'));
    // Don't exit — let the calling command handle missing data gracefully
  }
}
