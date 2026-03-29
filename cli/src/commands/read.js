import chalk from 'chalk';
import { exec } from 'child_process';
import {
  getArticleFiles,
  getArticleFilesForLang,
  readArticle,
} from '../lib/knowledge.js';
import { renderArticleHeader, renderMarkdown } from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Slugify a filename for comparison.
 * Strips extension, lowercases, replaces spaces/underscores with hyphens.
 */
function slugify(filename) {
  return filename
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

/**
 * Find the best matching article file for a given slug within a file list.
 */
async function findArticle(slug, articleFiles) {
  const normalizedSlug = slug.toLowerCase().replace(/[\s_]+/g, '-');

  // Pass 1: exact slug match on filename
  for (const filePath of articleFiles) {
    const filename = filePath.split('/').pop();
    const fileSlug = slugify(filename);
    if (fileSlug === normalizedSlug) {
      return filePath;
    }
  }

  // Pass 2: filename contains slug
  for (const filePath of articleFiles) {
    const filename = filePath.split('/').pop();
    const fileSlug = slugify(filename);
    if (
      fileSlug.includes(normalizedSlug) ||
      normalizedSlug.includes(fileSlug)
    ) {
      return filePath;
    }
  }

  // Pass 3: check frontmatter titles
  for (const filePath of articleFiles) {
    try {
      const article = await readArticle(filePath);
      if (article && article.frontmatter && article.frontmatter.title) {
        const titleSlug = article.frontmatter.title
          .toLowerCase()
          .replace(/[\s_]+/g, '-');
        if (
          titleSlug.includes(normalizedSlug) ||
          normalizedSlug.includes(titleSlug)
        ) {
          return filePath;
        }
      }
    } catch {
      // skip unreadable files
    }
  }

  return null;
}

/**
 * Resolve effective language from options.
 * --lang <code> takes precedence, then shorthand flags.
 */
function resolveLang(opts) {
  if (opts.lang) return opts.lang;
  if (opts.en) return 'en';
  if (opts.ja) return 'ja';
  if (opts.es) return 'es';
  return null; // default: am
}

export function readCommand(program) {
  program
    .command('read <slug>')
    .description('Read a Ethiopia.md article')
    .option('--en', 'Read English version (shorthand for --lang en)')
    .option('--ja', 'Read Japanese version (shorthand for --lang ja)')
    .option('--es', 'Read Spanish version (shorthand for --lang es)')
    .option('--lang <code>', 'Language code: en, ja, es (default: am)')
    .option('--raw', 'Output raw markdown')
    .option('--web', 'Open in browser')
    .action(async (slug, opts) => {
      try {
        await ensureData();

        const lang = resolveLang(opts);

        // Load file list for the requested language
        const articleFiles = lang
          ? getArticleFilesForLang(lang)
          : getArticleFiles();

        if (!articleFiles || articleFiles.length === 0) {
          if (lang) {
            console.log(
              chalk.yellow(`\n  找不到「${lang}」語言版本的文章。\n`),
            );
            console.log(chalk.gray('  可用語言: en, ja, es (需要先 sync)\n'));
          } else {
            console.log(chalk.yellow('\n  知識庫尚未同步。請先執行:'));
            console.log(chalk.cyan('  ethiopiamd sync\n'));
          }
          return;
        }

        const filePath = await findArticle(slug, articleFiles);

        if (!filePath) {
          // If a lang was requested and not found, try falling back to am
          if (lang) {
            console.log(
              chalk.yellow(
                `\n  找不到「${slug}」的 ${lang} 版本，嘗試中文版...\n`,
              ),
            );
            const zhFiles = getArticleFiles();
            const zhPath = await findArticle(slug, zhFiles);
            if (!zhPath) {
              console.log(chalk.yellow(`\n  找不到文章「${slug}」\n`));
              console.log(chalk.gray('  💡 試試搜尋:'));
              console.log(chalk.cyan(`  ethiopiamd search ${slug}\n`));
              return;
            }
            // Fall through with zh path
            return await renderArticleFile(zhPath, opts);
          }

          console.log(chalk.yellow(`\n  找不到文章「${slug}」\n`));
          console.log(chalk.gray('  💡 試試搜尋:'));
          console.log(chalk.cyan(`  ethiopiamd search ${slug}\n`));
          return;
        }

        await renderArticleFile(filePath, opts);
      } catch (err) {
        console.error(chalk.red(`讀取失敗: ${err.message}`));
        process.exit(1);
      }
    });
}

/**
 * Render an article from a given file path.
 */
async function renderArticleFile(filePath, opts) {
  const article = await readArticle(filePath);

  if (!article) {
    console.log(chalk.red('\n  無法讀取文章內容。\n'));
    return;
  }

  const fm = article.frontmatter;

  // Handle --web flag: open in browser
  if (opts.web) {
    const url = `https://ethiopia.md/${fm.category}/${fm.slug}`;
    console.log(chalk.gray(`\n  Opening ${url} ...\n`));
    exec(`open "${url}"`);
    return;
  }

  // Handle --raw flag: output raw markdown
  if (opts.raw) {
    console.log(article.body || '');
    return;
  }

  // Default: render article
  console.log('');
  console.log(
    renderArticleHeader({
      title: fm.title,
      category: fm.category,
      date: fm.date,
      wordCount: fm.wordCount,
      tags: fm.tags,
      description: fm.description,
    }),
  );
  console.log('');
  console.log(renderMarkdown(article.body || ''));
}
