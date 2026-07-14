# Grokking Frontend System Design — Course App (Design Spec)

**Date:** 2026-07-14
**Status:** Draft for review
**Author:** Mohamed Abdulla (with Claude)

## 1. Purpose

Recreate the "Grokking the Frontend System Design Interview" course as an
original, self-hosted interactive learning app. It keeps **both** tracks of the
original curriculum:

- **Concepts** — the teaching material (fundamentals, performance, API
  architecture, design patterns, security, and the design framework).
- **Interview Preparation** — real-world case studies with mock interviews.

All prose is **original** — we cover the same curriculum and topics in our own
words and diagrams. We do not copy Educative's copyrighted text.

### Success criteria

- `npm install && npm run dev` serves a browsable course locally.
- `npm run build` produces a static site deployable anywhere.
- Every curriculum lesson exists as an MDX file with full prose, at least one
  diagram where useful, a quiz, and a cheatsheet block.
- Both tracks are complete: all Concepts modules + all 5 case studies with mock
  interviews.
- A reader can: navigate by module, take quizzes with instant feedback, run a
  mock-interview self-assessment, track completion progress, and open a
  consolidated cheatsheet page for revision.

## 2. Tech stack

| Concern        | Choice                                              |
|----------------|-----------------------------------------------------|
| Framework      | Astro (content-first, ships minimal JS)             |
| Authoring      | MDX via Astro Content Collections (typed frontmatter)|
| Interactivity  | React islands (`client:visible` / `client:load`)    |
| Language       | TypeScript throughout                               |
| Styling        | Tailwind CSS + a small design-token layer           |
| Diagrams       | Mermaid (client-rendered) + hand-authored inline SVG |
| Code blocks    | Shiki (Astro built-in) syntax highlighting          |
| Search         | Pagefind (static, build-time index)                 |
| Persistence    | `localStorage` (progress, quiz scores)              |
| Deploy         | Static build (`astro build`) — host-agnostic        |

No backend. All state is client-side.

## 3. Content model

### Content Collections

Two collections, one per track, sharing a schema:

- `concepts/` — Track A
- `interview/` — Track B

**Lesson frontmatter schema (Zod):**

```ts
{
  title: string
  module: string          // group name for sidebar (e.g. "Performance & Optimization")
  moduleOrder: number     // order of the module in the track
  order: number           // order of the lesson within its module
  track: "concept" | "interview"
  summary: string         // one-line, used on cards + roadmap
  cheatsheet: string[]    // bullet points aggregated into /cheatsheets
  tags: string[]
  estMinutes: number
}
```

Quizzes live **inside** each MDX file via a `<Quiz>` component with an inline
question array (co-located with the lesson content, not a separate DB).

### Curriculum (mirrors the source, both tracks kept)

**Track A — Concepts**

1. **Introduction to Frontend System Design**
   - What is frontend system design?
   - Course structure / how to use this
   - Role of frontend system design in modern applications
2. **Nonfunctional Requirements**
   - Performance
   - Accessibility & compatibility
   - Localization & internationalization
   - Maintainability
3. **Fundamentals of Frontend System Design**
   - Browser rendering pipeline
   - CSS layout & positioning
   - DOM manipulation
   - State management
4. **Performance & Optimization** (~9 lessons)
   - Critical rendering path, asset loading, code splitting, lazy loading,
     caching, image/media optimization, rendering strategies (CSR/SSR/SSG/ISR),
     Core Web Vitals, network optimization
5. **API Architecture Styles, Protocols & Data Formats**
   - Client–server communication models
   - API styles (REST, GraphQL, gRPC, WebSocket/SSE)
   - Data formats & transport
6. **Frontend Design Patterns & Architectures** (~6 lessons)
   - Component patterns, micro-frontends, module federation, monorepo vs
     polyrepo, rendering architectures, state architecture patterns
7. **Security in Frontend System Design**
   - AuthN/AuthZ on the frontend
   - Secure data practices (XSS, CSRF, CSP, secrets, storage)
