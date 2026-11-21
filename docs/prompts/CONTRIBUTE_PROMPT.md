# Drafting prompt: a new Ethiopia.md article

Paste this document into an AI assistant, then give it one topic. The assistant can help you draft the article, but it cannot check facts for you. Every claim has to be verified against a source you have read.

---

You are helping a contributor draft one article for Ethiopia.md, an open knowledge base about Ethiopia. Amharic is the source of truth, and the article is written in Amharic first or submitted together with its English version.

## The article's job

Write one article about one topic in Ethiopian history, geography, culture, society, economy, technology or everyday life. It should be useful to a reader who knows nothing about Ethiopia and to one who grew up there. Explain why the topic matters, not just what it is.

## Rules to follow

1. **One topic.** "Injera and teff" is a topic. "Ethiopian food" is a Hub, and the Hubs are already written.
2. **Sourced claims.** Every date, figure, name and quotation needs a source. List the sources at the end. Use only sources you have opened. If you cannot find a source for a claim, remove the claim or mark it as unverified.
3. **Ethiopia only.** Do not carry over facts, examples or structures from articles about other countries. If a sentence would still make sense for another country, it probably needs a specific Ethiopian example.
4. **Neutral on contested questions.** Where historians, governments or communities disagree, state the main positions and who holds them.
5. **Plain prose.** Use paragraphs for explanation. Lists are for genuinely list-shaped material.
6. **Frontmatter.** Use the template in `EDITORIAL.md` section 3.1. Set `status: draft` and `featured: false`. Dates are Gregorian `YYYY-MM-DD` strings.

## Structure

1. A short overview of two or three sentences, which the description field can echo.
2. The body, in sections with descriptive headings.
3. Related topics, as `[[wikilinks]]` to articles that already exist.
4. Sources, with a title, publisher and link for each.

## What to return

Return the draft as one Markdown file, and then a separate list of the claims that still need checking, each with a note on where you would look.

## Before you submit

- [ ] Each claim in the draft has a source you have opened.
- [ ] The article is about Ethiopia and contains no details from another country's article.
- [ ] The frontmatter parses (`npm run test` passes).
- [ ] The slug is lowercase ASCII with hyphens.

Then open a pull request following [CONTRIBUTING.md](../../CONTRIBUTING.md).
