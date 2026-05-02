"use client";

import { useState } from "react";
import type { BitWidth, Operation } from "@/lib/alu/types";
import { normalizeBinary } from "@/lib/alu/binary";
import { deriveAluState } from "@/lib/alu/validation";
import { OperationWorkbench } from "./OperationWorkbench";
import { FlagsRow } from "./FlagsRow";
import { ComparisonBlockView } from "./ComparisonBlock";

type Props = {
  n: BitWidth;
  onBack: () => void;
};

export function ModeVerify({ n, onBack }: Props) {
  const [op, setOp] = useState<Operation>("add");
  const [aIn, setAIn] = useState("");
  const [bIn, setBIn] = useState("");
  const [binError, setBinError] = useState<string | null>(null);
  const [computed, setComputed] = useState<ReturnType<
    typeof deriveAluState
  > | null>(null);

  function clipBinary(raw: string): string {
    return raw.replace(/[^01]/g, "").slice(0, n).padStart(n, "0");
  }

  function parseInputs(): { a: string; b: string } | null {
    try {
      const a = normalizeBinary(aIn, n);
      const b = normalizeBinary(bIn, n);
      setBinError(null);
      return { a, b };
    } catch (e) {
      setBinError(e instanceof Error ? e.message : "Entrada inválida");
      return null;
    }
  }

  function handleCalculate() {
    const bits = parseInputs();
    if (!bits) return;
    setComputed(deriveAluState(bits.a, bits.b, n, op));
  }

  const snapshot = computed?.snapshot ?? null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <button
          type="button"
          className="w-fit text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
          onClick={onBack}
        >
          ← Inicio
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Modo comprobación
        </p>
        <h1 className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          ALU — ver resultado y banderas
        </h1>
      </header>

      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Operación
          <select
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono dark:border-zinc-600 dark:bg-zinc-900"
            value={op}
            onChange={(e) => {
              setOp(e.target.value as Operation);
              setComputed(null);
            }}
          >
            <option value="add">Suma</option>
            <option value="sub">Resta</option>
          </select>
        </label>

        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          onClick={handleCalculate}
        >
          Calcular
        </button>
      </section>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Escribí A y B en la columna <strong className="font-medium">Binario</strong>{" "}
        (solo 0 y 1; hasta {n} bits; MSB a la izquierda).
      </p>

      {binError && (
        <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
          {binError}
        </p>
      )}

      <OperationWorkbench
        n={n}
        operation={op}
        aBits={computed?.snapshot.aBits ?? clipBinary(aIn)}
        bBits={computed?.snapshot.bBits ?? clipBinary(bIn)}
        snapshot={snapshot}
        operandInputs={{
          n,
          a: aIn,
          b: bIn,
          onChangeA: (v) => {
            setAIn(v);
            setComputed(null);
          },
          onChangeB: (v) => {
            setBIn(v);
            setComputed(null);
          },
        }}
      />

      {computed && (
        <>
          <ValidityStrip
            naturalValid={computed.naturalValid}
            signedValid={computed.signedValid}
          />
          <FlagsRow flags={computed.flags} readOnly />
          <ComparisonBlockView value={computed.comparisons} readOnly />
        </>
      )}
    </div>
  );
}

function ValidityStrip({
  naturalValid,
  signedValid,
}: {
  naturalValid: boolean;
  signedValid: boolean;
}) {
  const pill = (label: string, ok: boolean) => (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${
        ok
          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          : "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100"
      }`}
    >
      {label}: {ok ? "válido" : "no válido"}
    </span>
  );

  return (
    <div className="flex flex-wrap gap-3">
      {pill("Interpretación ℕ", naturalValid)}
      {pill("Interpretación ℤ", signedValid)}
    </div>
  );
}
