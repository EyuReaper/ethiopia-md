#!/usr/bin/env python3
import json
import os
from pathlib import Path

# 讀取翻譯映射
with open("knowledge/_translations.json", "r", encoding="utf-8") as f:
    translations = json.load(f)

# 取得所有已翻譯的中文檔案路徑
translated_zh_files = set(translations.values())

# 掃描所有中文 .md 檔案
untranslated = []
knowledge_dir = Path("knowledge")

for md_file in knowledge_dir.glob("**/*.md"):
    # 排除 en/, zh-TW/, _ 開頭, ROADMAP
    relative_path = str(md_file.relative_to(Path(".")))
    
    if (
        "/en/" not in relative_path 
        and "/zh-TW/" not in relative_path 
        and not md_file.name.startswith("_")
        and "ROADMAP" not in md_file.name
        and relative_path not in translated_zh_files
    ):
        untranslated.append(relative_path)

# 按分類排序（依照優先序）
category_priority = {
    "Art": 1, "Culture": 2, "Technology": 3, "Economy": 4, 
    "Nature": 5, "Society": 6, "Geography": 7, "Music": 8, 
    "Food": 9, "Lifestyle": 10, "People": 11, "About": 12, "History": 13
}

def get_priority(path):
    for category in category_priority:
        if f"/{category}/" in path:
            return category_priority[category]
    return 99

untranslated.sort(key=get_priority)

print(f"找到 {len(untranslated)} 個尚未翻譯的檔案：")
for i, file in enumerate(untranslated, 1):
    print(f"{i}. {file}")