"use client";

import type { BitWidth } from "@/lib/alu/types";
import { BIT_WIDTH_OPTIONS } from "@/lib/alu/constants";

type Props = {
  n: BitWidth;
  onChangeN: (n: BitWidth) => void;
};

export function ConfigBar({ n, onChangeN }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Ancho ALU (n bits)
        <select
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm shadow-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={n}
          onChange={(e) => onChangeN(Number(e.target.value) as BitWidth)}
        >
          {BIT_WIDTH_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
