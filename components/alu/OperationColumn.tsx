"use client";

import { useId } from "react";
import type { BitWidth, Operation } from "@/lib/alu/types";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

type InputConfig = {
  value: string;
  onChange: (v: string) => void;
};

type ResultInputConfig = InputConfig & {
  validation?: boolean | null;
};

type Props = {
  n: BitWidth;
  operation: Operation;
  aInput: InputConfig;
  bInput: InputConfig;
  resultInput: ResultInputConfig;
};

function sanitizeBinary(raw: string, maxLen: number): string {
  return raw.replace(/[^01]/g, "").slice(0, maxLen);
}

// tracking-normal overrides the inherited tracking-wide from the grid so that
// n characters fit exactly inside width:nch without letter-spacing overflow.
const bitsInputClass =
  "block bg-transparent py-0 text-right font-mono text-sm tracking-normal tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600";

export function OperationColumn({
  n,
  operation,
  aInput,
  bInput,
  resultInput,
}: Props) {
  const opChar = operation === "add" ? "+" : "−";
  const resultSlots = n + 1;
  const baseId = useId();

  const resultRingClass = resultInput.validation === true
    ? "ring-1 ring-emerald-400 rounded"
    : resultInput.validation === false
      ? "ring-1 ring-rose-400 rounded"
      : "";

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>Original</div>
      <div className={`border-l border-zinc-300 pl-3 dark:border-zinc-600 ${operationGridClass}`}>

        {/* A */}
        <span className="pointer-events-none select-none opacity-0">.</span>
        <div className="min-w-0 flex justify-end">
          <label htmlFor={`${baseId}-a`} className="sr-only">
            Operando A ({n} bits)
          </label>
          <input
            id={`${baseId}-a`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)} aria-label={`Operando A (${n} bits)`}
            value={aInput.value}
            onChange={(e) => aInput.onChange(sanitizeBinary(e.target.value, n))}
            style={{ width: `${n}ch` }}
            className={bitsInputClass}
          />
        </div>

        {/* B */}
        <span className="flex items-end justify-center pb-px">{opChar}</span>
        <div className="min-w-0 flex justify-end">
          <label htmlFor={`${baseId}-b`} className="sr-only">
            Operando B ({n} bits)
          </label>
          <input
            id={`${baseId}-b`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)} aria-label={`Operando B (${n} bits)`}
            value={bInput.value}
            onChange={(e) => bInput.onChange(sanitizeBinary(e.target.value, n))}
            style={{ width: `${n}ch` }}
            className={bitsInputClass}
          />
        </div>

        {/* Result */}
        <span className="pointer-events-none select-none opacity-0">.</span>
        <div className={`min-w-0 flex justify-end border-t border-zinc-700 pt-1 dark:border-zinc-300 ${resultRingClass}`}>
          <div className="inline-flex items-baseline">
            <label htmlFor={`${baseId}-result`} className="sr-only">
              Resultado ({n} bits; opcional 1 carry MSB en el mismo campo)
            </label>
            <input
              id={`${baseId}-result`}
              type="text" inputMode="numeric" pattern="[01]*"
              autoComplete="off" spellCheck={false}
              maxLength={resultSlots} placeholder={"0".repeat(n)} aria-label={`Resultado (${n} bits)`}
              value={resultInput.value}
              onChange={(e) =>
                resultInput.onChange(
                  sanitizeBinary(e.target.value, resultSlots),
                )
              }
              style={{ width: `${resultSlots}ch` }}
              className={bitsInputClass}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
