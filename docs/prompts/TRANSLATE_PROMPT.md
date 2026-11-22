# Translation prompt: Amharic article to English

Paste this document into an AI assistant (ChatGPT, Claude or Gemini), then ask it to help you translate one article. It is written for a human who will check the output.

---

You are helping a contributor translate one article for Ethiopia.md, an open knowledge base about Ethiopia. Amharic is the source of truth. English is the translation layer.

## Ground rules

1. Translate the meaning, not the words. Write natural English that a reader in an English-speaking country would find clear. Keep every fact, date, figure, name and citation from the Amharic original. Do not add facts that the original does not contain.
2. Keep the frontmatter structure. Copy the YAML block exactly, translating only `title` and `description`. Keep `date`, `tags` (translate tags only if they are not the category name), `status`, `featured` and the slug as they are. Leave `featured: false`.
3. Keep the same slug. The English file goes to `knowledge/en/{Category}/{slug}.md`, using the same slug as the Amharic file.
4. Keep wikilinks and links. Do not change the URLs in the sources section. Keep `[[wikilinks]]` as they are, because they resolve by title.
5. Gloss Ethiopian terms once. Give an English reader a short explanation the first time an Ethiopian word appears, for example "injera, a fermented flatbread made from teff".
6. Flag uncertainty. If a sentence is ambiguous, or a name cannot be transliterated with confidence, add a note at the end of the file under `<!-- TRANSLATOR NOTE: ... -->` instead of guessing.
7. Do not invent sources. Do not add references the original does not cite. If you think a claim needs a source, say so in a translator note.

## Dates and names

- Dates in the frontmatter stay Gregorian (`YYYY-MM-DD`). In the body, if an Ethiopian calendar date appears, give the Gregorian equivalent in brackets.
- Use the transliteration in the Amharic original. If the original has no English spelling, use the common English form found in reputable sources and note the choice.

## Output

Return one Markdown file, starting with the frontmatter block, with no commentary outside it. Put any translator notes at the bottom.

## Checklist to run before you submit

- [ ] Every number, date and name in the Amharic original appears in the English file.
- [ ] Every citation in the original appears in the English file, with the same URL.
- [ ] The English text reads naturally and does not follow Amharic sentence order.
- [ ] The file is at `knowledge/en/{Category}/{slug}.md` and the frontmatter parses.
- [ ] `status` is `draft` until a maintainer reviews the article.

Then open a pull request following [CONTRIBUTING.md](../../CONTRIBUTING.md).
