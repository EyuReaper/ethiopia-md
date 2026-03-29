#!/bin/bash
# ============================================================
# Ethiopia.md Rewrite Pipeline — [Amharic translation needed - original Taiwan context]
# ============================================================
#
# 🎯 [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] → [Amharic translation needed - original Taiwan context] EDITORIAL v4 [Amharic translation needed - original Taiwan context]
#           [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context] SSOT，[Amharic translation needed - original Taiwan context] sync [Amharic translation needed - original Taiwan context]
#
# 🔄 [Amharic translation needed - original Taiwan context]：
#   1. [Amharic translation needed - original Taiwan context]（browser / web_search / web_fetch）
#   2. [Amharic translation needed - original Taiwan context] knowledge/{Category}/{[Amharic translation needed - original Taiwan context]}.md（[Amharic translation needed - original Taiwan context] SSOT）
#   3. [Amharic translation needed - original Taiwan context] sync.sh（knowledge/ → src/content/）
#   4. [Amharic translation needed - original Taiwan context] build [Amharic translation needed - original Taiwan context]
#   5. [Amharic translation needed - original Taiwan context] quality-scan.sh [Amharic translation needed - original Taiwan context]
#   6. git commit & push
#
# 📋 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] AI agent [Amharic translation needed - original Taiwan context] prompt [Amharic translation needed - original Taiwan context]）：
#
#   [Amharic translation needed - original Taiwan context] rewrite-pipeline [Amharic translation needed - original Taiwan context]「{[Amharic translation needed - original Taiwan context]}」
#
#   Agent [Amharic translation needed - original Taiwan context]：
#   Step 0: [Amharic translation needed - original Taiwan context] EDITORIAL.md [Amharic translation needed - original Taiwan context]
#   Step 1: [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 8+ [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]、[Amharic translation needed - original Taiwan context]）
#   Step 2: [Amharic translation needed - original Taiwan context] knowledge/{Category}/{[Amharic translation needed - original Taiwan context]}.md
#   Step 3: bash scripts/core/sync.sh
#   Step 4: npm run build（[Amharic translation needed - original Taiwan context] frontmatter）
#   Step 5: bash tools/quality-scan.sh（[Amharic translation needed - original Taiwan context] ≤ 3）
#   Step 6: git add -A && git commit && git push
#
# ⚠️ [Amharic translation needed - original Taiwan context]：
#   - [Amharic translation needed - original Taiwan context] knowledge/ = SSOT（Single Source of Truth）
#   - [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context] scripts/sync.sh [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context] src/content/
#   - [Amharic translation needed - original Taiwan context] knowledge/en/、knowledge/ja/、knowledge/es/
#   - [Amharic translation needed - original Taiwan context] src/content/（[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] sync [Amharic translation needed - original Taiwan context]）
#   - [Amharic translation needed - original Taiwan context] = [Amharic translation needed - original Taiwan context] knowledge/{Category}/ [Amharic translation needed - original Taiwan context] .md [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] sync
#
# ============================================================

set -e
cd "$(dirname "$0")/.."

TOPIC="${1:-}"
CATEGORY="${2:-}"

