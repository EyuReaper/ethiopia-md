#!/usr/bin/env python3
import json
import os
import glob

# 讀取翻譯映射
with open('/Users/cheyuwu/taiwan-md/knowledge/_translations.json', 'r', encoding='utf-8') as f:
    translations = json.load(f)

# 建立已翻譯的中文檔案集合（去除 .md 副檔名）
translated_zh_files = set()
for en_path, zh_path in translations.items():
    # zh_path 格式如 "Art/台灣水彩畫的百年流變.md"
    translated_zh_files.add(zh_path)

print(f"已翻譯文章數量: {len(translated_zh_files)}")

# 找所有中文 .md 檔案
knowledge_dir = "/Users/cheyuwu/taiwan-md/knowledge"
all_zh_files = []

for root, dirs, files in os.walk(knowledge_dir):
    # 排除 en/, zh-TW/, _ 開頭的目錄
    dirs[:] = [d for d in dirs if not d.startswith('en') and not d.startswith('zh-TW') and not d.startswith('_')]
    
    for file in files:
        if file.endswith('.md') and not file.startswith('_') and 'ROADMAP' not in file:
            rel_path = os.path.relpath(os.path.join(root, file), knowledge_dir)
            all_zh_files.append(rel_path)

print(f"總中文文章數量: {len(all_zh_files)}")

# 找出尚未翻譯的檔案
untranslated = []
for zh_file in all_zh_files:
    if zh_file not in translated_zh_files:
        untranslated.append(zh_file)

print(f"尚未翻譯文章數量: {len(untranslated)}")

# 按分類分組，依照優先序排序
categories_priority = [
    "Art", "Culture", "Technology", "Economy", "Nature", 
    "Society", "Geography", "Music", "Food", "Lifestyle", "People", "About"
]

categorized = {cat: [] for cat in categories_priority}
other_categories = []

for file in untranslated:
    category = file.split('/')[0]
    if category in categorized:
        categorized[category].append(file)
    else:
        other_categories.append(file)

# 印出結果
print("\n=== 尚未翻譯的文章（按優先序分類） ===")
total_count = 0
for category in categories_priority:
    if categorized[category]:
        print(f"\n{category} ({len(categorized[category])} 篇):")
        for file in sorted(categorized[category]):
            print(f"  {file}")
            total_count += 1

if other_categories:
    print(f"\n其他分類 ({len(other_categories)} 篇):")
    for file in sorted(other_categories):
        print(f"  {file}")
        total_count += 1

print(f"\n總計尚未翻譯: {total_count} 篇")

# 輸出前 3 篇（按優先序）
print("\n=== 本次翻譯候選（前 3 篇）===")
candidates = []
for category in categories_priority:
    for file in sorted(categorized[category]):
        candidates.append(file)
        if len(candidates) >= 3:
            break
    if len(candidates) >= 3:
        break

for i, file in enumerate(candidates[:3], 1):
    print(f"{i}. {file}")