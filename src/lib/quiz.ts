import type { QuizQuestion } from './types';

export function isAnswerCorrect(q: QuizQuestion, selectedIds: string[]): boolean {
  const correct = q.options.filter(o => o.correct).map(o => o.id).sort();
  const chosen = [...new Set(selectedIds)].sort();
  if (correct.length !== chosen.length) return false;
  return correct.every((id, i) => id === chosen[i]);
}
export function scoreQuiz(questions: QuizQuestion[], answers: Record<string, string[]>) {
  let score = 0;
  for (const q of questions) if (isAnswerCorrect(q, answers[q.id] ?? [])) score++;
  return { score, total: questions.length };
}
