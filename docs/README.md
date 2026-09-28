# Project documents

Documents about this project — architecture decisions, product specs, proposals, and other records.

## Layout

```
docs/
  adr/
    NNNN-topic.md            # ADRs: sequential number
  agents/                    # config read by the engineering agent skills
  <category>/
    yyyy-mm-dd-topic.md      # everything else (or .html)
```

- **ADRs**: `docs/adr/NNNN-<topic>.md`, numbered sequentially from `0001` (scan for the highest number and add one). Status and authored date go in frontmatter (`status: proposed | accepted | deprecated | superseded by ADR-NNNN`, `date: yyyy-mm-dd`). See the `domain-modeling` skill's `ADR-FORMAT.md` for format and when an ADR is warranted — an ADR can be a single paragraph.
- **Everything else**: `docs/<category>/<yyyy-mm-dd>-<topic>.{md,html}`
- **category** — the kind of document: `prd` (product requirements), `rfc` (request for comments), `documents` (explaining how things/logic in this project work), `handoff`, etc. Add categories as needed.
- **`documents/INDEX.md`** — searchable index of `docs/documents/`: one bullet per file, `- [file](file) - <description under 100 words>`. Update it whenever a file there is added, renamed or removed.
- **yyyy-mm-dd** — the date the document was authored, so files sort chronologically within a category.
- **topic** — a short kebab-case slug.

## Examples

```
docs/adr/0001-mood-log-entry-emotion-model.md
docs/prd/2026-06-08-daily-logging.md
docs/rfc/2026-06-08-theme-system.html
```

## HTML documents

When a document is written as HTML, follow `DESIGN.md` (and `DESIGN.html`) for the visual language — use the `warm-paper` theme tokens rather than ad-hoc styles.

- **Code blocks**: highlight with [Shiki](https://shiki.style) using the `catppuccin-mocha` theme.
- **Diagrams**: use [Mermaid](https://mermaid.js.org) for flowcharts, sequence diagrams, etc.
