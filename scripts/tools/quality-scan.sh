#!/usr/bin/env bash
# quality-scan.sh v3.0 — [Amharic translation needed - original Taiwan context] AI [Amharic translation needed - original Taiwan context]
# [Amharic translation needed - original Taiwan context]: bash tools/quality-scan.sh [--fix] [--json] [--diff] [--sort]
#
# v3.0 [Amharic translation needed - original Taiwan context]:
#   - [Amharic translation needed - original Taiwan context]（EDITORIAL v3 [Amharic translation needed - original Taiwan context]）
#   - [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context] H2）
#   - [Amharic translation needed - original Taiwan context]（--diff：[Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]）
#   - [Amharic translation needed - original Taiwan context]（--sort：[Amharic translation needed - original Taiwan context]→[Amharic translation needed - original Taiwan context]）
#   - LIST-DUMP：[Amharic translation needed - original Taiwan context]
#   - THIN：[Amharic translation needed - original Taiwan context]
#   - QUALITY-DECAY：[Amharic translation needed - original Taiwan context]
#
# [Amharic translation needed - original Taiwan context] ([Amharic translation needed - original Taiwan context] 0-N [Amharic translation needed - original Taiwan context]，[Amharic translation needed - original Taiwan context]):
#   1. bullet [Amharic translation needed - original Taiwan context]：「- **」[Amharic translation needed - original Taiwan context] / [Amharic translation needed - original Taiwan context] > 30%
#   2. [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] < 3
#   3. [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] http [Amharic translation needed - original Taiwan context]
#   4. [Amharic translation needed - original Taiwan context]
#   5. [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context] 3+ [Amharic translation needed - original Taiwan context] bullet [Amharic translation needed - original Taiwan context]
#   6. [Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]bullet[Amharic translation needed - original Taiwan context] < 10
#   7. lastHumanReview: false
#   8. 🆕 [Amharic translation needed - original Taiwan context]（EDITORIAL v3 [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]，≥1 [Amharic translation needed - original Taiwan context]）
#  8b. 🆕 [Amharic translation needed - original Taiwan context]「——」[Amharic translation needed - original Taiwan context]（AI [Amharic translation needed - original Taiwan context]，>4 [Amharic translation needed - original Taiwan context]）
#   9. 🆕 [Amharic translation needed - original Taiwan context]（「Ethiopia[Amharic translation needed - original Taiwan context]X[Amharic translation needed - original Taiwan context]...」「X[Amharic translation needed - original Taiwan context]Ethiopia...」）
#  10. 🆕 [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]
#  11. 🆕 [Amharic translation needed - original Taiwan context] H2 [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]）
#  12. 🆕 LIST-DUMP：[Amharic translation needed - original Taiwan context]（>40% bullet [Amharic translation needed - original Taiwan context] > [Amharic translation needed - original Taiwan context] 2 [Amharic translation needed - original Taiwan context]）
#  13. 🆕 THIN：[Amharic translation needed - original Taiwan context]（H2 [Amharic translation needed - original Taiwan context] < 3）
#  14. 🆕 QUALITY-DECAY：[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context] < [Amharic translation needed - original Taiwan context] 70%）
#  15. 🆕 CHINA-TERM：[Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context] 30+ [Amharic translation needed - original Taiwan context]）

set -uo pipefail
cd "$(dirname "$0")/../.."

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
CYN='\033[0;36m'
RST='\033[0m'

BASELINE_FILE="scripts/tools/.quality-baseline.json"

JSON_MODE=false
FIX_MODE=false
DIFF_MODE=false
SORT_MODE=false
for arg in "$@"; do
  [[ "$arg" == "--json" ]] && JSON_MODE=true
  [[ "$arg" == "--fix" ]] && FIX_MODE=true
  [[ "$arg" == "--diff" ]] && DIFF_MODE=true
  [[ "$arg" == "--sort" ]] && SORT_MODE=true
done

