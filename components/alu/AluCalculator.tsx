"use client";

import { useMemo, useState } from "react";
import type {
  BitWidth,
  ComparisonBlock,
  FlagSet,
  InterpretationAnswer,
  Operation,
} from "@/lib/alu/types";
import {
  deriveAluState,
  validateAnswers,
  type DerivedAluState,
} from "@/lib/alu/validation";
import { toNaturalValue, toSignedValue } from "@/lib/alu/binary";
import { Toolbar } from "./Toolbar";
import { OperationWorkbench } from "./OperationWorkbench";
import { FlagsRow } from "./FlagsRow";
import { ComparisonBlockView } from "./ComparisonBlock";
import { InterpretationSection } from "./InterpretationSection";

// ─── helpers ────────────────────────────────────────────────────────────────

const zeroFlags: FlagSet = { Z: false, N: false, C: false, V: false };
const emptyCmp: ComparisonBlock = { unsigned: null, signed: null };
const emptyInterp: InterpretationAnswer = {
  natValid: null,
  natFlag: null,
  sigValid: null,
  sigFlag: null,
};

function isValidBits(bits: string, n: BitWidth): boolean {
  return bits.length === n && /^[01]+$/.test(bits);
}

/** Safe for all BitWidth values including 32 */
function randomBits(n: BitWidth): string {
  if (n < 32) {
    const max = 1 << n;
    return Math.floor(Math.random() * max)
      .toString(2)
      .padStart(n, "0");
  }
  // n === 32: split into two 16-bit halves to avoid JS bitwise overflow
  const hi = Math.floor(Math.random() * 65536)
    .toString(2)
    .padStart(16, "0");
  const lo = Math.floor(Math.random() * 65536)
    .toString(2)
    .padStart(16, "0");
  return hi + lo;
}

// ─── component ──────────────────────────────────────────────────────────────

