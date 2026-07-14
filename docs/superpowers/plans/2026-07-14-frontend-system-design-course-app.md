# Grokking Frontend System Design — Course App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original, self-hosted interactive learning app that recreates the "Grokking the Frontend System Design Interview" curriculum — keeping both the Concepts track and the Interview Preparation track — with lessons, quizzes, mock-interview flows, progress tracking, and a consolidated cheatsheet.

**Architecture:** Astro (content-first, static output) authors lessons as MDX in typed Content Collections. Interactivity is delivered by React islands hydrated only where needed (quizzes, mock interviews, progress, theme). Pure logic (progress persistence, quiz scoring, navigation building) lives in framework-free TypeScript modules that are unit-tested with Vitest; Astro pages/components are validated by `astro check` + a successful build + a link check. Content itself is mass-produced in a later phase by a fan-out Workflow of writer subagents following a shared Style Guide.

**Tech Stack:** Astro 7, @astrojs/react 6, @astrojs/mdx 7, Tailwind CSS 4 (`@tailwindcss/vite`, CSS-first `@theme`), React 19, TypeScript, Vitest 4 + @testing-library/react, Pagefind 1.5, Mermaid.

## Global Constraints

- Node ≥ 20.3 (dev uses 20.19.2). Package manager: npm.
- All prose is **original**. Never copy Educative's text verbatim. Same curriculum, our own words/diagrams.
- No backend, no accounts, no payment, no video. All state is client-side `localStorage`.
- Both tracks must be fully populated: all Concepts modules + all 5 case studies (Newsfeed, Video Streaming, Chat, Uber, Calendar) each with a mock interview.
- TypeScript strict mode on. `astro check` must pass with zero errors.
- Every lesson MDX must conform to the frontmatter schema and contain ≥1 quiz question and a non-empty `cheatsheet` array.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`; meet WCAG AA contrast (the course teaches accessibility — the app must model it).
- Commit after every task with a conventional-commit message.

---

## File Structure

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts
src/
  content.config.ts            # Content Collections + Zod schema (glob loader)
  content/
    concepts/*.mdx             # Track A lessons
    interview/*.mdx            # Track B lessons
  lib/
    progressStore.ts           # localStorage wrapper (pure, testable)
    quiz.ts                    # quiz scoring/validation (pure)
    navigation.ts              # build grouped nav tree from entries (pure)
    types.ts                   # shared TS types
  components/
    Quiz.tsx                   # React island
    MockInterview.tsx          # React island
    ProgressRing.tsx           # React island
    MarkComplete.tsx           # React island
    ThemeToggle.tsx            # React island
    Mermaid.tsx                # React island (client render)
    Callout.astro              # note/tip/warning/interview-tip asides
    Sidebar.astro              # module→lesson nav w/ progress
    TableOfContents.astro      # in-page TOC
    TopBar.astro               # search + track switcher + theme toggle
  layouts/
    BaseLayout.astro
    LessonLayout.astro
  pages/
    index.astro                # landing + roadmap
    concepts/[...slug].astro
    interview/[...slug].astro
    cheatsheets.astro
    about.astro
  styles/
    tokens.css                 # design tokens (@theme)
    global.css                 # base + prose styles
tests/
  progressStore.test.ts
  quiz.test.ts
  navigation.test.ts
  Quiz.test.tsx
  MockInterview.test.tsx
docs/
  STYLE_GUIDE.md               # rules for content writer subagents
  content-manifest.ts          # machine-readable list of every lesson to write
```

---

### Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/pages/index.astro`, `tests/smoke.test.ts`
- Create: `.gitignore`

**Interfaces:**
- Produces: a runnable Astro project with React, MDX, Tailwind v4, and Vitest wired; `npm run dev`, `npm run build`, `npm test`, `npm run check` scripts.

- [ ] **Step 1: Scaffold Astro in the current directory**

The repo already has `docs/` and git initialized. Scaffold Astro into the existing directory (empty template, no git re-init, use npm):

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
```

If the CLI refuses due to existing files, scaffold into a temp dir and move `src/`, `astro.config.mjs`, `tsconfig.json`, `package.json` into place, preserving `docs/` and `.git/`.

- [ ] **Step 2: Add integrations**

```bash
npx astro add react mdx --yes
npm install tailwindcss @tailwindcss/vite
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/react @types/react-dom
npm install mermaid
```

- [ ] **Step 3: Wire Tailwind v4 via the Vite plugin in `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 6: Write a smoke test `tests/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest';

describe('toolchain', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 7: Run the smoke test**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: build completes with the default index page.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + React + MDX + Tailwind + Vitest"
```

