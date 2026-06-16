"use client";

import { useEffect } from "react";

interface TocScrollSpyProps {
  /** Heading ids in document order — must match the rendered TOC anchors. */
  ids: string[];
}

// Client-only active-section highlighter for the chapter TOC. It observes the
// heading elements and toggles a `data-active` flag on the matching TOC anchor
// (`a[data-toc-id="<id>"]`), which the server-rendered TOC styles via CSS.
// Scoped to the TOC: it never re-renders React, only flips a DOM attribute.
export default function TocScrollSpy({ ids }: TocScrollSpyProps) {
  useEffect(() => {
    if (ids.length === 0) return;

    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const visible = new Set<string>();

    function setActive(id: string | null) {
      for (const anchor of document.querySelectorAll<HTMLElement>(
        "[data-toc-id]",
      )) {
        anchor.toggleAttribute(
          "data-active",
          anchor.dataset.tocId === id && id !== null,
        );
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
        }
        // Highlight the first heading (in document order) currently in view.
        const active = ids.find((id) => visible.has(id)) ?? null;
        if (active) setActive(active);
      },
      // Bias the active band toward the top of the viewport.
      { rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);

    return () => observer.disconnect();
  }, [ids]);

  return null;
}
