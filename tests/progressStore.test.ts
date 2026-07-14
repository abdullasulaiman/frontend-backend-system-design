import { describe, it, expect, beforeEach } from 'vitest';
import * as store from '../src/lib/progressStore';

beforeEach(() => localStorage.clear());

describe('progressStore', () => {
  it('marks and reads completion', () => {
    expect(store.isComplete('l1')).toBe(false);
    store.markComplete('l1', true);
    expect(store.isComplete('l1')).toBe(true);
    store.markComplete('l1', false);
    expect(store.isComplete('l1')).toBe(false);
  });
  it('saves and reads quiz score', () => {
    store.saveQuizScore('l1', 3, 4);
    expect(store.getQuizScore('l1')).toEqual({ score: 3, total: 4 });
  });
  it('computes module progress fraction', () => {
    store.markComplete('a', true);
    expect(store.moduleProgress(['a', 'b'])).toBe(0.5);
  });
  it('survives corrupt storage', () => {
    localStorage.setItem('gfsd:v1:complete', 'not-json');
    expect(store.isComplete('a')).toBe(false);
  });
});
