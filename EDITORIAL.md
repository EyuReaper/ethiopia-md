# Ethiopia.md Editorial Guide

This guide covers how articles in `knowledge/` are written, sourced, structured and published. It replaces the editorial guide inherited from the Taiwan.md fork, whose prose was stripped during the rebrand.

The rules here are taken from what the repo enforces (`src/content.config.ts`, `scripts/core/test-frontmatter.mjs`, the article page templates) and from the articles that are actually live: the 12 category Hubs and the 24 published articles listed in `scripts/tools/.curated-core.json`. Where the live articles and this guide disagree, the guide describes the target, and the gap is listed in [`ROADMAP.md`](ROADMAP.md).

---

## 1. What an Ethiopia.md article is

An Ethiopia.md article is a sourced, readable explanation of one Ethiopian topic. It should work for someone who knows nothing about Ethiopia and for someone who grew up there.

- **One topic per article.** "Injera and teff" is a topic. "Ethiopian food" is a Hub.
- **Every factual claim is checkable.** A reader should be able to follow a link and find the number, date or quote you wrote.
- **Prose, not bullet dumps.** Lists are fine for genuinely list-shaped material (the clauses of a treaty, the three rounds of a coffee ceremony), but explanation belongs in paragraphs.
- **About Ethiopia, not adapted from somewhere else.** See [section 10](#10-the-fluent-but-wrong-country-failure-mode).

## 2. Languages: Amharic is the source of truth

| Tier    | Path                                | Role                                               |
| ------- | ----------------------------------- | -------------------------------------------------- |
| Amharic | `knowledge/{Category}/{slug}.md`    | Source of truth (SSOT). Written or approved first. |
| English | `knowledge/en/{Category}/{slug}.md` | Translation layer. Same slug as the Amharic file.  |

Rules:

- **The Amharic file is canonical.** If the Amharic and English versions disagree on a fact, the Amharic file is the one to fix first, then the translation follows.
- **Same slug in every language.** `knowledge/History/battle-of-adwa.md` pairs with `knowledge/en/History/battle-of-adwa.md`. Slugs are lowercase ASCII with hyphens, even for Amharic files.
- **Translations are faithful, not literal.** Keep every claim and every citation. Adjust sentence structure and add short glosses an English reader needs ("the _Kitet_, a national call to arms"), but do not add new facts in the translation that the Amharic file lacks.
- **Two languages only.** The site supports Amharic and English. There are no Spanish or Japanese folders, and the deleted Taiwan-era translations must not be restored.
- In practice, English drafts often come first because most sources are in English. That is fine, as long as the Amharic version is written, checked and published together with it, and the Amharic text is treated as the reference afterwards.

Never edit `src/content/**`. It is regenerated from `knowledge/` by `scripts/core/sync.sh` and your edits will be overwritten.

## 3. Frontmatter

### 3.1 Recommended template

Use this for every new article:

```yaml
---
title: 'The Battle of Adwa: Sovereign Defense and the Icon of Anti-Colonial Resistance'
description: 'In 1896, Ethiopian forces led by Emperor Menelik II and Empress Taytu Betul routed an invading Italian army at Adwa, preserving independence and inspiring Pan-African resistance.'
date: '2026-11-03'
tags:
  - History
  - Adwa
  - Pan-Africanism
featured: false
lastVerified: '2026-11-03'
lastHumanReview: false
status: draft
---
```

Quote dates as strings (`'2026-11-03'`). Use YAML block lists for tags. Inline lists with unescaped commas are the most common YAML failure in this repo.

### 3.2 Field reference

What is enforced where:

- **Validator**: `scripts/core/test-frontmatter.mjs`, run by `npm run test`, by the pre-commit hook (`--staged`) and in CI (`--ci`).
- **Schema**: the zod schema in `src/content.config.ts`, applied by Astro to the generated `src/content/` collections.
- **Page**: the article pages (`src/pages/[category]/[slug].astro` and the `en/` copy). These read frontmatter straight from `knowledge/` with `gray-matter`, so being in the schema does not mean a field is displayed.

| Field             | Required?                                                                           | Notes                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`           | Yes. Validator warns (error with `--strict`), schema requires it.                   | String. Must match the article's `#` heading.                                                                                                                                                          |
| `description`     | Yes. Same as `title`.                                                               | One or two sentences, roughly 120–250 characters. Shown on cards, in search and in meta tags. Must contain a concrete fact, not "an article about X".                                                  |
| `date`            | Yes. A missing date is a warning; an unparseable date is a hard error.              | ISO Gregorian `YYYY-MM-DD`, even in Amharic files. This is a machine date, never an Ethiopian-calendar date.                                                                                           |
| `tags`            | Yes. Missing is a warning; anything other than an array of strings is a hard error. | First tag is the category name in English (`History`, `Food`, ...). Then 2–4 specific tags. Hubs use `[Category, Hub]`.                                                                                |
| `status`          | Effectively yes                                                                     | `draft`, `published` or `archived` (use `archived` only to retire an article later). **A missing `status` means published** (schema default), so always set it explicitly. New work starts as `draft`. |
| `featured`        | Optional, default `false`                                                           | Used by homepage and featured listings. See `bash scripts/manage-featured.sh list`.                                                                                                                    |
| `lastVerified`    | Optional, not in schema                                                             | Date you last re-checked the facts against sources. Editorial convention used by the published articles.                                                                                               |
| `lastHumanReview` | Optional, not in schema                                                             | `true` only after a person (not an AI tool) has read the article against its sources. All current articles are `false`.                                                                                |
| `image`           | Optional                                                                            | Path under `public/` for a per-article hero image. Only use a real, licensed photo of the subject.                                                                                                     |
| `subcategory`     | Optional                                                                            | Shown as a small label next to the category on the article page.                                                                                                                                       |
| `readingTime`     | Optional                                                                            | Minutes. The page estimates it if absent, so usually leave it out.                                                                                                                                     |
| `author`          | Optional, default `Ethiopia.md Contributors`                                        | Leave unset unless there is a named, consenting author.                                                                                                                                                |
| `difficulty`      | Optional, `beginner` / `intermediate` / `advanced`                                  | Rarely used.                                                                                                                                                                                           |
| `lastUpdated`     | Optional                                                                            | ISO date of the last substantive edit.                                                                                                                                                                 |
| `source`          | Optional                                                                            | **Singular.** An array of URLs. The article page renders it as a "Sources" (ምንጮች) list under the body.                                                                                                 |
| `sources`         | Optional, in schema                                                                 | **Plural.** In the zod schema but _not_ rendered by the article page. Don't use it until the two are reconciled; use inline citations and, if you want a list, `source`.                               |
| `relatedTopics`   | Optional, in schema                                                                 | Not currently rendered. Use a closing paragraph with links instead (section 4).                                                                                                                        |

Language-specific fields:

- Amharic only: `alternativeNames` (array). Use `alternativeNames` for spelling variants and other-language names (for example `['Aksum', 'Axum', 'አክሱም']`).
- English only: `translationStatus` (`complete` / `partial` / `planned`, default `complete`).
- Don't use: `category` (derived from the folder, so setting it does nothing).

### 3.3 Other validator rules

- YAML must parse. A parse error is always a hard error.
- No duplicate slug within the same category and language.
- English slugs must be lowercase.
- Files starting with `_` (the Hubs and `_Home.md`) are validated like any other article.
- The validator scans `knowledge/_*.md`, the 14 category folders (including `Language/`) and their `en/` copies.
- A full `npm run test` passes on the current corpus. CI and the pre-commit hook only check changed files; check yours with: `node scripts/core/test-frontmatter.mjs --staged`.

## 4. Article structure

Every article follows the same depth model, so a reader can stop at any point and leave with something true.

1. **Title (`#`)**: matches the frontmatter `title`. Long titles can use a colon subtitle ("Ethiopian Coffee Culture and the Coffee Ceremony").
2. **30-second overview**: the lead paragraph, directly under the title and before the first `##`. In 3–5 sentences it says what the topic is, why it matters, and gives at least one concrete, cited anchor (a date, a number, a place). If a reader reads only this paragraph, they should be able to explain the topic to someone else.
3. **5-minute read**: the first two or three `##` sections. Together with the overview they tell the core story: origins, how it works, what it means. Someone who stops here should not have missed anything essential.
4. **In-depth sections**: the later `##` sections. Use them for regional variation, debates between scholars, economics and numbers, the current state, and what is uncertain.
5. **Related topics**: a short closing paragraph that connects the topic to one to three other _published_ articles and, where useful, the category Hub. See section 6 for link syntax.
6. **Sources**: inline citations after each claim (section 5). Optionally, also list the key URLs in the frontmatter `source:` array to get a rendered Sources list.

Skeleton:

```markdown
# Injera and Teff

Lead paragraph: what injera is, what teff is, one cited fact about teff's
origin or nutrition. [Source: Title](https://...)

## Teff: An Ancient Highland Grain

## How Injera Is Made

## Injera at the Table

## Teff in the Economy and on the Export Ban Debate

## Today: Diaspora, Gluten-Free Markets and Price Pressure

Injera is the base of almost every dish described in
[[doro-wat-and-festive-dining]]. For the wider picture, see the Food Hub.
```

Section headings say what the section contains ("The Treaty of Wuchale Deception"), not "Introduction" or "Conclusion". Don't add an "In conclusion" summary paragraph.

### Hubs

Each category has one Hub, `knowledge/{Category}/_{Category} Hub.md` (with an `en/` copy). A Hub is a survey of the whole category, not an index page: 4–8 `##` sections covering the major periods or themes, each with real content and citations. Hubs currently contain no wikilinks. Once enough articles exist in a category, Hubs should link to them in the relevant section.

## 5. Sourcing

### 5.1 Rules

- **Verify every number, date, name and quote.** If you can't find a source for it, cut it. "Approximately" doesn't excuse an unsourced figure.
- **Cite at the claim.** Put the citation right after the sentence or clause it supports, not collected at the end of a paragraph that makes five claims.
- **Source order of preference:**
  1. Primary sources: Ethiopian government bodies (ministries, the Central Statistics Service / Ethiopian Statistics Service, the National Bank of Ethiopia), UNESCO World Heritage listings, treaty texts, official reports of the institution being described.
  2. Academic work: peer-reviewed articles and scholarly books (Bahru Zewde, Harold Marcus, Richard Pankhurst, Encyclopaedia Aethiopica, university presses, JSTOR).
  3. Major reference works and international bodies: Britannica, World Bank, IMF, FAO, WHO, Kew, IUCN.
  4. Established journalism (BBC, Reuters, AP, The Guardian, Addis Standard, The Reporter Ethiopia) for recent events.
  5. Wikipedia only as a pointer or for uncontroversial background, and never as the only source for a number.
- **Name the source in the link text.** House style is `[Publisher: Title](url)`, for example `[Britannica: Battle of Adwa](https://www.britannica.com/event/Battle-of-Adwa)`. Repeat citations can shorten to `[Britannica](url)`.
- **The link must point at the cited work.** A JSTOR link labeled with a book title must open that book or a chapter of it, not an unrelated review. Open every URL before you commit.
- **Contested numbers get ranges and attribution.** "Estimates of the army's size range from 70,000 to over 100,000 [Source A] [Source B]", not a single confident figure.
- **Legend is labeled as legend.** The Kaldi coffee story, the Kebra Nagast lineage, founding myths: present them as traditions, and say so.
- **Date-sensitive facts carry their year.** "As of 2024, Ethiopian Airlines served..." Population, GDP, prices, user counts and rankings change.

### 5.2 Citation density

Measured across the live articles:

| Article set                                         | English words | Unique sources | Inline citations |
| --------------------------------------------------- | ------------- | -------------- | ---------------- |
| 12 category Hubs                                    | 950–1,250     | 5–12           | 5–12             |
| Aug 2026 articles (coffee, festivals, telebirr, AI) | 800–1,180     | 8–9            | 17–24            |
| Nov 2026 flagships (20 articles)                    | 430–610       | 0–7 (median 3) | 0–11             |

The **August articles are the model**: at least **800 words** in English (about 750 in Amharic, which uses fewer, longer words), **at least 6 distinct sources**, and a citation on every sentence that carries a number, date or quote. The shorter November flagships pass review but sit below this bar. A few have only one source or none (`addis-ababa-cafe-culture.md` has none), and they are queued for deepening in the roadmap. Don't copy their density.

Footnotes (`text[^1]` with `[^1]: ...` at the end) are also supported and rendered by the article page. Use them when a citation needs a comment ("figure is for 2019/20 EFY"). Inline links stay the default.

## 6. Wikilinks and cross-links

`plugins/remark-wikilinks.mjs` converts `[[slug]]` into a link at build time.

- The target is the **filename without `.md`** (`[[battle-of-adwa]]`), not the article title.
- The link map is built only from **Amharic root files** (`knowledge/{Category}/*.md`), skipping `_` files, `draft` and `archived`. A link to an unpublished or archived article quietly turns into plain text, so published articles never point at hidden pages.
- The visible link text is the slug itself (`battle-of-adwa`), and the URL is always the **Amharic** page (`/history/battle-of-adwa`), even inside an English article.

House style today: one wikilink in the closing paragraph, pointing at the paired article in the same category ("To discover Ethiopia's ancient commercial and political origins, see [[aksumite-empire]]."). Until the plugin becomes language-aware:

- In **Amharic** articles, use `[[slug]]`.
- In **English** articles, prefer a normal Markdown link so readers stay in English: `[the Aksumite Empire](/en/history/aksumite-empire)`.
- Link only to articles that are `status: published`. Link inside the body when a term needs it, not on every mention, and at most once per target.

## 7. Calendar, dates and numbers

Ethiopia uses its own calendar (ዓ.ም., _Amete Mihret_): 12 months of 30 days plus Pagume (5 or 6 days). The year runs 7–8 years behind the Gregorian year, and the Ethiopian New Year (Meskerem 1) falls on 11 September, or 12 September in the Gregorian year before a leap year.

**In Amharic prose**

- Use Ethiopian-calendar years with ዓ.ም. for historical and modern dates: "በየካቲት 23 ቀን 1888 ዓ.ም.". Use ዓ.ዓ. for BCE.
- Where an international reader would look for the Gregorian date (treaties, global events), add it in parentheses on first mention: "1888 ዓ.ም. (1896)".

**In English and other translations**

- Use Gregorian dates. For dates that matter in Ethiopia itself, add the Ethiopian date once: "March 1, 1896 (Yekatit 23, 1888 in the Ethiopian calendar)". After the first use, "E.C." is fine.
- Name Ethiopian festivals by their Ethiopian date and give the Gregorian equivalent: "Timket (Tir 11, usually January 19)".

**In both**

- Convert carefully. An Ethiopian year spans two Gregorian years (1888 E.C. ran from September 1895 to September 1896). Never convert a bare year without knowing the month; if the source gives only a year, keep the source's calendar and say which it is.
- Ethiopian fiscal years (EFY) run from Hamle 1 (about 8 July). Statistics from Ethiopian government sources are often by EFY; say so.
- Ethiopian time of day counts from about 6 a.m. ("1 o'clock" is 7 a.m.). In Amharic prose, say which system you use if a time appears; in English, use international time.
- Frontmatter dates (`date`, `lastVerified`, `lastUpdated`) are always ISO Gregorian. So are RSS and JSON-LD dates. On-screen dates are converted by `src/utils/dateFormat.ts`.
- Numbers: in English, use digits with commas (`4,000`) and spell out units on first use (`square kilometers`, `birr`). Give currency in birr with a dated USD equivalent where useful: "ETB 100 (about USD 1.80 in 2024)".

## 8. Names and transliteration

There is no single transliteration standard in general use, so the aim is consistency and recognizability.

- **Use the established English spelling** when one exists in major references: Haile Selassie, Menelik II, Aksum, Lalibela, Addis Ababa, Tigray, Oromia, Gondar. Don't create a new scholarly spelling for a name readers already know.
- **Give the Ge'ez script once.** On first mention of a person, place or term in an English article, add the Amharic (or relevant language's) spelling in parentheses: "Empress Taytu Betul (ጣይቱ ብጡል)", "the _masenqo_ (ማሲንቆ)".
- **One spelling per article.** If sources disagree (Taytu/Taitu, Kaffa/Kafa, Aksum/Axum), pick the one Britannica or the main academic source uses, list the others in `alternativeNames` in the Amharic file, and keep the original spelling only inside a quoted citation title.
- **No diacritics in running text or slugs.** Don't use Encyclopaedia Aethiopica-style marks (ä, ǝ, ṭ, ḥ) unless the article is about language or script. Slugs are always plain ASCII.
- **Ethiopian naming.** Most Ethiopians have a given name followed by their father's given name, not a family surname. On second mention use the given name: "Abebe Bikila ... Abebe won", not "Bikila won". Follow a person's own published usage if it differs.
- **Titles.** Keep traditional titles transliterated and explain them once: Ras, Dejazmach, Negus, Negusa Nagast, Woizero, Abuna.
- **Non-Amharic terms.** Give Oromo (Afaan Oromoo), Tigrinya, Somali, Sidama and other terms in their own standard orthography (Afaan Oromoo uses Latin script, Qubee: _Gadaa_, _Irreecha_), not run through Amharic.
- **Avoid slurs and exonyms.** Use the names communities use for themselves: Oromo (never "Galla"), Beta Israel (not "Falasha" except when quoting historical usage, marked as such).

