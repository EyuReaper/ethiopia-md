#!/bin/bash
# Ethiopia.md sync script
# Purpose: knowledge/ SSOT → src/content/ + frontmatter fix
# Usage: bash scripts/sync.sh

set -e  # Exit on error

echo "🚀 Ethiopia.md sync starting..."
echo "================================================="

# 1. Sync knowledge/ SSOT into src/content/
echo ""
echo "🔄 Step 1/2: syncing knowledge/ → src/content/..."

# Create target directories
echo "📁 Creating directories..."
mkdir -p src/content/am/{about,art,culture,economy,food,geography,history,lifestyle,music,nature,people,society,technology,resources}
mkdir -p src/content/en/{about,art,culture,economy,food,geography,history,lifestyle,music,nature,people,society,technology,resources}

# Count files
KNOWLEDGE_COUNT=$(find knowledge/ -name "*.md" | wc -l)
CONTENT_BEFORE=$(find src/content/ -name "*.md" | wc -l)

echo "📊 knowledge/ file count: $KNOWLEDGE_COUNT"
echo "📊 src/content/ file count before sync: $CONTENT_BEFORE"

# Sync homepage
echo "📄 Syncing homepage..."
if [ -f "knowledge/_Home.md" ]; then
    cp "knowledge/_Home.md" "src/content/am/_Home.md"
    echo "  ✅ _Home.md"
fi

# Sync Amharic (SSOT) articles
echo "🇪🇹 Syncing Amharic (SSOT) articles..."
SYNCED_COUNT=0
for category in About Art Culture Economy Food Geography History Lifestyle Music Nature People Society Technology; do
  if [ -d "knowledge/$category" ]; then
    lowercase_category=$(echo $category | tr '[:upper:]' '[:lower:]')
    for file in knowledge/$category/*.md; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        target_file="src/content/am/$lowercase_category/$filename"

        # Copy file (knowledge/ is the SSOT — always overwrite)
        cp "$file" "$target_file"
        echo "  ✅ $category/$filename"
        ((SYNCED_COUNT++))
      fi
    done
  fi
done

# Sync resources articles (shared across languages)
echo "📚 Syncing resources articles..."
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

# Sync English translations
echo "🇺🇸 Syncing English translations..."
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

  # Sync English resources
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

# Post-sync count
CONTENT_AFTER_SYNC=$(find src/content/ -name "*.md" | wc -l)

echo ""
echo "🎉 Step 1 done! knowledge/ synced into src/content/"
echo "📊 src/content/ file count now: $CONTENT_AFTER_SYNC"
echo "📊 files added/changed: $((CONTENT_AFTER_SYNC - CONTENT_BEFORE))"

# 2. Fix frontmatter
echo ""
echo "🔧 Step 2/2: fixing frontmatter..."

# Run the Python frontmatter fixer
if [ -f "scripts/utils/fix-all-frontmatter.py" ]; then
    echo "🐍 Running frontmatter fixer..."
    python3 scripts/utils/fix-all-frontmatter.py
    echo "  ✅ frontmatter fixed"
else
    echo "  ⚠️  fix-all-frontmatter.py not found, skipping frontmatter fix"
fi

# Final count
CONTENT_FINAL=$(find src/content/ -name "*.md" | wc -l)

echo ""
echo "🎊 Ethiopia.md sync complete!"
echo "================================================="
echo "📊 knowledge/ file count: $KNOWLEDGE_COUNT"
echo "📊 src/content/ file count: $CONTENT_FINAL"
echo "🔄 files synced: $SYNCED_COUNT"
echo ""
echo "✨ knowledge/ SSOT → src/content/ sync complete"
echo "🔧 frontmatter fixed"

# 3. Check images
echo ""
echo "🖼️ Step 3: checking images..."
node scripts/utils/check-images.mjs || echo "  ⚠️  image check found issues — run npm run check-images for details"

echo ""
echo "▶️  Next: run npm run build"
