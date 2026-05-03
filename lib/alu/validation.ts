import type {
  BitWidth,
  FlagSet,
  Operation,
  ComparisonBlock,
  InterpretationAnswer,
  WorkbenchSnapshot,
} from "./types";
import { normalizeBinary, toNaturalValue, toSignedValue } from "./binary";
import { computeArithmetic } from "./arithmetic";
import { deriveFlags } from "./flags";
import { compareBlock } from "./comparison";

/**
 * Validez en ℕ (natural / sin signo):
 *  - ADD: válida si carryOut === 0
 *  - SUB: válida si A ≥ B como naturales (equivalente a carryOut === 1 en C2)
 *
 * Validez en ℤ (complemento a 2): válida si V === 0
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

export type UserAnswers = {
  resultBits: string;
  /** User's two's complement of B (only validated when op === "sub") */
  negBBits: string;
  natA: string;
  natB: string;
  natResult: string;
  sigA: string;
  sigB: string;
  sigResult: string;
  flags: FlagSet;
  cmp: ComparisonBlock;
  interp: InterpretationAnswer;
};

/**
 * Validates user answers against the computed truth.
 * Returns a flat Record keyed by field name: true = correct, false = incorrect.
 *
 * Keys: "result" | "neg_b" | "nat_result" | "sig_result"
 *       "C" | "V" | "S" | "Z"
 *       "cmp_unsigned" | "cmp_signed"
 *       "nat_valid" | "nat_flag" | "sig_valid" | "sig_flag"
 *
 * Justifying flag for ℕ is always C; for ℤ is always V.
 */
export function validateAnswers(
  n: BitWidth,
  op: Operation,
  aBits: string,
  bBits: string,
  answers: UserAnswers,
): Record<string, boolean> {
  const expected = deriveAluState(aBits, bBits, n, op);
  const expF = expected.flags;
  const expResultBits = expected.snapshot.resultBits;

  let normalizedResult: string;
  try {
    normalizedResult = normalizeBinary(answers.resultBits, n);
  } catch {
    normalizedResult = "";
  }

  let normalizedNegB: string;
  try {
    normalizedNegB = normalizeBinary(answers.negBBits, n);
  } catch {
    normalizedNegB = "";
  }

  const expNatA = toNaturalValue(aBits);
  const expNatB = toNaturalValue(bBits);
  const expNatResult = toNaturalValue(expResultBits);
  const expSigA = toSignedValue(aBits, n);
  const expSigB = toSignedValue(bBits, n);
  const expSigResult = toSignedValue(expResultBits, n);

  const pNatA = parseInt(answers.natA, 10);
  const pNatB = parseInt(answers.natB, 10);
  const pNatResult = parseInt(answers.natResult, 10);
  const pSigA = parseInt(answers.sigA, 10);
  const pSigB = parseInt(answers.sigB, 10);
  const pSigResult = parseInt(answers.sigResult, 10);

  const result: Record<string, boolean> = {
    result:
      normalizedResult.length === n && normalizedResult === expResultBits,
    nat_a: !isNaN(pNatA) && pNatA === expNatA,
    nat_b: !isNaN(pNatB) && pNatB === expNatB,
    nat_result: !isNaN(pNatResult) && pNatResult === expNatResult,
    sig_a: !isNaN(pSigA) && pSigA === expSigA,
    sig_b: !isNaN(pSigB) && pSigB === expSigB,
    sig_result: !isNaN(pSigResult) && pSigResult === expSigResult,
    C: answers.flags.C === expF.C,
    V: answers.flags.V === expF.V,
    S: answers.flags.N === expF.N,
    Z: answers.flags.Z === expF.Z,
    cmp_unsigned: answers.cmp.unsigned === expected.comparisons.unsigned,
    cmp_signed: answers.cmp.signed === expected.comparisons.signed,
    nat_valid: answers.interp.natValid === expected.naturalValid,
    nat_flag: answers.interp.natFlag === "C",
    sig_valid: answers.interp.sigValid === expected.signedValid,
    sig_flag: answers.interp.sigFlag === "V",
  };

  if (op === "sub") {
    result["neg_b"] =
      normalizedNegB.length === n &&
      normalizedNegB === expected.snapshot.negBBits;
  }

  return result;
}
