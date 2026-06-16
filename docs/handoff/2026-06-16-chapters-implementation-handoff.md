# Handoff — Chapters content type (frontend implementation)

**Status:** ready to implement
**Owner of decisions:** see [ADR `2026-06-16-chapters-content-type`](../adr/2026-06-16-chapters-content-type.md)
**Glossary:** `CONTEXT.md` → _Reflection_, _Chapter_

This brief turns the accepted ADR into a file-by-file task list for
`frontend-developer`. Every "why" lives in the ADR; this document is the "what to
build". Read the ADR first — do not re-decide anything settled there.

## One-paragraph summary

Add a **Chapter** content type that mirrors the existing **Article** MDX pattern.
A Chapter is one chapter of the source book, surfaced as a page with a written
summary (MDX body) plus the Reflections that belong to it. Each chapter page is
two columns on desktop: prose on the left, a sticky aside on the right holding a
table of contents and the related `ReflectionCard` list.

## Reference implementation (copy the shape, don't reinvent)

| Concern | Existing file to mirror |
|---------|-------------------------|
| MDX content + `metadata` export | `frontend/contents/articles/getting-started/index.mdx` |
| Filesystem loader | `frontend/lib/articles.ts` |
| Dynamic `[slug]` MDX page | `frontend/app/articles/[slug]/page.tsx` |
| Reflection registry (source of truth) | `frontend/data/reflections.ts` |
| Reusable card | `frontend/components/home/ReflectionCard.tsx` |
| Live "ล่าสุด" stamp fetch | `frontend/app/page.tsx` + `frontend/lib/api/results.ts` (`getLastResultStamp`) |

## Tasks

### 1. MDX tooling (`frontend/next.config.ts`)
- Add `rehype-slug` (h2/h3 get stable `id`s) and a remark TOC-extraction plugin
  (e.g. `@stefanprobst/remark-extract-toc` + its mdx export) to the currently bare
  `createMDX({})` call.
- Verify existing Articles pages still build (plugins are global; ids are inert
  there).

### 2. Loader (`frontend/lib/chapters.ts`)
- Mirror `lib/articles.ts`: `getChapterSlugs()` + `getChapters(): ChapterMeta[]`.
- `ChapterMeta`: `{ slug, title, order, reflections: string[] }`.
- Sort by `order` ascending.
- **Validation:** resolving `reflections` ids against `data/reflections.ts` must
  throw a clear error naming the chapter slug and the missing id when an id is
  unknown. Build must fail loudly — no silent empty cards.

### 3. Chapter detail page (`frontend/app/chapters/[slug]/page.tsx`)
- Dynamically import `@/contents/chapters/${slug}/index.mdx`; `notFound()` on miss.
- **Dynamic render** (not static): fetch `getLastResultStamp` per reflection at
  request time, exactly like `app/page.tsx`. Do **not** copy the static
  `dynamicParams = false` / `generateStaticParams` setup from the articles page.
- Layout:
  - Desktop (`lg`+): two columns — left MDX prose (`.prose`), right sticky aside.
  - Right aside (sticky): **TOC on top**, then `ReflectionCard` list (with
    `lastDate` populated). Cards reuse `ReflectionCard`; pass `href`,
    `historyHref`, and the resolved registry fields.
  - Mobile (`< lg`): single column — content first, then the card list. **Hide
    the TOC.**

### 4. TOC + scroll-spy
- Render the TOC list (h2 + h3 only) server-side from the extracted heading data;
  anchors use the `rehype-slug` ids.
- Active-section highlight is a small `"use client"` component using
  `IntersectionObserver`. Keep it scoped to the TOC only.

### 5. Chapters index (`frontend/app/chapters/page.tsx`)
- List all chapters sorted by `order`. A simple card grid is fine (look at the
  Articles section in `app/page.tsx` for the card pattern).

### 6. Home page section (`frontend/app/page.tsx`)
- Add a **"บท"** section between the existing "แบบประเมิน" and "บทความ" sections,
  listing chapters by `order`, linking to `/chapters/<slug>`.

### 7. Seed content
- Add at least one real chapter: `frontend/contents/chapters/<slug>/index.mdx`
  with `title`, `order`, `reflections` frontmatter and a short summary body
  containing a few h2/h3 headings (so the TOC has something to show). Reference an
  existing reflection id from `data/reflections.ts`.

## Acceptance criteria
- `/chapters` lists chapters ordered by `order`.
- `/chapters/<slug>` renders MDX prose, a working sticky TOC (h2/h3) that
  deep-links and highlights the active section on scroll, and the related
  `ReflectionCard`s with a live "ล่าสุด" stamp.
- A bad reflection id in frontmatter fails the build with a clear message.
- Home page shows the new "บท" section in the right position.
- Mobile collapses to one column with the TOC hidden.
- `just frontend-lint` passes; no `console.log` left behind.

## Conventions to honour (CLAUDE.md)
- `@/` import alias, no relative traversal.
- Theme-sensitive values via CSS variables; no inline colour `style`.
- Server Components by default; `"use client"` only for the scroll-spy.

## Review gate
When implementation is reported done, the orchestrator hands the diff
(`file:line` ranges) to `tester-and-security-guard` before commit. Route any
Critical/High findings back, then re-review.
