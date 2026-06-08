import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleSlugs } from "@/lib/articles";
import type { ArticleMeta } from "@/lib/articles";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let Content: React.ComponentType;
  let meta: Partial<ArticleMeta> = {};
  try {
    const mod = await import(`@/contents/articles/${slug}/index.mdx`);
    Content = mod.default;
    meta = (mod.metadata ?? {}) as Partial<ArticleMeta>;
  } catch {
    notFound();
  }

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-[680px] px-5 py-10 sm:px-8 sm:py-12">
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
          {meta.date && <> · {meta.date}</>}
        </p>
        <div className="prose max-w-none">
          <Content />
        </div>
      </article>
    </main>
  );
}
