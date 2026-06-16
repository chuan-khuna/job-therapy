import GithubSlugger from "github-slugger";

// Shape emitted by @stefanprobst/remark-extract-toc (nested by heading depth).
export interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: TocEntry[];
}

export interface TocItem {
  id: string;
  value: string;
  depth: number;
}

// Flatten the nested TOC tree into a flat, document-ordered list limited to
// h2/h3. Each item carries the id used as the anchor target.
//
// rehype-slug assigns ids by running github-slugger over heading text in
// document order (so duplicate headings get `-1`, `-2`, … suffixes). The remark
// extract-toc plugin runs before rehype-slug and therefore does not see those
// ids, so we reproduce them here with the same algorithm and a single ordered
// pass — guaranteeing the TOC anchors match the rendered heading ids exactly.
export function flattenToc(entries: TocEntry[]): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  function walk(list: TocEntry[]) {
    for (const entry of list) {
      // Slug every heading (in order) so dedup numbering stays aligned with
      // rehype-slug, but only surface h2/h3 in the rendered TOC.
      const id = entry.id ?? slugger.slug(entry.value);
      if (entry.depth >= 2 && entry.depth <= 3) {
        items.push({ id, value: entry.value, depth: entry.depth });
      }
      if (entry.children?.length) {
        walk(entry.children);
      }
    }
  }

  walk(entries);
  return items;
}
