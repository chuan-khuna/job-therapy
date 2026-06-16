import TocScrollSpy from "@/components/chapters/TocScrollSpy";
import SectionLabel from "@/components/shared/SectionLabel";
import type { TocItem } from "@/lib/toc";

interface ChapterTocProps {
  items: TocItem[];
}

// Server-rendered table of contents for a chapter. The anchor list is rendered
// here (Server Component); active-section highlighting is delegated to the
// TocScrollSpy client component, which flips a `data-active` attribute on the
// matching anchor — styled via CSS in globals.css (`.chapter-toc a`).
export default function ChapterToc({ items }: ChapterTocProps) {
  if (items.length === 0) return null;

  return (
    <nav className="chapter-toc" aria-label="สารบัญ">
      <SectionLabel ruled={false} style={{ marginBottom: "0.75rem" }}>
        สารบัญ
      </SectionLabel>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              data-toc-id={item.id}
              style={{
                display: "block",
                fontSize: "13px",
                lineHeight: 1.5,
                paddingTop: "4px",
                paddingBottom: "4px",
                paddingLeft: item.depth === 3 ? "0.85rem" : 0,
                textDecoration: "none",
              }}
            >
              {item.value}
            </a>
          </li>
        ))}
      </ul>
      <TocScrollSpy ids={items.map((i) => i.id)} />
    </nav>
  );
}
