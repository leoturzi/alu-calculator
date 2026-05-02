import type {
  BitWidth,
  FlagSet,
  Operation,
  ComparisonBlock,
  WorkbenchSnapshot,
} from "./types";
import { normalizeBinary } from "./binary";
import { toNaturalValue } from "./binary";
import { computeArithmetic } from "./arithmetic";
import { deriveFlags } from "./flags";
import { compareBlock } from "./comparison";

/**
 * Validez en ℕ (natural / sin signo), alineada con el uso típico en ALU de n bits:
 *  - ADD: válida si carryOut === 0 (la suma exacta cabe en n bits sin desbordamiento unsigned).
 *  - SUB: válida si el minuendo A ≥ el sustraendo B en ℕ; si A < B hay “underflow”
 *    unsigned (el resultado modular no coincide con la resta exacta en ℕ).
 *
 * Validez en ℤ (complemento a 2): válida si V === 0 (no hay overflow con signo para
 * esta operación sobre n bits).
 */
export function naturalOperationValid(
  op: Operation,
  aBits: string,
  bBits: string,
  carryOut: boolean,
): boolean {
  if (op === "add") return !carryOut;
  return toNaturalValue(aBits) >= toNaturalValue(bBits);
}

export function signedOperationValid(flags: FlagSet): boolean {
  return !flags.V;
}

export type DerivedAluState = {
  snapshot: WorkbenchSnapshot;
  flags: FlagSet;
  comparisons: ComparisonBlock;
  naturalValid: boolean;
  signedValid: boolean;
};

export function deriveAluState(
  aBits: string,
  bBits: string,
  n: BitWidth,
  op: Operation,
): DerivedAluState {
  const arith = computeArithmetic(aBits, bBits, n, op);
  const flags = deriveFlags(arith.resultBits, arith);
  const comparisons = compareBlock(aBits, bBits, n);
  const snapshot: WorkbenchSnapshot = {
    n,
    operation: op,
    aBits,
    bBits,
    resultBits: arith.resultBits,
    negBBits: op === "sub" ? arith.negBTwosBits : undefined,
    carryOut: arith.carryOut,
  };
  return {
    snapshot,
    flags,
    comparisons,
    naturalValid: naturalOperationValid(op, aBits, bBits, arith.carryOut),
    signedValid: signedOperationValid(flags),
  };
}

export type PracticeAnswers = {
  resultBits: string;
  flags: FlagSet;
  comparisons: ComparisonBlock;
  /** Respuesta alumno: ¿la operación es válida interpretando operandos como naturales? */
  naturalValidGuess: boolean;
  /** Respuesta alumno: ¿válida en complemento a 2 (sin overflow V)? */
  signedValidGuess: boolean;
};

export type FieldResult = {
  field: string;
  ok: boolean;
};

export function validatePractice(
  n: BitWidth,
  op: Operation,
  aBits: string,
  bBits: string,
  answers: PracticeAnswers,
): { results: FieldResult[]; expected: DerivedAluState } {
  const expected = deriveAluState(aBits, bBits, n, op);
  let normalizedResult: string;
  try {
    normalizedResult = normalizeBinary(answers.resultBits, n);
  } catch {
    normalizedResult = "";
  }
  const resultOk =
    normalizedResult.length === n &&
    normalizedResult === expected.snapshot.resultBits;

  const f = answers.flags;
  const expF = expected.flags;
  const flagsOk =
    f.Z === expF.Z &&
    f.N === expF.N &&
    f.C === expF.C &&
    f.V === expF.V;

  const cu = answers.comparisons.unsigned;
  const eu = expected.comparisons.unsigned;
  const cmpUOk =
    cu.eq === eu.eq && cu.gt === eu.gt && cu.lt === eu.lt;

  const cs = answers.comparisons.signed;
  const es = expected.comparisons.signed;
  const cmpSOk = cs.eq === es.eq && cs.gt === es.gt && cs.lt === es.lt;

  const natOk =
    answers.naturalValidGuess === expected.naturalValid;
  const sigOk = answers.signedValidGuess === expected.signedValid;

  const results: FieldResult[] = [
    { field: "resultado binario", ok: resultOk },
    { field: "flags (Z,N,C,V)", ok: flagsOk },
    { field: "comparación como ℕ", ok: cmpUOk },
    { field: "comparación como ℤ", ok: cmpSOk },
    { field: "validez ℕ", ok: natOk },
    { field: "validez ℤ", ok: sigOk },
  ];

  return { results, expected };
}
