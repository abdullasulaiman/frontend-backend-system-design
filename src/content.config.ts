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

export const collections = { concepts, interview };
