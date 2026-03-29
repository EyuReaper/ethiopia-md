#!/bin/bash

# Ethiopia.md Featured [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context] knowledge/ [Amharic translation needed - original Taiwan context] featured: true [Amharic translation needed - original Taiwan context]

set -euo pipefail

# [Amharic translation needed - original Taiwan context]
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

KNOWLEDGE_DIR="knowledge"

# [Amharic translation needed - original Taiwan context]
usage() {
    echo -e "${BLUE}🏆 Ethiopia.md Featured [Amharic translation needed - original Taiwan context]${NC}"
    echo ""
    echo "[Amharic translation needed - original Taiwan context]: $0 <command> [arguments]"
    echo ""
    echo "[Amharic translation needed - original Taiwan context]:"
    echo "  list                    - [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]"
    echo "  set <[Amharic translation needed - original Taiwan context]>           - [Amharic translation needed - original Taiwan context] featured"
    echo "  unset <[Amharic translation needed - original Taiwan context]>         - [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]"
    echo "  audit                   - [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]"
    echo ""
    echo "[Amharic translation needed - original Taiwan context]:"
    echo "  $0 list"
    echo "  $0 set knowledge/Culture/Ethiopia[Amharic translation needed - original Taiwan context].md"
    echo "  $0 unset knowledge/Music/Ethiopia[Amharic translation needed - original Taiwan context].md"
    echo "  $0 audit"
}

# [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]
list_featured() {
    echo -e "${BLUE}📋 [Amharic translation needed - original Taiwan context] Featured [Amharic translation needed - original Taiwan context]${NC}"
    echo "======================================"
    
    local count=0
    local current_category=""
    
    # [Amharic translation needed - original Taiwan context]
    grep -r "featured: true" "$KNOWLEDGE_DIR" | \
        sort | \
        while IFS=':' read -r file _; do
            ((count++))
            
            # [Amharic translation needed - original Taiwan context]
            local category=$(dirname "$file" | sed "s|$KNOWLEDGE_DIR/||" | sed 's|^en/||' | cut -d'/' -f1)
            
            if [[ "$category" != "$current_category" ]]; then
                echo -e "\n${YELLOW}📂 $category${NC}"
                current_category="$category"
            fi
            
            # [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
            local title=$(basename "$file" .md)
            echo -e "  ✨ $title"
            echo -e "     ${BLUE}[Amharic translation needed - original Taiwan context]: $file${NC}"
    done
    
    local total=$(grep -r "featured: true" "$KNOWLEDGE_DIR" | wc -l)
    echo ""
    echo -e "${GREEN}📊 [Amharic translation needed - original Taiwan context]: $total [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]${NC}"
}

# [Amharic translation needed - original Taiwan context] featured
set_featured() {
    local file_path="$1"
    
    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ [Amharic translation needed - original Taiwan context]: $file_path${NC}"
        exit 1
    fi
    
    # [Amharic translation needed - original Taiwan context] featured
    if grep -q "featured: true" "$file_path"; then
        echo -e "${YELLOW}⚠️  [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]: $file_path${NC}"
        return
    fi
    
    # [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context] featured: true
    if grep -q "^---$" "$file_path"; then
        # [Amharic translation needed - original Taiwan context] --- [Amharic translation needed - original Taiwan context] featured: true
        sed -i '' '/^---$/,/^---$/{
            /^---$/!{
                /featured:/d
            }
        }' "$file_path"
        
        # [Amharic translation needed - original Taiwan context] --- [Amharic translation needed - original Taiwan context] featured: true
        awk '
        /^---$/ && NR==1 { print; next }
        /^---$/ && seen_first { print "featured: true"; print; next }
        /^---$/ { seen_first=1; print; next }
        { print }
        ' "$file_path" > "${file_path}.tmp" && mv "${file_path}.tmp" "$file_path"
        
        echo -e "${GREEN}✅ [Amharic translation needed - original Taiwan context] featured: $file_path${NC}"
    else
        echo -e "${RED}❌ [Amharic translation needed - original Taiwan context] frontmatter: $file_path${NC}"
        exit 1
    fi
}

