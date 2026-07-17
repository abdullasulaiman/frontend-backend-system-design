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
// Backend "System Design Interview" course: foundations/building blocks
// (sd-concepts, routed under /system-design) and "Design X" problems
// (sd-interview, routed under /system-design/design).
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
