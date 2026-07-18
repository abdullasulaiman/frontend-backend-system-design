# The System Design Handbook

A free, interactive study platform for **system design interviews** — covering both **Frontend** and **Backend** system design in depth. 250 original lessons, hands-on quizzes, guided mock interviews, progress tracking, and one-page revision cheatsheets.

### 🚀 [**Open the live site →**](https://abdullasulaiman.github.io/frontend-backend-system-design/)

<https://abdullasulaiman.github.io/frontend-backend-system-design/>

---

## Why this exists

Most system design prep is scattered across blog posts, videos, and paywalled courses — and almost all of it ignores the **frontend** interview entirely. This handbook brings both tracks together in one fast, searchable place, teaches each topic from first principles, and then makes you *practice* with quizzes and realistic mock-interview prompts. It's built to take you from "I know the concepts" to "I can confidently drive a 45-minute design interview."

## What you'll get out of it

- **A repeatable way to answer any design question** — a step-by-step framework (clarify → estimate → decompose → data & API → architecture → trade-offs) applied across every case study, so you stop freezing on open-ended prompts.
- **Real depth on the frontend interview** — rendering strategies, state architecture, performance budgets, accessibility, security, and design systems, not just "make a to-do app."
- **The full distributed-systems toolkit** — the building blocks (load balancers, databases, caches, queues, consistency models) *and* how to compose them into complete designs for real products.
- **Practice, not just reading** — a quiz on every lesson (instant feedback + explanations) and 13 guided mock interviews with rubrics you score yourself against.
- **Fast revision** — every lesson's key takeaways aggregated into printable cheatsheets, plus full-text search across all 250 lessons for the night before an interview.

---

## 📚 What's covered

Two independent courses, switchable from the top bar. Each mirrors a complete, in-order interview curriculum.

### 🎨 Frontend System Design — 58 lessons

**Concepts**
| Module | You'll learn |
| --- | --- |
| **Introduction** | What frontend system design is and how interviewers assess it |
| **Nonfunctional Requirements** | Performance, accessibility & compatibility, localization/i18n, maintainability |
| **Fundamentals** | Browser rendering pipeline, CSS layout & positioning, the DOM, state management |
| **Performance & Optimization** | Critical rendering path, asset loading, code splitting, lazy loading, caching, image/media optimization, rendering strategies (CSR/SSR/SSG/ISR), Core Web Vitals, network optimization |
| **API Architecture** | Client–server models, REST/GraphQL/gRPC/WebSocket/SSE, data formats & transport |
| **Design Patterns & Architectures** | Component patterns, micro-frontends, module federation, monorepo vs. polyrepo, rendering & state architectures |
| **Security** | Auth on the frontend (authN/authZ), XSS, CSRF, CSP, safe client-side storage |
| **The Framework** | A six-step method for structuring any frontend design answer under time pressure |
| **Bonus** | Real-time data & sync, offline-first/PWAs, frontend observability, feature flags & progressive delivery, design systems at scale |

**Interview Prep — 5 case studies, each ending in a mock interview**
News Feed · Video Streaming Platform · Chat Application · Ride-Hailing App · Calendar Application

### 🏗️ Backend / Distributed System Design — 192 lessons

**Foundations & Building Blocks**
Interview strategy · non-functional characteristics (availability, reliability, scalability, consistency — CAP/PACELC) · back-of-the-envelope estimation · **DNS** · **load balancers** · **databases** (SQL vs. NoSQL, replication, sharding, indexing, transactions) · **key-value stores** (consistent hashing, quorums) · **CDNs** · **unique ID generation** · **distributed monitoring** & error tracking · **distributed cache** · **message queues** · **pub-sub** · **rate limiter** · **blob store** · **distributed search** · **distributed logging** · **task scheduler** · **sharded counters**.

**Design Problems — the classic "Design X" interviews**
YouTube · Quora · Google Maps · Yelp (proximity) · Uber · Twitter · News Feed · Instagram · TinyURL · Web Crawler · WhatsApp · Typeahead · Google Docs · Deployment System · Payment System · ChatGPT-style LLM serving · Data Infrastructure · LLM Support Bot · AI Code Assistant · Lessons from System Failures.

**Bonus** — 14 extra designs (Notification System, Dropbox, Ticketmaster, Distributed Lock, Recommendations, Ad Click Aggregation, Leaderboard, Zoom, Stock Exchange, API Gateway, Web Analytics, Gmail, Online Code Judge, Airbnb) and 5 company case studies (**Netflix, Amazon DynamoDB, Google Search, Discord, Cloudflare**).

> 8 of the design modules include a dedicated **mock interview** with a prompt and a scoring rubric.

---

## ✨ Features

- **Quizzes on every lesson** — multiple-choice / multi-select / true-false with instant feedback and per-option explanations.
- **Mock-interview mode** — a realistic prompt, space for your own notes, a reveal-the-rubric step, and a self-score.
- **Progress tracking** — per-module completion rings, saved locally in your browser.
- **Cheatsheets** — every lesson's key points collected on one filterable page for last-minute revision.
- **Full-text search** across all 250 lessons.
- **Light / dark themes**, smooth client-side navigation, diagrams, fully responsive, and accessible (WCAG-AA).

## 🛠️ Built with

[Astro](https://astro.build) · React 19 islands · TypeScript (strict) · Tailwind CSS v4 · [Pagefind](https://pagefind.app) static search · Mermaid diagrams · Vitest. Statically generated and deployed to GitHub Pages via GitHub Actions.

## 💻 Run locally

Requires **Node ≥ 22.12** (pinned in `.nvmrc`).

```bash
nvm use          # or: nvm install
npm install
npm run dev      # http://localhost:4321/frontend-backend-system-design/
```

Useful scripts: `npm run build` (static build + search index) · `npm run preview` · `npm run check` (type + content validation) · `npm test` · `npm run linkcheck`.

---

## A note on originality

This is an **independent, original** learning project written from scratch. It is **not affiliated with, endorsed by, or copied from** any commercial course (including Educative's "Grokking" courses) or any other provider. Well-known system names (e.g. "Design Uber") refer to the systems being designed — standard interview practice — and all explanations, diagrams, and quizzes are original.
