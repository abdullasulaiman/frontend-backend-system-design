import { describe, it, expect } from 'vitest';
import { isAnswerCorrect, scoreQuiz } from '../src/lib/quiz';
import type { QuizQuestion } from '../src/lib/types';

const mcq: QuizQuestion = { id: 'q1', kind: 'mcq', prompt: '?', options: [
  { id: 'a', text: 'A', correct: true }, { id: 'b', text: 'B', correct: false }] };
const multi: QuizQuestion = { id: 'q2', kind: 'multi', prompt: '?', options: [
  { id: 'a', text: 'A', correct: true }, { id: 'b', text: 'B', correct: true }, { id: 'c', text: 'C', correct: false }] };

describe('quiz', () => {
  it('scores mcq', () => {
    expect(isAnswerCorrect(mcq, ['a'])).toBe(true);
    expect(isAnswerCorrect(mcq, ['b'])).toBe(false);
  });
  it('scores multi (set equality)', () => {
    expect(isAnswerCorrect(multi, ['a', 'b'])).toBe(true);
    expect(isAnswerCorrect(multi, ['a'])).toBe(false);
    expect(isAnswerCorrect(multi, ['a', 'b', 'c'])).toBe(false);
  });
  it('aggregates a quiz score', () => {
    expect(scoreQuiz([mcq, multi], { q1: ['a'], q2: ['a'] })).toEqual({ score: 1, total: 2 });
  });
});
