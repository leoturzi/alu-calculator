"use client";

import type { BitWidth, Operation } from "@/lib/alu/types";
import { ThemeToggle } from "./ThemeToggle";

const BIT_WIDTHS: BitWidth[] = [4, 8, 16, 32];

type Props = {
  n: BitWidth;
  op: Operation;
  canCalc: boolean;
  canVal: boolean;
  onChangeN: (n: BitWidth) => void;
  onChangeOp: (op: Operation) => void;
  onPractice: () => void;
  onCalculate: () => void;
  onValidate: () => void;
};

export function Toolbar({
  n,
  op,
  canCalc,
  canVal,
  onChangeN,
  onChangeOp,
  onPractice,
  onCalculate,
  onValidate,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Bit width selector */}
      <select
        value={n}
        onChange={(e) => onChangeN(Number(e.target.value) as BitWidth)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm font-mono dark:border-zinc-600 dark:bg-zinc-900"
        aria-label="Ancho de bits"
      >
        {BIT_WIDTHS.map((w) => (
          <option key={w} value={w}>
            {w} bits
          </option>
        ))}
      </select>

      {/* Operation selector */}
      <select
        value={op}
        onChange={(e) => onChangeOp(e.target.value as Operation)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm font-mono dark:border-zinc-600 dark:bg-zinc-900"
        aria-label="Operación"
      >
        <option value="add">Suma</option>
        <option value="sub">Resta</option>
      </select>

      <div className="flex items-center gap-1.5">
        {/* PRACTICA */}
        <button
          type="button"
          onClick={onPractice}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          Practica
        </button>

        {/* CALCULAR */}
        <button
          type="button"
          onClick={onCalculate}
          disabled={!canCalc}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          Calcular
        </button>

        {/* VALIDAR */}
        <button
          type="button"
          onClick={onValidate}
          disabled={!canVal}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Validar
        </button>
      </div>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
