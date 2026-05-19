import type { FlagSet, Operation } from "./types";
import type { RippleResult } from "./arithmetic";

/**
 * Z: resultado todo ceros
 * N: MSB del resultado (signo en C2)
 * C: para ADD = cout del sumador; para SUB = ~cout (C=1 ⟺ hay préstamo, A<B).
 * V: overflow con signo — carryIntoMsb XOR carryOut del sumador (add/sub sobre n bits).
 */
export function deriveFlags(
  resultBits: string,
  ripple: Pick<RippleResult, "carryOut" | "carryIntoMsb">,
  op: Operation,
): FlagSet {
  const Z = !/1/.test(resultBits);
  const N = resultBits[0] === "1";
  const C = op === "sub" ? !ripple.carryOut : ripple.carryOut;
  const V = ripple.carryIntoMsb !== ripple.carryOut;
  return { Z, N, C, V };
}
