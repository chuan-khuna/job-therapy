"use client";

import { useRef, useState } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string; // "HH:MM" or ""
  onChange: (value: string) => void;
}

function pad2(v: string): string {
  return v === "" ? "" : v.padStart(2, "0");
}

const segmentStyle: React.CSSProperties = {
  width: "42px",
  textAlign: "center",
  fontFamily: "var(--font-mono)",
  fontSize: "0.85rem",
  padding: "0.3rem 0.4rem",
};

// shadcn-style segmented time picker (hh : mm) — type digits,
// arrow up/down to step, auto-advance hour → minute
export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [initialHour, initialMinute] = value ? value.split(":") : ["", ""];
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const minuteRef = useRef<HTMLInputElement>(null);

  function emit(h: string, m: string) {
    if (!h && !m) onChange("");
    else onChange(`${pad2(h) || "00"}:${pad2(m) || "00"}`);
  }

  function handleSegment(
    raw: string,
    max: number,
    set: (v: string) => void,
  ): string {
    let digits = raw.replace(/\D/g, "").slice(-2);
    if (digits.length === 2 && Number(digits) > max) digits = digits[1];
    set(digits);
    return digits;
  }

  function step(
    current: string,
    delta: number,
    max: number,
    set: (v: string) => void,
  ): string {
    const n = (Number(current || "0") + delta + max + 1) % (max + 1);
    const next = String(n).padStart(2, "0");
    set(next);
    return next;
  }

  function keyHandler(
    which: "hour" | "minute",
  ): React.KeyboardEventHandler<HTMLInputElement> {
    return (e) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      if (which === "hour") {
        emit(step(hour, delta, 23, setHour), minute);
      } else {
        emit(hour, step(minute, delta, 59, setMinute));
      }
    };
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <Clock
        size={15}
        strokeWidth={2}
        style={{ color: "var(--color-text-muted)" }}
      />
      <input
        className="input"
        style={segmentStyle}
        inputMode="numeric"
        placeholder="--"
        aria-label="ชั่วโมง"
        value={hour}
        onChange={(e) => {
          const digits = handleSegment(e.target.value, 23, setHour);
          emit(digits, minute);
          if (digits.length === 2) minuteRef.current?.focus();
        }}
        onBlur={() => setHour(pad2(hour))}
        onKeyDown={keyHandler("hour")}
      />
      <span style={{ color: "var(--color-text-muted)" }}>:</span>
      <input
        ref={minuteRef}
        className="input"
        style={segmentStyle}
        inputMode="numeric"
        placeholder="--"
        aria-label="นาที"
        value={minute}
        onChange={(e) =>
          emit(hour, handleSegment(e.target.value, 59, setMinute))
        }
        onBlur={() => setMinute(pad2(minute))}
        onKeyDown={keyHandler("minute")}
      />
      <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
        น.
      </span>
    </div>
  );
}
