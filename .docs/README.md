# Project documents

Documents about this project — architecture decisions, product specs, proposals, and other records.

## Layout

```
.docs/
  <category>/
    yyyy-mm-dd-topic.md      # or .html
```

- **Path format**: `.docs/<category>/<yyyy-mm-dd>-<topic>.{md,html}`
- **category** — the kind of document: `adr` (architecture decision record), `prd` (product requirements), `rfc` (request for comments), `doc` (general documentation explaining how things/logic in this project work), etc. Add categories as needed.
- **yyyy-mm-dd** — the date the document was authored, so files sort chronologically within a category.
- **topic** — a short kebab-case slug.

## Examples

```
.docs/adr/2026-06-08-supabase-auth.md
.docs/prd/2026-06-08-daily-logging.md
.docs/rfc/2026-06-08-theme-system.html
```

## HTML documents

When a document is written as HTML, follow `DESIGN.md` (and `DESIGN.html`) for the visual language — use the `warm-paper` theme tokens rather than ad-hoc styles.

- **Code blocks**: highlight with [Shiki](https://shiki.style) using the `catppuccin-mocha` theme.
- **Diagrams**: use [Mermaid](https://mermaid.js.org) for flowcharts, sequence diagrams, etc.
