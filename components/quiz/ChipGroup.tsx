"use client";

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

// Dumb chip row — single vs multi select semantics live in the parent
export default function ChipGroup({
  options,
  selected,
  onToggle,
}: ChipGroupProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            className={`option-btn ${isSelected ? "selected" : ""}`}
            style={{ padding: "5px 14px", fontSize: "13px" }}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
