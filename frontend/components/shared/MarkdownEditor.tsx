"use client";

import dynamic from "next/dynamic";
import type { MarkdownEditorProps } from "./MarkdownEditorInternal";

// TipTap touches the DOM at import time — load client-side only.
// Two wrappers for the same chunk: editable shows a box-shaped
// placeholder while loading; read-only must never show a box.
const InternalBoxed = dynamic(() => import("./MarkdownEditorInternal"), {
  ssr: false,
  loading: () => (
    <div className="input" style={{ minHeight: "110px", width: "100%" }} />
  ),
});

const InternalPlain = dynamic(() => import("./MarkdownEditorInternal"), {
  ssr: false,
  loading: () => null,
});

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return props.readOnly ? (
    <InternalPlain {...props} />
  ) : (
    <InternalBoxed {...props} />
  );
}