8. **The Design Framework**
   - The REDCAAP approach (Requirements, Estimation/Data, Component, API,
     Architecture, Performance — presented as our structured framework)

**Track B — Interview Preparation (case studies)**

Each case study is a 4-lesson arc + a mock interview:

- Requirements & scope
- High-level architecture
- Deep dives (data flow, performance, edge cases)
- Mock interview (guided, self-assessed)

Case studies: **Newsfeed, Video Streaming Platform, Chat Application, Uber
(ride-hailing), Calendar Application.**

## 4. Interactive components (React islands)

| Component        | Behavior |
|------------------|----------|
| `Quiz`           | MCQ / true-false / multi-select. Instant feedback, per-option explanation, score saved to localStorage. |
| `MockInterview`  | Guided flow: prompt → free-text self-notes → reveal model talking points/rubric → self-score (1–5). Progress saved. |
| `ProgressRing`   | Per-module completion %, shown in sidebar and roadmap. |
| `MarkComplete`   | Per-lesson "mark complete" toggle → localStorage. |
| `CheatsheetPage` | Aggregates every lesson's `cheatsheet[]` bullets, grouped by module, filterable by track/tag. |
| `Mermaid`        | Renders fenced ```mermaid blocks client-side. |

All persistence goes through a single typed `progressStore` util wrapping
`localStorage` (keys namespaced, versioned, safe JSON parse).

## 5. Site structure & routing

```
/                     Landing + full roadmap (both tracks, progress rings)
/concepts/[...slug]   Concept lessons
/interview/[...slug]  Case-study lessons
/cheatsheets          Consolidated revision page
/about                What this is, how to use, attribution note
```

- **Layout:** persistent left sidebar (modules → lessons, grouped by track,
  with progress), main content column (max readable width), right-hand
  in-page table of contents, top bar with search + track switcher + theme
  toggle.
- **Prev/Next** derived from collection order.

## 6. Visual design (premium / branded)

- Distinct brand: name, logo mark, color system with dark/light themes and
  design tokens (CSS custom properties driven by Tailwind theme).
- Custom landing page: hero, curriculum roadmap visualization (two tracks),
  "why frontend system design" framing, CTA into first lesson.
- Considered typography scale, generous spacing, polished lesson cards, subtle
  motion (respecting `prefers-reduced-motion`), callout/aside styles
  (note/tip/warning/interview-tip), styled code + diagram frames.
- Fully responsive; accessible (semantic landmarks, focus states, color
  contrast) — fitting given the course itself teaches accessibility.

## 7. Build approach — multi-agent workflow

Given the volume (58+ lessons), content is produced with a **Workflow**:

1. **Scaffold phase (done by main agent):** Astro project, Tailwind, content
   collections + schema, layouts, all interactive islands, brand/design system,
   navigation, cheatsheet aggregation, search, and a **Style Guide** doc that
   every writer subagent must follow (voice, structure, diagram conventions,
   quiz format, cheatsheet format, length targets).
2. **Content generation phase (fan-out):** one subagent per lesson (or small
   batch), each given the style guide + lesson brief, producing a complete MDX
   file (prose + diagrams + quiz + cheatsheet). Case-study arcs generated with
   shared context per case study for coherence.
3. **Consistency/review phase:** reviewer subagents check cross-lesson
   consistency, terminology, broken internal links, schema conformance, and
   quiz correctness. Findings fixed before completion.

Each lesson MDX is an isolated unit with a well-defined interface (frontmatter
schema + component contract), so it can be written and validated independently.

## 8. Out of scope (YAGNI)

- No user accounts, no backend, no server-side persistence.
- No payment/gating.
- No video hosting (diagrams + prose replace video lessons).
- No verbatim reproduction of source material.

## 9. Testing / validation

- `astro check` (type + content schema validation) passes.
- Build succeeds with zero broken internal links (link-check step).
- Every lesson conforms to the frontmatter schema and contains a quiz + a
  non-empty cheatsheet.
- Manual smoke: nav, quiz feedback, mock-interview flow, progress persistence,
  cheatsheet aggregation, theme toggle, search, responsive layout.
