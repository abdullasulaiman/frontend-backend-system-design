/**
 * Content manifest — the writer contract for every lesson in the course.
 *
 * This file is the single source of truth for *what lessons exist*, their
 * ordering, grouping, and what each one must cover. Content-writer subagents
 * consume one `LessonBrief` at a time and produce a matching MDX file under
 * `src/content/concepts/<slug>.mdx` or `src/content/interview/<slug>.mdx`,
 * following `docs/STYLE_GUIDE.md` for structure, tone, and component usage.
 *
 * IMPORTANT — originality: `brief` fields describe the *topic* to teach —
 * the concepts, trade-offs, and examples a senior frontend engineer would
 * explain from general knowledge. They are never instructions to imitate the
 * structure or wording of any specific external course or source. See
 * `docs/STYLE_GUIDE.md` §0 for the full originality rule; every lesson
 * produced from this manifest must be 100% original writing.
 *
 * `moduleOrder`/`order` are authoritative for nav grouping and prev/next
 * ordering (see `src/lib/navigation.ts` and `src/layouts/LessonLayout.astro`).
 * `module` strings must match verbatim across all lessons in the same module.
 * `slug` must be unique within its track and becomes the MDX filename.
 *
 * This file is a plain data module (not part of the Astro build) — it is not
 * imported by the app. It exists purely as the shared contract for the
 * content-generation pass.
 */

export type Track = 'concept' | 'interview';

export interface LessonBrief {
  track: Track;
  module: string;
  moduleOrder: number;
  order: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  estMinutes: number;
  /** 2–4 sentences describing what this lesson must cover. Never a source to imitate. */
  brief: string;
}

