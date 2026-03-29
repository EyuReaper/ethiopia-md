#!/bin/bash
# [Amharic translation needed - original Taiwan context] Wikimedia [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context] URL
# [Amharic translation needed - original Taiwan context] Wikimedia 429 rate limit [Amharic translation needed - original Taiwan context]
set -e
cd "$(dirname "$0")/.."

IMG_DIR="public/images/wiki"
mkdir -p "$IMG_DIR"

echo "🖼️  Wikimedia [Amharic translation needed - original Taiwan context]"
echo "================================================="

# [Amharic translation needed - original Taiwan context] Wikimedia URLs
URLS=$(grep -roh 'https://upload.wikimedia.org/[^")*'"'"' ]*' knowledge/ src/pages/ src/components/ 2>/dev/null | sed "s/'$//" | sort -u)

TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "📊 [Amharic translation needed - original Taiwan context] $TOTAL [Amharic translation needed - original Taiwan context] Wikimedia [Amharic translation needed - original Taiwan context] URL"
echo ""

COUNT=0
CACHED=0
FAILED=0

for URL in $URLS; do
  COUNT=$((COUNT + 1))
  
  # [Amharic translation needed - original Taiwan context]（URL hash + [Amharic translation needed - original Taiwan context]）
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oE '\.(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL_FILE="$IMG_DIR/${HASH}${EXT}"
  LOCAL_PATH="/images/wiki/${HASH}${EXT}"
  
  if [ -f "$LOCAL_FILE" ]; then
    echo "  ⏭️  [$COUNT/$TOTAL] [Amharic translation needed - original Taiwan context]: ${HASH}${EXT}"
    CACHED=$((CACHED + 1))
    continue
  fi
  
  echo -n "  ⬇️  [$COUNT/$TOTAL] [Amharic translation needed - original Taiwan context]... "
  
  # [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] User-Agent [Amharic translation needed - original Taiwan context]）
  HTTP_CODE=$(curl -s -o "$LOCAL_FILE" -w "%{http_code}" \
    -H "User-Agent: EthiopiaMD/1.0 (https://ethiopia.md; educational open-source project)" \
    -L --max-time 15 "$URL" 2>/dev/null)
  
  if [ "$HTTP_CODE" = "200" ] && [ -s "$LOCAL_FILE" ]; then
    SIZE=$(wc -c < "$LOCAL_FILE" | tr -d ' ')
    echo "✅ ${HASH}${EXT} (${SIZE} bytes)"
    CACHED=$((CACHED + 1))
  else
    echo "❌ HTTP $HTTP_CODE"
    rm -f "$LOCAL_FILE"
    FAILED=$((FAILED + 1))
  fi
  
  # Rate limit [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] 0.5 [Amharic translation needed - original Taiwan context]
  sleep 0.5
done

echo ""
echo "================================================="
echo "📊 [Amharic translation needed - original Taiwan context]: $CACHED [Amharic translation needed - original Taiwan context] / $FAILED [Amharic translation needed - original Taiwan context] / $TOTAL [Amharic translation needed - original Taiwan context]"
echo "📂 [Amharic translation needed - original Taiwan context]: $IMG_DIR"

# [Amharic translation needed - original Taiwan context] URL mapping [Amharic translation needed - original Taiwan context]
echo ""
echo "📝 [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]..."
MAPPING="$IMG_DIR/url-mapping.txt"
> "$MAPPING"

for URL in $URLS; do
  HASH=$(echo "$URL" | md5 | cut -c1-12)
  EXT=$(echo "$URL" | grep -oE '\.(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG)' | tail -1 | tr '[:upper:]' '[:lower:]')
  [ -z "$EXT" ] && EXT=".jpg"
  LOCAL_PATH="/images/wiki/${HASH}${EXT}"
  
  if [ -f "$IMG_DIR/${HASH}${EXT}" ]; then
    echo "$URL → $LOCAL_PATH" >> "$MAPPING"
  fi
done

MAP_COUNT=$(wc -l < "$MAPPING" | tr -d ' ')
echo "  ✅ $MAP_COUNT [Amharic translation needed - original Taiwan context] $MAPPING"
echo ""
echo "💡 [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] scripts/replace-wiki-urls.sh [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]"
echo "================================================="