## 9. Neutrality on contested topics

Some topics are live political disputes. Getting them wrong does real harm, so the bar is higher.

The main ones: **ethnic federalism** and the 1995 constitution; **regional conflicts**, including the 2020–2022 Tigray war, the conflicts in Amhara and Oromia, and contested areas such as Western Tigray/Welkait and Raya; the **Grand Ethiopian Renaissance Dam (GERD)** and the Nile dispute with Egypt and Sudan; relations with **Eritrea**; the **Derg** and the Red Terror; **casualty and displacement figures**; the political legacy of emperors and prime ministers; and religious and ethnic demographics.

Rules:

- **Attribute, don't assert.** "The federal government describes X; the TPLF describes Y; the UN-mandated inquiry found Z" with a citation for each, not one side's framing stated as fact.
- **Report figures as ranges with their sources.** Casualty counts, census shares by ethnicity or religion, and dam impact estimates vary widely. Show the range and who produced each figure.
- **Use neutral names.** Name parties, groups and places by their own names. Where a place has two names in dispute, give both on first mention with a note ("Western Tigray, called Welkait by Amhara regional authorities"). Use labels such as "terrorist" only inside attributed quotes.
- **Separate the record from the interpretation.** Dates, treaty texts and court findings are the record. "Success", "failure", "liberation" and "occupation" are interpretations, so attribute them.
- **Represent Ethiopia's diversity.** Ethiopia has more than 80 ethnic groups and many religions. An article on "Ethiopian" culture should not quietly describe only the Orthodox Christian highland Amhara/Tigrayan version. Say when a practice is regional, ethnic or religious.
- **Recent events need dated sources.** For anything after 2018, say "as of [date]" and prefer reporting from more than one outlet.
- **Pick the scope you can source.** If you can't present the competing positions fairly with citations, narrow the article (for example GERD's engineering and timeline) and leave the dispute to a sourced section or a later article.

