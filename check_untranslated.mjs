#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 讀取翻譯映射
const translationsPath = path.join(
  process.env.HOME,
  'taiwan-md/knowledge/_translations.json',
);
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// 取得已翻譯的中文檔案清單（values）
const translatedFiles = new Set(Object.values(translations));

// 遞迴掃描所有 .md 檔案
function scanDirectory(dir, files = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 排除 en/, zh-TW/ 目錄
      if (!['en', 'zh-TW'].includes(entry)) {
        scanDirectory(fullPath, files);
      }
    } else if (entry.endsWith('.md')) {
      // 排除 _ 開頭和 ROADMAP 檔案
      if (!entry.startsWith('_') && !entry.includes('ROADMAP')) {
        const relativePath = path.relative(
          path.join(process.env.HOME, 'taiwan-md/knowledge'),
          fullPath,
        );
        files.push(relativePath);
      }
    }
  }

  return files;
}

// 掃描所有檔案
const knowledgeDir = path.join(process.env.HOME, 'taiwan-md/knowledge');
const allFiles = scanDirectory(knowledgeDir);

// 找出未翻譯的檔案
const untranslatedFiles = allFiles.filter((file) => !translatedFiles.has(file));

// 按分類分組
const categories = {};
for (const file of untranslatedFiles) {
  const category = file.split('/')[0];
  if (!categories[category]) categories[category] = [];
  categories[category].push(file);
}

// 按優先序排序分類
const priorityOrder = [
  'Art',
  'Culture',
  'Technology',
  'Economy',
  'Nature',
  'Society',
  'Geography',
  'Music',
  'Food',
  'Lifestyle',
  'People',
  'About',
];

console.log('=== 未翻譯檔案統計 ===');
console.log(`總計：${untranslatedFiles.length} 個檔案`);
console.log('');

for (const category of priorityOrder) {
  if (categories[category] && categories[category].length > 0) {
    console.log(`${category} (${categories[category].length}):`);
    categories[category].forEach((file) => console.log(`  ${file}`));
    console.log('');
  }
}

// 輸出前 3 個要翻譯的檔案
console.log('=== 本次翻譯清單（前3個）===');
let count = 0;
for (const category of priorityOrder) {
  if (categories[category] && count < 3) {
    for (const file of categories[category]) {
      if (count < 3) {
        console.log(`${count + 1}. ${file}`);
        count++;
      }
    }
  }
}
