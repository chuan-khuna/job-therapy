"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

export interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

// Very minimal: no toolbar — markdown shortcuts only
// (**bold**, *italic*, - list, 1. list, # heading, > quote)
export default function MarkdownEditorInternal({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "md-editor-content" },
    },
    onUpdate({ editor }) {
      onChange(editor.storage.markdown.getMarkdown());
    },
  });

  return (
    <div className="md-editor">
      <EditorContent editor={editor} />
    </div>
  );
}
