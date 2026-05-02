"use client";

import type { Operation } from "@/lib/alu/types";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

export type DecimalVariant = "natural" | "twos";

type Props = {
  variant: DecimalVariant;
  operation: Operation;
  /** Valores ya interpretados según variant */
  a: number;
  b: number;
  result: number | null;
};

/** Columna decimal paralela al binario (ℕ o ℤ) — muestra la operación directa sin transformación interna */
export function DecimalOperationColumn({
  variant,
  operation,
  a,
  b,
  result,
}: Props) {
  const title = variant === "natural" ? "ℕ natural" : "ℤ con signo";
  const opChar = operation === "add" ? "+" : "−";

  const rowResult =
    result === null
      ? "—"
      : variant === "natural"
        ? String(result)
        : formatSigned(result);

  const va = variant === "natural" ? String(a) : formatSigned(a);
  const vb = variant === "natural" ? String(b) : formatSigned(b);

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>{title}</div>
      <div className={`border-l border-zinc-300 pl-3 dark:border-zinc-600 ${operationGridClass}`}>
        <span className="pointer-events-none select-none opacity-0">.</span>
        <NumLine value={va} />

        <span className="flex items-end justify-center pb-px">{opChar}</span>
        <NumLine value={vb} />

        <span className="pointer-events-none select-none opacity-0">.</span>
        <NumLine value={rowResult} muted={result === null} resultRow />
      </div>
    </div>
  );
}

function NumLine({
  value,
  muted,
  resultRow,
}: {
  value: string;
  muted?: boolean;
  resultRow?: boolean;
}) {
  const mutedCls = muted ? "text-zinc-400" : "text-zinc-900 dark:text-zinc-100";

  return (
    <span
      className={`block min-w-[2ch] text-right ${resultRow ? "border-t border-zinc-700 pt-1 dark:border-zinc-300" : ""} ${mutedCls}`}
    >
      {value}
    </span>
  );
}

function formatSigned(v: number): string {
  if (v > 0) return `+${v}`;
  return String(v);
}
