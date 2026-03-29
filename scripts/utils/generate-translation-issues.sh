#!/bin/bash
# generate-translation-issues.sh — [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context]: bash scripts/generate-translation-issues.sh
# [Amharic translation needed - original Taiwan context]: TRANSLATION-STATUS.md（[Amharic translation needed - original Taiwan context]）

cd "$(dirname "$0")/.." || exit 1

echo "🔍 [Amharic translation needed - original Taiwan context]..."

# [Amharic translation needed - original Taiwan context]
ZH_COUNT=$(find knowledge/ -name "*.md" -not -path "*/en/*" -not -path "*/es/*" -not -path "*/ja/*" -not -name "_*" -not -name "PEOPLE-ROADMAP.md" | wc -l | tr -d ' ')

# [Amharic translation needed - original Taiwan context]
EN_COUNT=$(find knowledge/en/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
ES_COUNT=$(find knowledge/es/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')
JA_COUNT=$(find knowledge/ja/ -name "*.md" -not -name "_*" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "📊 [Amharic translation needed - original Taiwan context]："
echo "  [Amharic translation needed - original Taiwan context]: $ZH_COUNT [Amharic translation needed - original Taiwan context] (SSOT)"
echo "  [Amharic translation needed - original Taiwan context]: $EN_COUNT / $ZH_COUNT ($(( EN_COUNT * 100 / ZH_COUNT ))%)"
echo "  [Amharic translation needed - original Taiwan context]: $ES_COUNT / $ZH_COUNT ($(( ES_COUNT * 100 / ZH_COUNT ))%)"
echo "  [Amharic translation needed - original Taiwan context]: $JA_COUNT / $ZH_COUNT ($(( JA_COUNT * 100 / ZH_COUNT ))%)"

# [Amharic translation needed - original Taiwan context]
echo ""
echo "=== [Amharic translation needed - original Taiwan context] ==="

python3 << 'PYEOF'
import os, json

with open('knowledge/_translations.json') as f:
    trans = json.load(f)

# [Amharic translation needed - original Taiwan context]
zh_files = []
for root, dirs, files in os.walk('knowledge/'):
    if '/en/' in root or '/es/' in root or '/ja/' in root:
        continue
    for f in files:
        if f.endswith('.md') and not f.startswith('_') and f != 'PEOPLE-ROADMAP.md':
            zh_files.append(os.path.join(root, f))

# [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]
missing_en = []
for zh in sorted(zh_files):
    en = trans.get(zh, '')
    if not en or not os.path.exists(en):
        cat = zh.split('/')[1] if len(zh.split('/')) > 2 else 'Other'
        title = os.path.splitext(os.path.basename(zh))[0]
        missing_en.append((cat, title, zh))

# [Amharic translation needed - original Taiwan context]
from collections import defaultdict
by_cat = defaultdict(list)
for cat, title, path in missing_en:
    by_cat[cat].append((title, path))

for cat in sorted(by_cat.keys()):
    items = by_cat[cat]
    print(f"\n### {cat} ({len(items)} [Amharic translation needed - original Taiwan context])")
    for title, path in items[:10]:
        print(f"- [ ] {title}")
    if len(items) > 10:
        print(f"- ... [Amharic translation needed - original Taiwan context] {len(items)-10} [Amharic translation needed - original Taiwan context]")

print(f"\n**[Amharic translation needed - original Taiwan context] {len(missing_en)} [Amharic translation needed - original Taiwan context]**")
PYEOF
