/**
 * Ethiopia.md Knowledge Base Access
 *
 * Detects whether the CLI is running inside the repo or standalone,
 * and provides unified access to knowledge base articles and API data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI package root: cli/src/lib -> cli/
const CLI_ROOT = path.resolve(__dirname, '../..');
// Repo root (one level above cli/)
const REPO_ROOT = path.resolve(CLI_ROOT, '..');

const STANDALONE_DATA_DIR = path.join(os.homedir(), '.ethiopiamd');
const STANDALONE_KNOWLEDGE_DIR = path.join(STANDALONE_DATA_DIR, 'knowledge');
const STANDALONE_CACHE_DIR = path.join(STANDALONE_DATA_DIR, 'cache');

// Supported languages: am (Amharic, default, lives at knowledge/ root) and en (knowledge/en/)
export const SUPPORTED_LANGS = ['am', 'en'];

// Top-level directories that are never part of the Amharic article listing
const EXCLUDED_DIRS = new Set(['en', 'es', 'ja', 'resources']);

// Articles with these frontmatter statuses are hidden everywhere
const HIDDEN_STATUSES = new Set(['draft', 'archived']);

/**
 * Determine if we are running inside the repo (i.e. ../knowledge/ exists).
 */
function isInRepo() {
  const repoKnowledge = path.join(REPO_ROOT, 'knowledge');
  return (
    fs.existsSync(repoKnowledge) && fs.statSync(repoKnowledge).isDirectory()
  );
}

/**
 * Get the knowledge base root path.
 * In-repo: <repo>/knowledge/
 * Standalone: ~/.ethiopiamd/knowledge/
 */
export function getKnowledgePath() {
  if (isInRepo()) {
    return path.join(REPO_ROOT, 'knowledge');
  }
  return STANDALONE_KNOWLEDGE_DIR;
}

/**
 * Get the API data path.
 * In-repo: <repo>/public/api/
 * Standalone: ~/.ethiopiamd/cache/
 */
export function getApiPath() {
  if (isInRepo()) {
    return path.join(REPO_ROOT, 'public', 'api');
  }
  return STANDALONE_CACHE_DIR;
}

/**
 * Check if the knowledge base is available (directory exists and contains files).
 */
export function isKnowledgeAvailable() {
  const kPath = getKnowledgePath();
  if (!fs.existsSync(kPath)) return false;
  try {
    const entries = fs.readdirSync(kPath);
    return entries.length > 0;
  } catch {
    return false;
  }
}

/**
 * Returns true if the given language code is supported by the CLI.
 */
export function isSupportedLang(lang) {
  return SUPPORTED_LANGS.includes(lang);
}

/**
 * Decide whether a markdown file should be visible to the CLI.
 * - status: draft / archived  -> hidden
 * - status: published         -> visible (includes _-prefixed Hub files)
 * - no status                 -> visible unless the filename starts with _
 *                                (_Home.md and similar are internal notes)
 */
function isVisibleArticle(filePath, fileName) {
  let status = null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    status = parseFrontmatter(content).frontmatter.status ?? null;
  } catch {
    return false;
  }
  if (HIDDEN_STATUSES.has(status)) return false;
  if (status === 'published') return true;
  return !fileName.startsWith('_');
}

/**
 * Recursively collect all visible am article markdown file paths.
 * Excludes language dirs (en/es/ja), the resources dir, and hidden articles.
 */
export function getArticleFiles() {
  const knowledgeDir = getKnowledgePath();
  if (!fs.existsSync(knowledgeDir)) return [];

  const results = [];
  collectArticleFiles(knowledgeDir, knowledgeDir, results);
  return results;
}

/**
 * Collect all visible article files for a supported language.
 * 'am' delegates to getArticleFiles(); 'en' scans knowledge/en/.
 * Unsupported languages return [] (callers should check isSupportedLang first).
 *
 * @param {string} lang - Language code: 'am' or 'en'
 * @returns {string[]} Array of absolute file paths
 */
export function getArticleFilesForLang(lang) {
  if (!lang || lang === 'am') {
    return getArticleFiles();
  }
  if (!isSupportedLang(lang)) return [];

  const knowledgeDir = getKnowledgePath();
  const langDir = path.join(knowledgeDir, lang);

  if (!fs.existsSync(langDir)) return [];

  const results = [];
  function collect(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collect(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.md') &&
        isVisibleArticle(fullPath, entry.name)
      ) {
        results.push(fullPath);
      }
    }
  }

  collect(langDir);
  return results;
}

function collectArticleFiles(dir, rootDir, results) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip language dirs and resources at the top level
      const relativeToRoot = path.relative(rootDir, fullPath);
      const topLevelDir = relativeToRoot.split(path.sep)[0];
      if (EXCLUDED_DIRS.has(topLevelDir) && relativeToRoot === topLevelDir) {
        continue;
      }
      collectArticleFiles(fullPath, rootDir, results);
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      isVisibleArticle(fullPath, entry.name)
    ) {
      results.push(fullPath);
    }
  }
}

