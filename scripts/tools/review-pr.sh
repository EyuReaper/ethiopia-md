#!/usr/bin/env bash
# review-pr.sh v2.0 — Ethiopia.md PR review (local equivalent of the PR-review bot).
#
# Usage:
#   bash scripts/tools/review-pr.sh <file.md> [file.md ...]   # review given files
#   bash scripts/tools/review-pr.sh --pr <number>             # review files changed in a PR (needs gh)
#   bash scripts/tools/review-pr.sh --help
#
# Layers:
#   L0  path and type gate (articles must live under knowledge/)
#   L1  structure: conflict markers, frontmatter fields, category, Han-character leakage
#   L2  quality heuristics (same ideas as quality-scan.sh)
#   L3  editorial hints (opening, closing, sources)

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT" || exit 1

# ── CONFIG: keyword lists (ERE, matched case-insensitively) ─────────────────
# Filler phrases that signal hollow, generic prose.
HOLLOW_PAT='it is worth noting|it.s worth noting|plays an? (crucial|vital|pivotal|key|important) role|a testament to|stands as a testament|rich tapestry|ever-evolving|delve into|in today.s (fast-paced|digital|modern)|a myriad of|navigating the (complex|intricate)|in the realm of'
# Stock AI-style phrasing.
PLASTIC_PAT='serves as a (reminder|beacon|hub|catalyst)|highlights the importance|underscores the|continues to (shape|influence)|embark on a journey|a key (player|driver|factor) in|not only .* but also'
# Generic closing lines (matched at the start of a line).
CLOSER_PAT='^(in conclusion|in summary|to sum up|ultimately,|overall,)'
# Opening sentence that reads like a textbook definition.
TEXTBOOK_OPEN_PAT='^(ethiopia|ethiopian|the ethiopian [a-z ]+) (is|are|refers to|represents|encompasses) (a|an|the) '
# Literal Taiwan terms: wrong-country leftovers from the sister project. Matched as fixed strings.
TAIWAN_TERMS=("Taipei" "Taiwan" "TSMC" "Yushan" "Hakka" "Hoklo" "Hokkien" "Martial Law" "convenience store" "night market" ".gov.tw" "Sunflower Movement")
# Allowed top-level categories (directory under knowledge/).
VALID_CATS=("About" "History" "Geography" "Culture" "Food" "Art" "Music" "Technology" "Nature" "People" "Society" "Economy" "Lifestyle" "Language")
# ────────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'
BLU='\033[0;34m'; DIM='\033[0;90m'; RST='\033[0m'

TOTAL=0; L0=0; L1=0; L2=0; L3=0
STATUS="PASS"
REPORT=""

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
}

# Number of lines matching an ERE (case-insensitive).
n_lines() { grep -ciE -- "$1" <<< "$2" 2>/dev/null || true; }

# Number of individual matches of an ERE in a text (case-insensitive).
n_matches() { grep -oiE -- "$1" <<< "$2" 2>/dev/null | wc -l | tr -d '[:space:]' || true; }

# First non-empty prose line of a body (skips headings).
first_prose_line() { grep -vE '^[[:space:]]*$|^#' <<< "$1" | head -1; }

# Count Taiwan terms in a file. Sets TW_TOTAL and TW_FOUND.
count_taiwan_terms() {
  local f="$1" term c
  TW_TOTAL=0; TW_FOUND=""
  for term in "${TAIWAN_TERMS[@]}"; do
    c=$(grep -oiF -- "$term" "$f" 2>/dev/null | wc -l | tr -d '[:space:]')
    if (( c > 0 )); then
      TW_TOTAL=$((TW_TOTAL + c))
      TW_FOUND="${TW_FOUND}${term}(${c}) "
    fi
  done
}

# ════════════════════════════════════════
# Layer 0 — path and type gate
# ════════════════════════════════════════
layer0() {
  local f="$1"
  if [[ ! "$f" =~ \.md$ ]]; then
    echo "🔴 not a .md file"; return 1
  fi
  if [[ "$f" =~ ^knowledge/ ]]; then
    echo "✅ article path"; return 0
  fi
  echo "🔴 outside knowledge/ (articles are authored there; src/content is generated)"; return 1
}

