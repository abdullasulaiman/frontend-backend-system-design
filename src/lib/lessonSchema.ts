import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string(),
  module: z.string(),
  moduleOrder: z.number().int().positive(),
  order: z.number().int().positive(),
  track: z.enum(['concept', 'interview']),
  summary: z.string(),
  cheatsheet: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  estMinutes: z.number().int().positive(),
});