## 10. The "fluent but wrong country" failure mode

This repository is a fork of Taiwan.md. The most dangerous leftover errors are not the visibly broken `[Amharic translation needed ...]` strings. They are fluent, well-formatted passages that are factually about Taiwan but labeled Ethiopia.

Real examples found and fixed in this repo:

- The homepage stated a land area of `36,000 km²`, which is Taiwan's. Ethiopia's is about 1.1 million km².
- A contributor-guide example said a Taiwanese Olympic badminton player "is a famous Ethiopian badminton player".
- Hero stats claimed Ethiopia produces "90% of global advanced chips" and is "Asia's first democracy".
- The `/data` page called Ethiopia "an island".
- Four downloadable "Ethiopia" map SVGs and the site-wide social image showed Taiwan's outline.
- The `/resources` page listed Taiwan government URLs as Ethiopia's official directory.

What this means for writers and reviewers:

1. **Never Ethiopia-wash a Taiwan topic.** Don't take a Taiwan article (for example one recovered from git history, such as `convenience-store-culture.md`, `beef-noodle-soup.md` or `228-incident.md`), swap "Taiwan" for "Ethiopia" and tidy it up. The topic itself usually has no Ethiopian equivalent, and everything that survives the swap (dates, numbers, names) will be wrong. Replace the topic: the History flagship slot that held the 228 Incident now holds the Battle of Adwa, and the Culture slot that held Taiwanese tea culture now holds Ethiopian coffee culture, a genuinely different topic rather than a renamed one.
2. **Never use the deleted Taiwan articles as a template** for structure, tone, numbers or links. They were deleted because they are wrong.
3. **Read for plausibility, not just for corruption.** Grepping for the placeholder string finds only broken text. Watch for: islands, typhoons, semiconductors, night markets, convenience stores, MRT/metro systems, martial law, Hakka/Hoklo, Mandarin, "Asia's first", `.gov.tw` URLs, and any number you can't trace to an Ethiopian source.
4. **Check images by looking at them.** A file named `ethiopia-*.svg` proved nothing in this repo. Open every image you add or reuse.
5. **Run the keyword check** before opening a PR that touches site chrome:

   ```bash
   grep -rin "island\|taipei\|tsmc\|yushan\|night market\|convenience store\|hoklo\|hakka\|martial law\|\.gov\.tw\|taiwan" \
     src --include="*.ts" --include="*.astro" | grep -v "^src/content/"
   ```