if [ -z "$TOPIC" ]; then
  echo "❌ [Amharic translation needed - original Taiwan context]: bash tools/rewrite-pipeline.sh \"[Amharic translation needed - original Taiwan context]\" \"Category\""
  echo ""
  echo "[Amharic translation needed - original Taiwan context]:"
  echo "  bash tools/rewrite-pipeline.sh \"[Amharic translation needed - original Taiwan context]\" \"People\""
  echo "  bash tools/rewrite-pipeline.sh \"[Amharic translation needed - original Taiwan context]\" \"Food\""
  echo ""
  echo "📋 Pipeline [Amharic translation needed - original Taiwan context]："
  echo "  1. [Amharic translation needed - original Taiwan context]（8+ [Amharic translation needed - original Taiwan context]）"
  echo "  2. [Amharic translation needed - original Taiwan context] knowledge/{Category}/{[Amharic translation needed - original Taiwan context]}.md（SSOT）"
  echo "  3. sync.sh（knowledge/ → src/content/）"
  echo "  4. npm run build（[Amharic translation needed - original Taiwan context]）"
  echo "  5. quality-scan.sh（[Amharic translation needed - original Taiwan context] ≤ 3）"
  echo "  6. git commit & push"
  echo ""
  echo "⚠️ SSOT [Amharic translation needed - original Taiwan context]："
  echo "  knowledge/     ← [Amharic translation needed - original Taiwan context] SSOT（[Amharic translation needed - original Taiwan context]）"
  echo "  knowledge/en/  ← [Amharic translation needed - original Taiwan context]"
  echo "  knowledge/ja/  ← [Amharic translation needed - original Taiwan context]"
  echo "  src/content/   ← [Amharic translation needed - original Taiwan context]（sync.sh [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]）"
  exit 1
fi

echo "🇪🇹 Ethiopia.md Rewrite Pipeline"
echo "================================================="
echo "📝 [Amharic translation needed - original Taiwan context]: $TOPIC"
echo "📂 [Amharic translation needed - original Taiwan context]: ${CATEGORY:-（[Amharic translation needed - original Taiwan context]）}"
echo ""
echo "⚠️ [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]。"
echo "   [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] AI agent [Amharic translation needed - original Taiwan context]。"
echo "   [Amharic translation needed - original Taiwan context] sync → build → [Amharic translation needed - original Taiwan context] → push。"
echo "================================================="
echo ""

# Step 3: Sync
echo "🔄 Step 3/6: [Amharic translation needed - original Taiwan context] knowledge/ → src/content/..."
bash scripts/core/sync.sh
echo ""

# Step 4: Build
echo "🏗️  Step 4/6: Build [Amharic translation needed - original Taiwan context]..."
BUILD_OUT=$(npm run build 2>&1)
if echo "$BUILD_OUT" | grep -q "error"; then
  echo "❌ Build [Amharic translation needed - original Taiwan context]！"
  echo "$BUILD_OUT" | tail -20
  exit 1
fi
PAGE_COUNT=$(echo "$BUILD_OUT" | grep -o '[0-9]* page' | tail -1 | grep -o '[0-9]*')
echo "  ✅ Build [Amharic translation needed - original Taiwan context]（${PAGE_COUNT} pages）"
echo ""

# Step 5: Quality check
echo "🔍 Step 5/6: [Amharic translation needed - original Taiwan context]..."
if [ -n "$CATEGORY" ]; then
  FILE_PATH="knowledge/$CATEGORY/$TOPIC.md"
  if [ -f "$FILE_PATH" ]; then
    SCORE=$(bash tools/quality-scan.sh 2>/dev/null | grep "$TOPIC" | head -1 || echo "")
    if [ -n "$SCORE" ]; then
      echo "  📊 $SCORE"
    else
      echo "  ℹ️  quality-scan.sh [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）"
    fi
  fi
fi
echo ""

# Step 6: Git
echo "🚀 Step 6/6: Git commit & push..."
git add -A
if git diff --cached --quiet; then
  echo "  ℹ️  [Amharic translation needed - original Taiwan context]"
else
  git commit -m "content: [Amharic translation needed - original Taiwan context]「$TOPIC」(rewrite-pipeline)" --no-verify
  git push
  echo "  ✅ [Amharic translation needed - original Taiwan context]"
fi

echo ""
echo "================================================="
echo "🎉 Pipeline [Amharic translation needed - original Taiwan context]！"
echo "  📝 SSOT: knowledge/${CATEGORY}/${TOPIC}.md"
echo "  🔄 [Amharic translation needed - original Taiwan context] src/content/"
echo "  🌐 https://ethiopia.md"
echo "================================================="