---

### Task 2: Design system — tokens, theme, global styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/pages/index.astro` (import global.css, prove theming works)

**Interfaces:**
- Produces: CSS custom properties + Tailwind `@theme` tokens for brand colors, spacing, radius, fonts; `.prose` lesson typography; light/dark via `data-theme` attribute on `<html>`; a `--reduced-motion`-aware transition convention.

- [ ] **Step 1: Write `src/styles/tokens.css`** — brand palette (primary, accent, surface, text, semantic note/tip/warn), radii, shadows, font stacks, exposed as CSS custom properties for both `[data-theme="light"]` and `[data-theme="dark"]`, plus a `@theme` block mapping them into Tailwind utility tokens.

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --color-brand-500: #4f46e5;
  --color-brand-600: #4338ca;
  --color-accent-500: #06b6d4;
  --radius-card: 0.875rem;
}

:root, [data-theme='light'] {
  --bg: #ffffff; --surface: #f7f8fa; --text: #12131a; --muted: #5b6070;
  --border: #e4e6ec; --brand: var(--color-brand-600); --accent: var(--color-accent-500);
}
[data-theme='dark'] {
  --bg: #0c0d12; --surface: #14161d; --text: #eceef5; --muted: #9aa0b4;
  --border: #262a36; --brand: #8b8cf0; --accent: #22d3ee;
}
```

- [ ] **Step 2: Write `src/styles/global.css`** — imports tokens, sets base body colors from vars, a readable `.prose` scope (headings scale, line-height, code/pre frames, tables, blockquotes, links), focus-visible rings, and a motion guard:

```css
@import './tokens.css';

html { color-scheme: light dark; }
body { background: var(--bg); color: var(--text); font-family: var(--font-sans); }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
/* .prose typography rules ... (headings, p, ul, code, pre, table, blockquote) */
```

- [ ] **Step 3: Import global.css in `src/pages/index.astro`** and add a `data-theme="dark"` on `<html>` temporarily to eyeball both themes.

- [ ] **Step 4: Verify build + visual smoke**

Run: `npm run build` then `npm run dev` and confirm the page renders with brand background/text in both `data-theme` values (toggle attribute in devtools).
Expected: colors change with `data-theme`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: design tokens, theming, and global styles"
```

---

### Task 3: Shared types & Content Collections schema

**Files:**
- Create: `src/lib/types.ts`, `src/content.config.ts`
- Create: `src/content/concepts/_sample.mdx` (temporary fixture to validate schema; removed in Task 16)
- Test: `tests/schema.test.ts`

**Interfaces:**
- Produces:
  - `lessonSchema` (Zod) and TS types `LessonFrontmatter`, `Track = 'concept' | 'interview'`.
  - `QuizQuestion` type: `{ id: string; kind: 'mcq' | 'multi' | 'boolean'; prompt: string; options: { id: string; text: string; correct: boolean; explanation?: string }[] }`.
  - Two collections `concepts` and `interview` using the glob loader over `src/content/<name>/*.mdx`.

- [ ] **Step 1: Write `src/lib/types.ts`**

```ts
export type Track = 'concept' | 'interview';

export interface QuizOption { id: string; text: string; correct: boolean; explanation?: string; }
export interface QuizQuestion {
  id: string;
  kind: 'mcq' | 'multi' | 'boolean';
  prompt: string;
  options: QuizOption[];
}
export interface LessonFrontmatter {
  title: string;
  module: string;
  moduleOrder: number;
  order: number;
  track: Track;
  summary: string;
  cheatsheet: string[];
  tags: string[];
  estMinutes: number;
}
```

- [ ] **Step 2: Write the Zod schema test `tests/schema.test.ts` first (failing)**

```ts
import { describe, it, expect } from 'vitest';
import { lessonSchema } from '../src/content.config';

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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/schema.test.ts`
Expected: FAIL — cannot import `lessonSchema`.

- [ ] **Step 4: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: lessonSchema,
});
const interview = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/interview' }),
  schema: lessonSchema,
});

