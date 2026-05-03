"use client";

import { useId } from "react";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

type EditableField = {
  value: string;
  onChange: (v: string) => void;
  validation?: boolean | null;
};

type Props = {
  aInput: EditableField;
  negBInput: EditableField;
  resultInput: EditableField;
  carryOut: boolean | null;
  n: number;
};

function sanitizeBinary(raw: string, maxLen: number): string {
  return raw.replace(/[^01]/g, "").slice(0, maxLen);
}

function ringClass(v: boolean | null | undefined): string {
  if (v === true) return "ring-1 ring-emerald-400 rounded-sm";
  if (v === false) return "ring-1 ring-rose-400 rounded-sm";
  return "";
}

const bitsInputClass =
  "block bg-transparent py-0 text-right font-mono text-sm tracking-normal tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600";

export function SubtractionAddColumn({ aInput, negBInput, resultInput, carryOut, n }: Props) {
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>Resta → suma</div>
      <div className={`border-l border-emerald-400/70 pl-3 dark:border-emerald-600/60 ${operationGridClass}`}>

        {/* A — shared with Original */}
        <span className="pointer-events-none select-none opacity-0">.</span>
        <div className={`min-w-0 flex justify-end ${ringClass(aInput.validation)}`}>
          <label htmlFor={`${baseId}-a`} className="sr-only">Operando A ({n} bits)</label>
          <input
            id={`${baseId}-a`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)}
            value={aInput.value}
            onChange={(e) => aInput.onChange(sanitizeBinary(e.target.value, n))}
            style={{ width: `${n}ch` }}
            className={bitsInputClass}
          />
        </div>

        {/* ~B+1 */}
        <span className="flex items-end justify-center pb-px">+</span>
        <div className={`min-w-0 flex justify-end ${ringClass(negBInput.validation)}`}>
          <label htmlFor={`${baseId}-negb`} className="sr-only">Complemento a 2 de B ({n} bits)</label>
          <input
            id={`${baseId}-negb`}
            type="text" inputMode="numeric" pattern="[01]*"
            autoComplete="off" spellCheck={false}
            maxLength={n} placeholder={"0".repeat(n)}
            value={negBInput.value}
            onChange={(e) => negBInput.onChange(sanitizeBinary(e.target.value, n))}
            style={{ width: `${n}ch` }}
            className={bitsInputClass}
          />
        </div>

        {/* Result */}
        <span className="pointer-events-none select-none opacity-0">.</span>
        <div className={`min-w-0 flex justify-end border-t border-zinc-700 pt-1 dark:border-zinc-300 ${ringClass(resultInput.validation)}`}>
          <div className="inline-flex items-baseline">
            {carryOut === true && (
              <span className="font-mono text-sm tracking-normal font-semibold text-red-500 dark:text-red-400">1</span>
            )}
            <label htmlFor={`${baseId}-result`} className="sr-only">Resultado ({n} bits)</label>
            <input
              id={`${baseId}-result`}
              type="text" inputMode="numeric" pattern="[01]*"
              autoComplete="off" spellCheck={false}
              maxLength={n} placeholder={"0".repeat(n)}
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
