#!/usr/bin/env bash
# review-pr.sh v1.0 — Ethiopia.md PR [Amharic translation needed - original Taiwan context]（[Amharic translation needed - original Taiwan context]）
# [Amharic translation needed - original Taiwan context]: bash scripts/review-pr.sh file1.md file2.md ...
# [Amharic translation needed - original Taiwan context]:   bash scripts/review-pr.sh --pr 123
set -uo pipefail
cd "$(dirname "$0")/.."

RED='\033[0;31m'; YEL='\033[0;33m'; GRN='\033[0;32m'
BLU='\033[0;34m'; DIM='\033[0;90m'; RST='\033[0m'

VALID_CATS=("About" "History" "Geography" "Culture" "Food" "Art" "Music" "Technology" "Nature" "People" "Society" "Economy" "Lifestyle")
SIMP_PAT='[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]'

TOTAL=0; L0=0; L1=0; L2=0; L3=0
STATUS="PASS"
REPORT=""

# ════════════════════════════════════════
# Layer 0 — [Amharic translation needed - original Taiwan context]
# ════════════════════════════════════════
layer0() {
  local f="$1"
  [[ ! "$f" =~ \.md$ ]] && echo "🔴 [Amharic translation needed - original Taiwan context] .md [Amharic translation needed - original Taiwan context]" && return 1
  if [[ "$f" =~ ^knowledge/ ]] || [[ "$f" =~ ^src/content/ ]]; then
    echo "✅ [Amharic translation needed - original Taiwan context]"; return 0
  fi
  [[ "$f" =~ \.github/|^scripts/|^src/pages/|^src/components/|^tools/|^package|^astro\.config ]] \
    && echo "🔴 [Amharic translation needed - original Taiwan context]" && return 1
  echo "🔴 [Amharic translation needed - original Taiwan context]"; return 1
}

