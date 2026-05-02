"use client";

import { useCallback, useState } from "react";
import type { BitWidth, ComparisonBlock, FlagSet } from "@/lib/alu/types";
import { makePracticeProblem } from "@/lib/alu/practice";
import { validatePractice, type FieldResult } from "@/lib/alu/validation";
import { OperationWorkbench } from "./OperationWorkbench";
import { FlagsRow } from "./FlagsRow";
import { ComparisonBlockView } from "./ComparisonBlock";
import { ValidationFeedback } from "./ValidationFeedback";

type Props = {
  n: BitWidth;
  onBack: () => void;
};

const zeroFlags: FlagSet = { Z: false, N: false, C: false, V: false };

const emptyCmp: ComparisonBlock = {
  unsigned: { eq: false, gt: false, lt: false },
  signed: { eq: false, gt: false, lt: false },
};

export function ModePractice({ n, onBack }: Props) {
  const [problem, setProblem] = useState(() => makePracticeProblem(n));
  const [resultIn, setResultIn] = useState("");
  const [flags, setFlags] = useState<FlagSet>({ ...zeroFlags });
  const [cmp, setCmp] = useState<ComparisonBlock>({
    unsigned: { ...emptyCmp.unsigned },
    signed: { ...emptyCmp.signed },
  });
  const [natGuess, setNatGuess] = useState(false);
  const [sigGuess, setSigGuess] = useState(false);
  const [feedback, setFeedback] = useState<FieldResult[] | null>(null);

  const resetAnswers = useCallback(() => {
    setResultIn("");
    setFlags({ ...zeroFlags });
    setCmp({
      unsigned: { ...emptyCmp.unsigned },
      signed: { ...emptyCmp.signed },
    });
    setNatGuess(false);
    setSigGuess(false);
  }, []);

  function checked() {
    const answers = {
      resultBits: resultIn,
      flags,
      comparisons: cmp,
      naturalValidGuess: natGuess,
      signedValidGuess: sigGuess,
    };
    try {
      const { results } = validatePractice(
        n,
        problem.operation,
        problem.aBits,
        problem.bBits,
        answers,
      );
      setFeedback(results);
    } catch {
      setFeedback([{ field: "resultado binario", ok: false }]);
    }
  }

  function newProblem() {
    setProblem(makePracticeProblem(n));
    resetAnswers();
    setFeedback(null);
  }

  const opLabel = problem.operation === "add" ? "Suma" : "Resta";

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
          Modo práctica
        </p>
        <h1 className="font-mono text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Practica banderas y comparaciones
        </h1>
      </header>

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
          onClick={newProblem}
        >
          Nuevo ejercicio
        </button>
        <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
          Operación: <strong>{opLabel}</strong>
        </span>
      </section>

      <OperationWorkbench
        n={n}
        operation={problem.operation}
        aBits={problem.aBits}
        bBits={problem.bBits}
        snapshot={null}
      />

      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Tus respuestas
        </h2>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Resultado R ({n} bits)
          <input
            className="max-w-xs rounded-md border border-zinc-300 px-3 py-2 font-mono tracking-widest dark:border-zinc-600 dark:bg-zinc-900"
            value={resultIn}
            placeholder={"?".repeat(n)}
            onChange={(e) =>
              setResultIn(e.target.value.replace(/[^01]/g, "").slice(0, n))
            }
          />
        </label>

        <FlagsRow flags={flags} readOnly={false} onChange={setFlags} />

        <ComparisonBlockView value={cmp} readOnly={false} onChange={setCmp} />

        <div className="flex flex-col gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
            Validez de la operación (según definición del curso)
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-800"
              checked={natGuess}
              onChange={(e) => setNatGuess(e.target.checked)}
            />
            Válida como ℕ (sin signo)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-800"
              checked={sigGuess}
              onChange={(e) => setSigGuess(e.target.checked)}
            />
            Válida en ℤ (sin overflow V)
          </label>
        </div>

        <button
          type="button"
          className="w-fit rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          onClick={checked}
        >
          Comprobar
        </button>
      </section>

      <ValidationFeedback results={feedback} />
    </div>
  );
}
