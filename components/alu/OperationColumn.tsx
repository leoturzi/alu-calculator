"use client";

import { useId } from "react";
import type { Operation } from "@/lib/alu/types";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

type InputConfig = {
  value: string;
  onChange: (v: string) => void;
};

type ResultInputConfig = InputConfig & {
  validation?: boolean | null;
};

type Props = {
  operation: Operation;
  aInput: InputConfig;
  bInput: InputConfig;
  resultInput: ResultInputConfig;
  carryOut?: boolean | null;
};

function sanitizeBinary(raw: string, maxLen: number): string {
  return raw.replace(/[^01]/g, "").slice(0, maxLen);
}

// tracking-normal overrides the inherited tracking-wide from the grid so that
// n characters fit exactly inside width:nch without letter-spacing overflow.
const bitsInputClass =
  "block bg-transparent py-0 text-right font-mono text-sm tracking-normal tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600";

export function OperationColumn({
  operation,
  aInput,
  bInput,
  resultInput,
  carryOut,
}: Props) {
  const opChar = operation === "add" ? "+" : "−";
  const n = Math.max(aInput.value.length || 4, 4);
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
          <label htmlFor={`${baseId}-a`} className="sr-only">Operando A</label>
          <input
            id={`${baseId}-a`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)} aria-label="Operando A"
            value={aInput.value}
            onChange={(e) => aInput.onChange(sanitizeBinary(e.target.value, n))}
            style={{ width: `${n}ch` }}
            className={bitsInputClass}
          />
        </div>

        {/* B */}
        <span className="flex items-end justify-center pb-px">{opChar}</span>
        <div className="min-w-0 flex justify-end">
          <label htmlFor={`${baseId}-b`} className="sr-only">Operando B</label>
          <input
            id={`${baseId}-b`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)} aria-label="Operando B"
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
            {carryOut === true && (
              <span className="font-mono text-sm tracking-normal font-semibold text-red-500 dark:text-red-400">
                1
              </span>
            )}
            <label htmlFor={`${baseId}-result`} className="sr-only">Resultado</label>
            <input
              id={`${baseId}-result`}
              type="text" inputMode="numeric" pattern="[01]*"
              autoComplete="off" spellCheck={false}
              maxLength={n} placeholder={"0".repeat(n)} aria-label="Resultado"
              value={resultInput.value}
              onChange={(e) => resultInput.onChange(sanitizeBinary(e.target.value, n))}
              style={{ width: `${n}ch` }}
              className={bitsInputClass}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