/**
 * Parse simple YAML frontmatter from markdown content.
 * Mirrors the parsing approach used in scripts/core/generate-api.js.
 */
function parseFrontmatter(content) {
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const fmText = match[1];
  const body = match[2];
  const frontmatter = {};

  const lines = fmText.split('\n');
  let currentKey = null;
  let currentArrayValues = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check if this is a multiline array item (  - value)
    if (currentKey && /^\s+-\s+/.test(line)) {
      const itemValue = line
        .replace(/^\s+-\s+/, '')
        .trim()
        .replace(/^['"]|['"]$/g, '');
      if (currentArrayValues) {
        currentArrayValues.push(itemValue);
      }
      continue;
    }

    // Flush any pending multiline array
    if (currentKey && currentArrayValues) {
      frontmatter[currentKey] = currentArrayValues;
      currentKey = null;
      currentArrayValues = null;
    }

    // Parse key: value
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Remove quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Inline array: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
        .filter((v) => v.length > 0);
      frontmatter[key] = value;
      continue;
    }

    // Empty value might indicate a multiline array follows
    if (value === '') {
      currentKey = key;
      currentArrayValues = [];
      continue;
    }

    // Boolean coercion
    if (value === 'true') {
      frontmatter[key] = true;
      continue;
    }
    if (value === 'false') {
      frontmatter[key] = false;
      continue;
    }

    // Number coercion (for revision, etc.)
    if (/^\d+$/.test(value)) {
      frontmatter[key] = parseInt(value, 10);
      continue;
    }

    frontmatter[key] = value;
  }

  // Flush final pending multiline array
  if (currentKey && currentArrayValues) {
    frontmatter[currentKey] = currentArrayValues;
  }

  return { frontmatter, body };
}

/**
 * Calculate word count.
 * CJK characters count as 1 word each; latin words are whitespace-separated.
 */
function calculateWordCount(text) {
  if (!text) return 0;

  // Match CJK characters (CJK Unified Ideographs + common ranges)
  const cjkRegex =
    /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/g;
  const cjkMatches = text.match(cjkRegex);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // Remove CJK chars and count remaining latin words
  const withoutCjk = text.replace(cjkRegex, ' ');
  const latinWords = withoutCjk
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  return cjkCount + latinWords.length;
}

/**
 * Read a single article file and return parsed data.
 * @param {string} filePath - Absolute path to the markdown file
 * @returns {{ frontmatter: object, body: string, filePath: string }}
 */
export function readArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  // Ensure tags is always an array
  if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
    frontmatter.tags = [frontmatter.tags];
  }
  if (!frontmatter.tags) {
    frontmatter.tags = [];
  }

  // Derive slug from filename
  const slug = path.basename(filePath, '.md');

  // Derive category from directory path (skip the en/ prefix for English files)
  const knowledgeDir = getKnowledgePath();
  const parts = path.relative(knowledgeDir, filePath).split(path.sep);
  const lang = parts[0] === 'en' ? 'en' : 'am';
  if (parts[0] === 'en') parts.shift();
  const category = parts.length > 1 ? parts[0] : 'Misc';

  // Calculate word count from body
  const wordCount = calculateWordCount(body);

  return {
    frontmatter: {
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      date: frontmatter.date || null,
      tags: frontmatter.tags,
      status: frontmatter.status || null,
      lang,
      featured: frontmatter.featured === true,
      lastHumanReview: frontmatter.lastHumanReview ?? null,
      lastVerified: frontmatter.lastVerified || null,
      revision: frontmatter.revision ?? null,
      commitHash: frontmatter.commitHash || null,
      category: category.toLowerCase(),
      slug,
      wordCount,
    },
    body,
    filePath,
  };
}

/**
 * Load visible article records for a language, shaped for list/explore/quiz.
 * Built from knowledge/ so draft and archived articles are never included.
 *
 * @param {string} [lang='am'] - 'am' or 'en'
 * @returns {Array<object>}
 */
export function loadArticleRecords(lang = 'am') {
  const records = [];
  for (const filePath of getArticleFilesForLang(lang)) {
    try {
      const { frontmatter: fm } = readArticle(filePath);
      records.push({
        title: fm.title,
        slug: fm.slug,
        category: fm.category,
        description: fm.description,
        date: fm.date,
        lastVerified: fm.lastVerified,
        lastHumanReview: fm.lastHumanReview,
        humanReviewed: fm.lastHumanReview === true,
        featured: fm.featured,
        tags: fm.tags,
        wordCount: fm.wordCount,
        words: fm.wordCount,
        lang: fm.lang,
      });
    } catch {
      // skip unreadable files
    }
  }
  return records;
}
