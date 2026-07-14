import { describe, it, expect } from 'vitest';
import { lessonSchema } from '../src/lib/lessonSchema';

describe('lessonSchema', () => {
  const valid = {
    title: 'X', module: 'M', moduleOrder: 1, order: 1, track: 'concept',
    summary: 's', cheatsheet: ['a'], tags: ['t'], estMinutes: 5,
  };
  it('accepts a valid lesson', () => {
    expect(lessonSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects empty cheatsheet', () => {
    expect(lessonSchema.safeParse({ ...valid, cheatsheet: [] }).success).toBe(false);
  });
  it('rejects bad track', () => {
    expect(lessonSchema.safeParse({ ...valid, track: 'nope' }).success).toBe(false);
  });
});
