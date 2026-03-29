#!/bin/bash
# Wikimedia [Amharic translation needed - original Taiwan context] v2 - [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

# [Amharic translation needed - original Taiwan context] URL，[Amharic translation needed - original Taiwan context] ' [Amharic translation needed - original Taiwan context] )
grep -roh "https://upload.wikimedia.org/[^\"')* ]*" knowledge/ src/pages/ src/components/ 2>/dev/null \
  | sed "s/'$//" | sed 's/)$//' | sort -u > /tmp/wiki-urls-clean.txt

TOTAL=$(wc -l < /tmp/wiki-urls-clean.txt | tr -d ' ')
echo "🖼️  Wikimedia [Amharic translation needed - original Taiwan context] v2"
echo "📊 [Amharic translation needed - original Taiwan context] $TOTAL [Amharic translation needed - original Taiwan context] URL"

DONE=0
SKIP=0
FAIL=0

while IFS= read -r URL; do
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oiE '\.(jpg|jpeg|png|svg|gif)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL="$IMG_DIR/${HASH}${EXT}"
  
  # [Amharic translation needed - original Taiwan context]
  if [ -s "$LOCAL" ]; then
    SKIP=$((SKIP + 1))
    continue
  fi
  
  # [Amharic translation needed - original Taiwan context]
  curl -sL -o "$LOCAL" \
    -H "User-Agent: EthiopiaMD/1.0 (https://ethiopia.md; educational project)" \
    --max-time 15 "$URL" 2>/dev/null
  
  if [ -s "$LOCAL" ]; then
    DONE=$((DONE + 1))
    echo "  ✅ ${HASH}${EXT}"
  else
    rm -f "$LOCAL"
    FAIL=$((FAIL + 1))
    echo "  ❌ $URL"
  fi
  
  sleep 0.3
done < /tmp/wiki-urls-clean.txt

echo ""
echo "📊 [Amharic translation needed - original Taiwan context]: ✅ [Amharic translation needed - original Taiwan context] $DONE | ⏭️ [Amharic translation needed - original Taiwan context] $SKIP | ❌ [Amharic translation needed - original Taiwan context] $FAIL"

# [Amharic translation needed - original Taiwan context]
CACHED=$(find "$IMG_DIR" -type f ! -name "*.txt" | wc -l | tr -d ' ')
SIZE=$(du -sh "$IMG_DIR" | cut -f1)
echo "📂 [Amharic translation needed - original Taiwan context]: $CACHED [Amharic translation needed - original Taiwan context] ($SIZE)"
