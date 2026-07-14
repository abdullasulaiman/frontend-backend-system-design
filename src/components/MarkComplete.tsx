import { useEffect, useState } from 'react';
import { isComplete, markComplete } from '../lib/progressStore';

export default function MarkComplete({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isComplete(lessonId));
  }, [lessonId]);

  const toggle = () => {
    const next = !done;
    markComplete(lessonId, next);
    setDone(next);
    window.dispatchEvent(new CustomEvent('gfsd:progress'));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={
        'inline-flex items-center gap-2 self-start rounded-pill border px-4 py-2 text-sm font-semibold transition-colors duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 ' +
        (done
          ? 'border-[var(--tip-border)] bg-[var(--tip-bg)] text-[var(--tip-ink)]'
          : 'border-[var(--brand)] bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]')
      }
    >
      {done ? 'Completed ✓' : 'Mark complete'}
    </button>
  );
}
