import fs from "node:fs";
import path from "node:path";

export interface ArticleMeta {
  slug: string;
  title: string;
  description?: string;
  date?: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "contents", "articles");

export function getArticleSlugs(): string[] {
  try {
    return fs
      .readdirSync(ARTICLES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

export async function getArticles(): Promise<ArticleMeta[]> {
  const slugs = getArticleSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/contents/articles/${slug}/index.mdx`);
      const meta = (mod.metadata ?? {}) as Partial<ArticleMeta>;
      return {
        slug,
        title: meta.title ?? slug,
        description: meta.description,
        date: meta.date,
      };
    }),
  );
  return articles.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}