export default function AluCalculator() {
  // configuration
  const [n, setN] = useState<BitWidth>(4);
  const [op, setOp] = useState<Operation>("add");

  // operand inputs — always editable
  const [aBits, setABits] = useState("");
  const [bBits, setBBits] = useState("");

  // answer fields — always editable
  const [resultIn, setResultIn] = useState("");
  const [negBIn, setNegBIn] = useState("");
  const [natAIn, setNatAIn] = useState("");
  const [natBIn, setNatBIn] = useState("");
  const [natResultIn, setNatResultIn] = useState("");
  const [sigAIn, setSigAIn] = useState("");
  const [sigBIn, setSigBIn] = useState("");
  const [sigResultIn, setSigResultIn] = useState("");
  const [flagsIn, setFlagsIn] = useState<FlagSet>({ ...zeroFlags });
  const [cmpIn, setCmpIn] = useState<ComparisonBlock>({ ...emptyCmp });
  const [interpIn, setInterpIn] = useState<InterpretationAnswer>({
    ...emptyInterp,
  });

  // live computed truth (never shown directly — controls CALCULAR and VALIDAR)
  const computed = useMemo<DerivedAluState | null>(
    () =>
      isValidBits(aBits, n) && isValidBits(bBits, n)
        ? deriveAluState(aBits, bBits, n, op)
        : null,
    [aBits, bBits, n, op],
  );

  // validation coloring — null until VALIDAR is clicked
  const [validation, setValidation] = useState<Record<
    string,
    boolean
  > | null>(null);

  // ─── handlers ─────────────────────────────────────────────────────────────

  function clearAnswers() {
    setResultIn("");
    setNegBIn("");
    setNatAIn("");
    setNatBIn("");
    setNatResultIn("");
    setSigAIn("");
    setSigBIn("");
    setSigResultIn("");
    setFlagsIn({ ...zeroFlags });
    setCmpIn({ ...emptyCmp });
    setInterpIn({ ...emptyInterp });
    setValidation(null);
  }

  function handleChangeN(newN: BitWidth) {
    setN(newN);
    setABits("");
    setBBits("");
    clearAnswers();
  }

  function handleChangeOp(newOp: Operation) {
    setOp(newOp);
    setValidation(null);
    // computed reacts automatically via useMemo
  }

  function handlePractice() {
    const a = randomBits(n);
    const b = randomBits(n);
    setABits(a);
    setBBits(b);
    clearAnswers();
  }

  function handleCalculate() {
    if (!computed) return;
    const { snapshot, flags, comparisons, naturalValid, signedValid } =
      computed;
    setResultIn((snapshot.carryOut ? "1" : "") + snapshot.resultBits);
    setNegBIn(snapshot.negBBits ?? "");
    setNatAIn(String(toNaturalValue(snapshot.aBits)));
    setNatBIn(String(toNaturalValue(snapshot.bBits)));
    setNatResultIn(String(toNaturalValue(snapshot.resultBits)));
    setSigAIn(String(toSignedValue(snapshot.aBits, n)));
    setSigBIn(String(toSignedValue(snapshot.bBits, n)));
    setSigResultIn(String(toSignedValue(snapshot.resultBits, n)));
    setFlagsIn({ ...flags });
    setCmpIn({ ...comparisons });
    setInterpIn({
      natValid: naturalValid,
      natFlag: "C",
      sigValid: signedValid,
      sigFlag: "V",
    });
    setValidation(null);
  }

  function handleValidate() {
    if (!computed) return;
    const results = validateAnswers(n, op, aBits, bBits, {
      resultBits: resultIn,
      negBBits: negBIn,
      natA: natAIn,
      natB: natBIn,
      natResult: natResultIn,
      sigA: sigAIn,
      sigB: sigBIn,
      sigResult: sigResultIn,
      flags: flagsIn,
      cmp: cmpIn,
      interp: interpIn,
    });
    setValidation(results);
  }

  // ─── validation per section ───────────────────────────────────────────────

  const flagValidation = validation
    ? {
        C: validation["C"] ?? null,
        V: validation["V"] ?? null,
        N: validation["S"] ?? null, // S key in record maps to N in FlagSet
        Z: validation["Z"] ?? null,
      }
    : null;

  const cmpValidation = validation
    ? {
        unsigned: validation["cmp_unsigned"] ?? null,
        signed: validation["cmp_signed"] ?? null,
      }
    : null;

  const interpValidation = validation
    ? {
        natValid: validation["nat_valid"] ?? null,
        natFlag: validation["nat_flag"] ?? null,
        sigValid: validation["sig_valid"] ?? null,
        sigFlag: validation["sig_flag"] ?? null,
      }
    : null;

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      {/* Toolbar */}
      <Toolbar
        n={n}
        op={op}
        canCalc={computed !== null}
        canVal={computed !== null}
        onChangeN={handleChangeN}
        onChangeOp={handleChangeOp}
        onPractice={handlePractice}
        onCalculate={handleCalculate}
        onValidate={handleValidate}
      />

      {/* Operation workbench */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Operación</SectionLabel>
        <OperationWorkbench
          n={n}
          operation={op}
          aBits={aBits}
          bBits={bBits}
          onChangeA={(v) => { setABits(v); clearAnswers(); }}
          onChangeB={(v) => { setBBits(v); clearAnswers(); }}
          resultInput={{
            value: resultIn,
            onChange: (v) => { setResultIn(v); setValidation(null); },
            validation: validation?.["result"] ?? null,
          }}
          negBInput={{
            value: negBIn,
            onChange: (v) => { setNegBIn(v); setValidation(null); },
            validation: validation?.["neg_b"] ?? null,
          }}
          natAInput={{
            value: natAIn,
            onChange: (v) => { setNatAIn(v); setValidation(null); },
            validation: validation?.["nat_a"] ?? null,
          }}
          natBInput={{
            value: natBIn,
            onChange: (v) => { setNatBIn(v); setValidation(null); },
            validation: validation?.["nat_b"] ?? null,
          }}
          natResultInput={{
            value: natResultIn,
            onChange: (v) => { setNatResultIn(v); setValidation(null); },
            validation: validation?.["nat_result"] ?? null,
          }}
          sigAInput={{
            value: sigAIn,
            onChange: (v) => { setSigAIn(v); setValidation(null); },
            validation: validation?.["sig_a"] ?? null,
          }}
          sigBInput={{
            value: sigBIn,
            onChange: (v) => { setSigBIn(v); setValidation(null); },
            validation: validation?.["sig_b"] ?? null,
          }}
          sigResultInput={{
            value: sigResultIn,
            onChange: (v) => { setSigResultIn(v); setValidation(null); },
            validation: validation?.["sig_result"] ?? null,
          }}
        />
      </section>

      {/* Flags */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Banderas</SectionLabel>
        <FlagsRow
          flags={flagsIn}
          onChange={(next) => {
            setFlagsIn(next);
            setValidation(null);
          }}
          validation={flagValidation}
        />
      </section>

      {/* Comparison — only meaningful for subtraction */}
      {op === "sub" && (
        <section className="flex flex-col gap-2">
          <SectionLabel>Comparación</SectionLabel>
          <ComparisonBlockView
            value={cmpIn}
            onChange={(next) => {
              setCmpIn(next);
              setValidation(null);
            }}
            validation={cmpValidation}
          />
        </section>
      )}

      {/* Interpretation */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Interpretación</SectionLabel>
        <InterpretationSection
          value={interpIn}
          onChange={(next) => {
            setInterpIn(next);
            setValidation(null);
          }}
          validation={interpValidation}
        />
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
      {children}
    </p>
  );
}
