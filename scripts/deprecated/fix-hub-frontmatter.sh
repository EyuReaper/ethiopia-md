#!/bin/bash
# [Amharic translation needed - original Taiwan context] Hub [Amharic translation needed - original Taiwan context] frontmatter

set -e

echo "🔧 [Amharic translation needed - original Taiwan context] Hub [Amharic translation needed - original Taiwan context] frontmatter..."

# Hub [Amharic translation needed - original Taiwan context]
declare -A hub_info=(
    ["art"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。"
    ["culture"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。"
    ["economy"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]，Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["food"]="Ethiopia[Amharic translation needed - original Taiwan context]|Ethiopia[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]。"
    ["geography"]="Ethiopia[Amharic translation needed - original Taiwan context]|Ethiopia[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]4000[Amharic translation needed - original Taiwan context]。"
    ["history"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]，Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["lifestyle"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["music"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]，Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["nature"]="Ethiopia[Amharic translation needed - original Taiwan context]|Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["people"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["society"]="Ethiopia[Amharic translation needed - original Taiwan context]|Ethiopia[Amharic translation needed - original Taiwan context]。"
    ["technology"]="Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]，Ethiopia[Amharic translation needed - original Taiwan context]。"
)

for hub_file in src/content/am/*/_{Art,Culture,Economy,Food,Geography,History,Lifestyle,Music,Nature,People,Society,Technology}\ Hub.md; do
    if [ -f "$hub_file" ]; then
        # [Amharic translation needed - original Taiwan context] ([Amharic translation needed - original Taiwan context]：art, culture, etc.)
        category=$(echo "$hub_file" | sed 's/.*\/\([a-z]*\)\/_.*Hub\.md/\1/')
        
        if [[ -n "${hub_info[$category]}" ]]; then
            title_desc="${hub_info[$category]}"
            title=$(echo "$title_desc" | cut -d'|' -f1)
            description=$(echo "$title_desc" | cut -d'|' -f2)
            
            echo "🔧 [Amharic translation needed - original Taiwan context] $hub_file"
            
            # [Amharic translation needed - original Taiwan context]
            content=$(cat "$hub_file")
            
            # [Amharic translation needed - original Taiwan context] frontmatter
            if ! echo "$content" | head -10 | grep -q "^title:"; then
                # [Amharic translation needed - original Taiwan context] frontmatter（[Amharic translation needed - original Taiwan context]）
                if echo "$content" | head -1 | grep -q "^---"; then
                    # [Amharic translation needed - original Taiwan context] frontmatter，[Amharic translation needed - original Taiwan context]
                    end_line=$(echo "$content" | tail -n +2 | grep -n "^---" | head -1 | cut -d: -f1)
                    end_line=$((end_line + 1))
                    
                    # [Amharic translation needed - original Taiwan context]
                    existing_meta=$(echo "$content" | sed -n "2,${end_line}p" | head -n -1 | grep -v "^title:\|^description:\|^date:\|^tags:\|^author:\|^difficulty:\|^readingTime:\|^featured:")
                    
                    # [Amharic translation needed - original Taiwan context] frontmatter
                    new_frontmatter="---
title: \"$title\"
description: \"$description\"
date: 2026-03-17T00:00:00Z
tags: [\"$(echo $category | tr '[:lower:]' '[:upper:]' | cut -c1)$(echo $category | cut -c2-)\", \"Hub\"]
author: \"ethiopia.md [Amharic translation needed - original Taiwan context]\"
difficulty: \"beginner\"
readingTime: 5
featured: false"
                    
                    if [ -n "$existing_meta" ]; then
                        new_frontmatter="$new_frontmatter
$existing_meta"
                    fi
                    
                    new_frontmatter="$new_frontmatter
---"
                    
                    # [Amharic translation needed - original Taiwan context]
                    body=$(echo "$content" | tail -n +$((end_line + 1)))
                    echo -e "$new_frontmatter\n$body" > "$hub_file"
                else
                    # [Amharic translation needed - original Taiwan context] frontmatter，[Amharic translation needed - original Taiwan context]
                    new_frontmatter="---
title: \"$title\"
description: \"$description\"
date: 2026-03-17T00:00:00Z
tags: [\"$(echo $category | tr '[:lower:]' '[:upper:]' | cut -c1)$(echo $category | cut -c2-)\", \"Hub\"]
author: \"ethiopia.md [Amharic translation needed - original Taiwan context]\"
difficulty: \"beginner\"
readingTime: 5
featured: false
---
"
                    echo -e "$new_frontmatter$content" > "$hub_file"
                fi
                echo "  ✅ [Amharic translation needed - original Taiwan context] $title"
            else
                echo "  ⏭️  [Amharic translation needed - original Taiwan context] frontmatter，[Amharic translation needed - original Taiwan context]"
            fi
        fi
    fi
done

echo "✨ Hub [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context]！"