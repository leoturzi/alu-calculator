"use client";

import type { FlagSet } from "@/lib/alu/types";

/** Display labels: N is shown as S (signo) */
const FLAG_DISPLAY: Record<keyof FlagSet, string> = {
  C: "C",
  V: "V",
  N: "S",
  Z: "Z",
};

const FLAG_HINTS: Record<keyof FlagSet, string> = {
  Z: "Zero — vale 1 cuando todos los bits del resultado son 0.",
  N: "Signo — vale 1 cuando el MSB del resultado es 1 (negativo en C2).",
  C: "Carry — igual al cout del sumador; es el bit extra a la izquierda del resultado.",
  V: "oVerflow — vale 1 cuando hay desbordamiento en complemento a 2.",
};

type Props = {
  flags: FlagSet;
  onChange?: (next: FlagSet) => void;
  validation?: Partial<Record<keyof FlagSet, boolean>> | null;
};

export function FlagsRow({ flags, onChange, validation }: Props) {
  const keys: (keyof FlagSet)[] = ["C", "V", "N", "Z"];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2">
      {keys.map((k) => (
        <FlagItem
          key={k}
          displayLabel={FLAG_DISPLAY[k]}
          value={flags[k]}
          hint={FLAG_HINTS[k]}
          readOnly={!onChange}
          validationState={validation?.[k] ?? null}
          onChange={(v) => onChange?.({ ...flags, [k]: v })}
        />
      ))}
    </div>
  );
}

function FlagItem({
  displayLabel,
  value,
  hint,
  readOnly,
  validationState,
  onChange,
}: {
  displayLabel: string;
  value: boolean;
  hint: string;
  readOnly: boolean;
  validationState: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const ringClass =
    validationState === true
      ? "ring-1 ring-emerald-400 rounded"
      : validationState === false
        ? "ring-1 ring-rose-400 rounded"
        : "";

  return (
    <label
      className={`flex items-center gap-1.5 ${readOnly ? "cursor-default" : "cursor-pointer"} ${ringClass} px-1`}
    >
      <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
        {displayLabel} ={" "}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {value ? "1" : "0"}
        </span>
      </span>

      {/* tooltip */}
      <span className="group relative">
        <span className="flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full text-[9px] font-semibold text-zinc-400 ring-1 ring-zinc-300 dark:text-zinc-500 dark:ring-zinc-600">
          ?
        </span>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-[12px] leading-relaxed text-zinc-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {hint}
        </span>
      </span>

      <input
        type="checkbox"
        className="sr-only"
        checked={value}
        disabled={readOnly}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