export const collections = { concepts, interview };
```

Note: `astro:content` types resolve only after `astro sync`/build; the Vitest import of `lessonSchema` works because the Zod object is a plain export. If Vitest cannot resolve `astro:content`, extract the raw `z.object` into `src/lib/lessonSchema.ts` and import it in both `content.config.ts` and the test. Prefer that split if the test errors on the `astro:content` import.

- [ ] **Step 5: Create a temporary fixture `src/content/concepts/_sample.mdx`**

```mdx
---
title: Sample
module: Introduction
moduleOrder: 1
order: 1
track: concept
summary: Temporary fixture.
cheatsheet: ['placeholder']
tags: ['sample']
estMinutes: 3
---
Placeholder body.
```

- [ ] **Step 6: Run schema test + astro check**

Run: `npx vitest run tests/schema.test.ts` → PASS.
Run: `npm run check` → zero errors (content validates).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: content collection schema and shared types"
```

---

### Task 4: Navigation builder (pure)

**Files:**
- Create: `src/lib/navigation.ts`
- Test: `tests/navigation.test.ts`

**Interfaces:**
- Consumes: array of `{ id: string; data: LessonFrontmatter }` (shape returned by Astro's `getCollection`).
- Produces:
  - `buildNav(entries): NavModule[]` where `NavModule = { module: string; moduleOrder: number; lessons: NavLesson[] }` and `NavLesson = { id: string; title: string; order: number }`, sorted by `moduleOrder` then `order`.
  - `flattenNav(nav): NavLesson[]` — flat ordered list for prev/next.
  - `getPrevNext(flat, currentId): { prev?: NavLesson; next?: NavLesson }`.

- [ ] **Step 1: Write `tests/navigation.test.ts` (failing)**

```ts
import { describe, it, expect } from 'vitest';
import { buildNav, flattenNav, getPrevNext } from '../src/lib/navigation';

const e = (id, module, moduleOrder, order, title) => ({ id, data: { module, moduleOrder, order, title } });
const entries = [
  e('b', 'Perf', 2, 1, 'B'),
  e('a2', 'Intro', 1, 2, 'A2'),
  e('a1', 'Intro', 1, 1, 'A1'),
];

describe('navigation', () => {
  it('groups and sorts modules then lessons', () => {
    const nav = buildNav(entries as any);
    expect(nav.map(m => m.module)).toEqual(['Intro', 'Perf']);
    expect(nav[0].lessons.map(l => l.id)).toEqual(['a1', 'a2']);
  });
  it('flattens in order', () => {
    expect(flattenNav(buildNav(entries as any)).map(l => l.id)).toEqual(['a1', 'a2', 'b']);
  });
  it('computes prev/next', () => {
    const flat = flattenNav(buildNav(entries as any));
    expect(getPrevNext(flat, 'a2')).toEqual({ prev: flat[0], next: flat[2] });
    expect(getPrevNext(flat, 'a1').prev).toBeUndefined();
    expect(getPrevNext(flat, 'b').next).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/navigation.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/navigation.ts`**

```ts
import type { LessonFrontmatter } from './types';

export interface NavLesson { id: string; title: string; order: number; }
export interface NavModule { module: string; moduleOrder: number; lessons: NavLesson[]; }
type Entry = { id: string; data: Pick<LessonFrontmatter, 'module' | 'moduleOrder' | 'order' | 'title'> };

export function buildNav(entries: Entry[]): NavModule[] {
  const byModule = new Map<string, NavModule>();
  for (const { id, data } of entries) {
    let m = byModule.get(data.module);
    if (!m) { m = { module: data.module, moduleOrder: data.moduleOrder, lessons: [] }; byModule.set(data.module, m); }
    m.lessons.push({ id, title: data.title, order: data.order });
  }
  const mods = [...byModule.values()].sort((a, b) => a.moduleOrder - b.moduleOrder);
  for (const m of mods) m.lessons.sort((a, b) => a.order - b.order);
  return mods;
}

export function flattenNav(nav: NavModule[]): NavLesson[] {
  return nav.flatMap(m => m.lessons);
}

export function getPrevNext(flat: NavLesson[], currentId: string) {
  const i = flat.findIndex(l => l.id === currentId);
  return { prev: i > 0 ? flat[i - 1] : undefined, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined };
}
```

- [ ] **Step 4: Run tests → PASS.** `npx vitest run tests/navigation.test.ts`

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: pure navigation builder with prev/next"
```

---

### Task 5: Progress store (localStorage wrapper, pure)

**Files:**
- Create: `src/lib/progressStore.ts`
- Test: `tests/progressStore.test.ts`

**Interfaces:**
- Produces:
  - `markComplete(id: string, done: boolean): void`
  - `isComplete(id: string): boolean`
  - `saveQuizScore(lessonId: string, score: number, total: number): void`
  - `getQuizScore(lessonId: string): { score: number; total: number } | null`
  - `moduleProgress(lessonIds: string[]): number` (0–1 fraction complete)
  - `saveMockScore(lessonId: string, score: number): void` / `getMockScore(lessonId): number | null`
  - All keys namespaced under `gfsd:v1:`; every read guards `JSON.parse` and absent `localStorage`.

- [ ] **Step 1: Write `tests/progressStore.test.ts` (failing)**

```ts
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
```

- [ ] **Step 2: Run → FAIL.** `npx vitest run tests/progressStore.test.ts`

- [ ] **Step 3: Implement `src/lib/progressStore.ts`**

```ts
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
```

- [ ] **Step 4: Run → PASS.** `npx vitest run tests/progressStore.test.ts`

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: localStorage-backed progress store"
```

---

### Task 6: Quiz scoring logic (pure)

**Files:**
- Create: `src/lib/quiz.ts`
- Test: `tests/quiz.test.ts`

**Interfaces:**
- Consumes: `QuizQuestion` from `src/lib/types.ts`.
- Produces:
  - `isAnswerCorrect(q: QuizQuestion, selectedIds: string[]): boolean` — for `mcq`/`boolean` exactly one correct id selected; for `multi` selected set equals correct set.
  - `scoreQuiz(questions: QuizQuestion[], answers: Record<string, string[]>): { score: number; total: number }`.

- [ ] **Step 1: Write `tests/quiz.test.ts` (failing)**

```ts
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
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `src/lib/quiz.ts`**

```ts
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
```

- [ ] **Step 4: Run → PASS. Commit**

```bash
git add -A && git commit -m "feat: pure quiz scoring logic"
```

---

### Task 7: Quiz React island

**Files:**
- Create: `src/components/Quiz.tsx`
- Test: `tests/Quiz.test.tsx`

**Interfaces:**
- Consumes: `scoreQuiz`/`isAnswerCorrect` (Task 6), `saveQuizScore` (Task 5), `QuizQuestion` type.
- Produces: `export default function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] })`. Renders each question, lets the user select option(s), a "Check" button reveals correctness + per-option explanation, shows score, persists via `saveQuizScore`.

- [ ] **Step 1: Write `tests/Quiz.test.tsx` (failing)**

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from '../src/components/Quiz';

const questions = [{ id: 'q1', kind: 'mcq', prompt: 'Pick A', options: [
  { id: 'a', text: 'A', correct: true, explanation: 'A is right' },
  { id: 'b', text: 'B', correct: false }] }] as const;

beforeEach(() => localStorage.clear());

describe('Quiz', () => {
  it('reveals correctness after checking', () => {
    render(<Quiz lessonId="l1" questions={questions as any} />);
    fireEvent.click(screen.getByLabelText('A'));
    fireEvent.click(screen.getByRole('button', { name: /check/i }));
    expect(screen.getByText(/A is right/)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `src/components/Quiz.tsx`** — controlled selection state (`Record<qid, string[]>`), radio inputs for `mcq`/`boolean`, checkboxes for `multi`, a Check button that sets `revealed=true`, computes score via `scoreQuiz`, calls `saveQuizScore(lessonId, score, total)`, and renders explanations + a `score / total` summary. Use token-driven Tailwind classes; correct options get a success style, wrong-selected get a warning style, only after reveal. Include `aria-label` on each option input equal to its text.

- [ ] **Step 4: Run → PASS.** `npx vitest run tests/Quiz.test.tsx`

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: interactive Quiz island"
```

