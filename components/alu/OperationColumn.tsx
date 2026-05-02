"use client";

import { useId } from "react";
import type { BitWidth, Operation } from "@/lib/alu/types";
import { BitsRow } from "./BinaryBitsRow";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

/** Entrada de A/B en la misma rejilla que la cuenta (solo modo comprobación) */
export type OperandInputsConfig = {
  n: BitWidth;
  a: string;
  b: string;
  onChangeA: (value: string) => void;
  onChangeB: (value: string) => void;
};

type Props = {
  operation: Operation;
  /** MSB-first bit strings (length n), ya normalizados para lectura/decimales */
  aBits: string;
  bBits: string;
  /** Result bits when known */
  resultBits: string | null;
  /** Cout del sumador (para bit extra MSB en la línea del resultado + flag C en ADD) */
  carryOut?: boolean | null;
  operandInputs?: OperandInputsConfig;
};

function sanitizeBinary(raw: string, maxLen: number): string {
  return raw.replace(/[^01]/g, "").slice(0, maxLen);
}

/** Primera columna binaria: operación “directa” A ± B = R */
export function OperationColumn({
  operation,
  aBits,
  bBits,
  resultBits,
  carryOut,
  operandInputs,
}: Props) {
  const opChar = operation === "add" ? "+" : "−";
  const rowResult = resultBits ?? "—".repeat(aBits.length);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>Binario</div>
      <div className={`border-l border-zinc-300 pl-3 dark:border-zinc-600 ${operationGridClass}`}>
        <span className="pointer-events-none select-none opacity-0">.</span>
        {operandInputs ? (
          <OperandBitInput
            id={`${baseId}-a`}
            label={`Operando A (${operandInputs.n} bits, MSB a la izquierda)`}
            value={operandInputs.a}
            maxLen={operandInputs.n}
            onChange={(v) =>
              operandInputs.onChangeA(sanitizeBinary(v, operandInputs.n))
            }
          />
        ) : (
          <BitsRow bits={aBits} />
        )}

        <span className="flex items-end justify-center pb-px">{opChar}</span>
        {operandInputs ? (
          <OperandBitInput
            id={`${baseId}-b`}
            label={`Operando B (${operandInputs.n} bits)`}
            value={operandInputs.b}
            maxLen={operandInputs.n}
            onChange={(v) =>
              operandInputs.onChangeB(sanitizeBinary(v, operandInputs.n))
            }
          />
        ) : (
          <BitsRow bits={bBits} />
        )}

        <span className="pointer-events-none select-none opacity-0">.</span>
        <BitsRow
          bits={rowResult}
          muted={resultBits === null}
          resultRow
          prependRippleCarry={carryOut}
        />
      </div>
    </div>
  );
}

function OperandBitInput({
  id,
  label,
  value,
  maxLen,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  maxLen: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0 text-right">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[01]*"
        autoComplete="off"
        spellCheck={false}
        maxLength={maxLen}
        placeholder={"0".repeat(maxLen)}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="-mx-1 block min-w-[8ch] bg-transparent px-1 py-0 text-right font-mono text-sm tabular-nums text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus-visible:underline dark:text-zinc-100 dark:placeholder:text-zinc-600"
      />
    </div>
  );
}
