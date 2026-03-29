#!/bin/bash
# check-translation-sync.sh — [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context]: bash scripts/check-translation-sync.sh [hours]
# [Amharic translation needed - original Taiwan context]: 24 [Amharic translation needed - original Taiwan context]

HOURS="${1:-24}"

echo "🔍 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] ${HOURS} [Amharic translation needed - original Taiwan context]）..."
echo ""

# [Amharic translation needed - original Taiwan context]
CHANGED_ZH=$(git log --since="${HOURS} hours ago" --name-only --pretty=format: -- 'knowledge/**/*.md' ':!knowledge/en/**' ':!knowledge/**/_*' | sort -u | grep -v '^$')

if [ -z "$CHANGED_ZH" ]; then
    echo "✅ [Amharic translation needed - original Taiwan context]"
    exit 0
fi

STALE=0
MISSING=0
SYNCED=0

for zh in $CHANGED_ZH; do
    # [Amharic translation needed - original Taiwan context] _translations.json [Amharic translation needed - original Taiwan context]
    en=$(python3 -c "
import json
with open('knowledge/_translations.json') as f:
    d = json.load(f)
print(d.get('$zh', ''))
" 2>/dev/null)
    
    if [ -z "$en" ]; then
        echo "  ⚠️  $zh — [Amharic translation needed - original Taiwan context] translations.json"
        MISSING=$((MISSING + 1))
        continue
    fi
    
    if [ ! -f "$en" ]; then
        echo "  ❌ $zh — [Amharic translation needed - original Taiwan context]"
        MISSING=$((MISSING + 1))
        continue
    fi
    
    # [Amharic translation needed - original Taiwan context] git commit [Amharic translation needed - original Taiwan context]
    zh_ts=$(git log -1 --format=%ct -- "$zh" 2>/dev/null)
    en_ts=$(git log -1 --format=%ct -- "$en" 2>/dev/null)
    
    if [ -n "$zh_ts" ] && [ -n "$en_ts" ] && [ "$zh_ts" -gt "$((en_ts + 300))" ]; then
        diff_hrs=$(( (zh_ts - en_ts) / 3600 ))
        echo "  🔄 $zh — [Amharic translation needed - original Taiwan context] ${diff_hrs}h"
        STALE=$((STALE + 1))
    else
        SYNCED=$((SYNCED + 1))
    fi
done

echo ""
echo "📊 ${STALE} [Amharic translation needed - original Taiwan context] | ${MISSING} [Amharic translation needed - original Taiwan context] | ${SYNCED} [Amharic translation needed - original Taiwan context]"

if [ "$STALE" -gt 0 ] || [ "$MISSING" -gt 0 ]; then
    exit 1
fi
exit 0
