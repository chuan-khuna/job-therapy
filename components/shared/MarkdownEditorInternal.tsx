"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

export interface MarkdownEditorProps {
  value: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

// Very minimal: no toolbar — markdown shortcuts only
// (**bold**, *italic*, - list, 1. list, # heading, > quote)
export default function MarkdownEditorInternal({
  value,
  onChange,
  placeholder,
  readOnly = false,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "md-editor-content" },
    },
    onUpdate({ editor }) {
      onChange?.(editor.storage.markdown.getMarkdown());
    },
  });

  return (
    <div className={readOnly ? "md-editor readonly" : "md-editor"}>
      <EditorContent editor={editor} />
    </div>
  );
}
