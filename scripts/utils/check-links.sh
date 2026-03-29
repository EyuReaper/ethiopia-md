#!/bin/bash

# Ethiopia.md [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context] .md [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context] HTTP [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]

set -euo pipefail

# [Amharic translation needed - original Taiwan context]
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# [Amharic translation needed - original Taiwan context]
KNOWLEDGE_DIR="knowledge"
TIMEOUT=10
PARALLEL_JOBS=10
TEMP_FILE=$(mktemp)
DEAD_LINKS_FILE="dead-links-report-$(date +%Y%m%d-%H%M%S).txt"

# [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] 403 [Amharic translation needed - original Taiwan context]）
IGNORE_PATTERNS=(
    "github.com/.*"
    "api.github.com/.*"
    "linkedin.com/.*"
    "facebook.com/.*"
    "instagram.com/.*"
)

echo -e "${BLUE}🔍 Ethiopia.md [Amharic translation needed - original Taiwan context]${NC}"
echo -e "[Amharic translation needed - original Taiwan context]: ${KNOWLEDGE_DIR}"
echo -e "[Amharic translation needed - original Taiwan context]: ${PARALLEL_JOBS}"
echo -e "[Amharic translation needed - original Taiwan context]: ${TIMEOUT}[Amharic translation needed - original Taiwan context]"
echo ""

# [Amharic translation needed - original Taiwan context]
cleanup() {
    rm -f "$TEMP_FILE" 2>/dev/null || true
}
trap cleanup EXIT

# [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]
check_url() {
    local file="$1"
    local line_num="$2"
    local url="$3"
    
    # [Amharic translation needed - original Taiwan context]
    for pattern in "${IGNORE_PATTERNS[@]}"; do
        if [[ "$url" =~ $pattern ]]; then
            echo "SKIP|$file|$line_num|$url|[Amharic translation needed - original Taiwan context]"
            return
        fi
    done
    
    # [Amharic translation needed - original Taiwan context] HTTP/HTTPS URL
    if [[ ! "$url" =~ ^https?:// ]]; then
        return
    fi
    
    # [Amharic translation needed - original Taiwan context] HEAD request
    local status_code
    status_code=$(curl -sI -o /dev/null -w '%{http_code}' \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        --user-agent "Ethiopia.md Link Checker (https://ethiopia.md)" \
        "$url" 2>/dev/null || echo "000")
    
    # [Amharic translation needed - original Taiwan context]
    case "$status_code" in
        "000")
            echo "ERROR|$file|$line_num|$url|[Amharic translation needed - original Taiwan context]"
            ;;
        [45]*)
            echo "DEAD|$file|$line_num|$url|HTTP $status_code"
            ;;
        *)
            echo "OK|$file|$line_num|$url|HTTP $status_code"
            ;;
    esac
}

# [Amharic translation needed - original Taiwan context] xargs [Amharic translation needed - original Taiwan context]
export -f check_url
export TIMEOUT
export IGNORE_PATTERNS

# [Amharic translation needed - original Taiwan context] URL [Amharic translation needed - original Taiwan context]
echo -e "${YELLOW}⚙️  [Amharic translation needed - original Taiwan context]...${NC}"

find "$KNOWLEDGE_DIR" -name "*.md" -type f | while read -r file; do
    # [Amharic translation needed - original Taiwan context] Markdown [Amharic translation needed - original Taiwan context] [text](url)
    grep -n '\[.*\](http[^)]*)' "$file" 2>/dev/null | \
        sed -E 's/.*\[([^\]]*)\]\(([^)]*)\).*/\2/' | \
        nl -nln | \
        while read -r line_num url; do
            echo "$file|$line_num|$url"
        done
    
    # [Amharic translation needed - original Taiwan context] URL（[Amharic translation needed - original Taiwan context] http [Amharic translation needed - original Taiwan context] URL）
    grep -n -o 'https\?://[^[:space:]<>()]*' "$file" 2>/dev/null | \
        while IFS=: read -r line_num url; do
            echo "$file|$line_num|$url"
        done
