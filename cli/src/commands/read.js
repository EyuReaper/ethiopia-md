import chalk from 'chalk';
import { exec } from 'child_process';
import {
  getArticleFiles,
  getArticleFilesForLang,
  readArticle,
} from '../lib/knowledge.js';
import { renderArticleHeader, renderMarkdown } from '../lib/render.js';
import { SUPPORTED_LANGS, isSupportedLang } from '../lib/knowledge.js';
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
 * --en is shorthand for --lang en; the default is Amharic (null here).
 */
function resolveLang(opts) {
  if (opts.lang) return opts.lang;
  if (opts.en) return 'en';
  return null; // default: am
}

export function readCommand(program) {
  program
    .command('read <slug>')
    .description('Read a published Ethiopia.md article in the terminal')
    .option('--en', 'Read the English version (shorthand for --lang en)')
    .option(
      '--lang <code>',
      `Language: ${SUPPORTED_LANGS.join(' or ')} (default: am)`,
    )
    .option('--raw', 'Output raw markdown')
    .option('--web', 'Open in browser')
    .action(async (slug, opts) => {
      try {
        const lang = resolveLang(opts);
        if (lang && !isSupportedLang(lang)) {
          console.error(
            chalk.red(
              `Unsupported language "${lang}". Use: ${SUPPORTED_LANGS.join(', ')}.`,
            ),
          );
          process.exit(1);
        }

        await ensureData();

        // Load file list for the requested language
        const articleFiles = lang
          ? getArticleFilesForLang(lang)
          : getArticleFiles();

        if (!articleFiles || articleFiles.length === 0) {
          if (lang) {
            console.log(
              chalk.yellow(`\n  No published ${lang} articles found.\n`),
            );
          } else {
            console.log(
              chalk.yellow(
                '\n  The knowledge base is empty or not synced yet. Run:',
              ),
            );
            console.log(chalk.cyan('  ethiopiamd sync\n'));
          }
          return;
        }

        const filePath = await findArticle(slug, articleFiles);

        if (!filePath) {
          // If an English version was requested but not found, fall back to Amharic
          if (lang) {
            console.log(
              chalk.yellow(
                `\n  No "${lang}" version of "${slug}" found; showing the Amharic original.\n`,
              ),
            );
            const amPath = await findArticle(slug, getArticleFiles());
            if (!amPath) {
              console.log(chalk.yellow(`\n  Article "${slug}" not found.\n`));
              console.log(chalk.gray('  Try searching:'));
              console.log(chalk.cyan(`  ethiopiamd search ${slug}\n`));
              return;
            }
            return await renderArticleFile(amPath, opts);
          }

          console.log(chalk.yellow(`\n  Article "${slug}" not found.\n`));
          console.log(chalk.gray('  Try searching:'));
          console.log(chalk.cyan(`  ethiopiamd search ${slug}\n`));
          return;
        }

        await renderArticleFile(filePath, opts);
      } catch (err) {
        console.error(chalk.red(`Read failed: ${err.message}`));
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
    console.log(chalk.red('\n  Could not read the article.\n'));
    return;
  }

  const fm = article.frontmatter;

  // Handle --web flag: open in browser
  if (opts.web) {
    const url = `https://ethiopia.md/${fm.lang === 'en' ? 'en/' : ''}${fm.category}/${fm.slug}`;
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