# ════════════════════════════════════════
# Layer 1 — [Amharic translation needed - original Taiwan context]
# ════════════════════════════════════════
layer1() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 [Amharic translation needed - original Taiwan context]" && return 1
  local err=() wrn=()

  # conflict markers
  grep -qE '^(<{7}|={7}|>{7})' "$f" 2>/dev/null && err+=("Git [Amharic translation needed - original Taiwan context]")

  # [Amharic translation needed - original Taiwan context]
  local sc; sc=$(grep -oE "$SIMP_PAT" "$f" 2>/dev/null | wc -l | tr -d ' ')
  (( sc > 5 )) && wrn+=("[Amharic translation needed - original Taiwan context] ${sc} [Amharic translation needed - original Taiwan context]")

  # frontmatter
  local fm; fm=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$f" 2>/dev/null)
  if [[ -z "$fm" ]]; then
    err+=("[Amharic translation needed - original Taiwan context] frontmatter")
  else
    echo "$fm" | grep -q '^title:' || err+=("[Amharic translation needed - original Taiwan context] title")
    echo "$fm" | grep -q '^description:' || err+=("[Amharic translation needed - original Taiwan context] description")
    echo "$fm" | grep -q '^date:' || err+=("[Amharic translation needed - original Taiwan context] date")
    echo "$fm" | grep -q '^tags:' || err+=("[Amharic translation needed - original Taiwan context] tags")
    echo "$fm" | grep -q '^featured: true' && err+=("featured [Amharic translation needed - original Taiwan context] true")
    # category from path
    local cd; cd=$(echo "$f" | sed -n 's|^knowledge/\([^/]*\)/.*|\1|p')
    if [[ -n "$cd" ]]; then
      local ok=false
      for v in "${VALID_CATS[@]}"; do [[ "$cd" == "$v" ]] && ok=true && break; done
      $ok || err+=("[Amharic translation needed - original Taiwan context] category: $cd")
    fi
  fi

  if (( ${#err[@]} > 0 )); then
    echo "🔴 $(IFS=', '; echo "${err[*]}")"; return 1
  elif (( ${#wrn[@]} > 0 )); then
    echo "🟡 OK（$(IFS=', '; echo "${wrn[*]}")）"; return 0
  else
    echo "✅ frontmatter [Amharic translation needed - original Taiwan context]"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 2 — [Amharic translation needed - original Taiwan context]（inline quality-scan [Amharic translation needed - original Taiwan context]）
# ════════════════════════════════════════
layer2() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "🔴 [Amharic translation needed - original Taiwan context]" && return 1
  local wrn=() hs=0

  local body; body=$(awk '/^---$/{n++; next} n>=2{print}' "$f" 2>/dev/null)
  local tl; tl=$(echo "$body" | wc -l | tr -d ' \n'); tl=${tl:-0}

  # quality: bullet [Amharic translation needed - original Taiwan context]
  local bl; bl=$(echo "$body" | grep -c '^- \*\*' 2>/dev/null || echo "0"); bl=${bl//[^0-9]/}; bl=${bl:-0}
  (( tl > 5 && bl * 100 / tl > 30 )) && ((hs+=2))

  # quality: [Amharic translation needed - original Taiwan context]
  local yr; yr=$(echo "$body" | grep -oE '\b(19|20)[0-9]{2}\b' 2>/dev/null | wc -l | tr -d ' \n'); yr=${yr//[^0-9]/}; yr=${yr:-0}
  (( yr < 3 )) && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  echo "$body" | grep -q 'http' 2>/dev/null || ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  local hw; hw=$(echo "$body" | grep -cE '[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]' 2>/dev/null || echo "0"); hw=${hw//[^0-9]/}; hw=${hw:-0}
  (( hw >= 3 )) && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  local pr; pr=$(echo "$body" | grep -cvE '^#|^$|^-|^\*|^>|^\|' 2>/dev/null || echo "0"); pr=${pr//[^0-9]/}; pr=${pr:-0}
  (( pr < 10 )) && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  local pl; pl=$(echo "$body" | grep -cE '[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context]' 2>/dev/null || echo "0"); pl=${pl//[^0-9]/}; pl=${pl:-0}
  (( pl >= 1 )) && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  local ds; ds=$(echo "$body" | grep -o '——' 2>/dev/null | wc -l | tr -d ' \n'); ds=${ds//[^0-9]/}; ds=${ds:-0}
  (( ds > 4 )) && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  echo "$body" | head -1 | grep -qE '^(Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia|[Amharic translation needed - original Taiwan context]Ethiopia[Amharic translation needed - original Taiwan context])' 2>/dev/null && ((hs++))

  # quality: [Amharic translation needed - original Taiwan context]
  echo "$body" | tail -5 | grep -qE '[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]' 2>/dev/null && ((hs++))

  # quality [Amharic translation needed - original Taiwan context]
  local hs_label=""
  if (( hs <= 5 )); then hs_label="✅ quality $hs"
  elif (( hs <= 7 )); then hs_label="🟡 quality $hs"; wrn+=("quality [Amharic translation needed - original Taiwan context]")
  else hs_label="🔴 quality $hs"; echo "$hs_label"; return 1
  fi

  # [Amharic translation needed - original Taiwan context]
  local cc; cc=$(echo "$body" | wc -m | tr -d ' \n'); cc=${cc//[^0-9]/}; cc=${cc:-0}
  if [[ "$f" =~ /en/|/es/|/ja/ ]]; then
    (( cc < 2500 )) && wrn+=("[Amharic translation needed - original Taiwan context] ${cc}ch")
  else
    (( cc < 3000 )) && wrn+=("[Amharic translation needed - original Taiwan context] ${cc}ch")
  fi

  # H2
  local h2; h2=$(grep -c '^## ' "$f" 2>/dev/null || echo 0); h2=${h2//[^0-9]/}; h2=${h2:-0}
  (( h2 < 1 )) && wrn+=("[Amharic translation needed - original Taiwan context] H2")

  # [Amharic translation needed - original Taiwan context]
  local lk; lk=$(grep -c 'http' "$f" 2>/dev/null || echo 0); lk=${lk//[^0-9]/}; lk=${lk:-0}
  (( lk < 1 )) && wrn+=("[Amharic translation needed - original Taiwan context]")

  if (( ${#wrn[@]} > 0 )); then
    echo "$hs_label（$(IFS=', '; echo "${wrn[*]}")）"; return 0
  else
    echo "$hs_label"; return 0
  fi
}

# ════════════════════════════════════════
# Layer 3 — EDITORIAL v4 [Amharic translation needed - original Taiwan context]
# ════════════════════════════════════════
layer3() {
  local f="$1"
  [[ ! -f "$f" ]] && echo "—" && return 0
  local wrn=()
  local body; body=$(awk '/^---$/{n++; next} n>=2 && NF{print}' "$f" 2>/dev/null)

  # [Amharic translation needed - original Taiwan context]
  echo "$body" | head -1 | grep -qE '^(Ethiopia[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]Ethiopia)' 2>/dev/null && wrn+=("[Amharic translation needed - original Taiwan context]")

  # [Amharic translation needed - original Taiwan context]
  grep -q '「' "$f" 2>/dev/null || wrn+=("[Amharic translation needed - original Taiwan context]")

  # [Amharic translation needed - original Taiwan context]
  tail -10 "$f" | grep -qE '[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context].*[Amharic translation needed - original Taiwan context]|[Amharic translation needed - original Taiwan context]' 2>/dev/null && wrn+=("[Amharic translation needed - original Taiwan context]")

  # [Amharic translation needed - original Taiwan context]
  local refs; refs=$(grep -c 'http' "$f" 2>/dev/null || echo 0); refs=${refs//[^0-9]/}; refs=${refs:-0}
  (( refs < 3 )) && wrn+=("[Amharic translation needed - original Taiwan context]<3")

  if (( ${#wrn[@]} > 0 )); then
    echo "🟡 $(IFS=', '; echo "${wrn[*]}")"
  else echo "✅"
  fi; return 0
}

# ════════════════════════════════════════
# [Amharic translation needed - original Taiwan context]
# ════════════════════════════════════════
review() {
  local f="$1"; REPORT+="📁 ${f}\n"

  local r0; r0=$(layer0 "$f"); REPORT+="  L0 [Amharic translation needed - original Taiwan context]：${r0}\n"
  if [[ "$r0" =~ ^🔴 ]]; then STATUS="FAIL"; REPORT+="\n"; return; fi
  L0=$((L0+1))

  local r1; r1=$(layer1 "$f"); REPORT+="  L1 [Amharic translation needed - original Taiwan context]：${r1}\n"
  if [[ "$r1" =~ ^🔴 ]]; then STATUS="FAIL"; else L1=$((L1+1)); fi

  local r2; r2=$(layer2 "$f"); REPORT+="  L2 [Amharic translation needed - original Taiwan context]：${r2}\n"
  if [[ "$r2" =~ ^🔴 ]]; then STATUS="FAIL"
  elif [[ "$r2" =~ ^🟡 ]] && [[ "$STATUS" != "FAIL" ]]; then STATUS="WARNING"
  fi
  [[ ! "$r2" =~ ^🔴 ]] && L2=$((L2+1))

  local r3; r3=$(layer3 "$f"); REPORT+="  L3 [Amharic translation needed - original Taiwan context]：${r3}\n\n"
  [[ "$r3" =~ ^✅ ]] && L3=$((L3+1))
  [[ "$r3" =~ ^🟡 ]] && [[ "$STATUS" == "PASS" ]] && STATUS="WARNING"
}

# ════════════════════════════════════════
# Main
# ════════════════════════════════════════
main() {
  local files=()
  if [[ "${1:-}" == "--pr" ]] && [[ -n "${2:-}" ]]; then
    while IFS= read -r l; do [[ -n "$l" ]] && files+=("$l"); done < <(gh pr diff "$2" --name-only 2>/dev/null)
    (( ${#files[@]} == 0 )) && echo "❌ [Amharic translation needed - original Taiwan context] PR #$2" && exit 1
  else
    files=("$@")
  fi
  (( ${#files[@]} == 0 )) && echo "[Amharic translation needed - original Taiwan context]: $0 <file.md ...> | --pr <number>" && exit 1

  for f in "${files[@]}"; do TOTAL=$((TOTAL+1)); review "$f"; done

  echo -e "${BLU}🔍 Ethiopia.md PR Review${RST}"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  echo -e "$REPORT"
  echo -e "${DIM}═══════════════════════════════════${RST}"
  case $STATUS in
    PASS)    echo -e "${GRN}✅ PASS${RST}（${L0}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L1}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L2}/${TOTAL} [Amharic translation needed - original Taiwan context]）" ;;
    WARNING) echo -e "${YEL}🟡 WARNING${RST}（${L0}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L1}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L2}/${TOTAL} [Amharic translation needed - original Taiwan context]）" ;;
    FAIL)    echo -e "${RED}🔴 FAIL${RST}（${L0}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L1}/${TOTAL} [Amharic translation needed - original Taiwan context] | ${L2}/${TOTAL} [Amharic translation needed - original Taiwan context]）" ;;
  esac
  [[ "$STATUS" == "FAIL" ]] && exit 1 || exit 0
}

main "$@"
