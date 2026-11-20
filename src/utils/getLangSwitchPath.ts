import { readFile } from 'fs/promises';
import { resolve } from 'path';

export async function getLangSwitchPath(currentPath: string) {
  // Language switch logic — use _translations.json for article pages
  let zhLink = '/';
  let enLink = '/en';

  const normalizePath = (path: string) => {
    if (!path) return '/';
    const withLeading = path.startsWith('/') ? path : `/${path}`;
    if (withLeading.length > 1 && withLeading.endsWith('/')) {
      return withLeading.slice(0, -1);
    }
    return withLeading;
  };

  // Build translation lookup from _translations.json
  const translationMap = new Map<string, string>(); // enUrl → zhUrl
  const reverseMap = new Map<string, string>(); // zhUrl → enUrl
  try {
    const translationsPath = resolve(
      process.cwd(),
      'knowledge',
      '_translations.json',
    );
    const raw = await readFile(translationsPath, 'utf-8');
    const translations: Record<string, string> = JSON.parse(raw);
    const categoryFolderToSlug: Record<string, string> = {
      History: 'history',
      Geography: 'geography',
      Culture: 'culture',
      Food: 'food',
      Art: 'art',
      Music: 'music',
      Technology: 'technology',
      Nature: 'nature',
      People: 'people',
      Society: 'society',
      Economy: 'economy',
      Lifestyle: 'lifestyle',
      Language: 'language',
      About: 'about',
      Resources: 'resources',
    };
    const addTranslation = (enUrl: string, zhUrl: string) => {
      const normalizedEn = normalizePath(enUrl);
      const normalizedZh = normalizePath(zhUrl);
      const enCandidates = new Set([
        normalizedEn,
        decodeURIComponent(normalizedEn),
      ]);
      const zhCandidates = new Set([
        normalizedZh,
        decodeURIComponent(normalizedZh),
      ]);
      for (const enKey of enCandidates) translationMap.set(enKey, normalizedZh);
      for (const zhKey of zhCandidates) reverseMap.set(zhKey, normalizedEn);
    };
    for (const [enFile, zhFile] of Object.entries(translations)) {
      const enParts = enFile.replace(/\.md$/, '').split('/');
      const zhParts = zhFile.replace(/\.md$/, '').split('/');
      if (enParts.length >= 3 && zhParts.length >= 2) {
        const enCatSlug =
          categoryFolderToSlug[enParts[1]] || enParts[1].toLowerCase();
        const zhCatSlug =
          categoryFolderToSlug[zhParts[0]] || zhParts[0].toLowerCase();
        const enUrl = `/en/${enCatSlug}/${enParts[2]}`;
        const zhUrl = `/${zhCatSlug}/${encodeURIComponent(zhParts[1])}`;
        addTranslation(enUrl, zhUrl);
      } else if (enParts.length === 2 && zhParts.length === 1) {
        const enUrl = `/en/${enParts[1]}`;
        const zhUrl = `/${encodeURIComponent(zhParts[0])}`;
        addTranslation(enUrl, zhUrl);
      }
    }
  } catch {}

  const normalizedPath = normalizePath(currentPath);
  const decodedPath = normalizePath(decodeURIComponent(normalizedPath));

  if (normalizedPath.startsWith('/en')) {
    enLink = normalizedPath;
    zhLink =
      translationMap.get(decodedPath) ||
      translationMap.get(normalizedPath) ||
      (() => {
        const match = normalizedPath.match(/^\/en\/([^/]+)\/[^/]+$/);
        return match
          ? `/${match[1]}`
          : normalizedPath.replace(/^\/en/, '') || '/';
      })();
  } else {
    zhLink = normalizedPath;
    enLink =
      reverseMap.get(decodedPath) ||
      reverseMap.get(normalizedPath) ||
      (() => {
        const match = normalizedPath.match(/^\/([^/]+)\/[^/]+$/);
        return match
          ? `/en/${match[1]}`
          : '/en' + (normalizedPath === '/' ? '' : normalizedPath);
      })();
  }

  return {
    enLink,
    zhLink,
  };
}