# [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]
unset_featured() {
    local file_path="$1"
    
    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ [Amharic translation needed - original Taiwan context]: $file_path${NC}"
        exit 1
    fi
    
    # [Amharic translation needed - original Taiwan context] featured
    if ! grep -q "featured: true" "$file_path"; then
        echo -e "${YELLOW}⚠️  [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]: $file_path${NC}"
        return
    fi
    
    # [Amharic translation needed - original Taiwan context] featured: true [Amharic translation needed - original Taiwan context]
    sed -i '' '/^featured: true$/d' "$file_path"
    
    echo -e "${GREEN}✅ [Amharic translation needed - original Taiwan context] featured: $file_path${NC}"
}

# [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]
audit_featured() {
    echo -e "${BLUE}📊 Featured [Amharic translation needed - original Taiwan context]${NC}"
    echo "======================================"
    
    local total_featured=0
    local total_articles=0
    
    echo -e "${YELLOW}[Amharic translation needed - original Taiwan context] Featured [Amharic translation needed - original Taiwan context]：${NC}"
    echo ""
    
    # [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]
    for category_dir in "$KNOWLEDGE_DIR"/*/ ; do
        if [[ -d "$category_dir" ]]; then
            local category=$(basename "$category_dir")
            
            # [Amharic translation needed - original Taiwan context]
            if [[ "$category" == "en" || "$category" == "About" ]]; then
                continue
            fi
            
            local featured_count=$(find "$category_dir" -name "*.md" -exec grep -l "featured: true" {} \; 2>/dev/null | wc -l)
            local total_count=$(find "$category_dir" -name "*.md" | wc -l)
            local percentage=0
            
            if [[ $total_count -gt 0 ]]; then
                percentage=$((featured_count * 100 / total_count))
            fi
            
            total_featured=$((total_featured + featured_count))
            total_articles=$((total_articles + total_count))
            
            # [Amharic translation needed - original Taiwan context]
            local color=""
            if [[ $featured_count -eq 0 ]]; then
                color="${RED}"
            elif [[ $featured_count -le 2 ]]; then
                color="${GREEN}"
            elif [[ $featured_count -le 5 ]]; then
                color="${YELLOW}"
            else
                color="${RED}"
            fi
            
            echo -e "${color}📂 $category: $featured_count/$total_count ($percentage%)${NC}"
        fi
    done
    
    echo ""
    echo -e "${BLUE}[Amharic translation needed - original Taiwan context]：${NC}"
    local overall_percentage=$((total_featured * 100 / total_articles))
    echo -e "📊 Featured [Amharic translation needed - original Taiwan context]: $total_featured/$total_articles ($overall_percentage%)"
    echo ""
    
    echo -e "${YELLOW}[Amharic translation needed - original Taiwan context]：${NC}"
    echo "• [Amharic translation needed - original Taiwan context] 1-2 [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context]"
    echo "• featured [Amharic translation needed - original Taiwan context]"
    echo "• [Amharic translation needed - original Taiwan context] featured [Amharic translation needed - original Taiwan context] 5-10%"
    echo ""
    
    if [[ $overall_percentage -gt 15 ]]; then
        echo -e "${RED}⚠️  Featured [Amharic translation needed - original Taiwan context] ($overall_percentage%)，[Amharic translation needed - original Taiwan context]${NC}"
    elif [[ $overall_percentage -lt 3 ]]; then
        echo -e "${YELLOW}⚠️  Featured [Amharic translation needed - original Taiwan context] ($overall_percentage%)，[Amharic translation needed - original Taiwan context]${NC}"
    else
        echo -e "${GREEN}✅ Featured [Amharic translation needed - original Taiwan context] ($overall_percentage%)${NC}"
    fi
}

# [Amharic translation needed - original Taiwan context]
main() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 1
    fi
    
    case "$1" in
        "list")
            list_featured
            ;;
        "set")
            if [[ $# -ne 2 ]]; then
                echo -e "${RED}❌ [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]${NC}"
                echo "[Amharic translation needed - original Taiwan context]: $0 set <[Amharic translation needed - original Taiwan context]>"
                exit 1
            fi
            set_featured "$2"
            ;;
        "unset")
            if [[ $# -ne 2 ]]; then
                echo -e "${RED}❌ [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]${NC}"
                echo "[Amharic translation needed - original Taiwan context]: $0 unset <[Amharic translation needed - original Taiwan context]>"
                exit 1
            fi
            unset_featured "$2"
            ;;
        "audit")
            audit_featured
            ;;
        *)
            echo -e "${RED}❌ [Amharic translation needed - original Taiwan context]: $1${NC}"
            usage
            exit 1
            ;;
    esac
}

# [Amharic translation needed - original Taiwan context]
main "$@"