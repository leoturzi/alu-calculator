import type { FlagSet } from "./types";
import type { RippleResult } from "./arithmetic";

/**
 * Z: resultado todo ceros
 * N: MSB del resultado (signo en C2)
 * C: coincide con el carry fuera del MSB del sumador (cout) — mismo bit que el MSB extra en la línea binaria (n+1 bits).
 * V: overflow con signo — carryIntoMsb XOR carryOut del sumador (add/sub sobre n bits).
 */
export function deriveFlags(
  resultBits: string,
  ripple: Pick<RippleResult, "carryOut" | "carryIntoMsb">,
): FlagSet {
  const Z = !/1/.test(resultBits);
  const N = resultBits[0] === "1";
  const C = ripple.carryOut;
  const V = ripple.carryIntoMsb !== ripple.carryOut;
  return { Z, N, C, V };
}
