# Language tiers

Ethiopia.md supports two languages: **Amharic**, the source of truth, and **English**, the translation layer. Nothing else is supported yet. There are no Spanish, Japanese, Korean or other locale directories, and the site does not expose them.

## Layout

```
knowledge/{Category}/{slug}.md         Amharic (source of truth)
knowledge/en/{Category}/{slug}.md      English (translation, same slug)
i18n/en/STYLE.md                       Style notes for English translations
```

Site chrome (navigation, buttons and page labels) is translated in `src/i18n/*.ts`. Those dictionaries are separate from the article content, and each one has an `am` and an `en` entry.

## Rules

- Amharic is written or approved first. If the two versions disagree on a fact, fix the Amharic file first and then the translation.
- Use the same slug in both languages. Slugs are lowercase ASCII with hyphens.
- Translations keep every fact, figure and citation. Adjust the sentences for English readers rather than translating word for word.
- The English site language is served under `/en/`. Amharic is the default and has no prefix (see `astro.config.mjs`).

## Adding a language

Adding a language is a change to the site, not only to the content. It needs:

1. A locale entry in `astro.config.mjs`.
2. A `knowledge/{lang}/` directory and a `src/i18n` dictionary for the site labels.
3. A style guide at `i18n/{lang}/STYLE.md`.
4. Build and validation support, so the new language's articles are checked the same way as English.

Oromo and Tigrinya are not supported. They would need all four items above before anything is published.

## Related

- [`EDITORIAL.md`](../EDITORIAL.md) section 2 for the full rules on source and translation.
- [`docs/editorial/TRANSLATION-SYNC.md`](../docs/editorial/TRANSLATION-SYNC.md) for keeping translations current.
- [`docs/prompts/TRANSLATE_PROMPT.md`](../docs/prompts/TRANSLATE_PROMPT.md) for an AI-assisted translation workflow.