# ════════════════════════════════════════
# Layer 1 — structure
# ════════════════════════════════════════
layer1() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 file missing" && return 1
  local err=() wrn=()

  # conflict markers
  grep -qE '^(<{7}|={7}|>{7})' "$f" 2>/dev/null && err+=("git conflict markers")

  # Han (CJK) characters in article text: a leftover from the source project
  local han
  han=$(grep -oP '\p{Han}' "$f" 2>/dev/null | wc -l | tr -d '[:space:]')
  han=${han:-0}
  (( han > 5 )) && wrn+=("${han} CJK characters")

  # frontmatter
  local fm
  fm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$f" 2>/dev/null)
  if [[ -z "$fm" ]]; then
    err+=("missing frontmatter")
  else
    echo "$fm" | grep -q '^title:' || err+=("missing title")
    echo "$fm" | grep -q '^description:' || err+=("missing description")
    echo "$fm" | grep -q '^date:' || err+=("missing date")
    echo "$fm" | grep -q '^tags:' || err+=("missing tags")
    local cd
    cd=$(echo "$f" | sed -n 's|^knowledge/\([^/]*\)/.*|\1|p')
    if [[ -n "$cd" && "$cd" != "en" && "$cd" != "es" && "$cd" != "ja" ]]; then
      local ok=false v
      for v in "${VALID_CATS[@]}"; do [[ "$cd" == "$v" ]] && ok=true && break; done
      $ok || err+=("unknown category: $cd")
    fi
  fi

  if (( ${#err[@]} > 0 )); then
    echo "🔴 $(IFS=', '; echo "${err[*]}")"; return 1
  elif (( ${#wrn[@]} > 0 )); then
    echo "🟡 OK ($(IFS=', '; echo "${wrn[*]}"))"; return 0
  else
    echo "✅ frontmatter and structure"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 2 — quality heuristics
# ════════════════════════════════════════
layer2() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 file missing" && return 1
  local wrn=() hs=0

  local body
  body=$(awk '/^---$/{n++; next} n>=2{print}' "$f" 2>/dev/null)
  local tl
  tl=$(echo "$body" | wc -l | tr -d ' ')

  # bullet-heavy body
  local bl
  bl=$(n_lines '^- \*\*' "$body")
  (( tl > 5 && bl * 100 / tl > 30 )) && ((hs+=2))

  # few years
  local yr
  yr=$(echo "$body" | grep -oE '\b(1[6-9][0-9]{2}|20[0-2][0-9])\b' 2>/dev/null | wc -l | tr -d ' ')
  (( yr < 3 )) && ((hs++))

  # no links
  echo "$body" | grep -q 'http' 2>/dev/null || ((hs++))

  # hollow filler phrases
  local hw
  hw=$(n_matches "$HOLLOW_PAT" "$body")
  (( hw >= 3 )) && ((hs++))

  # little prose
  local pr
  pr=$(echo "$body" | grep -cvE '^#|^$|^-|^\*|^>|^\|' 2>/dev/null || true)
  pr=${pr//[^0-9]/}; pr=${pr:-0}
  (( pr < 10 )) && ((hs++))

  # stock AI phrasing (lines)
  local pl
  pl=$(n_lines "$PLASTIC_PAT" "$body")
  (( pl >= 1 )) && ((hs++))

  # em-dash overuse
  local ds
  ds=$(echo "$body" | grep -o '—' 2>/dev/null | wc -l | tr -d ' ')
  (( ds > 4 )) && ((hs++))

  # textbook opening
  first_prose_line "$body" | grep -qiE -- "$TEXTBOOK_OPEN_PAT" && ((hs++))

  # generic closing line
  echo "$body" | tail -5 | grep -qiE -- "$CLOSER_PAT" && ((hs++))

  # Taiwan terms: wrong-country leftovers
  count_taiwan_terms "$f"
  if (( TW_TOTAL >= 1 )); then
    hs=$((hs + 2))
    wrn+=("Taiwan terms ${TW_FOUND% })")
  fi

  local hs_label=""
  if (( hs <= 5 )); then hs_label="✅ quality $hs"
  elif (( hs <= 7 )); then hs_label="🟡 quality $hs"; wrn+=("quality score $hs")
  else echo "🔴 quality $hs"; return 1
  fi

  # length (characters)
  local cc
  cc=$(echo "$body" | wc -m | tr -d ' ')
  if [[ "$f" =~ /en/ ]]; then
    (( cc < 2500 )) && wrn+=("short: ${cc} chars")
  else
    (( cc < 3000 )) && wrn+=("short: ${cc} chars")
  fi

  # H2 headings
  local h2
  h2=$(grep -c '^## ' "$f" 2>/dev/null || true)
  h2=${h2//[^0-9]/}; h2=${h2:-0}
  (( h2 < 1 )) && wrn+=("no H2 sections")

  # links
  local lk
  lk=$(grep -c 'http' "$f" 2>/dev/null || true)
  lk=${lk//[^0-9]/}; lk=${lk:-0}
  (( lk < 1 )) && wrn+=("no links")

  if (( ${#wrn[@]} > 0 )); then
    echo "$hs_label ($(IFS=', '; echo "${wrn[*]}"))"; return 0
  else
    echo "$hs_label"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 3 — editorial hints
# ════════════════════════════════════════
layer3() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "—" && return 0
  local wrn=()
  local body
  body=$(awk '/^---$/{n++; next} n>=2 && NF{print}' "$f" 2>/dev/null)

  # textbook-style opening sentence
  first_prose_line "$body" | grep -qiE -- "$TEXTBOOK_OPEN_PAT" && wrn+=("textbook-style opening")

  # generic closing line in the last lines
  tail -10 "$f" | grep -qiE -- "$CLOSER_PAT" && wrn+=("generic closing line")

  # fewer than 3 references
  local refs
  refs=$(grep -c 'http' "$f" 2>/dev/null || true)
  refs=${refs//[^0-9]/}; refs=${refs:-0}
  (( refs < 3 )) && wrn+=("fewer than 3 links (${refs})")

  if (( ${#wrn[@]} > 0 )); then
    echo "🟡 $(IFS=', '; echo "${wrn[*]}")"
  else echo "✅"
  fi; return 0
}

# ════════════════════════════════════════
# Per-file review
# ════════════════════════════════════════
review() {
  local f="$1"; REPORT+="📁 ${f}\n"

  local r0; r0=$(layer0 "$f"); REPORT+="  L0 gate: ${r0}\n"
  if [[ "$r0" =~ ^🔴 ]]; then STATUS="FAIL"; REPORT+="\n"; return; fi
  L0=$((L0+1))

  local r1; r1=$(layer1 "$f"); REPORT+="  L1 structure: ${r1}\n"
  if [[ "$r1" =~ ^🔴 ]]; then STATUS="FAIL"
  else L1=$((L1+1))
    [[ "$r1" =~ ^🟡 && "$STATUS" == "PASS" ]] && STATUS="WARNING"
  fi

  local r2; r2=$(layer2 "$f"); REPORT+="  L2 quality: ${r2}\n"
  if [[ "$r2" =~ ^🔴 ]]; then STATUS="FAIL"
  elif [[ "$r2" =~ ^🟡 ]] && [[ "$STATUS" != "FAIL" ]]; then STATUS="WARNING"
  fi
  [[ ! "$r2" =~ ^🔴 ]] && L2=$((L2+1))

  local r3; r3=$(layer3 "$f"); REPORT+="  L3 editorial: ${r3}\n\n"
  [[ "$r3" =~ ^✅ ]] && L3=$((L3+1))
  [[ "$r3" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"
}

# ════════════════════════════════════════
# Main
# ════════════════════════════════════════
main() {
  local files=()
  case "${1:-}" in
    -h|--help|"") usage; [[ -z "${1:-}" ]] && exit 1; exit 0 ;;
  esac
  if [[ "${1:-}" == "--pr" ]] && [[ -n "${2:-}" ]]; then
    while IFS= read -r l; do [[ -n "$l" ]] && files+=("$l"); done < <(gh pr diff "$2" --name-only 2>/dev/null)
    (( ${#files[@]} == 0 )) && echo "❌ no files found for PR #$2" && exit 1
  else
    files=("$@")
  fi

  for f in "${files[@]}"; do TOTAL=$((TOTAL+1)); review "$f"; done

  echo -e "${BLU}🔍 Ethiopia.md PR review${RST}"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  echo -e "$REPORT"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  case $STATUS in
    PASS)    echo -e "${GRN}✅ PASS${RST} (L0 ${L0}/${TOTAL} | L1 ${L1}/${TOTAL} | L2 ${L2}/${TOTAL} | L3 clean ${L3}/${TOTAL})" ;;
    WARNING) echo -e "${YEL}🟡 WARNING${RST} (L0 ${L0}/${TOTAL} | L1 ${L1}/${TOTAL} | L2 ${L2}/${TOTAL} | L3 clean ${L3}/${TOTAL})" ;;
    FAIL)    echo -e "${RED}🔴 FAIL${RST} (L0 ${L0}/${TOTAL} | L1 ${L1}/${TOTAL} | L2 ${L2}/${TOTAL} | L3 clean ${L3}/${TOTAL})" ;;
  esac
  [[ "$STATUS" == "FAIL" ]] && exit 1 || exit 0
}

main "$@"