## 11. Tone and style

Derived from the published Hubs and articles:

- **Explanatory and concrete.** Lead with the specific: "On March 1, 1896, at the foot of the mountains of Adwa..." rather than "Ethiopia has a rich and fascinating history".
- **Warm but not promotional.** Ethiopia.md is not a tourism brochure. Don't use "hidden gem", "breathtaking", "must-see", "land of contrasts" or "rich tapestry". Let the facts carry the weight.
- **Honest about difficulty.** Famine, war, repression and poverty are part of the record and appear in the Hubs with sources. Don't leave them out to keep an article upbeat, and don't make them the only story either.
- **Explain Ethiopian terms the first time,** in italics in English: "_injera_, a fermented flatbread made from teff".
- **Paragraphs of 3–6 sentences;** `##` sections of 1–3 paragraphs. Bold is rare. Bullet lists only for list-shaped content.
- **No AI-writing tics:** no "delve", no "it is worth noting", no "In conclusion", no strings of em dashes, no paragraphs that restate the heading.
- **English spelling:** US spelling to match the existing English articles.

## 12. Workflow

1. **Pick a slot or a topic.** Check `ROADMAP.md` and `scripts/tools/.curated-core.json`. Search first (`ethiopiamd search "<topic>"` or the `ethiopiamd-search` skill) to avoid duplicates.
2. **Research before writing.** Collect at least six sources, and open each one.
3. **Write the Amharic and English files** at `knowledge/{Category}/{slug}.md` and `knowledge/en/{Category}/{slug}.md` with `status: draft`.
4. **Validate:** `node scripts/core/test-frontmatter.mjs --staged`, then `npm run sync` and `bun run dev` to read the rendered page. Check that every wikilink resolves and every URL opens.
5. **Review.** A reviewer checks facts against sources, plausibility (section 10) and neutrality (section 9). Set `lastHumanReview: true` only after a person has done this.
6. **Publish** by changing `status: draft` to `status: published` in both language files in the same commit, and update `lastVerified`.