SINGLE_FILE=""
for arg in "$@"; do
  # If arg is a .md file path, treat as single-file mode
  if [[ "$arg" == *.md ]] && [[ -f "$arg" ]]; then
    SINGLE_FILE="$arg"
  fi
done

TOTAL=0
SUSPECT=0
declare -a FLAGGED_FILES=()
declare -a SCORES=()
declare -a REASONS=()

scan_file() {
  local f="$1"
  local score=0
  local reasons=""
  local lines
  lines=$(wc -l < "$f")
  lines=${lines//[[:space:]]/}
  
  # Skip very short files (stubs)
  [[ $lines -lt 20 ]] && return

  # ── 1. Bullet [Amharic translation needed - original Taiwan context] ──
  local bullet_lines
  bullet_lines=$(grep -c '^- \*\*' "$f" 2>/dev/null || echo "0")
  bullet_lines=${bullet_lines//[[:space:]]/}
  local bullet_ratio=0
  if [[ $lines -gt 0 ]]; then
    bullet_ratio=$((bullet_lines * 100 / lines))
  fi
  if [[ $bullet_ratio -gt 30 ]]; then
    score=$((score + 3))
    reasons="${reasons}bullet[Amharic translation needed - original Taiwan context]${bullet_ratio}% "
  elif [[ $bullet_ratio -gt 20 ]]; then
    score=$((score + 1))
    reasons="${reasons}bullet[Amharic translation needed - original Taiwan context]${bullet_ratio}% "
  fi

  # ── 2. [Amharic translation needed - original Taiwan context] ──
  local year_count
  year_count=$(grep -oE '\b(1[6-9][0-9]{2}|20[0-2][0-9])\b' "$f" | grep -v 'date:' | wc -l | tr -d '[:space:]')
  if [[ $year_count -lt 2 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${year_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $year_count -lt 5 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${year_count}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 3. [Amharic translation needed - original Taiwan context] ──
  local url_count
  url_count=$(grep -c 'http' "$f" 2>/dev/null || echo "0")
  url_count=${url_count//[[:space:]]/}
  if [[ $url_count -eq 0 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]URL[Amharic translation needed - original Taiwan context] "
  elif [[ $url_count -lt 3 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${url_count}[Amharic translation needed - original Taiwan context]URL "
  fi

  # ── 4. [Amharic translation needed - original Taiwan context] ──
  local hollow_count
  hollow_count=$(grep -oE '[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]' "$f" | wc -l | tr -d '[:space:]')
  if [[ $hollow_count -gt 15 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${hollow_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $hollow_count -gt 8 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${hollow_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $hollow_count -gt 4 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${hollow_count}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 5. [Amharic translation needed - original Taiwan context] ──
  local prose_lines
  prose_lines=$(grep -cvE '^(#|-|\*|\||>|$|---|\s*$|title:|description:|date:|tags:|category:|author:|featured:|last)' "$f" 2>/dev/null || echo "0")
  prose_lines=$(echo "$prose_lines" | tr -d '[:space:]')
  if [[ $prose_lines -lt 5 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${prose_lines}[Amharic translation needed - original Taiwan context] "
  elif [[ $prose_lines -lt 15 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${prose_lines}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 6. lastHumanReview: false ──
  if grep -q 'lastHumanReview: false' "$f" 2>/dev/null; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 7. [Amharic translation needed - original Taiwan context] bullet [Amharic translation needed - original Taiwan context] ──
  local max_consecutive=0
  local current=0
  while IFS= read -r line; do
    if [[ "$line" =~ ^-\ \*\* ]]; then
      current=$((current + 1))
      [[ $current -gt $max_consecutive ]] && max_consecutive=$current
    else
      current=0
    fi
  done < "$f"
  if [[ $max_consecutive -ge 6 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]bullet${max_consecutive}[Amharic translation needed - original Taiwan context] "
  elif [[ $max_consecutive -ge 4 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]bullet${max_consecutive}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 8. 🆕 [Amharic translation needed - original Taiwan context]（EDITORIAL v3 [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]）──
  local plastic_count
  plastic_count=$(grep -cE '[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{2,15}[Amharic translation needed - original Taiwan context].{2,15}，[Amharic translation needed - original Taiwan context].{2,15}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context].{0,6}|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,10}[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{0,8}[Amharic translation needed - original Taiwan context]' "$f" 2>/dev/null || echo "0")
  plastic_count=${plastic_count//[[:space:]]/}
  if [[ $plastic_count -gt 8 ]]; then
    score=$((score + 4))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${plastic_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $plastic_count -gt 4 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${plastic_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $plastic_count -gt 2 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${plastic_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $plastic_count -ge 1 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${plastic_count}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 8b. 🆕 [Amharic translation needed - original Taiwan context]「——」[Amharic translation needed - original Taiwan context] ──
  local dash_count
  dash_count=$(grep -o '——' "$f" | wc -l | tr -d '[:space:]')
  if [[ $dash_count -gt 15 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${dash_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $dash_count -gt 8 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${dash_count}[Amharic translation needed - original Taiwan context] "
  elif [[ $dash_count -gt 4 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${dash_count}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 9. 🆕 [Amharic translation needed - original Taiwan context] ──
  # [Amharic translation needed - original Taiwan context] frontmatter [Amharic translation needed - original Taiwan context] 3 [Amharic translation needed - original Taiwan context]
  local in_frontmatter=true
  local check_lines=0
  local textbook_opening=false
  while IFS= read -r line; do
    if [[ "$in_frontmatter" == true ]]; then
      # [Amharic translation needed - original Taiwan context] --- [Amharic translation needed - original Taiwan context] frontmatter
      if [[ "$line" == "---" ]] && [[ $check_lines -eq 0 ]]; then
        check_lines=-1  # saw first ---
      elif [[ "$line" == "---" ]] && [[ $check_lines -eq -1 ]]; then
        in_frontmatter=false
        check_lines=0
      fi
      continue
    fi
    # Skip empty lines and headings
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    check_lines=$((check_lines + 1))
    if [[ $check_lines -le 2 ]]; then
      # [Amharic translation needed - original Taiwan context]：「Ethiopia[Amharic translation needed - original Taiwan context]X[Amharic translation needed - original Taiwan context]Y」「X[Amharic translation needed - original Taiwan context]EthiopiaY」「[Amharic translation needed - original Taiwan context]Z，Ethiopia」
      if echo "$line" | grep -qE '^Ethiopia[Amharic translation needed - original Taiwan context].{2,20}[Amharic translation needed - original Taiwan context]|^.{2,10}[Amharic translation needed - original Taiwan context]Ethiopia.{2,20}|^[Amharic translation needed - original Taiwan context].{2,15}，Ethiopia|^[Amharic translation needed - original Taiwan context].{2,10}([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])，Ethiopia|^Ethiopia.{2,6}([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])'; then
        textbook_opening=true
      fi
    fi
    [[ $check_lines -ge 3 ]] && break
  done < "$f"
  if [[ "$textbook_opening" == true ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 10. 🆕 [Amharic translation needed - original Taiwan context]/[Amharic translation needed - original Taiwan context] ──
  # [Amharic translation needed - original Taiwan context] 5 [Amharic translation needed - original Taiwan context]
  local tail_text
  tail_text=$(tail -20 "$f" | grep -v '^$' | grep -v '^#' | grep -v '^\-' | grep -v '^http' | tail -5)
  if echo "$tail_text" | grep -qE '[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].{2,20}[Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]'; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context] "
  fi

  # ── 11. 🆕 [Amharic translation needed - original Taiwan context] H2 [Amharic translation needed - original Taiwan context] ──
  local template_h2=0
  local h2_list
  h2_list=$(grep '^## ' "$f" | sed 's/^## //')
  while IFS= read -r h2; do
    [[ -z "$h2" ]] && continue
    if echo "$h2" | grep -qE '^([Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])?|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])?|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context])?|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]([Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]))$'; then
      template_h2=$((template_h2 + 1))
    fi
  done <<< "$h2_list"
  if [[ $template_h2 -ge 4 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]H2×${template_h2} "
  elif [[ $template_h2 -ge 3 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]H2×${template_h2} "
  elif [[ $template_h2 -ge 2 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]H2×${template_h2} "
  fi

  # ── 12. LIST-DUMP（[Amharic translation needed - original Taiwan context]）──
  local split_line=$(( lines * 6 / 10 ))
  local front_bullet=0
  local back_bullet=0
  local front_total=0
  local back_total=0
  local line_num=0
  while IFS= read -r line; do
    line_num=$((line_num + 1))
    [[ -z "$line" ]] && continue
    if [[ $line_num -le $split_line ]]; then
      front_total=$((front_total + 1))
      [[ "$line" =~ ^-\  || "$line" =~ ^\*\  || "$line" =~ ^[0-9]+\. ]] && front_bullet=$((front_bullet + 1))
    else
      back_total=$((back_total + 1))
      [[ "$line" =~ ^-\  || "$line" =~ ^\*\  || "$line" =~ ^[0-9]+\. ]] && back_bullet=$((back_bullet + 1))
    fi
  done < "$f"
  local front_ratio=0
  local back_ratio=0
  [[ $front_total -gt 0 ]] && front_ratio=$((front_bullet * 100 / front_total))
  [[ $back_total -gt 0 ]] && back_ratio=$((back_bullet * 100 / back_total))
  if [[ $back_ratio -gt 40 ]] && [[ $front_total -gt 0 ]] && [[ $back_ratio -gt $((front_ratio * 2)) ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${back_ratio}% "
  elif [[ $back_ratio -gt 30 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]${back_ratio}% "
  fi

  # ── 13. THIN（[Amharic translation needed - original Taiwan context]）──
  local thin_count=0
  local current_h2=""
  local prose_in_block=0
  local in_block=false
  while IFS= read -r line; do
    if [[ "$line" =~ ^##\  ]]; then
      # Evaluate previous block
      if [[ "$in_block" == true ]] && [[ $prose_in_block -lt 3 ]]; then
        thin_count=$((thin_count + 1))
      fi
      current_h2="$line"
      in_block=true
      prose_in_block=0
    elif [[ "$in_block" == true ]]; then
      # Count prose lines (not bullet/table/empty/heading)
      if [[ -n "$line" ]] && ! [[ "$line" =~ ^(#|-|\*|\||>) ]] && ! [[ "$line" =~ ^[0-9]+\. ]]; then
        prose_in_block=$((prose_in_block + 1))
      fi
    fi
  done < "$f"
  # Check last block
  if [[ "$in_block" == true ]] && [[ $prose_in_block -lt 3 ]]; then
    thin_count=$((thin_count + 1))
  fi
  if [[ $thin_count -ge 2 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]×${thin_count} "
  elif [[ $thin_count -ge 1 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]×${thin_count} "
  fi

  # ── 14. QUALITY-DECAY（[Amharic translation needed - original Taiwan context]）──
  local front_prose=0
  local back_prose=0
  local front_all=0
  local back_all=0
  line_num=0
  while IFS= read -r line; do
    line_num=$((line_num + 1))
    if [[ $line_num -le $split_line ]]; then
      front_all=$((front_all + 1))
      if [[ -n "$line" ]] && ! [[ "$line" =~ ^(#|-|\*|\||>) ]] && ! [[ "$line" =~ ^[0-9]+\. ]]; then
        front_prose=$((front_prose + 1))
      fi
    else
      back_all=$((back_all + 1))
      if [[ -n "$line" ]] && ! [[ "$line" =~ ^(#|-|\*|\||>) ]] && ! [[ "$line" =~ ^[0-9]+\. ]]; then
        back_prose=$((back_prose + 1))
      fi
    fi
  done < "$f"
  local front_prose_ratio=0
  local back_prose_ratio=0
  [[ $front_all -gt 0 ]] && front_prose_ratio=$((front_prose * 100 / front_all))
  [[ $back_all -gt 0 ]] && back_prose_ratio=$((back_prose * 100 / back_all))
  if [[ $front_prose_ratio -gt 0 ]]; then
    local decay_threshold_50=$(( front_prose_ratio / 2 ))
    local decay_threshold_70=$(( front_prose_ratio * 7 / 10 ))
    if [[ $back_prose_ratio -lt $decay_threshold_50 ]]; then
      score=$((score + 3))
      reasons="${reasons}[Amharic translation needed - original Taiwan context]${front_prose_ratio}%[Amharic translation needed - original Taiwan context]${back_prose_ratio}% "
    elif [[ $back_prose_ratio -lt $decay_threshold_70 ]]; then
      score=$((score + 1))
      reasons="${reasons}[Amharic translation needed - original Taiwan context]${front_prose_ratio}%[Amharic translation needed - original Taiwan context]${back_prose_ratio}% "
    fi
  fi

  # ── 15. CHINA-TERM（[Amharic translation needed - original Taiwan context]）──
  # [Amharic translation needed - original Taiwan context] data/terminology/ YAML [Amharic translation needed - original Taiwan context] A [Amharic translation needed - original Taiwan context] + [Amharic translation needed - original Taiwan context]
  local china_terms=(
    "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]"
    "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]"
    "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]"
    "U[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]" "[Amharic translation needed - original Taiwan context]"
  )
  local china_hits=0
  local china_found=""
  for cterm in "${china_terms[@]}"; do
    local count
    count=$(grep -c "$cterm" "$f" 2>/dev/null || echo 0)
    if [[ $count -gt 0 ]]; then
      china_hits=$((china_hits + count))
      china_found="${china_found}${cterm}(${count}) "
    fi
  done
  if [[ $china_hits -ge 5 ]]; then
    score=$((score + 3))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]×${china_hits}[${china_found}] "
  elif [[ $china_hits -ge 3 ]]; then
    score=$((score + 2))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]×${china_hits}[${china_found}] "
  elif [[ $china_hits -ge 1 ]]; then
    score=$((score + 1))
    reasons="${reasons}[Amharic translation needed - original Taiwan context]×${china_hits}[${china_found}] "
  fi

  TOTAL=$((TOTAL + 1))

  # [Amharic translation needed - original Taiwan context]: 0-3 OK, 4-7 ⚠️ [Amharic translation needed - original Taiwan context], 8+ 🔴 [Amharic translation needed - original Taiwan context]
  if [[ $score -ge 4 ]]; then
    SUSPECT=$((SUSPECT + 1))
    local rel="${f#src/content/am/}"
    FLAGGED_FILES+=("$rel")
    SCORES+=("$score")
    REASONS+=("$reasons")
  fi
}

echo ""
if [[ "$JSON_MODE" == false ]]; then
  if [[ -n "$SINGLE_FILE" ]]; then
    echo "🔍 quality-scan v3.0 — [Amharic translation needed - original Taiwan context]: $SINGLE_FILE"
  else
    echo "🔍 quality-scan v3.0 — [Amharic translation needed - original Taiwan context] src/content/am/"
  fi
  echo "   [Amharic translation needed - original Taiwan context]: 0-3 ✅ OK | 4-7 ⚠️ [Amharic translation needed - original Taiwan context] | 8+ 🔴 [Amharic translation needed - original Taiwan context]"
  echo "   [Amharic translation needed - original Taiwan context]: [Amharic translation needed - original Taiwan context]11[Amharic translation needed - original Taiwan context] + LIST-DUMP + THIN + QUALITY-DECAY + CHINA-TERM"
  echo ""
fi

# Scan: single file or all am articles
if [[ -n "$SINGLE_FILE" ]]; then
  scan_file "$SINGLE_FILE"
else
  while IFS= read -r -d '' file; do
    scan_file "$file"
  done < <(find src/content/am -name '*.md' -print0 | sort -z)
fi

# ── Sort by score (descending) if requested ──
sorted_indices=()
if [[ "$SORT_MODE" == true ]] && [[ ${#SCORES[@]} -gt 0 ]]; then
  # Build index array sorted by score descending
  sorted_indices=()
  while IFS= read -r idx; do
    sorted_indices+=("$idx")
  done < <(
    for i in "${!SCORES[@]}"; do
      echo "$i ${SCORES[$i]}"
    done | sort -k2 -nr | awk '{print $1}'
  )
elif [[ ${#SCORES[@]} -gt 0 ]]; then
  for i in "${!SCORES[@]}"; do
    sorted_indices+=("$i")
  done
fi

# ── Diff mode: load baseline into temp file for lookup ──
BASELINE_TMP=""
if [[ "$DIFF_MODE" == true ]] && [[ -f "$BASELINE_FILE" ]]; then
  BASELINE_TMP=$(mktemp)
  grep '"file"' "$BASELINE_FILE" 2>/dev/null | \
    sed 's/.*"file": *"//;s/".*"score": *//;s/[^0-9].*//' | \
    paste - - > "$BASELINE_TMP" 2>/dev/null || true
  # Actually parse properly
  rm -f "$BASELINE_TMP"
  BASELINE_TMP=$(mktemp)
  python3 -c "
import json, sys
try:
  data = json.load(open('$BASELINE_FILE'))
  for f in data.get('files', []):
    print(f['file'] + '\t' + str(f['score']))
except: pass
" > "$BASELINE_TMP" 2>/dev/null || true
fi

baseline_lookup() {
  local file="$1"
  if [[ -n "$BASELINE_TMP" && -f "$BASELINE_TMP" ]]; then
    grep "^${file}	" "$BASELINE_TMP" 2>/dev/null | cut -f2 | head -1
  fi
}

# ── Output ──
if [[ "$JSON_MODE" == false ]]; then
  new_count=0
  improved_count=0
  worsened_count=0
  
  for idx in ${sorted_indices[@]+"${sorted_indices[@]}"}; do
    rel="${FLAGGED_FILES[$idx]}"
    sc="${SCORES[$idx]}"
    rs="${REASONS[$idx]}"
    
    # Diff annotation
    diff_tag=""
    if [[ "$DIFF_MODE" == true ]]; then
      old_score=$(baseline_lookup "$rel")
      if [[ -n "$old_score" ]]; then
        if [[ $sc -gt $old_score ]]; then
          diff_tag=" ${RED}↑${old_score}→${sc}${RST}"
          worsened_count=$((worsened_count + 1))
        elif [[ $sc -lt $old_score ]]; then
          diff_tag=" ${GRN}↓${old_score}→${sc}${RST}"
          improved_count=$((improved_count + 1))
        fi
      else
        diff_tag=" ${CYN}🆕${RST}"
        new_count=$((new_count + 1))
      fi
    fi

    if [[ $sc -ge 8 ]]; then
      echo -e "${RED}🔴 [$sc] $rel${diff_tag}${RST}"
      echo -e "   ${DIM}${rs}${RST}"
    elif [[ $sc -ge 4 ]]; then
      echo -e "${YEL}⚠️  [$sc] $rel${diff_tag}${RST}"
      echo -e "   ${DIM}${rs}${RST}"
    fi
  done

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "📊 [Amharic translation needed - original Taiwan context]: ${TOTAL} [Amharic translation needed - original Taiwan context]"
  if [[ $SUSPECT -gt 0 ]]; then
    red_count=0
    yellow_count=0
    for sc in ${SCORES[@]+"${SCORES[@]}"}; do
      [[ $sc -ge 8 ]] && red_count=$((red_count + 1))
      [[ $sc -ge 4 && $sc -lt 8 ]] && yellow_count=$((yellow_count + 1))
    done
    echo -e "   ${RED}🔴 [Amharic translation needed - original Taiwan context]: ${red_count} [Amharic translation needed - original Taiwan context]${RST}"
    echo -e "   ${YEL}⚠️  [Amharic translation needed - original Taiwan context]: ${yellow_count} [Amharic translation needed - original Taiwan context]${RST}"
    echo -e "   ${GRN}✅ [Amharic translation needed - original Taiwan context]: $((TOTAL - SUSPECT)) [Amharic translation needed - original Taiwan context]${RST}"
  else
    echo -e "${GRN}✅ [Amharic translation needed - original Taiwan context]${RST}"
  fi
  
  if [[ "$DIFF_MODE" == true ]]; then
    # Count fixed (was in baseline, not in current)
    fixed_count=0
    if [[ -n "$BASELINE_TMP" && -f "$BASELINE_TMP" ]]; then
      while IFS=$'\t' read -r bfile bscore; do
        [[ -z "$bfile" ]] && continue
        found=false
        for ffile in "${FLAGGED_FILES[@]}"; do
          [[ "$ffile" == "$bfile" ]] && found=true && break
        done
        [[ "$found" == false ]] && fixed_count=$((fixed_count + 1))
      done < "$BASELINE_TMP"
    fi
    
    echo ""
    echo -e "📈 [Amharic translation needed - original Taiwan context]（vs [Amharic translation needed - original Taiwan context] baseline）:"
    echo -e "   ${CYN}🆕 [Amharic translation needed - original Taiwan context]: ${new_count}${RST}"
    echo -e "   ${RED}↑ [Amharic translation needed - original Taiwan context]: ${worsened_count}${RST}"
    echo -e "   ${GRN}↓ [Amharic translation needed - original Taiwan context]: ${improved_count}${RST}"
    echo -e "   ${GRN}✅ [Amharic translation needed - original Taiwan context]: ${fixed_count}${RST}"
  fi
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

# ── JSON output ──
if [[ "$JSON_MODE" == true ]]; then
  echo "{"
  echo "  \"version\": \"3.0\","
  echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"total\": $TOTAL,"
  echo "  \"flagged\": $SUSPECT,"
  echo "  \"red\": $(printf '%s\n' ${SCORES[@]+"${SCORES[@]}"} | awk '$1>=8' | wc -l | tr -d '[:space:]'),"
  echo "  \"yellow\": $(printf '%s\n' ${SCORES[@]+"${SCORES[@]}"} | awk '$1>=4 && $1<8' | wc -l | tr -d '[:space:]'),"
  echo "  \"files\": ["
  first=true
  for idx in ${sorted_indices[@]+"${sorted_indices[@]}"}; do
    [[ "$first" == true ]] && first=false || echo ","
    printf '    {"file": "%s", "score": %s, "reasons": "%s"}' \
      "${FLAGGED_FILES[$idx]}" "${SCORES[$idx]}" "$(echo "${REASONS[$idx]}" | sed 's/ *$//')"
  done
  echo ""
  echo "  ]"
  echo "}"
fi

# ── Save baseline (always, for diff mode next time) ──
{
  echo "{"
  echo "  \"version\": \"3.0\","
  echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"total\": $TOTAL,"
  echo "  \"flagged\": $SUSPECT,"
  echo "  \"files\": ["
  first=true
  for idx in ${sorted_indices[@]+"${sorted_indices[@]}"}; do
    [[ "$first" == true ]] && first=false || echo ","
    printf '    {"file": "%s", "score": %s}' "${FLAGGED_FILES[$idx]}" "${SCORES[$idx]}"
  done
  echo ""
  echo "  ]"
  echo "}"
} > "$BASELINE_FILE"

# ── Fix mode ──
if [[ "$FIX_MODE" == true ]] && [[ $SUSPECT -gt 0 ]]; then
  echo ""
  echo "📝 [Amharic translation needed - original Taiwan context] lastHumanReview: false → [Amharic translation needed - original Taiwan context]"
  for f in "${FLAGGED_FILES[@]}"; do
    full="src/content/am/$f"
    if grep -q 'lastHumanReview: true' "$full" 2>/dev/null; then
      sed -i '' 's/lastHumanReview: true/lastHumanReview: false/' "$full"
      echo "   ✏️  $f → lastHumanReview: false"
    fi
  done
fi
