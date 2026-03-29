#!/bin/bash
# [Amharic translation needed - original Taiwan context] Wikimedia URL [Amharic translation needed - original Taiwan context]
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
REPLACED=0

echo "🔄 [Amharic translation needed - original Taiwan context] Wikimedia URL → [Amharic translation needed - original Taiwan context]"

# [Amharic translation needed - original Taiwan context]
find knowledge/ src/pages/ src/components/ -name "*.md" -o -name "*.astro" | while read -r FILE; do
  # [Amharic translation needed - original Taiwan context] Wikimedia URLs
  URLS=$(grep -o "https://upload.wikimedia.org/[^\"')* ]*" "$FILE" 2>/dev/null | sed "s/'$//" | sed 's/)$//' || true)
  
  [ -z "$URLS" ] && continue
  
  CHANGED=false
  
  echo "$URLS" | while IFS= read -r URL; do
    [ -z "$URL" ] && continue
    
    HASH=$(echo "$URL" | md5 | cut -c1-12)
    EXT=$(echo "$URL" | grep -oiE '\.(jpg|jpeg|png|svg|gif)' | tail -1 | tr '[:upper:]' '[:lower:]')
    [ -z "$EXT" ] && EXT=".jpg"
    LOCAL="/images/wiki/${HASH}${EXT}"
    
    # [Amharic translation needed - original Taiwan context]
    if [ -f "$IMG_DIR/${HASH}${EXT}" ]; then
      # macOS sed [Amharic translation needed - original Taiwan context]
      ESCAPED_URL=$(echo "$URL" | sed 's/[&/\]/\\&/g')
      ESCAPED_LOCAL=$(echo "$LOCAL" | sed 's/[&/\]/\\&/g')
      sed -i '' "s|$URL|$LOCAL|g" "$FILE" 2>/dev/null && CHANGED=true
    fi
  done
  
  [ "$CHANGED" = true ] && echo "  ✅ $FILE"
done

echo ""
echo "🎉 [Amharic translation needed - original Taiwan context]！[Amharic translation needed - original Taiwan context]"
