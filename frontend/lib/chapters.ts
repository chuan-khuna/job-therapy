import fs from "node:fs";
import path from "node:path";
import { reflections } from "@/data/reflections";
import type { ReflectionMeta } from "@/data/reflections";

export interface ChapterMeta {
  slug: string;
  title: string;
  order: number;
  reflections: string[];
}

const CHAPTERS_DIR = path.join(process.cwd(), "contents", "chapters");

export function getChapterSlugs(): string[] {
  try {
    return fs
      .readdirSync(CHAPTERS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
}

// Resolve a list of reflection ids to their registry entries. Throws loudly —
// naming both the chapter slug and the missing id — when an id is not present
// in data/reflections.ts, so a typo in frontmatter fails the build instead of
// silently rendering an empty card.
export function resolveReflectionIds(
  ids: string[],
  chapterSlug: string,
): ReflectionMeta[] {
  return ids.map((id) => {
    const match = reflections.find((r) => r.id === id);
    if (!match) {
      throw new Error(
        `Chapter "${chapterSlug}" references unknown reflection id "${id}" ` +
          `— no matching entry in data/reflections.ts.`,
      );
    }
    return match;
  });
}

export async function getChapters(): Promise<ChapterMeta[]> {
  const slugs = getChapterSlugs();
  const chapters = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/contents/chapters/${slug}/index.mdx`);
      const meta = (mod.metadata ?? {}) as Partial<ChapterMeta>;
      const reflectionIds = meta.reflections ?? [];
      // Validate every referenced id at load time so the build fails loudly.
      resolveReflectionIds(reflectionIds, slug);
      return {
        slug,
        title: meta.title ?? slug,
        order: meta.order ?? 0,
        reflections: reflectionIds,
      };
    }),
  );
  return chapters.sort((a, b) => a.order - b.order);
}
