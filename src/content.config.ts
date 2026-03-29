import { defineCollection, z } from 'astro:content';

// [Amharic translation needed - original Taiwan context] content collection schema
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
});

// [Amharic translation needed - original Taiwan context] collection
const amCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    // [Amharic translation needed - original Taiwan context]
    originalTitle: z.string().optional(), // [Amharic translation needed - original Taiwan context]
    alternativeNames: z.array(z.string()).optional().default([]), // [Amharic translation needed - original Taiwan context]
  }),
});

// [Amharic translation needed - original Taiwan context] collection
const enCollection = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    // [Amharic translation needed - original Taiwan context]
    chineseTitle: z.string().optional(), // [Amharic translation needed - original Taiwan context]
    translationStatus: z
      .enum(['complete', 'partial', 'planned'])
      .optional()
      .default('complete'),
  }),
});

// [Amharic translation needed - original Taiwan context] collections
export const collections = {
  'am': amCollection,
  en: enCollection,
};

// Type exports for TypeScript support
export type ZhTWContent = z.infer<typeof baseContentSchema> & {
  originalTitle?: string;
  alternativeNames?: string[];
};

export type EnContent = z.infer<typeof baseContentSchema> & {
  chineseTitle?: string;
  translationStatus?: 'complete' | 'partial' | 'planned';
};
