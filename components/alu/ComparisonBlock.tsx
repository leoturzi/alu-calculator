"use client";

import type { ComparisonBlock, CmpSymbol } from "@/lib/alu/types";

type Props = {
  value: ComparisonBlock;
  onChange?: (next: ComparisonBlock) => void;
  validation?: { unsigned: boolean | null; signed: boolean | null } | null;
};

export function ComparisonBlockView({ value, onChange, validation }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <ComparisonRow
        label="ℕ"
        sublabel="naturales"
        selected={value.unsigned}
        validationState={validation?.unsigned ?? null}
        readOnly={!onChange}
        onSelect={(sym) => onChange?.({ ...value, unsigned: sym })}
      />
      <ComparisonRow
        label="ℤ"
        sublabel="enteros"
        selected={value.signed}
        validationState={validation?.signed ?? null}
        readOnly={!onChange}
        onSelect={(sym) => onChange?.({ ...value, signed: sym })}
      />
    </div>
  );
}

function ComparisonRow({
  label,
  sublabel,
  selected,
  validationState,
  readOnly,
  onSelect,
}: {
  label: string;
  sublabel: string;
  selected: CmpSymbol;
  validationState: boolean | null;
  readOnly: boolean;
  onSelect: (sym: CmpSymbol) => void;
}) {
  const ringClass =
    validationState === true
      ? "ring-1 ring-emerald-400"
      : validationState === false
        ? "ring-1 ring-rose-400"
        : "";

  return (
    <div className={`flex items-center gap-3 rounded px-1 ${ringClass}`}>
      <span className="w-16 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold">{label}</span>
        <span className="ml-1 font-normal">{sublabel}</span>
      </span>
      <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">A</span>
      <SymbolSelector
        selected={selected}
        readOnly={readOnly}
        onSelect={onSelect}
      />
      <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">B</span>
    </div>
  );
}

const SYMBOLS: { value: CmpSymbol; label: string }[] = [
  { value: "gt", label: ">" },
  { value: "eq", label: "=" },
  { value: "lt", label: "<" },
];

function SymbolSelector({
  selected,
  readOnly,
  onSelect,
}: {
  selected: CmpSymbol;
  readOnly: boolean;
  onSelect: (sym: CmpSymbol) => void;
}) {
  return (
    <div className="flex rounded-md border border-zinc-300 dark:border-zinc-600 overflow-hidden">
      {SYMBOLS.map(({ value, label }) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onSelect(value)}
            className={`px-2.5 py-1 font-mono text-sm transition-colors ${
              isActive
                ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            } ${readOnly ? "cursor-default" : "cursor-pointer"} border-r border-zinc-300 last:border-r-0 dark:border-zinc-600`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
