# Style Guide — Grokking Frontend System Design

This is the contract every content-writer subagent follows when turning a
`LessonBrief` from `docs/content-manifest.ts` into a lesson MDX file. Read this
whole document before writing a single lesson. When in doubt, prefer the
stricter reading of a rule.

---

## 0. The originality rule (non-negotiable)

**Every lesson must be 100% original content**, written from general
engineering knowledge and produced independently for this course.

- Do **not** copy, closely paraphrase, or "reword with synonyms" any text,
  example, diagram, quiz question, or structural outline from any specific
  commercial course, book, blog post, or other copyrighted source —
  including (but not limited to) Educative's "Grokking" course family, other
  paid interview-prep products, or any other named source.
- Do **not** reuse a proprietary framework name/acronym (e.g. a specific
  vendor's named interview framework). If a lesson teaches "a framework for
  approaching frontend system design," it must be **our own framework**,
  named and structured by us (see the Design Framework lesson in the
  manifest for the name to use).
- `LessonBrief.brief` fields in the manifest describe the **topic** to teach
  — the concepts, trade-offs, and examples a competent senior frontend
  engineer would explain. They are never an instruction to imitate a
  source's wording or structure, and they must never be read that way.
- Diagrams, worked examples, quiz questions, and mock-interview rubrics must
  all be **written fresh** for this course. It's fine (expected) for
  concepts like "critical rendering path" or "REST vs GraphQL" to overlap
  with what every course on the topic covers — that's just the subject
  matter. What's forbidden is copying any source's specific words, examples,
  diagram layouts, or question phrasing.
- If you genuinely don't know a topic well enough to write about it from
  first principles, write what you do know accurately and keep the lesson
  shorter, rather than leaning on a specific external source's structure.

If you are ever unsure whether something crosses the line, don't write it —
rephrase from the underlying concept instead.

---

## 1. Voice and tone

- Write like a senior engineer explaining a topic to a peer during a design
  review: direct, concrete, opinionated where it helps, no filler.
- Second person is fine ("you'll often see...", "when you design this...").
- Prefer short paragraphs and scannable structure over long prose blocks.
- No marketing language, no "In today's fast-paced world...", no restating
  the section title as the first sentence, no filler transitions ("Now
  let's dive into...").
- It's fine to state trade-offs plainly ("X is simpler but doesn't scale
  past Y; Z is more work but handles Y") rather than hedging everything.
- Use real, concrete numbers and examples over abstractions where possible
  (e.g. "a 200ms budget" beats "a short amount of time").

---

## 2. Lesson structure

Every lesson MDX file follows this shape, in this order:

1. **Frontmatter** (see §4).
2. **Component imports** immediately after the frontmatter fence.
3. **Intro** — 1–3 short paragraphs answering "why does this matter?" before
   any mechanics. Ground it in a real scenario a frontend engineer hits.
4. **Body sections** — organized under `##` (H2) headings, with `###` (H3)
   subheadings where a section has sub-topics. This is the bulk of the
   lesson: explain the concept(s) from the brief precisely and concretely.
5. **At least one diagram** where a diagram genuinely aids understanding
   (pipelines, data flow, architecture, state machines, sequence-like
   interactions). Not every lesson needs one — a lesson that's purely about
   comparing trade-offs in prose may skip it — but most concept and all
   architecture-heavy lessons should have one. Use the `<Mermaid>` component
   (see §5).
6. **A worked example** — a concrete, specific scenario (not hypothetical
   hand-waving) that applies the lesson's ideas end to end.
7. **Common pitfalls** — at least one `<Callout type="warning">` block
   naming a specific mistake engineers make with this topic and how to
   avoid it. Case-study lessons may use `<Callout type="interview">` instead
   or in addition, for interview-specific advice.
8. **`<Quiz>`** — 2–4 questions checking the concepts just taught (see §6).
   Case-study "Mock interview" lessons use `<MockInterview>` instead of (or
   in addition to) `<Quiz>` — see §7.
9. **`cheatsheet` frontmatter bullets** — written last, after the lesson
   body is final, so they actually summarize what's in the lesson (see §4).

## 3. Length targets

- **Concept lessons** (`track: concept`): ~800–1400 words of body prose
  (excludes frontmatter, code fences, and Quiz/MockInterview JSX).
- **Case-study lessons** (`track: interview`): ~1000–1600 words. Mock
  interview lessons can run shorter in prose since the `<MockInterview>`
  rubric carries some of the content, but the prompt and any framing text
  should still be substantive.
- These are targets, not hard limits — a lesson that needs 1500 words to be
  correct and clear is better than one padded or cut down to hit a number.

---

## 4. Frontmatter rules

Every lesson's frontmatter must satisfy `lessonSchema`
(`src/lib/lessonSchema.ts`) exactly:

```ts
{
  title: string;
  module: string;
  moduleOrder: number;   // integer > 0
  order: number;         // integer > 0
  track: 'concept' | 'interview';
  summary: string;
  cheatsheet: string[];  // min 1 item — use 3–7
  tags: string[];
  estMinutes: number;    // integer > 0
}
```

Rules:

- **Copy `module`, `moduleOrder`, `order`, `track`, `slug`, `title`,
  `summary`, `tags`, `estMinutes` straight from the matching
  `LessonBrief` entry in `docs/content-manifest.ts`.** Don't invent your
  own values or renumber — the manifest is the source of truth for
  ordering and grouping. `slug` becomes the filename
  (`src/content/<track-dir>/<slug>.mdx`), not a frontmatter field.
- `module` must be spelled **identically** (same string) across every
  lesson that belongs to that module — the sidebar/nav groups lessons by
  this string plus `track`. Copy it verbatim from the manifest; don't
  paraphrase it per-lesson.
- `summary` is a one-sentence description shown in nav/listing UI — distinct
  from the lesson body's intro paragraph, though it can echo it.
- `cheatsheet` is **3–7 genuinely useful revision bullets** — short,
  standalone statements someone could review the night before an interview
  and get real value from (not "we covered X" restatements of section
  titles, but the actual takeaway: "Debounce location updates but
  interpolate positions client-side for smooth motion between them").
  Write these *after* the body is done.
- `tags` — lowercase kebab-case, 2–4 tags, drawn from the manifest entry
  (you may add one more specific tag if it clearly helps search/filtering).
- `estMinutes` — realistic reading + quiz time; use the manifest's value
  unless your final lesson length clearly warrants adjusting it by a
  minute or two.

---

## 5. MDX components

Import components using **relative paths from the lesson file** at
`src/content/<concepts|interview>/<slug>.mdx` (two levels up to `src/`):

```mdx
import Quiz from '../../components/Quiz';
import MockInterview from '../../components/MockInterview';
import Callout from '../../components/Callout.astro';
import Mermaid from '../../components/Mermaid';
```

Only import the components a given lesson actually uses.

### `<Callout>`

```mdx
<Callout type="warning">
  A specific, concrete pitfall — not a generic warning.
</Callout>
```

`type` is one of `"note" | "tip" | "warning" | "interview"`. Use `"warning"`
for the required common-pitfalls callout; `"note"`/`"tip"` for asides;
`"interview"` for interview-specific framing advice (most useful in the
Interview Prep track).

### Diagrams — use the `<Mermaid>` component, not raw ` ```mermaid ` fences

**This project does not render raw ` ```mermaid ` fenced code blocks.**
There is no remark/rehype Mermaid plugin registered in `astro.config.mjs` —
only `@astrojs/react` and `@astrojs/mdx` are installed. A fenced
` ```mermaid ` block would render as an inert `<pre><code>` block of text,
not a diagram. The **only working approach** is the `Mermaid` React island
at `src/components/Mermaid.tsx`, which lazy-loads the `mermaid` package
client-side and renders to SVG (falling back to the raw chart text if
rendering ever throws, so a syntax slip never breaks the page).

**Standardize on this pattern for every diagram:**

```mdx
<Mermaid client:visible chart={`
flowchart LR
  A[Request] --> B[Server]
  B --> C[Response]
`} />
```

Notes:

- Always pass `client:visible` — diagrams hydrate only when scrolled into
  view, keeping the initial page light.
- Use a template literal (backticks) for `chart` so the Mermaid source can
  span multiple lines; keep the diagram source itself simple and readable
  (flowcharts, sequence diagrams, and state diagrams are the most common
  needs for this course).
- Keep diagrams focused — 4–10 nodes/steps. A diagram that needs a paragraph
  to explain its own layout is too complex; simplify or split it.

### `<Quiz>`

```mdx
<Quiz
  lessonId="the-lesson-slug"
  client:visible
  questions={[
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'Which of these best describes X?',
      options: [
        { id: 'a', text: 'Option A', correct: true, explanation: 'Why A is right.' },
        { id: 'b', text: 'Option B', correct: false, explanation: 'Why B is wrong.' },
      ],
    },
  ]}
/>
```

- `lessonId` must equal the lesson's own `slug` (used to key saved quiz
  scores in local progress storage).
- Always pass `client:visible`.
- See §6 for the quiz content rules.

### `<MockInterview>`

```mdx
<MockInterview
  lessonId="the-lesson-slug"
  client:visible
  prompt="Design the frontend for a real-time chat application."
  rubric={[
    { point: 'Clarifies requirements first', detail: 'Confirms group vs 1:1, multi-device sync, and offline needs before designing.' },
  ]}
/>
```

- `lessonId` must equal the lesson's own `slug`.
- `prompt` is the open-ended interview question, written fresh for this
  course.
- `rubric` is 4–6 `{ point, detail }` pairs, each `point` a short heading
  ("Handles reconnection gracefully") and `detail` a sentence explaining
  what a strong answer covers for that point. See §7 for how these are used
  in the manifest's Mock Interview lessons.

---

## 6. Quiz rules

- **2–4 questions per `<Quiz>`.**
- **Mix of `kind`s** across the lesson set where it makes sense — `'mcq'`
  (single correct answer), `'multi'` (multiple correct answers, checkbox
  UI), `'boolean'` (true/false, phrase the prompt as a statement to
  evaluate). Not every quiz needs all three kinds, but don't make every
  quiz in the course all-`mcq`.
- **Every option must have an `explanation`** — including wrong options.
  The explanation says *why* that option is right or wrong, not just
  restates the option.
- **Correct flags must be exact**: `kind: 'mcq'` and `'boolean'` questions
  have exactly one `correct: true` option; `kind: 'multi'` questions have
  two or more.
- Quiz questions test understanding of what the lesson actually taught —
  write them after the body is finished, not before.
- Write quiz questions and explanations **from scratch**; do not adapt
  questions from any external quiz/source (see §0).

---

## 7. Mock Interview lessons (Interview Prep track only)

Every case study's 4th lesson ("Mock Interview") is built around
`<MockInterview>`:

- `prompt` — the open-ended system design prompt for that case study,
  matching the manifest brief.
- `rubric` — 4–6 points a strong candidate hits, covering (roughly):
  requirements clarification, architecture/component breakdown, the
  case-study-specific deep-dive concern (e.g. ordering/dedup for chat,
  adaptive bitrate for video), resilience/edge-case handling, and
  performance or trade-off discussion.
- The lesson's prose framing (before the component) should briefly remind
  the reader this is a timed, talk-it-through exercise, and encourage
  writing notes before revealing the rubric — the component itself handles
  the notes/reveal/self-score flow, so don't duplicate that UI in prose.

---

## 8. Complete worked example

Copy this template's structure exactly. This is an **original** short lesson
(shortened for template purposes — a real lesson should hit the length
targets in §3) demonstrating every required piece: frontmatter, imports,
intro, body sections, a diagram, a worked example, a pitfalls callout, and a
quiz.

Save as: `src/content/concepts/debouncing-and-throttling.mdx`

````mdx
---
title: Debouncing and Throttling
module: Fundamentals
moduleOrder: 3
order: 5
track: concept
summary: Explains debouncing and throttling as two distinct techniques for controlling how often expensive work runs in response to frequent events.
cheatsheet:
  - "Debounce delays work until events stop firing for a quiet period — good for 'wait until the user pauses' (search-as-you-type, resize-end)."
  - "Throttle runs work at most once per fixed interval while events keep firing — good for 'stay responsive but capped' (scroll, drag, mousemove)."
  - "Debounce can starve output entirely under a constant stream of events; throttle guarantees periodic output."
  - "Both are about controlling *frequency* of work, not deferring *when* work starts — neither replaces lazy loading or code splitting."
  - "Trailing vs leading edge matters: a leading-edge throttle fires immediately then cools down; a trailing-edge debounce waits for silence."
tags: ['fundamentals', 'performance', 'events']
estMinutes: 7
---

import Callout from '../../components/Callout.astro';
import Mermaid from '../../components/Mermaid';
import Quiz from '../../components/Quiz';

Some browser events fire far more often than any handler needs to run.
Scrolling can fire dozens of times a second; a resize can fire continuously
while a window is being dragged; a keystroke handler wired to an API call
can fire on every character. Run expensive work — a layout read, a network
request, a re-render — on every single event, and you'll janky up the page
or hammer a backend for no benefit. Debouncing and throttling are the two
standard techniques for controlling that frequency, and they solve
different problems.

## Debouncing: wait for quiet

A debounced function delays running until a burst of calls stops for a
configured quiet period. Each new call resets the timer. If the event
keeps firing faster than the quiet period, the wrapped function never
runs at all — only once things go quiet does it fire.

This is the right tool when you only care about the *final* state after
a burst: a search-as-you-type box that queries the API once the user
pauses, or a window-resize handler that recalculates a layout once
resizing stops, rather than on every intermediate size.

## Throttling: cap the rate

A throttled function runs at most once per fixed interval, no matter how
many times the event fires during that interval. Unlike debouncing, it
guarantees output at a steady cadence even under a continuous stream of
events — it just drops (or queues, depending on implementation) the calls
in between.

This is the right tool when you need to stay responsive throughout an
ongoing interaction, not just at the end: updating a "scroll progress"
indicator, tracking a drag gesture, or sampling `mousemove` coordinates
for a custom cursor effect.

### Leading vs. trailing edge

Both techniques have a "which edge fires" choice:

- **Leading edge**: fire immediately on the first event, then ignore
  (throttle) or delay (debounce) subsequent ones.
- **Trailing edge**: wait, then fire using the last event's data once the
  interval/quiet-period elapses.

A throttled scroll handler is often leading-edge (react immediately, then
cool down). A debounced search box is almost always trailing-edge (wait
for the user to actually stop typing before firing).

<Mermaid client:visible chart={`
sequenceDiagram
    participant E as Events (fired rapidly)
    participant D as Debounced fn
    participant T as Throttled fn
    E->>D: call, call, call...
    Note over D: timer resets each call
    D-->>D: fires once, after quiet period
    E->>T: call, call, call...
    Note over T: interval elapses
    T-->>T: fires, then cools down for interval
    T-->>T: fires again next interval
`} />

## Worked example: a live search box

Say you're building a search box that queries an API as the user types.
Firing a request per keystroke means a user typing "system design" sends
~13 requests, most of which are wasted — only the last one's results
matter once they stop typing.

Wrapping the API call in a 300ms trailing-edge debounce fixes this: each
keystroke resets a 300ms timer, and only when the user pauses for 300ms
does the request actually fire. Now "system design" typed at normal speed
produces a single request instead of thirteen.

Contrast that with a *throttled* implementation of the same feature: a
250ms throttle would still fire a request every 250ms while the user
keeps typing, which is closer to "live-updating results" behavior — a
valid choice, but a different UX and a different backend load profile.
The right choice depends on whether you want "final answer only" (debounce)
or "periodic live updates" (throttle).

<Callout type="warning">
  A common mistake: creating a new debounced/throttled function on every
  render (e.g. `debounce(fn, 300)` inline in a component body). Each render
  produces a fresh timer with no memory of the previous one, so calls never
  actually get coalesced — you get all the complexity with none of the
  benefit. Create the debounced/throttled function once (e.g. via `useMemo`
  or `useRef` in React, or at module scope) and reuse that same instance
  across calls.
</Callout>

<Quiz
  lessonId="debouncing-and-throttling"
  client:visible
  questions={[
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'A search-as-you-type box should query the API only after the user pauses typing for 300ms. Which technique fits?',
      options: [
        { id: 'a', text: 'Debounce', correct: true, explanation: 'Debounce delays work until events go quiet for the configured period — exactly "wait until the user pauses."' },
        { id: 'b', text: 'Throttle', correct: false, explanation: 'Throttle would still fire periodically while the user keeps typing, not just once they pause.' },
        { id: 'c', text: 'Neither — always fire on every keystroke', correct: false, explanation: 'That produces one request per keystroke, which is the exact problem debouncing/throttling solves.' },
      ],
    },
    {
      id: 'q2',
      kind: 'multi',
      prompt: 'Which scenarios are better suited to throttling than debouncing? (Select all that apply.)',
      options: [
        { id: 'a', text: 'Updating a scroll-progress indicator while the user scrolls', correct: true, explanation: 'You want a steady stream of updates throughout the scroll, not just once scrolling stops — that is throttling.' },
        { id: 'b', text: 'Sampling mousemove coordinates for a custom cursor effect', correct: true, explanation: 'The effect needs to stay responsive throughout the drag/move, at a capped rate — a throttle use case.' },
        { id: 'c', text: 'Triggering a layout recalculation once window resizing has finished', correct: false, explanation: 'Caring only about the final size after resizing stops is the debounce case, not throttle.' },
      ],
    },
    {
      id: 'q3',
      kind: 'boolean',
      prompt: 'A debounced function is guaranteed to run at least once per fixed time interval, even under a continuous stream of events.',
      options: [
        { id: 'true', text: 'True', correct: false, explanation: 'That guarantee describes throttling. A debounced function can be starved indefinitely if events never stop firing faster than the quiet period.' },
        { id: 'false', text: 'False', correct: true, explanation: 'Correct — debouncing has no such guarantee; only throttling guarantees periodic execution under continuous events.' },
      ],
    },
  ]}
/>
````

---

## 9. Checklist before you consider a lesson done

- [ ] Frontmatter matches the manifest entry exactly (title, module,
      moduleOrder, order, track, tags, estMinutes) and `summary` +
      `cheatsheet` are written.
- [ ] `cheatsheet` has 3–7 genuinely useful bullets, written after the body.
- [ ] Intro explains why the topic matters before diving into mechanics.
- [ ] Body uses `##`/`###` headings, no giant undifferentiated wall of text.
- [ ] A diagram is present via `<Mermaid client:visible chart={...} />` if
      the topic benefits from one.
- [ ] A concrete worked example is present, not just abstract description.
- [ ] At least one `<Callout type="warning">` names a specific pitfall.
- [ ] `<Quiz>` (or `<MockInterview>` for mock-interview lessons) is present,
      `client:visible` is set, and — for `<Quiz>` — every option has an
      `explanation` and correct flags are exactly right.
- [ ] Word count is in range for the track (§3).
- [ ] Nothing in the lesson was copied or closely paraphrased from any
      external source (§0).
