#!/usr/bin/env bash
# quality-scan.sh v4.0 — heuristic quality scan for Ethiopia.md articles.
#
# Usage:
#   bash scripts/tools/quality-scan.sh                     # scan published articles under knowledge/
#   bash scripts/tools/quality-scan.sh --all               # also scan status: archived and status: draft
#   bash scripts/tools/quality-scan.sh knowledge/en/X.md   # scan one article
#   Flags: --json  --sort  --diff (compare with .quality-baseline.json)  --fix (lastHumanReview: true -> false)
#
# Soft signals (lastHumanReview, thin sections, prose decay, em-dashes, textbook openers, list dumps) are not scored.
# A score is a prompt to read the article, not a verdict. Score 0-3 OK, 4-7 review, 8+ strong signal.
# Keyword lists are in the CONFIG block below; edit them there.

set -uo pipefail

ORIG_PWD="$(pwd)"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 1

# ── CONFIG: keyword lists (ERE, matched case-insensitively) ─────────────────
# Filler phrases that signal hollow, generic prose.
HOLLOW_PAT='it is worth noting|it.s worth noting|plays an? (crucial|vital|pivotal|key|important) role|a testament to|stands as a testament|rich tapestry|ever-evolving|delve into|in today.s (fast-paced|digital|modern)|a myriad of|navigating the (complex|intricate)|in the realm of'
# Stock AI-style phrasing.
PLASTIC_PAT='serves as a (reminder|beacon|hub|catalyst)|highlights the importance|underscores the|continues to (shape|influence)|embark on a journey|a key (player|driver|factor) in|not only .* but also'
# Generic closing lines (matched at the start of a line).
CLOSER_PAT='^(in conclusion|in summary|to sum up|ultimately,|overall,)'
# Template H2 headings (matched against the heading text).
TEMPLATE_H2_PAT='^(overview|introduction|background|significance|impact|conclusion|summary|context|legacy|future outlook|key takeaways)$'
# Opening sentence that reads like a textbook definition.
TEXTBOOK_OPEN_PAT='^(ethiopia|ethiopian|the ethiopian [a-z ]+) (is|are|refers to|represents|encompasses) (a|an|the) '
# Literal Taiwan terms: wrong-country leftovers from the sister project. Matched as fixed strings.
TAIWAN_TERMS=("Taipei" "Taiwan" "TSMC" "Yushan" "Hakka" "Hoklo" "Hokkien" "Martial Law" "convenience store" "night market" ".gov.tw" "Sunflower Movement")
# ────────────────────────────────────────────────────────────────────────────

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
INCLUDE_ALL=false
SINGLE_FILE=""
for arg in "$@"; do
  case "$arg" in
    --json) JSON_MODE=true ;;
    --fix) FIX_MODE=true ;;
    --diff) DIFF_MODE=true ;;
    --sort) SORT_MODE=true ;;
    --all) INCLUDE_ALL=true ;;
    *.md)
      if [[ -f "$ORIG_PWD/$arg" || -f "$arg" ]]; then
        abs="$(cd "$(dirname "${arg}")" 2>/dev/null && pwd)/$(basename "$arg")"
        [[ "$abs" == "$ROOT/"* ]] && abs="${abs#"$ROOT/"}"
        SINGLE_FILE="$abs"
      fi
      ;;
  esac
done

TOTAL=0
SKIPPED=0
SUSPECT=0
declare -a FLAGGED_FILES=()
declare -a SCORES=()
declare -a REASONS=()

# Print the status: value from the frontmatter (empty if none).
article_status() {
  local fm
  fm=$(awk 'NR==1 && /^---/{next} /^---/{exit} {print}' "$1")
  echo "$fm" | sed -n 's/^status:[[:space:]]*//p' | tr -d "\"' \r" | head -1
}

# Number of lines matching an ERE (case-insensitive).
n_lines() { grep -ciE -- "$1" "$2" 2>/dev/null || true; }

# Number of individual matches of an ERE (case-insensitive).
n_matches() { grep -oiE -- "$1" "$2" 2>/dev/null | wc -l | tr -d '[:space:]' || true; }

# First non-empty prose line of the body (skips frontmatter and headings).
first_prose_line() {
  awk 'NR==1 && /^---/{fm=1; next} fm && /^---/{fm=0; next} fm{next}
       /^[[:space:]]*$/{next} /^#/{next} {print; exit}' "$1"
}

