import { useEffect, useState } from 'react';
import { moduleProgress } from '../lib/progressStore';

export default function ProgressRing({
  lessonIds,
  size = 64,
  label,
}: {
  lessonIds: string[];
  size?: number;
  label?: string;
}) {
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    const read = () => setFraction(moduleProgress(lessonIds));
    read();
    window.addEventListener('gfsd:progress', read);
    return () => window.removeEventListener('gfsd:progress', read);
  }, [lessonIds]);

  const stroke = Math.max(4, Math.round(size / 10));
  const radius = size / 2 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - fraction);
  const percent = Math.round(fraction * 100);

  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label={label ?? 'Module progress'}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${percent}% complete`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset var(--transition-fast) ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[var(--text)]"
          style={{ fontSize: size / 4, fontWeight: 600 }}
        >
          {percent}%
        </text>
      </svg>
      {label && <span className="text-sm font-medium text-[var(--text)]">{label}</span>}
    </div>
  );
}
