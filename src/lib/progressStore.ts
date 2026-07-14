const NS = 'gfsd:v1:';
const key = (k: string) => NS + k;

function readObj<T>(k: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key(k));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function writeObj(k: string, v: unknown) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(key(k), JSON.stringify(v)); } catch { /* ignore */ }
}

export function markComplete(id: string, done: boolean) {
  const m = readObj<Record<string, boolean>>('complete', {});
  if (done) m[id] = true; else delete m[id];
  writeObj('complete', m);
}
export function isComplete(id: string) { return !!readObj<Record<string, boolean>>('complete', {})[id]; }

export function saveQuizScore(lessonId: string, score: number, total: number) {
  const m = readObj<Record<string, { score: number; total: number }>>('quiz', {});
  m[lessonId] = { score, total }; writeObj('quiz', m);
}
export function getQuizScore(lessonId: string) {
  return readObj<Record<string, { score: number; total: number }>>('quiz', {})[lessonId] ?? null;
}
export function saveMockScore(lessonId: string, score: number) {
  const m = readObj<Record<string, number>>('mock', {}); m[lessonId] = score; writeObj('mock', m);
}
export function getMockScore(lessonId: string) {
  return readObj<Record<string, number>>('mock', {})[lessonId] ?? null;
}
export function moduleProgress(lessonIds: string[]) {
  if (!lessonIds.length) return 0;
  const done = lessonIds.filter(isComplete).length;
  return done / lessonIds.length;
}