---

### Task 8: Mock Interview React island

**Files:**
- Create: `src/components/MockInterview.tsx`
- Test: `tests/MockInterview.test.tsx`

**Interfaces:**
- Consumes: `saveMockScore` (Task 5).
- Produces: `export default function MockInterview({ lessonId, prompt, rubric }: { lessonId: string; prompt: string; rubric: { point: string; detail: string }[] })`. Flow: shows prompt + a textarea for the user's own answer notes → "Reveal model answer" shows the rubric talking points → user self-scores 1–5 → `saveMockScore` persists it and a confirmation shows.

- [ ] **Step 1: Write `tests/MockInterview.test.tsx` (failing)** — render, type notes, click reveal, assert a rubric point appears, click a score button, assert saved confirmation text and that `getMockScore` returns it.

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockInterview from '../src/components/MockInterview';
import { getMockScore } from '../src/lib/progressStore';

beforeEach(() => localStorage.clear());

describe('MockInterview', () => {
  it('reveals rubric and saves self-score', () => {
    render(<MockInterview lessonId="m1" prompt="Design X" rubric={[{ point: 'Scope', detail: 'Clarify requirements' }]} />);
    fireEvent.click(screen.getByRole('button', { name: /reveal/i }));
    expect(screen.getByText(/Clarify requirements/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    expect(getMockScore('m1')).toBe(4);
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement `src/components/MockInterview.tsx`** per the interface. Textarea notes held in local state (not persisted — ephemeral self-reflection); `revealed` toggle gates the rubric list; score buttons 1–5 call `saveMockScore`.

- [ ] **Step 4: Run → PASS. Commit**

```bash
git add -A && git commit -m "feat: MockInterview self-assessment island"
```

---

### Task 9: Progress islands — ProgressRing & MarkComplete

**Files:**
- Create: `src/components/ProgressRing.tsx`, `src/components/MarkComplete.tsx`

**Interfaces:**
- Consumes: `moduleProgress`, `isComplete`, `markComplete` (Task 5).
- Produces:
  - `ProgressRing({ lessonIds, size?, label? })` — SVG donut showing `moduleProgress` %; reads on mount (client-only) to avoid SSR/localStorage mismatch (start at 0, update in `useEffect`).
  - `MarkComplete({ lessonId })` — toggle button reflecting `isComplete`, calls `markComplete`, dispatches a `window` `CustomEvent('gfsd:progress')` so rings can re-read.

- [ ] **Step 1: Implement both components.** Guard all `localStorage` reads inside `useEffect`. `ProgressRing` computes stroke-dashoffset from the fraction. `MarkComplete` updates local state and fires the custom event.

- [ ] **Step 2: Add a light test `tests/MarkComplete.test.tsx`** rendering `MarkComplete`, clicking it, asserting `isComplete(id)` becomes true and button text toggles.

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkComplete from '../src/components/MarkComplete';
import { isComplete } from '../src/lib/progressStore';

beforeEach(() => localStorage.clear());
describe('MarkComplete', () => {
  it('toggles completion', () => {
    render(<MarkComplete lessonId="l9" />);
    fireEvent.click(screen.getByRole('button'));
    expect(isComplete('l9')).toBe(true);
  });
});
```

- [ ] **Step 3: Run → PASS. Commit**

```bash
git add -A && git commit -m "feat: ProgressRing and MarkComplete islands"
```

---

### Task 10: Presentational Astro components — Callout, Mermaid

**Files:**
- Create: `src/components/Callout.astro`, `src/components/Mermaid.tsx`

**Interfaces:**
- Produces:
  - `Callout` — `<Callout type="note|tip|warning|interview">…</Callout>`, styled aside with icon + token colors, used inside MDX.
  - `Mermaid` — React island: `<Mermaid chart={string} />` that dynamically imports `mermaid`, renders to SVG on mount, re-renders on theme change (listens for `gfsd:theme` event), and respects reduced motion.

- [ ] **Step 1: Implement `Callout.astro`** — a `type` prop mapping to a semantic color and label; slot for content.

- [ ] **Step 2: Implement `Mermaid.tsx`** — `useEffect` calls `mermaid.initialize({ startOnLoad: false, theme: <light/dark> })` then `mermaid.render`. Store SVG in state; render via `dangerouslySetInnerHTML`. Fallback: show the raw code in a `<pre>` if render throws.

- [ ] **Step 3: Verify build** (`npm run build`) — components compile. No unit test (presentational; covered by build + later manual smoke).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: Callout and Mermaid MDX components"
```

---

### Task 11: Layouts, Sidebar, TOC, TopBar, ThemeToggle

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/layouts/LessonLayout.astro`, `src/components/Sidebar.astro`, `src/components/TableOfContents.astro`, `src/components/TopBar.astro`, `src/components/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `getCollection` from `astro:content`, `buildNav`/`flattenNav`/`getPrevNext` (Task 4), `ProgressRing` (Task 9), design system (Task 2).
- Produces:
  - `BaseLayout` — `<html data-theme>` shell, `<head>` meta, imports global.css, inline no-flash theme script (reads `localStorage['gfsd:v1:theme']` before paint, sets `data-theme`), renders `TopBar` + a `<slot />`.
  - `LessonLayout` — two/three-column grid: `Sidebar` (left), article `.prose` slot (center), `TableOfContents` (right); renders lesson `title`, `estMinutes`, `MarkComplete`, and prev/next footer.
  - `ThemeToggle` — button that flips `data-theme`, persists to localStorage, dispatches `gfsd:theme` event.

- [ ] **Step 1: Implement `ThemeToggle.tsx`** (persist + dispatch event; icon reflects current theme).

- [ ] **Step 2: Implement `BaseLayout.astro`** with the no-flash inline script:

```astro
<script is:inline>
  const t = localStorage.getItem('gfsd:v1:theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
</script>
```

- [ ] **Step 3: Implement `Sidebar.astro`** — takes both collections, calls `buildNav`, renders module groups with a `ProgressRing` per module (pass that module's lesson ids) and lesson links; highlights the active slug (passed as prop). Group by track heading (Concepts / Interview Prep).

- [ ] **Step 4: Implement `TableOfContents.astro`** — receives Astro's `headings` (from `render()`), renders anchor list for depth 2–3.

- [ ] **Step 5: Implement `TopBar.astro`** — brand/logo, track switch links, a search box placeholder (wired in Task 15), and `ThemeToggle` island.

- [ ] **Step 6: Implement `LessonLayout.astro`** composing the above + prev/next.

- [ ] **Step 7: Verify build** — `npm run check && npm run build` succeed (using the `_sample.mdx` fixture as the only lesson for now; wire routing in Task 12 so pages exist).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: layouts, sidebar, TOC, topbar, theme toggle"
```

---

### Task 12: Lesson routing pages

**Files:**
- Create: `src/pages/concepts/[...slug].astro`, `src/pages/interview/[...slug].astro`

**Interfaces:**
- Consumes: `getCollection`, `render` from `astro:content`; `LessonLayout`; `buildNav`/`flattenNav`/`getPrevNext`.
- Produces: static routes for every lesson via `getStaticPaths`, rendering the MDX body inside `LessonLayout`, passing headings + prev/next.

- [ ] **Step 1: Implement `concepts/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import LessonLayout from '../../layouts/LessonLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('concepts');
  return entries.map(entry => ({ params: { slug: entry.id }, props: { entry } }));
}
const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---
<LessonLayout entry={entry} headings={headings} track="concept">
  <Content />
</LessonLayout>
```

- [ ] **Step 2: Implement `interview/[...slug].astro`** identically against the `interview` collection with `track="interview"`.

- [ ] **Step 3: Verify** — `npm run build` generates `/concepts/_sample/` page; open in preview and confirm sidebar, prose, TOC, prev/next, and MarkComplete render.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: lesson routing for both tracks"
```

---

### Task 13: Landing page & roadmap (premium/branded)

**Files:**
- Create: `src/pages/index.astro`
- Modify: `src/pages/about.astro` (create)

**Interfaces:**
- Consumes: `getCollection`, `buildNav`, `ProgressRing`, `BaseLayout`.
- Produces: hero (brand name, tagline, primary CTA to first lesson), a two-track roadmap visualization (Concepts column + Interview Prep column showing modules → lesson counts with per-module `ProgressRing`), a "how to use" strip, and footer. `about.astro` explains the project + original-content/attribution note.

- [ ] **Step 1: Implement `index.astro`** — hero section with gradient using brand tokens, subtle reveal animation gated by `prefers-reduced-motion`; roadmap built from both collections via `buildNav`; each module card links to its first lesson.

- [ ] **Step 2: Implement `about.astro`** — original-content statement, no-affiliation note, how-to-use, tech credits.

- [ ] **Step 3: Verify build + visual smoke** in both themes and at mobile width (responsive: roadmap columns stack).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: branded landing page and roadmap"
```

---

### Task 14: Cheatsheet aggregation page

**Files:**
- Create: `src/pages/cheatsheets.astro`

**Interfaces:**
- Consumes: `getCollection` (both collections), `buildNav`.
- Produces: a single `/cheatsheets` page that iterates all lessons (both tracks), grouped by track → module, printing each lesson's `cheatsheet[]` bullets under its title, with a track/tag filter (small client script or a tiny React island) and a "print" friendly layout.

- [ ] **Step 1: Implement `cheatsheets.astro`** — gather entries, sort via `buildNav` ordering, render grouped `<section>`s. Add client-side filter buttons (Concepts / Interview / All) toggling `hidden` on sections by `data-track`.

- [ ] **Step 2: Verify build** — page lists sample lesson's cheatsheet; filters work in preview.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: consolidated cheatsheets page"
```

---

### Task 15: Static search (Pagefind)

**Files:**
- Modify: `package.json` (postbuild script), `src/components/TopBar.astro` (wire search UI)
- Create: `src/components/Search.tsx` (or use Pagefind's prebuilt UI)

**Interfaces:**
- Produces: build-time search index over the static output; a search box in the top bar that queries it.

- [ ] **Step 1: Install + script**

```bash
npm install -D pagefind
```
Add to `package.json`: `"postbuild": "pagefind --site dist"`.

- [ ] **Step 2: Wire the Pagefind UI** in `TopBar.astro` — load `/pagefind/pagefind-ui.js` (only on the built site) and mount its input; in dev, show a disabled placeholder (Pagefind indexes `dist/`, so search is live only after `npm run build`).

- [ ] **Step 3: Verify** — `npm run build` then `npm run preview`; search returns lesson results.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: static search via Pagefind"
```

---

### Task 16: Style Guide + content manifest (the writer contract)

**Files:**
- Create: `docs/STYLE_GUIDE.md`, `docs/content-manifest.ts`
- Delete: `src/content/concepts/_sample.mdx`

**Interfaces:**
- Produces:
  - `docs/STYLE_GUIDE.md` — the exact contract every writer subagent follows: voice/tone, lesson structure (intro → body sections → diagram(s) → worked example → common pitfalls → `<Quiz>` → cheatsheet frontmatter), length targets (concept lessons ~800–1400 words; case-study lessons ~1000–1600), diagram conventions (Mermaid syntax, when to use), quiz format (2–4 questions, mix of kinds, every option has an explanation), MDX component usage (`<Callout>`, `<Quiz>`, `<MockInterview>`, ```mermaid fences), frontmatter rules, and the originality rule (no verbatim source text).
  - `docs/content-manifest.ts` — exported array `MANIFEST: LessonBrief[]` where `LessonBrief = { track: Track; module: string; moduleOrder: number; order: number; slug: string; title: string; summary: string; tags: string[]; estMinutes: number; brief: string }`. One entry for **every** lesson across both tracks (see the curriculum in the design spec §3). `brief` is a 2–4 sentence description of what that lesson must cover, enough to write it without the source.

- [ ] **Step 1: Write `docs/STYLE_GUIDE.md`** covering all sections above, with a full worked example of one short lesson MDX (frontmatter + body + `<Quiz>`) so writers have a concrete template.

- [ ] **Step 2: Write `docs/content-manifest.ts`** enumerating every lesson. Cover, in order:
  - **Concepts:** Introduction (3), Nonfunctional Requirements (4), Fundamentals (4), Performance & Optimization (9), API Architecture (3), Design Patterns & Architectures (6), Security (2), Design Framework (1–2).
  - **Interview:** 5 case studies × 4 lessons each (Requirements, High-level design, Deep dives, Mock interview) = 20. Mock-interview lessons must include the `<MockInterview>` rubric data in their brief.
  - Assign stable `slug`s (kebab-case, unique within track), correct `moduleOrder`/`order`.

- [ ] **Step 3: Delete the temporary fixture** `src/content/concepts/_sample.mdx`.

- [ ] **Step 4: Guard the build with zero lessons** — if `getCollection` returning empty breaks `getStaticPaths`, ensure pages handle an empty set gracefully (they should: empty `getStaticPaths` = no routes, landing/cheatsheets render empty states). Run `npm run check`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: style guide and full content manifest"
```

---

### Task 17: Content generation (multi-agent Workflow)

**Files:**
- Create: all lesson MDX files under `src/content/concepts/` and `src/content/interview/` per the manifest.

**Interfaces:**
- Consumes: `docs/STYLE_GUIDE.md`, `docs/content-manifest.ts`, the MDX component contracts (`<Quiz>` expects `lessonId` + `questions: QuizQuestion[]`; `<MockInterview>` expects `lessonId` + `prompt` + `rubric`).
- Produces: one complete, schema-valid MDX file per manifest entry.

- [ ] **Step 1: Author and run a Workflow** that fans out one writer subagent per manifest entry (pipeline, batched by module for shared context on case studies). Each subagent receives: the Style Guide text, its `LessonBrief`, the frontmatter schema, and the component usage contract; it returns the full MDX file content (validated against a structured schema: must include frontmatter fields + at least one `<Quiz>` with ≥1 question + non-empty cheatsheet). Case-study arcs (4 lessons) are generated with the case study's shared context so requirements/design/deep-dive/mock stay coherent; the mock-interview lesson embeds `<MockInterview>`.

  Workflow shape (write to files after the workflow returns the content, since scripts have no FS access):
  - Phase "Write": `pipeline(MANIFEST, brief => agent(writePrompt(brief, styleGuide), { schema: LESSON_MDX_SCHEMA }))`.
  - Phase "Verify": each returned lesson checked by a reviewer agent for originality, schema conformance, quiz correctness (the `correct` flags are self-consistent), and Style-Guide adherence; failures regenerated once.
  - The main agent writes each returned MDX string to `src/content/<track>/<slug>.mdx`.

- [ ] **Step 2: Write all returned MDX files to disk** at their `src/content/<track>/<slug>.mdx` paths.

- [ ] **Step 3: Validate content** — `npm run check` passes (every file conforms to schema); count files equals manifest length for each track.

- [ ] **Step 4: Commit** (may be batched per module for reviewable diffs)

```bash
git add -A && git commit -m "content: generate all lessons for both tracks"
```

---

### Task 18: Consistency review, link check, and final validation

**Files:**
- Create: `scripts/check-links.mjs` (internal-link validator over `dist/`)
- Modify: `package.json` (add `"linkcheck"` script)

**Interfaces:**
- Produces: a passing full build with no broken internal links and a manual smoke checklist completed.

- [ ] **Step 1: Write `scripts/check-links.mjs`** — after build, parse every `dist/**/*.html`, collect internal `href`s, assert each resolves to an emitted file or in-page anchor; exit non-zero on any miss. Add `"linkcheck": "node scripts/check-links.mjs"`.

- [ ] **Step 2: Run the full gate**

```bash
npm test && npm run check && npm run build && npm run linkcheck
```
Expected: all pass; link check reports zero broken links.

- [ ] **Step 3: Dispatch a consistency-review pass** (subagent or workflow) over the generated content: terminology consistency (same term for same concept across lessons), no duplicated lessons, cross-links between related lessons use valid slugs, each module's lesson `order` is contiguous. Fix findings.

- [ ] **Step 4: Manual smoke checklist** (via `npm run preview`): sidebar nav + active state; a quiz gives instant feedback + persists; a mock-interview flow reveals rubric + saves self-score; MarkComplete updates a ProgressRing; cheatsheets page aggregates + filters; theme toggle has no flash and persists; search returns results; responsive at 375px width; keyboard focus visible throughout.

- [ ] **Step 5: Final commit**

```bash
git add -A && git commit -m "chore: link checker and final validation pass"
```

---

## Self-Review

**Spec coverage:**
- Both tracks kept → Tasks 3, 12, 16, 17. ✓
- Astro+MDX+React+Tailwind+TS → Tasks 1–2. ✓
- Content collections + typed frontmatter → Task 3. ✓
- Quiz / MockInterview / ProgressRing / MarkComplete / Cheatsheet / Mermaid → Tasks 7–10, 14. ✓
- Progress persistence (localStorage) → Task 5. ✓
- Site structure & routing (index, concepts, interview, cheatsheets, about) → Tasks 12–14. ✓
- Premium/branded visual design + dark/light + accessibility → Tasks 2, 11, 13. ✓
- Search (Pagefind) → Task 15. ✓
- Multi-agent content workflow + style guide → Tasks 16–17. ✓
- Consistency/link/validation → Task 18. ✓
- Originality (no verbatim copy) → Global Constraints + Tasks 16–17. ✓
- REDCAAP reframed as our framework → Task 16 manifest (Design Framework module). ✓

**Placeholder scan:** Logic tasks (4–9) contain complete code + tests. Presentational/page tasks (10–15) describe concrete component contracts and are validated by build + manual smoke rather than unit tests (appropriate for Astro view components). Content tasks (16–18) are inherently descriptive but pin exact file paths, schemas, and validation gates.

**Type consistency:** `QuizQuestion`/`QuizOption` (Task 3) reused verbatim in Tasks 6–7; `progressStore` function names (Task 5) reused in Tasks 7–9, 14; `buildNav`/`flattenNav`/`getPrevNext` (Task 4) reused in Tasks 11–13; `LessonBrief`/`MANIFEST` (Task 16) consumed in Task 17. Consistent. ✓
