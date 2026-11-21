# Keeping the English translation in sync

The Amharic article in `knowledge/{Category}/{slug}.md` is the source of truth. The English version lives at `knowledge/en/{Category}/{slug}.md` with the same slug. See [`EDITORIAL.md`](../../EDITORIAL.md) section 2 for the rules.

## When a translation needs updating

An English file is out of date when its Amharic source has changed since the translation was last checked. Two checks help:

1. Look at the Amharic file's `lastVerified` and `date` fields and compare them with the English file.
2. Run the sync helper, which lists Amharic articles changed in a recent window and checks whether an English file exists for them:

```bash
bash scripts/utils/check-translation-sync.sh 24
```

The number is the window in hours. The script reports changes from git history only. It does not compare content, so a human still has to read the diff.

## How to update a translation

- Keep every fact and citation from the Amharic source. Do not add a fact the source does not contain.
- Adjust sentence structure for English readers and add short glosses for Ethiopian terms.
- Keep the same frontmatter fields and the same slug.
- If the English version was written first and the Amharic is now the reference, check the Amharic text against it rather than the other way round.

## Status

Only the 12 category Hubs have published English versions. Flagship articles that are still `draft` do not have an English version yet. [`community/TRANSLATION-BOARD.md`](../community/TRANSLATION-BOARD.md) explains how to find the current list.
