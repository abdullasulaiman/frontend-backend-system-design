import { useState } from 'react';
import type { QuizQuestion } from '../lib/types';
import { isAnswerCorrect, scoreQuiz } from '../lib/quiz';
import { saveQuizScore } from '../lib/progressStore';

type Answers = Record<string, string[]>;

function optionInputType(kind: QuizQuestion['kind']): 'radio' | 'checkbox' {
  return kind === 'multi' ? 'checkbox' : 'radio';
}

export default function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [revealed, setRevealed] = useState(false);

  const select = (qId: string, optId: string, kind: QuizQuestion['kind']) => {
    if (revealed) return;
    setAnswers(prev => {
      const current = prev[qId] ?? [];
      if (kind === 'multi') {
        const next = current.includes(optId)
          ? current.filter(id => id !== optId)
          : [...current, optId];
        return { ...prev, [qId]: next };
      }
      return { ...prev, [qId]: [optId] };
    });
  };

  const { score, total } = revealed ? scoreQuiz(questions, answers) : { score: 0, total: questions.length };

  const check = () => {
    const result = scoreQuiz(questions, answers);
    setRevealed(true);
    saveQuizScore(lessonId, result.score, result.total);
  };

  return (
    <div className="not-prose flex flex-col gap-6 rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      {questions.map(q => {
        const selected = answers[q.id] ?? [];
        const inputType = optionInputType(q.kind);
        const questionCorrect = revealed && isAnswerCorrect(q, selected);

        return (
          <fieldset key={q.id} className="flex flex-col gap-3 border-0 p-0 m-0">
            <legend className="text-base font-semibold text-[var(--text)]">
              {q.prompt}
              {revealed && (
                <span
                  className={
                    questionCorrect
                      ? 'ml-2 text-sm font-medium text-[var(--tip-ink)]'
                      : 'ml-2 text-sm font-medium text-[var(--warn-ink)]'
                  }
                >
                  {questionCorrect ? 'Correct' : 'Incorrect'}
                </span>
              )}
            </legend>
            <div className="flex flex-col gap-2">
              {q.options.map(opt => {
                const isSelected = selected.includes(opt.id);
                const showSuccess = revealed && opt.correct;
                const showWarning = revealed && isSelected && !opt.correct;

                let optionClasses =
                  'flex flex-col gap-1 rounded-card border p-3 transition-colors duration-[var(--transition-fast)]';
                if (showSuccess) {
                  optionClasses += ' border-[var(--tip-border)] bg-[var(--tip-bg)]';
                } else if (showWarning) {
                  optionClasses += ' border-[var(--warn-border)] bg-[var(--warn-bg)]';
                } else {
                  optionClasses += ' border-[var(--border)] bg-[var(--bg)]';
                }

                return (
                  <label key={opt.id} className={optionClasses}>
                    <span className="flex items-center gap-2">
                      <input
                        type={inputType}
                        name={q.id}
                        aria-label={opt.text}
                        checked={isSelected}
                        disabled={revealed}
                        onChange={() => select(q.id, opt.id, q.kind)}
                      />
                      <span className="text-sm text-[var(--text)]">{opt.text}</span>
                    </span>
                    {revealed && (showSuccess || showWarning) && opt.explanation && (
                      <span
                        className={
                          showSuccess
                            ? 'pl-6 text-sm text-[var(--tip-ink)]'
                            : 'pl-6 text-sm text-[var(--warn-ink)]'
                        }
                      >
                        {opt.explanation}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={check}
          disabled={revealed}
          className="rounded-pill bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check
        </button>
        {revealed && (
          <span className="text-sm font-semibold text-[var(--text)]">
            Score: {score} / {total}
          </span>
        )}
      </div>
    </div>
  );
}
