"use client";

import { useId } from "react";
import type { Operation } from "@/lib/alu/types";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

export type DecimalVariant = "natural" | "twos";

type DecimalInput = {
  value: string;
  onChange: (v: string) => void;
  validation?: boolean | null;
};

type Props = {
  variant: DecimalVariant;
  operation: Operation;
  aInput: DecimalInput;
  bInput: DecimalInput;
  resultInput: DecimalInput;
};

function sanitizeDecimal(raw: string, signed: boolean): string {
  if (signed) {
    // allow optional leading minus, then digits
    return raw.replace(/[^-\d]/g, "").replace(/(?!^)-/g, "");
  }
  return raw.replace(/\D/g, "");
}

/** Columna decimal paralela al binario (ℕ o ℤ) */
export function DecimalOperationColumn({
  variant,
  operation,
  aInput,
  bInput,
  resultInput,
}: Props) {
  const title = variant === "natural" ? "ℕ natural" : "ℤ con signo";
  const opChar = operation === "add" ? "+" : "−";
  const signed = variant === "twos";
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>{title}</div>
      <div
        className={`border-l border-zinc-300 pl-3 dark:border-zinc-600 ${operationGridClass}`}
      >
        <span className="pointer-events-none select-none opacity-0">.</span>
        <DecimalInput
          id={`${baseId}-a`}
          label={`A en ${title}`}
          signed={signed}
          field={aInput}
        />

        <span className="flex items-end justify-center pb-px">{opChar}</span>
        <DecimalInput
          id={`${baseId}-b`}
          label={`B en ${title}`}
          signed={signed}
          field={bInput}
        />

        <span className="pointer-events-none select-none opacity-0">.</span>
        <DecimalInput
          id={`${baseId}-result`}
          label={`Resultado en ${title}`}
          signed={signed}
          field={resultInput}
          resultRow
        />
      </div>
    </div>
  );
}

function DecimalInput({
  id,
  label,
  signed,
  field,
  resultRow,
}: {
  id: string;
  label: string;
  signed: boolean;
  field: DecimalInput;
  resultRow?: boolean;
}) {
  const ringClass =
    field.validation === true
      ? "ring-1 ring-emerald-400 rounded"
      : field.validation === false
        ? "ring-1 ring-rose-400 rounded"
        : "";

  return (
    <div className={`min-w-0 text-right ${ringClass} ${resultRow ? "border-t border-zinc-700 pt-1 dark:border-zinc-300" : ""}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={signed ? "text" : "numeric"}
        autoComplete="off"
        spellCheck={false}
        placeholder="?"
        value={field.value}
        onChange={(e) =>
          field.onChange(
            signed
              ? e.target.value.replace(/[^-\d]/g, "").replace(/(?!^)-/g, "")
              : e.target.value.replace(/\D/g, ""),
          )
        }
        className="block min-w-[2ch] bg-transparent py-0 text-right font-mono text-sm tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600"
      />
    </div>
  );
}
