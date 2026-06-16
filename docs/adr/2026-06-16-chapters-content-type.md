---
status: accepted
---

# Add a "Chapters" content type to the frontend

## Context

The source book (_Job Therapy_ by Tessa West) is organised into chapters. The app
already surfaces two Reflections drawn from that book
(`data/reflections.ts`: `reflection-001-stereotype-test`,
`reflection-002-daily-stress-test`), but there is no way to navigate from a book
chapter to the Reflections it contains, or to read a summary of what that chapter
covers.

A second content type already exists — Articles (`frontend/contents/articles/`,
`frontend/lib/articles.ts`, `frontend/app/articles/[slug]/page.tsx`) — freestanding
prose not tied to the book. Chapters are a distinct concept: they _are_ tied to
specific book chapters and they group Reflections.

Domain terms are settled in `CONTEXT.md`:

- **Reflection** (Thai UI: _แบบประเมิน_) — a structured self-assessment. The
  codebase already uses this name exclusively after the full-stack rename in
  commit `788d9ee`.
- **Chapter** (Thai UI: _บท_) — one page of the book, surfaced as one page in
  the app: written summary + grouped Reflections.

The home page (`app/page.tsx`) already demonstrates the dynamic-fetch pattern:
it calls `getLastResultStamp` (from `lib/api/results.ts`) at request time to
show a live "ล่าสุด" stamp on each `ReflectionCard`. Chapter detail pages must
replicate this because showing a stale baked date would be wrong.

`next.config.ts` passes bare `createMDX({})` — no remark or rehype plugins are
configured today, so heading elements have no `id` attributes, making TOC
deep-links impossible without adding plugins.

## Decision

Add Chapters as a first-class content type that mirrors the Articles MDX pattern
but extends it with ordered navigation, Reflection grouping, a TOC sidebar, and
a dynamic render mode.

### Terminology (no change)

"Reflection" is kept as the canonical term (Thai: _แบบประเมิน_). Do not revert
to "quiz" or _แบบทดสอบ_ even though the source book uses those words. The
product explicitly rejects the test/gamification framing ("ไม่ใช่เกม
ไม่มีคะแนนดีหรือแย่", `contents/articles/getting-started/index.mdx`). Commit
`788d9ee` already completed that rename across the full stack.

### Content location and frontmatter

Chapter MDX files live at:

```
frontend/contents/chapters/<slug>/index.mdx
```

Required frontmatter fields:

| Field         | Type       | Notes                                                         |
|---------------|------------|---------------------------------------------------------------|
| `title`       | `string`   | Display name of the chapter                                   |
| `order`       | `number`   | Integer; chapters sort ascending by this field                |
| `reflections` | `string[]` | Plain reflection ids, e.g. `["reflection-001-stereotype-test"]` |

`reflections` stores **ids only**, not objects. Card data (`name`, `description`,
`questionCount`, `tags`) is resolved from `data/reflections.ts` at render time.
This keeps `data/reflections.ts` as the single source of truth and avoids
duplicating registry data in MDX.

If a chapter references an id not present in `data/reflections.ts`, the build
must **throw with a clear message** naming both the chapter and the missing id
rather than silently rendering an empty card.

### Linking direction

Chapters reference Reflection ids. Reflections do not carry a `chapterId`.
`data/reflections.ts` stays unaware of chapters entirely. Cardinality is
many-to-many: a Reflection has a conceptual "home" chapter but may be referenced
by other chapters too (cross-reference). No uniqueness constraint is enforced on
which chapters may reference a given id.

### New files

| File | Role |
|------|------|
| `frontend/lib/chapters.ts` | Loader: `readdirSync` + dynamic MDX import, returns `ChapterMeta[]` sorted by `order`. Mirrors `lib/articles.ts`. |
| `frontend/app/chapters/[slug]/page.tsx` | Chapter detail page (dynamic render — see below). |
| `frontend/app/chapters/page.tsx` | Chapters index listing all chapters sorted by `order`. |

### Home page section

A new "บท" section is added to `app/page.tsx` between the existing "แบบประเมิน"
and "บทความ" sections, listing chapters sorted by `order`.

### MDX plugins

Two remark/rehype plugins are added to `next.config.ts`'s `createMDX({})` call:

- **`rehype-slug`** — adds stable `id` attributes to `h2`/`h3` elements so TOC
  links can deep-link into the content.
- **`@stefanprobst/remark-extract-toc`** (or equivalent) — exports the heading
  list from the MDX module; slugs are generated to match `rehype-slug` exactly so
  TOC anchors resolve correctly. TOC captures `h2` and `h3` only.

These plugins apply globally (they do not harm existing Articles pages).

### Chapter detail page layout

Desktop (`lg` breakpoint and above): two-column layout.

- **Left column** — MDX prose content.
- **Right column** — sticky aside containing:
  1. TOC (rendered server-side; scroll-spy active-section highlighting is a
     small `"use client"` component using `IntersectionObserver`).
  2. `ReflectionCard` list for the chapter's Reflections, including the live
     "ล่าสุด" stamp.

Mobile (below `lg`): single column — content first, then the `ReflectionCard`
list. The TOC is hidden on mobile.

### Render mode: dynamic, not static

The chapter detail page fetches `getLastResultStamp` (from
`lib/api/results.ts`) at request time to populate `lastDate` on each
`ReflectionCard`. This makes `/chapters/<slug>` a **dynamically rendered** route,
diverging from the fully static Articles pattern (`dynamicParams = false`,
`generateStaticParams` in `app/articles/[slug]/page.tsx`).

This is deliberate: baking result timestamps at build time would show stale
"ล่าสุด" dates. The same fetch-at-request pattern is already established in
`app/page.tsx`.

## Consequences

- Chapter pages incur a backend HTTP round-trip per Reflection per request for
  the "ล่าสุด" stamp; this is acceptable for a single-user local app.
- Heading ids in both Article and Chapter MDX will gain `rehype-slug` ids — a
  minor, non-breaking change to Articles output (existing pages have no TOC, so
  the new ids are inert there).
- `data/reflections.ts` remains decoupled from chapter structure; adding or
  reordering chapters never touches the Reflection registry.
- A future "Book" abstraction (grouping chapters under a single book entity) is
  intentionally deferred. Only one book exists today; over-engineering for that
  case is not justified.

## Alternatives considered

**1. Revert "Reflection" → "Quiz" to match the source book and Thai translation.**
Rejected. Commit `788d9ee` completed a deliberate, breaking, full-stack rename.
Reverting it would churn the entire codebase for a single new feature and
re-introduce the test/gamification framing the product explicitly rejects
(`CONTEXT.md`, `contents/articles/getting-started/index.mdx`).

**2. Frontmatter `reflections` as array of objects `[{ id, note }]`.**
Rejected. Embedding card data or per-chapter annotations in frontmatter
duplicates the `data/reflections.ts` registry and creates a drift risk. Plain ids
+ registry lookup is sufficient today. If per-chapter annotations are ever needed,
this can be revisited.

**3. Reflections own a `chapterId` (link from the Reflection side).**
Rejected. Adding `chapterId` to `data/reflections.ts` would make the Reflection
registry depend on the chapter structure and would prevent cross-referencing a
Reflection from multiple chapters without modifying every involved Reflection
entry. Linking from Chapter → Reflection keeps the registries independent.

**4. Keep chapter pages fully static like Articles (no live result stamp).**
Rejected. The "ล่าสุด" stamp on `ReflectionCard` is a core UX feature; baking it
at build time would show stale or missing dates. Dynamic rendering at request time
is the correct trade-off, consistent with how `app/page.tsx` already works.
