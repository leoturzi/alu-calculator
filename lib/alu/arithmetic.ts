import type { BitWidth } from "./types";
import type { Operation } from "./types";

export type RippleResult = {
  resultBits: string;
  /** Carry out of MSB (unsigned overflow for ADD; borrow complement for SUB-as-add per text in flags) */
  carryOut: boolean;
  /** Carry into MSB bit position — with carryOut yields signed overflow via XOR */
  carryIntoMsb: boolean;
};

/**
 * n-bit ripple adder. Subtraction uses A + ~B + 1 (carry into LSB = 1).
 */
export function rippleAddSubtract(
  aBits: string,
  bBits: string,
  n: BitWidth,
  op: Operation,
): RippleResult {
  const subtract = op === "sub";
  let carry = subtract ? 1 : 0;
  let carryIntoMsb = false;
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const ai = aBits.charCodeAt(i) === 49 ? 1 : 0;
    let bi = bBits.charCodeAt(i) === 49 ? 1 : 0;
    if (subtract) bi ^= 1;
    if (i === 0) carryIntoMsb = carry === 1;
    const s = ai + bi + carry;
    out.unshift(s % 2 === 1 ? "1" : "0");
    carry = s >= 2 ? 1 : 0;
  }
  return {
    resultBits: out.join(""),
    carryOut: carry === 1,
    carryIntoMsb,
  };
}

/** Two's complement negation (−B) as n-bit pattern */
export function negateTwosComplement(bBits: string, n: BitWidth): string {
  return rippleAddSubtract("0".repeat(n), bBits, n, "sub").resultBits;
}

export type AluArithmetic = RippleResult & {
  op: Operation;
  /** For display: negation of B as n-bit two's complement pattern (for sub-as-add column) */
  negBTwosBits: string;
};

export function computeArithmetic(
  aBits: string,
  bBits: string,
  n: BitWidth,
  op: Operation,
): AluArithmetic {
  const ripple = rippleAddSubtract(aBits, bBits, n, op);
  const negBTwosBits = op === "sub" ? negateTwosComplement(bBits, n) : bBits;
  return {
    ...ripple,
    op,
    negBTwosBits,
  };
}
