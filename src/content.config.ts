import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { lessonSchema } from './lib/lessonSchema';

export { lessonSchema };

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: lessonSchema,
});
const interview = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/interview' }),
  schema: lessonSchema,
});
// Backend "System Design Interview" course. Content is generated separately
// later; for now these collections only hold a `_placeholder.mdx` fixture
// each (see src/content/sd-concepts/_placeholder.mdx and
// src/content/sd-interview/_placeholder.mdx) so the collections aren't
// empty during build. Delete the placeholders once real lessons land.
const sdConcepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/sd-concepts' }),
  schema: lessonSchema,
});
const sdInterview = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/sd-interview' }),
  schema: lessonSchema,
});

export const collections = {
  concepts,
  interview,
  'sd-concepts': sdConcepts,
  'sd-interview': sdInterview,
};
