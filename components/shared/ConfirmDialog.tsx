"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        // click on the backdrop closes
        if (e.target === ref.current) onCancel();
      }}
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        boxShadow:
          "0 1px 2px oklch(20% 0.015 80 / 0.04), 0 6px 20px oklch(20% 0.015 80 / 0.07)",
        background: "var(--color-surface)",
        color: "var(--color-text)",
        padding: 0,
        maxWidth: "380px",
        width: "calc(100% - 2rem)",
      }}
    >
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.05rem",
            color: "var(--color-ink)",
            marginBottom: description ? "0.35rem" : "1rem",
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            {description}
          </p>
        )}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "กำลังลบ…" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