done > "$TEMP_FILE"

total_links=$(wc -l < "$TEMP_FILE")
echo -e "[Amharic translation needed - original Taiwan context] ${total_links} [Amharic translation needed - original Taiwan context]"

if [ "$total_links" -eq 0 ]; then
    echo -e "${GREEN}✅ [Amharic translation needed - original Taiwan context]${NC}"
    exit 0
fi

echo -e "\n${YELLOW}🌐 [Amharic translation needed - original Taiwan context]...${NC}"

# [Amharic translation needed - original Taiwan context] URL
check_results=$(while IFS='|' read -r file line_num url; do
    echo "check_url \"$file\" \"$line_num\" \"$url\""
done < "$TEMP_FILE" | xargs -n 1 -P "$PARALLEL_JOBS" -I {} bash -c "{}")

# [Amharic translation needed - original Taiwan context]
ok_count=0
dead_count=0
error_count=0
skip_count=0

echo -e "\n${BLUE}📊 [Amharic translation needed - original Taiwan context]：${NC}"
echo "=========================================="

{
    echo "# Ethiopia.md [Amharic translation needed - original Taiwan context]"
    echo "# [Amharic translation needed - original Taiwan context]: $(date)"
    echo "# [Amharic translation needed - original Taiwan context]: $KNOWLEDGE_DIR"
    echo ""
} > "$DEAD_LINKS_FILE"

# [Amharic translation needed - original Taiwan context]
while IFS='|' read -r status file line_num url message; do
    case "$status" in
        "OK")
            ((ok_count++))
            ;;
        "DEAD")
            ((dead_count++))
            echo -e "${RED}💀 [Amharic translation needed - original Taiwan context]${NC}: $file:$line_num"
            echo -e "   ${RED}URL: $url${NC}"
            echo -e "   ${RED}[Amharic translation needed - original Taiwan context]: $message${NC}"
            echo ""
            echo "DEAD|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "ERROR")
            ((error_count++))
            echo -e "${YELLOW}⚠️  [Amharic translation needed - original Taiwan context]${NC}: $file:$line_num"
            echo -e "   ${YELLOW}URL: $url${NC}"
            echo -e "   ${YELLOW}[Amharic translation needed - original Taiwan context]: $message${NC}"
            echo ""
            echo "ERROR|$file|$line_num|$url|$message" >> "$DEAD_LINKS_FILE"
            ;;
        "SKIP")
            ((skip_count++))
            ;;
    esac
done <<< "$check_results"

echo "=========================================="
echo -e "${GREEN}✅ [Amharic translation needed - original Taiwan context]: $ok_count${NC}"
echo -e "${RED}💀 [Amharic translation needed - original Taiwan context]: $dead_count${NC}"
echo -e "${YELLOW}⚠️  [Amharic translation needed - original Taiwan context]: $error_count${NC}"
echo -e "${BLUE}⏭️  [Amharic translation needed - original Taiwan context]: $skip_count${NC}"
echo -e "${BLUE}📊 [Amharic translation needed - original Taiwan context]: $total_links${NC}"

if [ "$dead_count" -gt 0 ] || [ "$error_count" -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}📄 [Amharic translation needed - original Taiwan context]: $DEAD_LINKS_FILE${NC}"
    
    {
        echo ""
        echo "## [Amharic translation needed - original Taiwan context]"
        echo "- ✅ [Amharic translation needed - original Taiwan context]: $ok_count"
        echo "- 💀 [Amharic translation needed - original Taiwan context]: $dead_count" 
        echo "- ⚠️ [Amharic translation needed - original Taiwan context]: $error_count"
        echo "- ⏭️ [Amharic translation needed - original Taiwan context]: $skip_count"
        echo "- 📊 [Amharic translation needed - original Taiwan context]: $total_links"
    } >> "$DEAD_LINKS_FILE"
    
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 [Amharic translation needed - original Taiwan context]！${NC}"
    rm -f "$DEAD_LINKS_FILE"
    exit 0
fi