`bash scripts/tools/quality-scan.sh` is inherited from Taiwan.md and its keyword patterns were corrupted by the rebrand. It currently flags good articles (it treats the placeholder string as a character class). Don't use its score as a publish gate until it is repaired.

---

## አጭር ማጠቃለያ (በአማርኛ)

- **ዋናው ምንጭ አማርኛ ነው።** የአማርኛው ጽሑፍ ትክክለኛው ቅጂ ነው፤ እንግሊዝኛ፣ ስፓኒሽ እና ጃፓንኛ ትርጉሞች ናቸው። በሁሉም ቋንቋዎች ተመሳሳይ የፋይል ስም (slug) ይጠቀሙ።
- **እያንዳንዱን ቁጥር፣ ቀንና ስም ያረጋግጡ።** ምንጭ የሌለው መረጃ አይጻፍም። የመንግሥት ሰነዶችን፣ የዩኔስኮ መዛግብትንና የምሁራን ጥናቶችን ቅድሚያ ይስጡ፤ ምንጩን ከዓረፍተ ነገሩ ቀጥሎ ያስቀምጡ። ጥሩ ጽሑፍ ቢያንስ ስድስት የተለያዩ ምንጮች አሉት።
- **የጽሑፍ አወቃቀር፦** የ30 ሰከንድ መግቢያ አንቀጽ፣ የ5 ደቂቃ ዋና ክፍሎች፣ ጥልቅ ክፍሎች፣ ተዛማጅ ርዕሶች፣ ከዚያም ምንጮች።
- **የዘመን አቆጣጠር፦** በአማርኛ ጽሑፍ የኢትዮጵያን ዘመን አቆጣጠር (ዓ.ም.) ይጠቀሙ፤ በእንግሊዝኛ ጽሑፍ የግሪጎሪያን ቀን ይጠቀሙና አስፈላጊ ሲሆን የኢትዮጵያን ቀን በቅንፍ ያክሉ። በፍሮንትማተር ውስጥ ያሉ ቀኖች ሁልጊዜ በግሪጎሪያን (YYYY-MM-DD) ይጻፋሉ።
- **ስሞች፦** የታወቀውን የእንግሊዝኛ አጻጻፍ ይጠቀሙ፤ በመጀመሪያ ሲጠቀሱ የግዕዝ ፊደል አጻጻፉን በቅንፍ ያክሉ። ሰዎችን በሁለተኛ ጊዜ በመጀመሪያ ስማቸው ይጥሩ።
- **አወዛጋቢ ጉዳዮች፦** ስለ ብሔር ፌዴራሊዝም፣ ስለ ክልላዊ ግጭቶችና ስለ ታላቁ የኢትዮጵያ ሕዳሴ ግድብ ሲጽፉ የእያንዳንዱን ወገን አቋም በምንጭ አስደግፈው ያቅርቡ። የራስዎን አቋም እንደ እውነታ አያቅርቡ።
- **«የተሳሳተ ሀገር» ስህተት፦** ይህ ፕሮጀክት ከታይዋን ፕሮጀክት የተገኘ ነው። የታይዋንን ርዕስ «ኢትዮጵያዊ» አድርገው አይቀይሩ፤ ርዕሱን በእውነተኛ የኢትዮጵያ ርዕስ ይተኩ። የተቀመጡ (archived) ፋይሎችን እንደ ምሳሌ አይጠቀሙ።
- **የሥራ ሂደት፦** አዲስ ጽሑፍ በ `status: draft` ይጀምራል፤ አንድ ሰው ከምንጮቹ ጋር ካረጋገጠው በኋላ ብቻ ወደ `status: published` ይቀየራል።

_This Amharic summary should be reviewed by a native Amharic editor._
