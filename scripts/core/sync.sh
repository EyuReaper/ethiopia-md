#!/bin/bash
# Ethiopia.md [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context]：knowledge/ SSOT → src/content/ + frontmatter [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context]：bash scripts/sync.sh

set -e  # [Amharic translation needed - original Taiwan context]

echo "🚀 Ethiopia.md [Amharic translation needed - original Taiwan context]..."
echo "================================================="

# 1. [Amharic translation needed - original Taiwan context] knowledge/ SSOT [Amharic translation needed - original Taiwan context] src/content/ [Amharic translation needed - original Taiwan context]
echo ""
echo "🔄 [Amharic translation needed - original Taiwan context] 1/2: [Amharic translation needed - original Taiwan context] knowledge/ → src/content/..."

# [Amharic translation needed - original Taiwan context]
echo "📁 [Amharic translation needed - original Taiwan context]..."
mkdir -p src/content/am/{about,art,culture,economy,food,geography,history,lifestyle,music,nature,people,society,technology,resources}
mkdir -p src/content/en/{about,art,culture,economy,food,geography,history,lifestyle,music,nature,people,society,technology,resources}

# [Amharic translation needed - original Taiwan context]
KNOWLEDGE_COUNT=$(find knowledge/ -name "*.md" | wc -l)
CONTENT_BEFORE=$(find src/content/ -name "*.md" | wc -l)

echo "📊 knowledge/ [Amharic translation needed - original Taiwan context]: $KNOWLEDGE_COUNT"
echo "📊 [Amharic translation needed - original Taiwan context] src/content/ [Amharic translation needed - original Taiwan context]: $CONTENT_BEFORE"

# [Amharic translation needed - original Taiwan context]
echo "📄 [Amharic translation needed - original Taiwan context]..."
if [ -f "knowledge/_Home.md" ]; then
    cp "knowledge/_Home.md" "src/content/am/_Home.md"
    echo "  ✅ _Home.md"
fi

# [Amharic translation needed - original Taiwan context]
echo "🇪🇹 [Amharic translation needed - original Taiwan context]..."
SYNCED_COUNT=0
for category in About Art Culture Economy Food Geography History Lifestyle Music Nature People Society Technology; do
  if [ -d "knowledge/$category" ]; then
    lowercase_category=$(echo $category | tr '[:upper:]' '[:lower:]')
    for file in knowledge/$category/*.md; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        target_file="src/content/am/$lowercase_category/$filename"
        
        # [Amharic translation needed - original Taiwan context]（SSOT [Amharic translation needed - original Taiwan context]）
        cp "$file" "$target_file"
        echo "  ✅ $category/$filename"
        ((SYNCED_COUNT++))
      fi
    done
  fi
done

# [Amharic translation needed - original Taiwan context] resources [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
echo "📚 [Amharic translation needed - original Taiwan context] resources [Amharic translation needed - original Taiwan context]..."
for resource_dir in "knowledge/resources" "knowledge/am/resources"; do
  if [ -d "$resource_dir" ]; then
    for file in $resource_dir/*.md; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        target_file="src/content/am/resources/$filename"
        cp "$file" "$target_file"
        echo "  ✅ resources/$filename"
        ((SYNCED_COUNT++))
      fi
    done
  fi
done

# [Amharic translation needed - original Taiwan context]
echo "🇺🇸 [Amharic translation needed - original Taiwan context]..."
if [ -d "knowledge/en" ]; then
  for category in About Art Culture Economy Food Geography Lifestyle Music People History Nature Society Technology; do
    if [ -d "knowledge/en/$category" ]; then
      lowercase_category=$(echo $category | tr '[:upper:]' '[:lower:]')
      for file in knowledge/en/$category/*.md; do
        if [ -f "$file" ]; then
          filename=$(basename "$file")
          target_file="src/content/en/$lowercase_category/$filename"
          cp "$file" "$target_file"
          echo "  ✅ en/$category/$filename"
          ((SYNCED_COUNT++))
        fi
      done
    fi
  done
  
  # [Amharic translation needed - original Taiwan context] resources
  if [ -d "knowledge/en/resources" ]; then
    for file in knowledge/en/resources/*.md; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        target_file="src/content/en/resources/$filename"
        cp "$file" "$target_file"
        echo "  ✅ en/resources/$filename"
        ((SYNCED_COUNT++))
      fi
    done
  fi
fi

# [Amharic translation needed - original Taiwan context]
CONTENT_AFTER_SYNC=$(find src/content/ -name "*.md" | wc -l)

echo ""
echo "🎉 [Amharic translation needed - original Taiwan context] 1 [Amharic translation needed - original Taiwan context]！[Amharic translation needed - original Taiwan context]"
echo "📊 [Amharic translation needed - original Taiwan context] src/content/ [Amharic translation needed - original Taiwan context]: $CONTENT_AFTER_SYNC"
echo "📊 [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]: $((CONTENT_AFTER_SYNC - CONTENT_BEFORE))"

# 2. [Amharic translation needed - original Taiwan context] frontmatter
echo ""
echo "🔧 [Amharic translation needed - original Taiwan context] 2/2: [Amharic translation needed - original Taiwan context] frontmatter..."

# [Amharic translation needed - original Taiwan context] Python [Amharic translation needed - original Taiwan context] frontmatter
if [ -f "scripts/utils/fix-all-frontmatter.py" ]; then
    echo "🐍 [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]..."
    python3 scripts/utils/fix-all-frontmatter.py
    echo "  ✅ frontmatter [Amharic translation needed - original Taiwan context]"
else
    echo "  ⚠️  [Amharic translation needed - original Taiwan context] fix-all-frontmatter.py，[Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]"
fi

# [Amharic translation needed - original Taiwan context]
CONTENT_FINAL=$(find src/content/ -name "*.md" | wc -l)

echo ""
echo "🎊 Ethiopia.md [Amharic translation needed - original Taiwan context]！"
echo "================================================="
echo "📊 knowledge/ [Amharic translation needed - original Taiwan context]: $KNOWLEDGE_COUNT"
echo "📊 [Amharic translation needed - original Taiwan context] src/content/ [Amharic translation needed - original Taiwan context]: $CONTENT_FINAL"
echo "🔄 [Amharic translation needed - original Taiwan context]: $SYNCED_COUNT"
echo ""
echo "✨ knowledge/ SSOT → src/content/ [Amharic translation needed - original Taiwan context]"
echo "🔧 frontmatter [Amharic translation needed - original Taiwan context]"

# 3. [Amharic translation needed - original Taiwan context]
echo ""
echo "🖼️ [Amharic translation needed - original Taiwan context] 3: [Amharic translation needed - original Taiwan context]..."
node scripts/utils/check-images.mjs || echo "  ⚠️  [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] npm run check-images [Amharic translation needed - original Taiwan context]"

echo ""
echo "▶️  [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] npm run build [Amharic translation needed - original Taiwan context]"