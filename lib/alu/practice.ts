import type { BitWidth } from "./types";
import type { Operation } from "./types";

export type PracticeProblem = {
  n: BitWidth;
  operation: Operation;
  aBits: string;
  bBits: string;
};

/** Uniform bits in [0, 2^n) */
export function randomBits(rng: () => number, n: BitWidth): string {
  const max = 1 << n;
  const v = Math.floor(rng() * max);
  return v.toString(2).padStart(n, "0");
}

export function randomOperation(rng: () => number): Operation {
  return rng() < 0.5 ? "add" : "sub";
}

export function makePracticeProblem(
  n: BitWidth,
  rng: () => number = Math.random,
): PracticeProblem {
  return {
    n,
    operation: randomOperation(rng),
    aBits: randomBits(rng, n),
    bBits: randomBits(rng, n),
  };
}