export const MANIFEST: LessonBrief[] = [
  // ===========================================================================
  // CONCEPTS TRACK — 32 lessons across 8 modules
  // ===========================================================================

  // --- Module 1: Introduction (moduleOrder 1) — 3 lessons ---
  {
    track: 'concept',
    module: 'Introduction',
    moduleOrder: 1,
    order: 1,
    slug: 'what-is-frontend-system-design',
    title: 'What Is Frontend System Design?',
    summary: 'Defines frontend system design as a discipline and distinguishes it from backend system design and UI craft.',
    tags: ['introduction', 'fundamentals'],
    estMinutes: 8,
    brief:
      'Explain what frontend system design means both as an interview discipline and as a real engineering practice: designing the architecture, data flow, and user-facing behavior of a client application at scale. Contrast it with backend system design (data stores, distributed systems) and with pure UI/visual design, explaining why interviewers treat it as a distinct skill. Note the kinds of decisions in scope — rendering strategy, state management, API shape, performance, reliability of the client — and close with why senior/staff frontend engineers are expected to reason about these trade-offs.',
  },
  {
    track: 'concept',
    module: 'Introduction',
    moduleOrder: 1,
    order: 2,
    slug: 'how-to-use-this-course',
    title: 'How to Use This Course',
    summary: 'Explains the two tracks (concepts and case studies), how lessons build on each other, and how to practice effectively.',
    tags: ['introduction', 'meta'],
    estMinutes: 6,
    brief:
      "Describe the course's two tracks: the Concepts track (fundamentals, patterns, performance, security, and a design framework) and the Interview Prep track (five end-to-end case studies each ending in a mock interview). Explain the recommended order (build concepts before or alongside case studies), how quizzes and mock interviews reinforce learning, and how to use each lesson's cheatsheet bullets for spaced revision before an interview. Keep it practical and short.",
  },
  {
    track: 'concept',
    module: 'Introduction',
    moduleOrder: 1,
    order: 3,
    slug: 'role-of-frontend-system-design-in-modern-apps',
    title: 'The Role of Frontend System Design in Modern Apps',
    summary: 'Surveys why frontend architecture decisions matter more as apps grow in scale, team size, and device diversity.',
    tags: ['introduction', 'architecture'],
    estMinutes: 8,
    brief:
      'Explain why frontend architecture has become its own discipline as applications have grown in scale, team size, and device/network diversity. Cover pressures like multiple teams owning parts of one app, users on wildly varied networks and devices, and rising expectations for speed and reliability. Give two or three concrete scenarios (e.g. a social feed, a video platform, a shared internal dashboard) where poor frontend architecture decisions caused real problems, to motivate the rest of the course.',
  },

  // --- Module 2: Nonfunctional Requirements (moduleOrder 2) — 4 lessons ---
  {
    track: 'concept',
    module: 'Nonfunctional Requirements',
    moduleOrder: 2,
    order: 1,
    slug: 'performance-as-a-requirement',
    title: 'Performance as a Requirement',
    summary: 'Frames performance as a measurable nonfunctional requirement with concrete targets, not a vague goal.',
    tags: ['nonfunctional', 'performance'],
    estMinutes: 10,
    brief:
      "Explain how to treat performance as a nonfunctional requirement (NFR) with measurable targets rather than a vague 'make it fast' goal. Introduce categories of performance NFRs: load performance, runtime/interaction performance, and perceived performance. Show how to phrase performance requirements concretely (e.g. a target load time, an interaction latency budget) and how these targets should shape later architecture decisions covered in the Performance & Optimization module.",
  },
  {
    track: 'concept',
    module: 'Nonfunctional Requirements',
    moduleOrder: 2,
    order: 2,
    slug: 'accessibility-and-compatibility',
    title: 'Accessibility & Compatibility',
    summary: 'Covers accessibility and cross-device/browser compatibility as nonfunctional requirements to clarify up front.',
    tags: ['nonfunctional', 'accessibility'],
    estMinutes: 10,
    brief:
      "Cover accessibility (semantic HTML, keyboard navigation, screen reader support, color contrast) and compatibility (supporting a matrix of browsers, devices, and assistive technology) as nonfunctional requirements to clarify early in a design. Explain how to scope 'how accessible/compatible does this need to be' in an interview, and the trade-offs of graceful degradation versus progressive enhancement. Give a short example of how an accessibility requirement changes a component's design.",
  },
  {
    track: 'concept',
    module: 'Nonfunctional Requirements',
    moduleOrder: 2,
    order: 3,
    slug: 'localization-and-internationalization',
    title: 'Localization & Internationalization (i18n)',
    summary: 'Distinguishes internationalization from localization and covers the frontend concerns each raises.',
    tags: ['nonfunctional', 'i18n'],
    estMinutes: 9,
    brief:
      'Explain the difference between internationalization (i18n — making the app localizable) and localization (l10n — providing the actual translations and locale data), and why this is a nonfunctional requirement to clarify early. Cover practical concerns: text expansion in translated strings, right-to-left layouts, date/number/currency formatting, and loading locale bundles without hurting performance. Note how i18n needs affect component and data design choices made later in the course.',
  },
  {
    track: 'concept',
    module: 'Nonfunctional Requirements',
    moduleOrder: 2,
    order: 4,
    slug: 'maintainability-as-a-requirement',
    title: 'Maintainability as a Requirement',
    summary: 'Frames maintainability as a nonfunctional requirement covering code health, testability, and multi-team ownership.',
    tags: ['nonfunctional', 'maintainability'],
    estMinutes: 8,
    brief:
      'Explain maintainability as a nonfunctional requirement covering code health, testability, and the ability for multiple teams to evolve the frontend safely over time. Cover the signals interviewers listen for — modularity, clear ownership boundaries, a testing strategy — and how architecture choices covered later (Design Patterns & Architectures) support or hurt maintainability. Give an example of a design decision that trades short-term speed for long-term maintainability.',
  },

  // --- Module 3: Fundamentals (moduleOrder 3) — 4 lessons ---
  {
    track: 'concept',
    module: 'Fundamentals',
    moduleOrder: 3,
    order: 1,
    slug: 'the-browser-rendering-pipeline',
    title: 'The Browser Rendering Pipeline',
    summary: 'Walks through how a browser turns HTML, CSS, and JS into pixels on screen.',
    tags: ['fundamentals', 'rendering'],
    estMinutes: 12,
    brief:
      'Walk through how a browser turns HTML/CSS/JS into pixels: parsing HTML into the DOM, parsing CSS into the CSSOM, constructing the render tree, layout (reflow), paint, and compositing. Explain what triggers each stage to re-run, and why understanding this pipeline matters for diagnosing jank and designing performant UI. Include a diagram of the pipeline stages in order.',
  },
  {
    track: 'concept',
    module: 'Fundamentals',
    moduleOrder: 3,
    order: 2,
    slug: 'css-layout-and-positioning',
    title: 'CSS Layout & Positioning',
    summary: 'Covers the core CSS layout models and positioning schemes relevant to system-design trade-offs.',
    tags: ['fundamentals', 'css'],
    estMinutes: 10,
    brief:
      'Cover the core CSS layout models relevant to system design discussions — normal flow, flexbox, grid, and positioning (relative/absolute/fixed/sticky) — including how each interacts with the rendering pipeline (a layout-triggering change versus a compositing-only change). Explain when to reach for flexbox versus grid for common UI patterns, and how layout choices affect reflow cost. Keep CSS mechanics light; focus on the system-design-relevant trade-offs.',
  },
  {
    track: 'concept',
    module: 'Fundamentals',
    moduleOrder: 3,
    order: 3,
    slug: 'dom-manipulation',
    title: 'DOM Manipulation',
    summary: 'Explains the cost of direct DOM manipulation and how frameworks batch updates to mitigate it.',
    tags: ['fundamentals', 'dom'],
    estMinutes: 9,
    brief:
      "Explain direct DOM manipulation costs — reflow/repaint triggers, and layout thrashing from interleaving layout reads and writes in a loop — and how virtual-DOM/reactive frameworks batch updates to mitigate this. Cover techniques like batching reads and writes together, using a DocumentFragment for offscreen construction, and why frameworks' reconciliation models exist. Include a small before/after example of layout thrashing and its fix.",
  },
  {
    track: 'concept',
    module: 'Fundamentals',
    moduleOrder: 3,
    order: 4,
    slug: 'state-management-fundamentals',
    title: 'State Management Fundamentals',
    summary: 'Introduces the categories of frontend state and why conflating them causes complexity.',
    tags: ['fundamentals', 'state'],
    estMinutes: 11,
    brief:
      "Introduce categories of frontend state — local component state, shared/global UI state, server/remote cache state, and URL state — and why conflating them causes complexity. Explain the trade-offs between prop drilling, context, and dedicated state libraries, and when a server-state caching tool is more appropriate than general-purpose state management. This lesson sets up the deeper 'state architecture patterns' lesson in the Design Patterns & Architectures module.",
  },

  // --- Module 4: Performance & Optimization (moduleOrder 4) — 9 lessons ---
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 1,
    slug: 'critical-rendering-path',
    title: 'The Critical Rendering Path',
    summary: 'Defines the critical rendering path and the techniques used to shorten it.',
    tags: ['performance', 'rendering'],
    estMinutes: 11,
    brief:
      'Define the critical rendering path as the sequence of steps a browser must complete to render the first meaningful pixels, and how render-blocking resources (CSS, synchronous JS) delay it. Cover techniques to shorten it: minimizing critical CSS, deferring non-critical JS, preloading key resources, and font-loading strategies. Include a diagram of a page-load timeline that highlights the critical path.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 2,
    slug: 'asset-loading-strategies',
    title: 'Asset Loading Strategies',
    summary: 'Covers resource hints and loading order strategies for JS, CSS, and font assets.',
    tags: ['performance', 'loading'],
    estMinutes: 9,
    brief:
      'Cover strategies for loading JS/CSS/font assets efficiently: preload/prefetch/preconnect resource hints, priority hints, async/defer script loading, and bundling/minification trade-offs. Explain how to decide what to eagerly load versus defer, based on above-the-fold needs. Give a concrete example of ordering asset loads for a content-heavy page.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 3,
    slug: 'code-splitting',
    title: 'Code Splitting',
    summary: 'Explains route- and component-based code splitting and how to choose split boundaries.',
    tags: ['performance', 'bundling'],
    estMinutes: 9,
    brief:
      'Explain route-based and component-based code splitting, how bundlers implement it via dynamic `import()`, and the trade-off between fewer large bundles versus many small requests (including HTTP/2 multiplexing considerations). Cover how to decide split boundaries for a large app and pitfalls like a request waterfall from nested lazy imports.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 4,
    slug: 'lazy-loading',
    title: 'Lazy Loading',
    summary: 'Covers lazy loading of images, components, and below-the-fold content, and its trade-offs.',
    tags: ['performance', 'loading'],
    estMinutes: 8,
    brief:
      'Cover lazy loading of images, offscreen components, and below-the-fold content using `IntersectionObserver` and native `loading="lazy"`, and how it interacts with code splitting. Discuss trade-offs: layout-shift risk when lazy-loaded content lacks reserved space, and cases where lazy loading hurts perceived performance (e.g. lazy-loading above-the-fold content). Give a short example of lazy-loading a comment section on a feed.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 5,
    slug: 'caching-strategies',
    title: 'Caching Strategies',
    summary: 'Surveys the layers of frontend caching and how to reason about invalidation.',
    tags: ['performance', 'caching'],
    estMinutes: 11,
    brief:
      'Cover the layers of frontend caching: HTTP caching (`Cache-Control`, `ETag`), CDN caching, service-worker/offline caching, and in-app data caching (e.g. caching API responses in memory or IndexedDB). Explain cache invalidation strategies — cache-busting via hashed filenames, stale-while-revalidate — and how to reason about staleness-versus-freshness trade-offs when presenting a caching strategy in an interview.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 6,
    slug: 'image-and-media-optimization',
    title: 'Image & Media Optimization',
    summary: 'Covers responsive images, modern formats, and video-specific optimization concerns.',
    tags: ['performance', 'media'],
    estMinutes: 9,
    brief:
      'Cover responsive images (`srcset`/`sizes`), modern formats (WebP/AVIF), lazy-loading media, and video-specific concerns (adaptive bitrate, poster frames). Explain how to reason about image optimization trade-offs — quality versus size versus decode cost — and CDN-based image transformation as a design lever. Reference how this connects to the later Video Streaming Platform case study.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 7,
    slug: 'rendering-strategies-csr-ssr-ssg-isr',
    title: 'Rendering Strategies: CSR, SSR, SSG, and ISR',
    summary: 'Compares client- and server-driven rendering strategies and their trade-offs.',
    tags: ['performance', 'rendering', 'architecture'],
    estMinutes: 13,
    brief:
      'Compare client-side rendering, server-side rendering, static site generation, and incremental static regeneration: what each optimizes for (time-to-first-byte, interactivity, SEO, content freshness) and their trade-offs. Cover hydration cost and patterns that reduce it (partial/progressive/islands hydration). Include a diagram comparing the request/render timelines of CSR versus SSR versus SSG, and give guidance on choosing a strategy based on content type and update frequency.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 8,
    slug: 'core-web-vitals',
    title: 'Core Web Vitals',
    summary: 'Explains LCP, INP, and CLS precisely, including causes and fixes for poor scores.',
    tags: ['performance', 'metrics'],
    estMinutes: 10,
    brief:
      'Explain the Core Web Vitals metrics — LCP, INP, and CLS — precisely: what each measures, common causes of a poor score, and concrete fixes for each. Cover how to instrument and monitor these metrics (real-user monitoring versus lab data) and how to bring them up naturally when discussing performance trade-offs in an interview.',
  },
  {
    track: 'concept',
    module: 'Performance & Optimization',
    moduleOrder: 4,
    order: 9,
    slug: 'network-optimization',
    title: 'Network Optimization',
    summary: 'Covers network-layer optimizations and designing for flaky or slow connections.',
    tags: ['performance', 'networking'],
    estMinutes: 10,
    brief:
      'Cover network-layer optimizations relevant to frontend design: HTTP/2 and HTTP/3 benefits (multiplexing, header compression), connection reuse, compression (gzip/brotli), reducing request count and payload size, and handling flaky or slow networks (retry with backoff, optimistic UI, offline-first patterns). Tie this back to how network conditions should shape the architecture decisions discussed throughout the course.',
  },

  // --- Module 5: API Architecture Styles, Protocols & Data Formats (moduleOrder 5) — 3 lessons ---
  {
    track: 'concept',
    module: 'API Architecture Styles, Protocols & Data Formats',
    moduleOrder: 5,
    order: 1,
    slug: 'client-server-communication-models',
    title: 'Client–Server Communication Models',
    summary: 'Compares polling, long-polling, and persistent-connection models for client–server communication.',
    tags: ['api', 'architecture'],
    estMinutes: 9,
    brief:
      'Cover the fundamental communication models a frontend uses to talk to backends: request/response polling, long-polling, and persistent connections (WebSocket/SSE), and when each is appropriate based on update frequency and directionality of data. Include a diagram contrasting the message flow of polling versus long-polling versus WebSocket.',
  },
  {
    track: 'concept',
    module: 'API Architecture Styles, Protocols & Data Formats',
    moduleOrder: 5,
    order: 2,
    slug: 'api-styles-rest-graphql-grpc-websocket-sse',
    title: 'API Styles: REST, GraphQL, gRPC, WebSocket, and SSE',
    summary: 'Compares the major API styles a frontend integrates with and when to choose each.',
    tags: ['api', 'protocols'],
    estMinutes: 13,
    brief:
      'Compare REST, GraphQL, gRPC-web, WebSocket, and Server-Sent Events as API styles available to a frontend: their strengths, weaknesses, typical use cases, and how to justify picking one in an interview — e.g. GraphQL for flexible client-driven queries that reduce over/under-fetching, WebSocket for bidirectional real-time needs, SSE for one-way server push. Include a short comparison table.',
  },
  {
    track: 'concept',
    module: 'API Architecture Styles, Protocols & Data Formats',
    moduleOrder: 5,
    order: 3,
    slug: 'data-formats-and-transport',
    title: 'Data Formats & Transport',
    summary: 'Covers JSON versus binary data formats and when each trade-off matters.',
    tags: ['api', 'data-formats'],
    estMinutes: 8,
    brief:
      "Cover common data formats a frontend receives — JSON, Protocol Buffers, and other binary formats — and transport considerations like payload size, parsing cost, and schema evolution. Explain the trade-off between JSON's simplicity/debuggability and binary formats' compactness/speed, and when each matters (e.g. high-frequency real-time updates versus occasional API calls).",
  },

  // --- Module 6: Design Patterns & Architectures (moduleOrder 6) — 6 lessons ---
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 1,
    slug: 'component-design-patterns',
    title: 'Component Design Patterns',
    summary: 'Covers reusable component patterns and how they affect reusability and testability at scale.',
    tags: ['patterns', 'components'],
    estMinutes: 11,
    brief:
      'Cover reusable component patterns relevant to system design discussions: container/presentational separation, compound components, composition via hooks or render-prop-style APIs, and controlled versus uncontrolled components. Explain how choosing the right pattern affects reusability and testability at scale, with a short concrete example.',
  },
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 2,
    slug: 'micro-frontends',
    title: 'Micro-Frontends',
    summary: 'Explains the micro-frontend architecture, composition approaches, and its trade-offs.',
    tags: ['patterns', 'architecture', 'micro-frontends'],
    estMinutes: 12,
    brief:
      'Explain the micro-frontend architecture: splitting a large frontend into independently deployable pieces owned by separate teams, common composition approaches (build-time integration, runtime integration via iframes or client-side composition, edge-side includes), and the trade-offs — team autonomy versus consistency, bundle duplication, cross-app communication. Include a diagram of a micro-frontend composition.',
  },
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 3,
    slug: 'module-federation',
    title: 'Module Federation',
    summary: 'Explains Module Federation as a runtime mechanism for composing micro-frontends.',
    tags: ['patterns', 'architecture', 'tooling'],
    estMinutes: 10,
    brief:
      'Explain Module Federation (as implemented by tools like webpack or Vite) as a concrete mechanism for implementing micro-frontends: sharing dependencies at runtime, exposing and consuming remote modules, and versioning pitfalls such as shared-dependency mismatches. Contrast it with simpler composition approaches (iframes, single-spa-style routing) and when the added complexity is worth it.',
  },
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 4,
    slug: 'monorepo-vs-polyrepo',
    title: 'Monorepo vs Polyrepo',
    summary: 'Compares organizing a frontend codebase as a monorepo versus multiple repositories.',
    tags: ['patterns', 'tooling', 'org'],
    estMinutes: 9,
    brief:
      'Compare monorepo and polyrepo approaches to organizing frontend codebases: build tooling implications, code sharing, versioning, and how each interacts with team ownership boundaries and micro-frontend architectures. Give guidance on which to recommend based on team size and coupling between projects.',
  },
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 5,
    slug: 'rendering-architectures',
    title: 'Rendering Architectures',
    summary: 'Covers architectural patterns that combine rendering strategies to reduce hydration cost.',
    tags: ['patterns', 'architecture', 'rendering'],
    estMinutes: 11,
    brief:
      "Go beyond the CSR/SSR/SSG comparison in the Performance module to cover architectural patterns for combining them: islands architecture, streaming SSR, resumability, and edge rendering. Explain how these architectures aim to reduce hydration cost and time-to-interactive while keeping good SEO/first-paint characteristics, referencing this course app's own islands approach as one concrete real example.",
  },
  {
    track: 'concept',
    module: 'Design Patterns & Architectures',
    moduleOrder: 6,
    order: 6,
    slug: 'state-architecture-patterns',
    title: 'State Architecture Patterns',
    summary: 'Covers architectural patterns for state at scale, building on the earlier fundamentals lesson.',
    tags: ['patterns', 'state', 'architecture'],
    estMinutes: 11,
    brief:
      'Build on the earlier State Management Fundamentals lesson to cover architectural patterns for state at scale: normalized client caches, event-driven/unidirectional data flow, and server-state synchronization patterns such as optimistic updates with cache invalidation on mutation. Explain how to choose a state architecture based on how shared and how volatile the data is.',
  },

  // --- Module 7: Security (moduleOrder 7) — 2 lessons ---
  {
    track: 'concept',
    module: 'Security',
    moduleOrder: 7,
    order: 1,
    slug: 'authentication-and-authorization-on-the-frontend',
    title: 'Authentication & Authorization on the Frontend',
    summary: "Covers the frontend's role in auth flows and why frontend authorization is UX-only, never a security boundary.",
    tags: ['security', 'auth'],
    estMinutes: 11,
    brief:
      "Cover how frontends participate in authentication (session cookies versus tokens, OAuth/OIDC redirect flows, silent refresh) and authorization (hiding or showing UI based on roles/permissions, and why frontend authorization is UX-only, never a real security boundary). Explain common pitfalls like storing tokens insecurely and trusting client-side role checks as if they were enforcement.",
  },
  {
    track: 'concept',
    module: 'Security',
    moduleOrder: 7,
    order: 2,
    slug: 'secure-data-practices',
    title: 'Secure Data Practices: XSS, CSRF, CSP, and Storage',
    summary: 'Covers the main frontend security threats and mitigations, including safe client-side storage choices.',
    tags: ['security', 'xss', 'csrf'],
    estMinutes: 12,
    brief:
      'Cover the main frontend security threats and mitigations: XSS (sanitization, avoiding unsafe HTML-injection sinks), CSRF (`SameSite` cookies, anti-CSRF tokens), Content-Security-Policy as defense in depth, and secure choices for client-side storage — cookies versus `localStorage` versus `sessionStorage` trade-offs for sensitive data. Give a short example of an XSS vector and its fix.',
  },

  // --- Module 8: Design Framework (moduleOrder 8) — 1 lesson ---
  {
    track: 'concept',
    module: 'Design Framework',
    moduleOrder: 8,
    order: 1,
    slug: 'a-framework-for-frontend-system-design-interviews',
    title: 'A Framework for Frontend System Design Interviews',
    summary: 'Introduces an original six-step framework for structuring any frontend system design interview answer.',
    tags: ['framework', 'interview-prep'],
    estMinutes: 14,
    brief:
      "Introduce an original, structured six-step approach — this course's own framework, not a reproduction of any commercial course's named framework — for tackling any frontend system design interview question end to end: (1) clarify requirements and scope, (2) estimate scale and data, (3) break the problem into components, (4) design the API and data flow, (5) choose the rendering and state architecture, (6) evaluate performance and trade-offs. Explain what to say and cover in each step and roughly how much time to spend on it in a 35–45 minute interview, then walk through applying all six steps briefly to one small example (e.g. a 'like button with a live count') so readers see the framework in action before using it on the five case studies in the Interview Prep track.",
  },

  // --- Module 9: Conclusion (moduleOrder 9) — 1 lesson ---
  {
    track: 'concept',
    module: 'Conclusion',
    moduleOrder: 9,
    order: 1,
    slug: 'wrapping-up-frontend-system-design',
    title: 'Wrapping Up Frontend System Design',
    summary: 'Consolidates the whole course into a mental model and a checklist for approaching any frontend system design problem.',
    tags: ['conclusion', 'interview-prep', 'review'],
    estMinutes: 8,
    brief:
      'Close out the concepts track by tying the whole course together. Recap the throughline: nonfunctional requirements drive architecture; the fundamentals (rendering, state, DOM) underpin every decision; performance, API design, patterns, and security are the levers you trade off; and the six-step framework is how you apply all of it under interview time pressure. Give the reader a compact, durable mental model and a final pre-interview checklist (clarify requirements, estimate scale, decompose components, design data flow and API, pick rendering/state architecture, address performance/accessibility/security, state trade-offs). Point forward to the Interview Prep case studies as where to practice. Keep it motivating and concise.',
  },

  // --- Module 10: Bonus Lessons (moduleOrder 10) — 5 lessons ---
  {
    track: 'concept',
    module: 'Bonus Lessons',
    moduleOrder: 10,
    order: 1,
    slug: 'real-time-data-and-synchronization',
    title: 'Real-Time Data and Synchronization',
    summary: 'How frontends keep data fresh and consistent in real time using polling, SSE, WebSockets, and reconciliation strategies.',
    tags: ['real-time', 'websocket', 'sync', 'bonus'],
    estMinutes: 12,
    brief:
      'Explain how a frontend keeps data fresh and consistent in real time. Compare the delivery mechanisms — short/long polling, Server-Sent Events, and WebSockets — and when each fits. Cover the hard part: reconciling live server updates with local optimistic state (conflict handling, last-write-wins vs. merge, ordering/sequence numbers, dedup), handling reconnection and backfill after a dropped connection, and presence/typing-style ephemeral state. Use a small collaborative example (e.g. a live comment thread) and note the performance/battery cost of always-on connections.',
  },
  {
    track: 'concept',
    module: 'Bonus Lessons',
    moduleOrder: 10,
    order: 2,
    slug: 'offline-first-and-pwa-architecture',
    title: 'Offline-First and PWA Architecture',
    summary: 'Designing frontends that work offline using service workers, caching strategies, and background sync.',
    tags: ['pwa', 'offline', 'service-worker', 'bonus'],
    estMinutes: 12,
    brief:
      'Describe how to design a frontend that works offline or on flaky networks. Explain the service worker lifecycle (install/activate/fetch) and the main caching strategies (cache-first, network-first, stale-while-revalidate) and when to use each. Cover the app shell model, storing data locally (IndexedDB) for offline reads, queuing writes with background sync for later replay, and the UX of communicating offline/stale state to users. Note the pitfalls: cache invalidation, versioning the service worker, and avoiding serving stale critical assets.',
  },
  {
    track: 'concept',
    module: 'Bonus Lessons',
    moduleOrder: 10,
    order: 3,
    slug: 'frontend-observability-and-monitoring',
    title: 'Frontend Observability and Monitoring',
    summary: 'Measuring real-user performance, errors, and behavior in production with RUM, error tracking, and logging.',
    tags: ['observability', 'monitoring', 'rum', 'bonus'],
    estMinutes: 11,
    brief:
      'Explain how to know what is actually happening in a shipped frontend. Cover Real User Monitoring (collecting Core Web Vitals and custom timings from real sessions), client-side error tracking (capturing unhandled errors/promise rejections, source maps for readable stack traces, grouping and alerting), structured event logging/analytics, and distributed tracing that stitches a user action to backend spans. Discuss sampling to control volume/cost, protecting user privacy/PII in telemetry, and turning these signals into SLOs and alerts. Use a concrete example of diagnosing a latency regression from RUM data.',
  },
  {
    track: 'concept',
    module: 'Bonus Lessons',
    moduleOrder: 10,
    order: 4,
    slug: 'feature-flags-and-progressive-delivery',
    title: 'Feature Flags and Progressive Delivery',
    summary: 'Shipping safely with feature flags, canary releases, A/B experiments, and instant rollback.',
    tags: ['feature-flags', 'experimentation', 'delivery', 'bonus'],
    estMinutes: 11,
    brief:
      'Explain how modern frontends decouple deploy from release using feature flags. Cover flag types (release, ops kill-switches, experiment, permission), how flags are evaluated on the client vs. server and the flash-of-wrong-variant problem, progressive rollout patterns (canary, percentage ramps, ring-based rollout), running A/B experiments and reading results without breaking metrics, and the safety win of instant rollback via a flag. Address the cost side: flag debt/cleanup, testing multiple flag combinations, and consistent bucketing of a user across sessions.',
  },
  {
    track: 'concept',
    module: 'Bonus Lessons',
    moduleOrder: 10,
    order: 5,
    slug: 'design-systems-and-component-libraries-at-scale',
    title: 'Design Systems and Component Libraries at Scale',
    summary: 'Building a shared design system and component library that keeps large frontends consistent and maintainable.',
    tags: ['design-system', 'components', 'maintainability', 'bonus'],
    estMinutes: 12,
    brief:
      'Explain why large organizations build a design system and how it is architected. Cover design tokens as the single source of truth for visual decisions, layered component architecture (primitives → composed components → patterns), theming and accessibility baked into the library, versioning and distribution (semver, a monorepo or published packages) and how breaking changes are rolled out to many consuming apps, documentation (living component docs/storybook-style catalogs), and governance (contribution model, avoiding fragmentation). Connect it back to maintainability and consistency, and note the trade-off between central control and team autonomy.',
  },

  // ===========================================================================
  // INTERVIEW TRACK — 20 lessons across 5 case studies (4 lessons each)
  // ===========================================================================

  // --- Case study 1: Newsfeed (moduleOrder 1) ---
  {
    track: 'interview',
    module: 'Case Study: Newsfeed',
    moduleOrder: 1,
    order: 1,
    slug: 'newsfeed-requirements-and-scope',
    title: 'Newsfeed: Requirements & Scope',
    summary: 'Scopes a social newsfeed feature end to end: functional requirements, NFRs, and clarifying questions.',
    tags: ['case-study', 'newsfeed', 'requirements'],
    estMinutes: 12,
    brief:
      "Walk through scoping a 'design a social media newsfeed' interview question: functional requirements (an infinite-scrolling feed of posts with text/image/video, likes and comments, near-real-time updates) and nonfunctional requirements (performance on slow networks, huge post volume, freshness-versus-consistency trade-offs). List the clarifying questions a strong candidate asks — single chronological feed or algorithmic ranking? real-time updates required? media-heavy or text-first? — and how the answers change the design.",
  },
  {
    track: 'interview',
    module: 'Case Study: Newsfeed',
    moduleOrder: 1,
    order: 2,
    slug: 'newsfeed-high-level-architecture',
    title: 'Newsfeed: High-Level Architecture',
    summary: 'Presents a component and data-flow architecture for a paginated, media-rich newsfeed.',
    tags: ['case-study', 'newsfeed', 'architecture'],
    estMinutes: 13,
    brief:
      'Present a high-level component and data-flow architecture for the newsfeed: a feed component tree (feed list, post card, media renderer), an API layer with pagination, and a client-side cache/store for feed items. Include a diagram of the major components and how data flows from API to render. Cover the rendering-strategy choice — e.g. SSR for the initial feed page, CSR for subsequent pagination — and why.',
  },
  {
    track: 'interview',
    module: 'Case Study: Newsfeed',
    moduleOrder: 1,
    order: 3,
    slug: 'newsfeed-deep-dives',
    title: 'Newsfeed: Deep Dives — Data Flow, Performance & Edge Cases',
    summary: 'Goes deep on pagination, virtualization, optimistic updates, and edge cases for a newsfeed.',
    tags: ['case-study', 'newsfeed', 'deep-dive'],
    estMinutes: 14,
    brief:
      'Go deep on the trickiest parts of the newsfeed design: pagination strategy (cursor-based versus offset) and how it interacts with new-posts-inserted-at-top edge cases, virtualizing a long feed list for performance, optimistic UI for likes/comments with rollback on failure, and an image/video loading strategy for a media-heavy feed (referencing the Image & Media Optimization concept lesson). Cover two or three edge cases: duplicate posts after a pagination cursor shifts, a post being deleted while in view, and slow or offline network handling.',
  },
  {
    track: 'interview',
    module: 'Case Study: Newsfeed',
    moduleOrder: 1,
    order: 4,
    slug: 'newsfeed-mock-interview',
    title: 'Newsfeed: Mock Interview',
    summary: 'A timed mock-interview prompt and rubric for designing a social media newsfeed from scratch.',
    tags: ['case-study', 'newsfeed', 'mock-interview'],
    estMinutes: 20,
    brief:
      'Provide a full mock-interview prompt asking the reader to design a social media newsfeed from scratch in about 35–40 minutes, covering requirements, architecture, data flow, and performance. This lesson uses the `<MockInterview>` component with a `prompt` string and a `rubric` array of five to six points covering: clarifying requirements first, a sound component/data architecture, a pagination and virtualization strategy, optimistic updates with error handling, and performance/accessibility trade-offs — each rubric point paired with a short explanation of what a strong answer includes.',
  },

  // --- Case study 2: Video Streaming Platform (moduleOrder 2) ---
  {
    track: 'interview',
    module: 'Case Study: Video Streaming Platform',
    moduleOrder: 2,
    order: 1,
    slug: 'video-streaming-requirements-and-scope',
    title: 'Video Streaming Platform: Requirements & Scope',
    summary: 'Scopes a video streaming platform frontend: playback, adaptive quality, and clarifying questions.',
    tags: ['case-study', 'video-streaming', 'requirements'],
    estMinutes: 12,
    brief:
      "Scope a 'design a video streaming platform frontend' question (on-demand or live video, e.g. a YouTube/Netflix-style product): functional requirements (video playback, adaptive quality, seek/scrub, a recommendations rail, comments) and nonfunctional requirements (startup latency, smooth playback on variable networks, cross-device support). List clarifying questions — live versus on-demand? DRM/premium content in scope? offline downloads? — and how they shift scope.",
  },
  {
    track: 'interview',
    module: 'Case Study: Video Streaming Platform',
    moduleOrder: 2,
    order: 2,
    slug: 'video-streaming-high-level-architecture',
    title: 'Video Streaming Platform: High-Level Architecture',
    summary: 'Presents a player-centric architecture including adaptive streaming and metadata layers.',
    tags: ['case-study', 'video-streaming', 'architecture'],
    estMinutes: 13,
    brief:
      'Present the high-level architecture: a video player component wrapping a media element with custom controls, an adaptive bitrate streaming approach (HLS/DASH concepts at the client level), a metadata/recommendations API layer, and a client cache for video metadata and playback position. Include a diagram of the player pipeline from manifest fetch to rendered frames, and discuss the rendering strategy for the surrounding page (SSR for SEO on watch pages, CSR for the player itself).',
  },
  {
    track: 'interview',
    module: 'Case Study: Video Streaming Platform',
    moduleOrder: 2,
    order: 3,
    slug: 'video-streaming-deep-dives',
    title: 'Video Streaming Platform: Deep Dives — Data Flow, Performance & Edge Cases',
    summary: 'Goes deep on adaptive bitrate logic, buffering strategy, and cross-device playback continuity.',
    tags: ['case-study', 'video-streaming', 'deep-dive'],
    estMinutes: 14,
    brief:
      'Go deep on adaptive bitrate switching logic (how the client picks a quality level based on measured bandwidth and buffer health), a buffering/preloading strategy for smooth playback, and resuming playback position across devices. Cover edge cases: a network drop mid-stream and recovery, switching quality without a visible stutter, and keeping captions/subtitles synced under variable-latency streams. Reference the earlier Image & Media Optimization and Network Optimization concept lessons.',
  },
  {
    track: 'interview',
    module: 'Case Study: Video Streaming Platform',
    moduleOrder: 2,
    order: 4,
    slug: 'video-streaming-mock-interview',
    title: 'Video Streaming Platform: Mock Interview',
    summary: 'A timed mock-interview prompt and rubric for designing a video streaming platform frontend.',
    tags: ['case-study', 'video-streaming', 'mock-interview'],
    estMinutes: 20,
    brief:
      'Provide a full mock-interview prompt asking the reader to design the frontend for a video streaming platform, covering the player architecture, adaptive streaming strategy, and performance under poor networks. Include a `<MockInterview>` rubric of five to six points: requirements clarification, player/component architecture, adaptive bitrate and buffering strategy, graceful handling of network issues, and cross-device considerations — each with a short explanation.',
  },

  // --- Case study 3: Chat Application (moduleOrder 3) ---
  {
    track: 'interview',
    module: 'Case Study: Chat Application',
    moduleOrder: 3,
    order: 1,
    slug: 'chat-app-requirements-and-scope',
    title: 'Chat Application: Requirements & Scope',
    summary: 'Scopes a real-time chat application: messaging, delivery guarantees, and clarifying questions.',
    tags: ['case-study', 'chat-app', 'requirements'],
    estMinutes: 12,
    brief:
      "Scope a 'design a real-time chat application' question (a messaging app): functional requirements (1:1 and group messaging, delivery/read receipts, typing indicators, media attachments) and nonfunctional requirements (real-time delivery latency, offline message queuing, message ordering guarantees). List clarifying questions — group size limits? end-to-end encryption in scope? multi-device sync? — and their impact on the design.",
  },
  {
    track: 'interview',
    module: 'Case Study: Chat Application',
    moduleOrder: 3,
    order: 2,
    slug: 'chat-app-high-level-architecture',
    title: 'Chat Application: High-Level Architecture',
    summary: 'Presents an architecture centered on a persistent connection with a local message store.',
    tags: ['case-study', 'chat-app', 'architecture'],
    estMinutes: 13,
    brief:
      'Present a high-level architecture centered on a persistent connection (WebSocket) for real-time messages, a local message store/cache for conversation history, and a component tree (conversation list, message thread, composer). Include a diagram showing the WebSocket connection alongside a REST/GraphQL API used for history and search, and discuss the reconnection strategy and connection-state UI.',
  },
  {
    track: 'interview',
    module: 'Case Study: Chat Application',
    moduleOrder: 3,
    order: 3,
    slug: 'chat-app-deep-dives',
    title: 'Chat Application: Deep Dives — Data Flow, Performance & Edge Cases',
    summary: 'Goes deep on message ordering, deduplication, offline queuing, and long-thread performance.',
    tags: ['case-study', 'chat-app', 'deep-dive'],
    estMinutes: 14,
    brief:
      'Go deep on message ordering and deduplication (client-generated message IDs, server-assigned sequence numbers, reconciling optimistic sends with server acknowledgements), offline queuing and retry on reconnect, and virtualizing very long message threads for performance. Cover edge cases: out-of-order delivery, duplicate delivery on reconnect, and syncing read/typing state across multiple open devices.',
  },
  {
    track: 'interview',
    module: 'Case Study: Chat Application',
    moduleOrder: 3,
    order: 4,
    slug: 'chat-app-mock-interview',
    title: 'Chat Application: Mock Interview',
    summary: 'A timed mock-interview prompt and rubric for designing a real-time chat application.',
    tags: ['case-study', 'chat-app', 'mock-interview'],
    estMinutes: 20,
    brief:
      'Provide a full mock-interview prompt asking the reader to design the frontend for a real-time chat application, covering connection strategy, message ordering, and offline handling. Include a `<MockInterview>` rubric of five to six points: requirements clarification, real-time connection and reconnection strategy, message ordering/deduplication approach, offline/optimistic-send handling, and performance of long threads — each with a short explanation.',
  },

  // --- Case study 4: Ride-Hailing App (moduleOrder 4) ---
  {
    track: 'interview',
    module: 'Case Study: Ride-Hailing App',
    moduleOrder: 4,
    order: 1,
    slug: 'ride-hailing-requirements-and-scope',
    title: 'Ride-Hailing App: Requirements & Scope',
    summary: 'Scopes a ride-hailing app frontend: map-based matching, live tracking, and clarifying questions.',
    tags: ['case-study', 'ride-hailing', 'requirements'],
    estMinutes: 12,
    brief:
      "Scope a 'design a ride-hailing app frontend' question (an Uber/Lyft-style product): functional requirements (a map-based rider/driver matching UI, live location tracking, fare estimation, trip state transitions) and nonfunctional requirements (low-latency location updates, resilience to GPS/network flakiness, battery and network efficiency on mobile). List clarifying questions — rider app, driver app, or both? real-time ETA precision needed? multiple ride types? — and their scope impact.",
  },
  {
    track: 'interview',
    module: 'Case Study: Ride-Hailing App',
    moduleOrder: 4,
    order: 2,
    slug: 'ride-hailing-high-level-architecture',
    title: 'Ride-Hailing App: High-Level Architecture',
    summary: 'Presents an architecture built around a live-location pipeline and a trip-state machine.',
    tags: ['case-study', 'ride-hailing', 'architecture'],
    estMinutes: 13,
    brief:
      'Present a high-level architecture: a map rendering layer (third-party map SDK integration concerns), a live-location data pipeline (periodic updates or a streaming connection), a trip-state machine driving the UI (requesting to matched to en route to in progress to completed), and an API layer for trip and fare data. Include a diagram of the trip-state machine and how location updates flow into the map component.',
  },
  {
    track: 'interview',
    module: 'Case Study: Ride-Hailing App',
    moduleOrder: 4,
    order: 3,
    slug: 'ride-hailing-deep-dives',
    title: 'Ride-Hailing App: Deep Dives — Data Flow, Performance & Edge Cases',
    summary: 'Goes deep on live-location smoothing, state-machine resilience, and map rendering performance.',
    tags: ['case-study', 'ride-hailing', 'deep-dive'],
    estMinutes: 14,
    brief:
      'Go deep on efficient live-location updates (throttling/debouncing GPS updates and interpolating driver position between updates for smooth map movement), handling the trip state machine robustly across reconnects, and rendering performance for combined map-plus-list views. Cover edge cases: a driver app backgrounded mid-trip, GPS signal loss, and a rider cancelling mid-match.',
  },
  {
    track: 'interview',
    module: 'Case Study: Ride-Hailing App',
    moduleOrder: 4,
    order: 4,
    slug: 'ride-hailing-mock-interview',
    title: 'Ride-Hailing App: Mock Interview',
    summary: 'A timed mock-interview prompt and rubric for designing a ride-hailing app frontend.',
    tags: ['case-study', 'ride-hailing', 'mock-interview'],
    estMinutes: 20,
    brief:
      'Provide a full mock-interview prompt asking the reader to design the frontend for a ride-hailing app, covering the trip state machine, live location updates, and resilience to flaky mobile networks. Include a `<MockInterview>` rubric of five to six points: requirements clarification, state-machine-driven architecture, live-location update strategy and smoothing, resilience to network/GPS issues, and performance on mobile — each with a short explanation.',
  },

  // --- Case study 5: Calendar Application (moduleOrder 5) ---
  {
    track: 'interview',
    module: 'Case Study: Calendar Application',
    moduleOrder: 5,
    order: 1,
    slug: 'calendar-app-requirements-and-scope',
    title: 'Calendar Application: Requirements & Scope',
    summary: 'Scopes a calendar application frontend: views, recurrence, timezone handling, and clarifying questions.',
    tags: ['case-study', 'calendar-app', 'requirements'],
    estMinutes: 12,
    brief:
      "Scope a 'design a calendar application frontend' question (a Google Calendar-style product): functional requirements (day/week/month views, event CRUD, recurring events, multi-timezone display, shared/overlapping calendars) and nonfunctional requirements (fast view switching, correctness of recurrence and timezone math, offline editing). List clarifying questions — single user or shared calendars? recurring events in scope? which views are required? — and their scope impact.",
  },
  {
    track: 'interview',
    module: 'Case Study: Calendar Application',
    moduleOrder: 5,
    order: 2,
    slug: 'calendar-app-high-level-architecture',
    title: 'Calendar Application: High-Level Architecture',
    summary: 'Presents an architecture centered on date-range queries and recurring-event expansion.',
    tags: ['case-study', 'calendar-app', 'architecture'],
    estMinutes: 13,
    brief:
      'Present a high-level architecture: a date/grid rendering layer for day/week/month views, an event data layer that expands recurring events into concrete instances for a visible date range, and a component tree (calendar grid, event chip, event editor modal). Include a diagram of how a date-range query flows from the view into expanded event instances for rendering, and discuss client-side caching of fetched date ranges.',
  },
  {
    track: 'interview',
    module: 'Case Study: Calendar Application',
    moduleOrder: 5,
    order: 3,
    slug: 'calendar-app-deep-dives',
    title: 'Calendar Application: Deep Dives — Data Flow, Performance & Edge Cases',
    summary: 'Goes deep on recurring-event expansion, timezone/DST correctness, and dense-view rendering performance.',
    tags: ['case-study', 'calendar-app', 'deep-dive'],
    estMinutes: 14,
    brief:
      'Go deep on recurring-event expansion (storing a recurrence rule versus materializing instances, and where to do the expansion — client versus server), timezone handling correctness (storing UTC, rendering in the viewer\'s timezone, DST transitions), and rendering performance for month views with many overlapping events. Cover edge cases: editing a single instance of a recurring event, a DST transition changing an event\'s displayed time, and overlapping-event layout.',
  },
  {
    track: 'interview',
    module: 'Case Study: Calendar Application',
    moduleOrder: 5,
    order: 4,
    slug: 'calendar-app-mock-interview',
    title: 'Calendar Application: Mock Interview',
    summary: 'A timed mock-interview prompt and rubric for designing a calendar application frontend.',
    tags: ['case-study', 'calendar-app', 'mock-interview'],
    estMinutes: 20,
    brief:
      'Provide a full mock-interview prompt asking the reader to design the frontend for a calendar application, covering view rendering, recurring events, and timezone correctness. Include a `<MockInterview>` rubric of five to six points: requirements clarification, data model for recurring events and expansion strategy, timezone/DST correctness, rendering performance for dense views, and handling shared/overlapping calendars — each with a short explanation.',
  },
];
