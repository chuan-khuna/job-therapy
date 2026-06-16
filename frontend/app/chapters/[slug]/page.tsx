import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterToc from "@/components/chapters/ChapterToc";
import ReflectionCard from "@/components/home/ReflectionCard";
import { resolveReflectionIds } from "@/lib/chapters";
import type { ChapterMeta } from "@/lib/chapters";
import { flattenToc } from "@/lib/toc";
import type { TocEntry } from "@/lib/toc";
import { getLastResultStamp } from "@/lib/api/results";

// created_at is an ISO 8601 UTC timestamp from the backend.
function formatStamp(stamp: { date: string; created_at: string }): string {
  const d = new Date(stamp.created_at);
  const time = d.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${stamp.date} · ${time}`;
}

// Dynamic render: the live "ล่าสุด" stamp is fetched per request (mirrors
// app/page.tsx). Deliberately no generateStaticParams / dynamicParams here —
// baking timestamps at build time would show stale dates.
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let Content: React.ComponentType;
  let meta: Partial<ChapterMeta> = {};
  let toc: TocEntry[] = [];
  try {
    const mod = await import(`@/contents/chapters/${slug}/index.mdx`);
    Content = mod.default;
    meta = (mod.metadata ?? {}) as Partial<ChapterMeta>;
    toc = (mod.tableOfContents ?? []) as TocEntry[];
  } catch {
    notFound();
  }

  // Resolve referenced ids → registry entries. This is INTENTIONALLY outside
  // the try/catch above: a bad reflection id must throw a real error (naming
  // the chapter slug + missing id) rather than be swallowed by notFound(). The
  // try/catch is only for a missing/un-importable chapter module → 404.
  //
  // The build-time guarantee that a typo'd id fails the build does not come
  // from this dynamically-rendered page — it comes from the static index pages
  // (app/chapters/page.tsx, app/page.tsx) calling getChapters(), which runs the
  // same validation at build. Here it additionally guards per-request renders.
  const chapterReflections = resolveReflectionIds(meta.reflections ?? [], slug);
  const tocItems = flattenToc(toc);

  const lastDates = await Promise.all(
    chapterReflections.map(async (reflection) => {
      try {
        const stamp = await getLastResultStamp(reflection.id);
        return stamp ? formatStamp(stamp) : null;
      } catch {
        return null;
      }
    }),
  );

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-12">
        <p
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            ← หน้าแรก
          </Link>
          {" · "}
          <Link
            href="/chapters"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            บททั้งหมด
          </Link>
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left column — MDX prose */}
          <article className="prose max-w-none">
            <Content />
          </article>

          {/* Right column — sticky aside: TOC then ReflectionCards.
              On mobile this stacks below the content; the TOC is hidden. */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="hidden lg:block" style={{ marginBottom: "2rem" }}>
              <ChapterToc items={tocItems} />
            </div>

            {chapterReflections.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {chapterReflections.map((reflection, i) => (
                  <ReflectionCard
                    key={reflection.id}
                    href={`/reflections/${reflection.slug}`}
                    historyHref={`/reflections/${reflection.slug}/history`}
                    name={reflection.name}
                    description={reflection.description}
                    questionCount={reflection.questionCount}
                    typeCount={reflection.typeCount}
                    tags={reflection.tags}
                    lastDate={lastDates[i]}
                  />
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
