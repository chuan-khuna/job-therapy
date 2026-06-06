"use client";

import dynamic from "next/dynamic";
import type { MarkdownEditorProps } from "./MarkdownEditorInternal";

// MDXEditor touches the DOM at import time — load client-side only
const Internal = dynamic(() => import("./MarkdownEditorInternal"), {
  ssr: false,
  loading: () => (
    <div className="input" style={{ minHeight: "110px", width: "100%" }} />
  ),
});

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return <Internal {...props} />;
}
