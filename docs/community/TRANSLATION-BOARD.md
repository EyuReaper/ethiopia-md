# Translation board

This page explains where to find articles that need an English version. It does not list them by hand, because the list changes with every merge.

## Where the status lives

Each article's `status` field in its frontmatter decides whether it is visible:

- `published`: live on the site, and linked from category pages, search and feeds.
- `draft`: hidden from the site and from wikilink resolution until a maintainer flips it.
- `archived`: a retired article, hidden from listings and wikilinks. The page still builds if its URL is typed directly. None exist at the moment.

An article needs an English version when it is `published` (or about to be) and no file exists at `knowledge/en/{Category}/{slug}.md`.

## Finding open work

From the repository root, list Amharic articles that have no English counterpart:

```bash
for f in knowledge/*/*.md; do
  case "$f" in knowledge/en/*|*/_*) continue ;; esac
  rel="${f#knowledge/}"
  cat_dir="${rel%%/*}"
  slug="$(basename "$f")"
  [ -f "knowledge/en/${cat_dir}/${slug}" ] || echo "$f"
done
```

The Hub articles (`_{Category} Hub.md`) are the best starting point for a new reader. They are already translated.

## Claiming work

There is no claim system. If you plan to translate an article, open an issue or comment on an existing one so two people do not write the same file. Then follow [`prompts/TRANSLATE_PROMPT.md`](../prompts/TRANSLATE_PROMPT.md) and [`editorial/TRANSLATION-SYNC.md`](../editorial/TRANSLATION-SYNC.md).

## Review

A translation is reviewed against its Amharic source by a maintainer before it is merged. Reviewers check that every fact and citation survives the translation.
