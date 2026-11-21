import { defineCollection, z } from 'astro:content';

// Shared frontmatter schema for every Ethiopia.md article.
const baseContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional().default('Ethiopia.md Contributors'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
  readingTime: z.number().optional().default(5),
  featured: z.boolean().optional().default(false),
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional()
    .default('published'),
  lastUpdated: z.coerce.date().optional(),
  relatedTopics: z.array(z.string()).optional().default([]),
  sources: z.array(z.string()).optional().default([]),
  subcategory: z.string().optional().default(''),
  image: z.string().optional(),
});

// Amharic collection (source of truth). Adds spelling variants and other names.
const amCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    alternativeNames: z.array(z.string()).optional().default([]),
  }),
});

// English collection (translation layer). Tracks how complete the translation is.
const enCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    translationStatus: z
      .enum(['complete', 'partial', 'planned'])
      .optional()
      .default('complete'),
  }),
});

// Collections registered with Astro; the keys are the language codes.
export const collections = {
  am: amCollection,
  en: enCollection,
};

// Types inferred from the schemas.
export type AmharicContent = z.infer<typeof baseContentSchema> & {
  alternativeNames?: string[];
};

export type EnglishContent = z.infer<typeof baseContentSchema> & {
  translationStatus?: 'complete' | 'partial' | 'planned';
};
