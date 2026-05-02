"use client";

import type { FlagSet } from "@/lib/alu/types";

const FLAG_HINTS: Record<keyof FlagSet, string> = {
  Z: "Zero — vale 1 cuando todos los bits del resultado son 0.",
  N: "Negative — vale 1 cuando el MSB del resultado es 1 (negativo en C2).",
  C: "Carry — igual al cout del sumador; es el bit extra que aparece a la izquierda del resultado binario.",
  V: "oVerflow — vale 1 cuando hay desbordamiento en complemento a 2: el resultado no cabe en el rango con signo de n bits.",
};

type Props = {
  flags: FlagSet;
  readOnly: boolean;
  onChange?: (next: FlagSet) => void;
};

export function FlagsRow({ flags, readOnly, onChange }: Props) {
  const keys = Object.keys(FLAG_HINTS) as (keyof FlagSet)[];

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Banderas (flags)
      </h3>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {keys.map((k) => (
          <FlagItem
            key={k}
            flagKey={k}
            value={flags[k]}
            hint={FLAG_HINTS[k]}
            readOnly={readOnly}
            onChange={(v) => onChange?.({ ...flags, [k]: v })}
          />
        ))}
      </div>
    </div>
  );
}

function FlagItem({
  flagKey,
  value,
  hint,
  readOnly,
  onChange,
}: {
  flagKey: keyof FlagSet;
  value: boolean;
  hint: string;
  readOnly: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-center gap-1.5 ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
      <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
        {flagKey.toLowerCase()} ={" "}
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
