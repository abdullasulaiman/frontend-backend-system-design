import { useState } from 'react';
import { saveMockScore } from '../lib/progressStore';

const SCORES = [1, 2, 3, 4, 5] as const;

export default function MockInterview({
  lessonId,
  prompt,
  rubric,
}: {
  lessonId: string;
  prompt: string;
  rubric: { point: string; detail: string }[];
}) {
  const [notes, setNotes] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const notesId = `mock-notes-${lessonId}`;

  const rate = (value: number) => {
    setScore(value);
    saveMockScore(lessonId, value);
  };

  return (
    <div className="not-prose flex flex-col gap-6 rounded-card border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <p className="text-base font-semibold text-[var(--text)]">{prompt}</p>

      <div className="flex flex-col gap-2">
        <label htmlFor={notesId} className="text-sm font-medium text-[var(--text)]">
          Your answer notes
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={5}
          placeholder="Jot down how you'd answer before revealing the model answer…"
          className="w-full rounded-card border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
      </div>

      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="self-start rounded-pill bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition-colors duration-[var(--transition-fast)] hover:bg-[var(--brand-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
        >
          Reveal model answer
        </button>
      )}

      {revealed && (
        <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-4">
          <ul className="flex flex-col gap-3">
            {rubric.map((r, i) => (
              <li
                key={i}
                className="rounded-card border border-[var(--tip-border)] bg-[var(--tip-bg)] p-3"
              >
                <p className="text-sm font-semibold text-[var(--tip-ink)]">{r.point}</p>
                <p className="text-sm text-[var(--tip-ink)]">{r.detail}</p>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text)]">
              How would you rate your answer?
            </span>
            <div className="flex items-center gap-2">
              {SCORES.map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => rate(value)}
                  aria-pressed={score === value}
                  className={
                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 ' +
                    (score === value
                      ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--tip-bg)]')
                  }
                >
                  {value}
                </button>
              ))}
            </div>
            {score !== null && (
              <span className="text-sm font-semibold text-[var(--tip-ink)]">
                Saved — self-score {score} / 5
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
