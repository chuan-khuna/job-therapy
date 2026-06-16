import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";

// This config is authored as ESM (.mjs) rather than .ts so that
// `import.meta.resolve` is available and ESM-only packages resolve correctly.
//
// The MDX plugins (remark/rehype) are passed to @next/mdx as *string paths*,
// not functions, because Turbopack — the default builder in Next 16 — requires
// loader options to be serializable. But @next/mdx's loader resolves those
// strings with `require.resolve`, which fails on these ESM-only packages
// (`@stefanprobst/remark-extract-toc` exposes only an "import" condition, so its
// bare specifier and subpaths are not require-resolvable). Resolving each to its
// concrete file path here sidesteps the exports-map gate: an absolute .js path
// is require-resolvable and then loaded as ESM via import().
function resolvePlugin(specifier) {
  return fileURLToPath(import.meta.resolve(specifier));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    // rehype-slug adds stable `id`s to h2/h3 (deep-link targets for the TOC).
    // The remark-extract-toc pair exports a `tableOfContents` from each MDX
    // module: the base plugin populates vfile.data.toc, the `/mdx` plugin emits
    // the export. Order matters — the `/mdx` plugin must run after the base one.
    remarkPlugins: [
      resolvePlugin("@stefanprobst/remark-extract-toc"),
      resolvePlugin("@stefanprobst/remark-extract-toc/mdx"),
    ],
    rehypePlugins: [resolvePlugin("rehype-slug")],
  },
});

export default withMDX(nextConfig);
