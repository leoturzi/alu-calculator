"use client";

import { useId } from "react";
import type { BitWidth, Operation } from "@/lib/alu/types";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

export type DecimalVariant = "natural" | "twos";

type DecimalInputField = {
  value: string;
  onChange: (v: string) => void;
  validation?: boolean | null;
};

type Props = {
  n: BitWidth;
  variant: DecimalVariant;
  operation: Operation;
  aInput: DecimalInputField;
  bInput: DecimalInputField;
  resultInput: DecimalInputField;
};

/** Max characters needed to represent any value for this variant + bit width. */
function maxDecimalChars(n: number, signed: boolean): number {
  // Natural: 0 .. 2^n-1  →  floor(n * log10(2)) + 1 digits
  // Signed:  -(2^(n-1)) .. 2^(n-1)-1  →  same digits + 1 for minus sign
  const digits = Math.floor(n * Math.log10(2)) + 1;
  return signed ? digits + 1 : digits;
}

export function DecimalOperationColumn({
  n,
  variant,
  operation,
  aInput,
  bInput,
  resultInput,
}: Props) {
  const title = variant === "natural" ? "ℕ natural" : "ℤ con signo";
  const opChar = operation === "add" ? "+" : "−";
  const signed = variant === "twos";
  const inputWidth = maxDecimalChars(n, signed);
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
          width={inputWidth}
          field={aInput}
        />

        <span className="flex items-end justify-center pb-px">{opChar}</span>
        <DecimalInput
          id={`${baseId}-b`}
          label={`B en ${title}`}
          signed={signed}
          width={inputWidth}
          field={bInput}
        />

        <span className="pointer-events-none select-none opacity-0">.</span>
        <DecimalInput
          id={`${baseId}-result`}
          label={`Resultado en ${title}`}
          signed={signed}
          width={inputWidth}
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
  width,
  field,
  resultRow,
}: {
  id: string;
  label: string;
  signed: boolean;
  width: number;
  field: DecimalInputField;
  resultRow?: boolean;
}) {
  const ringClass =
    field.validation === true
      ? "ring-1 ring-emerald-400 rounded-sm"
      : field.validation === false
        ? "ring-1 ring-rose-400 rounded-sm"
        : "";

  return (
    <div
      className={`flex justify-end ${ringClass} ${
        resultRow ? "border-t border-zinc-700 pt-1 dark:border-zinc-300" : ""
      }`}
    >
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
        style={{ width: `${width}ch` }}
        className="bg-transparent py-0 text-right font-mono text-sm tracking-normal tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600"
      />
    </div>
  );
}