# Count Taiwan terms. Sets TW_TOTAL and TW_FOUND.
count_taiwan_terms() {
  local f="$1" term c
  TW_TOTAL=0
  TW_FOUND=""
  for term in "${TAIWAN_TERMS[@]}"; do
    c=$(sed 's/Taiwan\.md//g' "$f" | grep -oiF -- "$term" 2>/dev/null | wc -l | tr -d '[:space:]')
    if (( c > 0 )); then
      TW_TOTAL=$((TW_TOTAL + c))
      TW_FOUND="${TW_FOUND}${term}(${c}) "
    fi
  done
}

scan_file() {
  local f="$1"
  local score=0
  local reasons=""
  local lines
  lines=$(wc -l < "$f" | tr -d '[:space:]')

  # Skip very short files (stubs)
  [[ $lines -lt 20 ]] && return

  # Hubs and the home page are link lists by design, so layout signals do not apply.
  local is_hub=false
  [[ "$(basename "$f")" == _* ]] && is_hub=true

  # ── 1. Bullet-heavy body ──
  local bullet_lines bullet_ratio
  bullet_lines=$(n_lines '^- \*\*' "$f")
  bullet_ratio=$((bullet_lines * 100 / lines))
  if [[ "$is_hub" == true ]]; then
    :
  elif [[ $bullet_ratio -gt 30 ]]; then
    score=$((score + 3)); reasons="${reasons}bullets ${bullet_ratio}% "
  elif [[ $bullet_ratio -gt 20 ]]; then
    score=$((score + 1)); reasons="${reasons}bullets ${bullet_ratio}% "
  fi

  # ── 2. Few years (dated facts) ──
  local year_count
  year_count=$(grep -oE '\b(1[6-9][0-9]{2}|20[0-2][0-9])\b' "$f" | grep -vc 'date:' || true)
  year_count=${year_count//[[:space:]]/}
  # Few dated facts is a hint only; it never flags an article on its own.
  if [[ "$is_hub" == false && $year_count -lt 2 ]]; then
    score=$((score + 1)); reasons="${reasons}years ${year_count} "
  fi

  # ── 3. Few links ──
  local url_count
  url_count=$(n_lines 'http' "$f")
  # Missing sources is a real problem: an article with no URL at all is flagged on its own.
  if [[ $url_count -eq 0 ]]; then
    score=$((score + 4)); reasons="${reasons}no sources "
  elif [[ "$is_hub" == false && $url_count -lt 3 ]]; then
    score=$((score + 1)); reasons="${reasons}URLs ${url_count} "
  fi

  # ── 4. Hollow filler phrases ──
  local hollow_count
  hollow_count=$(n_matches "$HOLLOW_PAT" "$f")
  if [[ $hollow_count -gt 15 ]]; then
    score=$((score + 3)); reasons="${reasons}hollow ${hollow_count} "
  elif [[ $hollow_count -gt 8 ]]; then
    score=$((score + 2)); reasons="${reasons}hollow ${hollow_count} "
  elif [[ $hollow_count -gt 4 ]]; then
    score=$((score + 1)); reasons="${reasons}hollow ${hollow_count} "
  fi

  # ── 5. Little prose (mostly lists, tables, headings) ──
  local prose_lines
  prose_lines=$(grep -cvE '^(#|-|\*|\||>|$|---|\s*$|title:|description:|date:|tags:|category:|author:|featured:|last)' "$f" || true)
  prose_lines=${prose_lines//[[:space:]]/}
  if [[ "$is_hub" == true ]]; then
    :
  elif [[ $prose_lines -lt 5 ]]; then
    score=$((score + 3)); reasons="${reasons}prose ${prose_lines} "
  elif [[ $prose_lines -lt 15 ]]; then
    score=$((score + 1)); reasons="${reasons}prose ${prose_lines} "
  fi

  # ── 7. Long unbroken bullet runs ──
  local max_consecutive=0 current=0 line
  while IFS= read -r line; do
    if [[ "$line" =~ ^-\ \*\* ]]; then
      current=$((current + 1))
      [[ $current -gt $max_consecutive ]] && max_consecutive=$current
    else
      current=0
    fi
  done < "$f"
  if [[ "$is_hub" == true ]]; then
    :
  elif [[ $max_consecutive -ge 6 ]]; then
    score=$((score + 2)); reasons="${reasons}bullet-run ${max_consecutive} "
  elif [[ $max_consecutive -ge 4 ]]; then
    score=$((score + 1)); reasons="${reasons}bullet-run ${max_consecutive} "
  fi

  # ── 8. Stock AI phrasing ──
  local plastic_count
  plastic_count=$(n_lines "$PLASTIC_PAT" "$f")
  if [[ $plastic_count -gt 8 ]]; then
    score=$((score + 4)); reasons="${reasons}ai-phrases ${plastic_count} "
  elif [[ $plastic_count -gt 4 ]]; then
    score=$((score + 3)); reasons="${reasons}ai-phrases ${plastic_count} "
  elif [[ $plastic_count -gt 2 ]]; then
    score=$((score + 2)); reasons="${reasons}ai-phrases ${plastic_count} "
  elif [[ $plastic_count -ge 1 ]]; then
    score=$((score + 1)); reasons="${reasons}ai-phrases ${plastic_count} "
  fi

  # ── 10. Generic closing summary line in the last few prose lines ──
  local tail_text
  tail_text=$(tail -20 "$f" | grep -v '^$' | grep -v '^#' | grep -v '^-' | grep -v '^http' | tail -5)
  if echo "$tail_text" | grep -qiE -- "$CLOSER_PAT"; then
    score=$((score + 2)); reasons="${reasons}generic-closer "
  fi

  # ── 11. Template H2 headings ──
  local template_h2
  template_h2=$(grep '^## ' "$f" | sed 's/^## //;s/[[:space:]]*$//' | grep -ciE -- "$TEMPLATE_H2_PAT" || true)
  if [[ $template_h2 -ge 4 ]]; then
    score=$((score + 3)); reasons="${reasons}template-H2 x${template_h2} "
  elif [[ $template_h2 -ge 3 ]]; then
    score=$((score + 2)); reasons="${reasons}template-H2 x${template_h2} "
  elif [[ $template_h2 -ge 2 ]]; then
    score=$((score + 1)); reasons="${reasons}template-H2 x${template_h2} "
  fi

  # ── 15. Taiwan leakage (wrong-country terms from the sister project) ──
  # Any hit is a real problem, so a single term is enough to flag the file.
  # "Taiwan.md" (the upstream project name, cited in the origin story) is not a leak.
  # The origin story documents the fork and may name Taiwan, so it is exempt.
  TW_TOTAL=0; TW_FOUND=""
  [[ "$f" == */About/origin-story.md ]] || count_taiwan_terms "$f"
  if [[ $TW_TOTAL -ge 5 ]]; then
    score=$((score + 6)); reasons="${reasons}TAIWAN x${TW_TOTAL} [${TW_FOUND}]"
  elif [[ $TW_TOTAL -ge 1 ]]; then
    score=$((score + 4)); reasons="${reasons}TAIWAN x${TW_TOTAL} [${TW_FOUND}]"
  fi

  TOTAL=$((TOTAL + 1))

  if [[ $score -ge 4 ]]; then
    SUSPECT=$((SUSPECT + 1))
    FLAGGED_FILES+=("$f")
    SCORES+=("$score")
    REASONS+=("$reasons")
  fi
}

# ── Collect files ──
collect_files() {
  if [[ -n "$SINGLE_FILE" ]]; then
    printf '%s\0' "$SINGLE_FILE"
  else
    find knowledge -name '*.md' -print0 | sort -z
  fi
}

if [[ "$JSON_MODE" == false ]]; then
  echo ""
  if [[ -n "$SINGLE_FILE" ]]; then
    echo "quality-scan v4.0 — file: $SINGLE_FILE"
  else
    echo "quality-scan v4.0 — knowledge/ ($( [[ "$INCLUDE_ALL" == true ]] && echo "all statuses" || echo "published only" ))"
  fi
  echo "   Score: 0-3 OK | 4-7 review | 8+ strong signal"
  echo "   Checks: bullets, years, sources, hollow filler, prose, AI phrasing, closers, template H2s, Taiwan terms"
  echo ""
fi

while IFS= read -r -d '' file; do
  if [[ "$INCLUDE_ALL" == false ]]; then
    st="$(article_status "$file")"
    case "$st" in
      archived|draft)
        SKIPPED=$((SKIPPED + 1))
        [[ -n "$SINGLE_FILE" ]] && echo "Skipped $file: status is '$st' (pass --all to scan it)."
        continue
        ;;
    esac
  fi
  scan_file "$file"
done < <(collect_files)

# ── Sort by score (descending) if requested ──
sorted_indices=()
if [[ "$SORT_MODE" == true ]] && [[ ${#SCORES[@]} -gt 0 ]]; then
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

# ── Diff mode: load baseline ──
BASELINE_TMP=""
if [[ "$DIFF_MODE" == true ]] && [[ -f "$BASELINE_FILE" ]]; then
  BASELINE_TMP=$(mktemp)
  python3 -c "
import json
try:
  data = json.load(open('$BASELINE_FILE'))
  for f in data.get('files', []):
    print(f['file'] + '\t' + str(f['score']))
except Exception:
  pass
" > "$BASELINE_TMP" 2>/dev/null || true
fi

baseline_lookup() {
  local file="$1"
  if [[ -n "$BASELINE_TMP" && -f "$BASELINE_TMP" ]]; then
    grep -F "${file}"$'\t' "$BASELINE_TMP" 2>/dev/null | cut -f2 | head -1
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
        diff_tag=" ${CYN}new${RST}"
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
  echo "Scanned: ${TOTAL} articles (skipped ${SKIPPED} archived/draft)"
  if [[ $SUSPECT -gt 0 ]]; then
    red_count=0
    yellow_count=0
    for sc in ${SCORES[@]+"${SCORES[@]}"}; do
      [[ $sc -ge 8 ]] && red_count=$((red_count + 1))
      [[ $sc -ge 4 && $sc -lt 8 ]] && yellow_count=$((yellow_count + 1))
    done
    echo -e "   ${RED}🔴 strong signal: ${red_count}${RST}"
    echo -e "   ${YEL}⚠️  review: ${yellow_count}${RST}"
    echo -e "   ${GRN}✅ OK: $((TOTAL - SUSPECT))${RST}"
  else
    echo -e "${GRN}✅ No articles above the review threshold${RST}"
  fi

  if [[ "$DIFF_MODE" == true ]]; then
    fixed_count=0
    if [[ -n "$BASELINE_TMP" && -f "$BASELINE_TMP" ]]; then
      while IFS=$'\t' read -r bfile bscore; do
        [[ -z "$bfile" ]] && continue
        found=false
        for ffile in "${FLAGGED_FILES[@]+"${FLAGGED_FILES[@]}"}"; do
          [[ "$ffile" == "$bfile" ]] && found=true && break
        done
        [[ "$found" == false ]] && fixed_count=$((fixed_count + 1))
      done < "$BASELINE_TMP"
    fi

    echo ""
    echo "vs baseline:"
    echo -e "   ${CYN}new: ${new_count}${RST}"
    echo -e "   ${RED}worse: ${worsened_count}${RST}"
    echo -e "   ${GRN}better: ${improved_count}${RST}"
    echo -e "   ${GRN}no longer flagged: ${fixed_count}${RST}"
  fi
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

[[ -n "$BASELINE_TMP" ]] && rm -f "$BASELINE_TMP"

# ── JSON output ──
if [[ "$JSON_MODE" == true ]]; then
  echo "{"
  echo "  \"version\": \"4.0\","
  echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "  \"total\": $TOTAL,"
  echo "  \"flagged\": $SUSPECT,"
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

# ── Save baseline: only for a full default scan, so single-file runs do not clobber it ──
if [[ -z "$SINGLE_FILE" && "$INCLUDE_ALL" == false ]]; then
  {
    echo "{"
    echo "  \"version\": \"4.0\","
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
fi

# ── Fix mode: flip lastHumanReview true -> false on flagged files ──
if [[ "$FIX_MODE" == true ]] && [[ $SUSPECT -gt 0 ]]; then
  echo ""
  echo "Fix: lastHumanReview: true -> false on flagged files"
  for f in "${FLAGGED_FILES[@]}"; do
    if grep -q 'lastHumanReview: true' "$f" 2>/dev/null; then
      sed -i 's/lastHumanReview: true/lastHumanReview: false/' "$f"
      echo "   edited $f"
    fi
  done
fi
