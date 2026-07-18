# The System Design Handbook

> Two complete, original system-design courses — **Frontend** and **Backend** — in one fast, searchable, interactive web app. 250 lessons, quizzes, mock interviews, progress tracking, and revision cheatsheets.

**🔗 Live site:** https://your-username.github.io/frontend-backend-system-design/
_(replace `your-username` with your GitHub username after deploying)_

Built with Astro + React islands. All content is original, self-hosted, and free.

---

## What's inside

Two independent courses, switchable from the top bar, each faithful to a full interview curriculum:

### 🎨 Frontend System Design — 58 lessons (15 modules)
Introduction · Nonfunctional Requirements · Fundamentals (rendering, state, DOM) · Performance & Optimization · API Architecture · Design Patterns & Architectures · Security · a step-by-step interview Framework · Conclusion · Bonus topics — plus **5 case studies** (Newsfeed, Video Streaming, Chat, Ride-Hailing, Calendar), each with a **mock interview**.

### 🏗️ System Design Interview (Backend) — 192 lessons (48 modules)
- **Foundations & Building Blocks:** interview prep, non-functional characteristics, estimation, DNS, load balancers, databases, key-value stores, CDN, ID generators, monitoring, distributed cache, message queues, pub-sub, rate limiter, blob store, search, logging, task scheduler, sharded counters…
- **Design Problems:** YouTube, Quora, Google Maps, Yelp, Uber, Twitter, Instagram, TinyURL, Web Crawler, WhatsApp, Typeahead, Google Docs, Payments, ChatGPT-style systems, and more.
- **Bonus:** 14 extra "Design X" lessons (Notification System, Dropbox, Ticketmaster, Zoom, Stock Exchange, API Gateway, Gmail, Airbnb…) and 5 company **case studies** (Netflix, DynamoDB, Google Search, Discord, Cloudflare).

## Features
- **Interactive quizzes** on every lesson — instant feedback with explanations.
- **Mock-interview mode** — a prompt, your notes, a reveal-the-rubric flow, and a self-score.
- **Progress tracking** — per-module completion rings (saved in your browser).
- **Consolidated cheatsheets** — every lesson's key takeaways on one page for fast revision.
- **Full-text search** across all lessons (Pagefind).
- **Light / dark themes**, smooth client-side navigation, accessible (WCAG-AA), responsive.

## Tech stack
[Astro](https://astro.build) (content collections + view transitions) · React 19 islands · Tailwind CSS v4 · TypeScript (strict) · [Pagefind](https://pagefind.app) static search · Mermaid diagrams · Vitest.

---

## Run it locally

Requires **Node ≥ 22.12** (pinned via `.nvmrc`).

```bash
nvm use            # or: nvm install
npm install
npm run dev        # http://localhost:4321/frontend-backend-system-design/
```

Other scripts: `npm run build` (static build + search index) · `npm run preview` · `npm run check` (type + content validation) · `npm test` · `npm run linkcheck`.

## Deploy to GitHub Pages

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes on every push to `main`.

1. In `astro.config.mjs`, replace `your-username` in the `site:` line with your GitHub username.
2. Create a **public** repo named exactly **`frontend-backend-system-design`** and push:
   ```bash
   git remote add origin git@github.com:<your-username>/frontend-backend-system-design.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
4. The site goes live at `https://<your-username>.github.io/frontend-backend-system-design/`.

> The app is served from the `/frontend-backend-system-design/` subpath, which is why `base` is set in `astro.config.mjs`. If you rename the repo, update `base` (and the `BASE` constant in `scripts/check-links.mjs`) to match.

**Suggested repo topics** (Settings → About) for discoverability: `system-design`, `system-design-interview`, `frontend-system-design`, `distributed-systems`, `interview-preparation`, `astro`, `learning-resource`.

---

## A note on originality
This is an **independent, original** learning project written from scratch. It is **not affiliated with, endorsed by, or copied from** any commercial course (including Educative's "Grokking" courses) or any other provider. Well-known system names (e.g. "Design Uber") refer to the systems being designed — standard interview practice — and all explanations, diagrams, and quizzes are original.
