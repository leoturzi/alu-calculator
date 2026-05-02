import type { BitWidth } from "./types";

/** Strip non-bits; pad MSBs with zeros to length n (MSB-first string). */
export function normalizeBinary(input: string, n: BitWidth): string {
  const cleaned = input.replace(/[^01]/g, "");
  if (cleaned.length > n) {
    throw new Error(`Entrada binaria demasiado larga: máximo ${n} bits.`);
  }
  return cleaned.padStart(n, "0");
}

/** Groups of 4 from the MSB for legibility */
export function formatBinaryGrouped(bits: string): string {
  const r = bits.length % 4;
  const chunks: string[] = [];
  if (r > 0) chunks.push(bits.slice(0, r));
  for (let i = r; i < bits.length; i += 4) {
    chunks.push(bits.slice(i, i + 4));
  }
  return chunks.join(" ");
}

export function bitwiseNot(bits: string): string {
  return [...bits].map((c) => (c === "1" ? "0" : "1")).join("");
}

/** Unsigned value of MSB-first bit pattern */
export function toNaturalValue(bits: string): number {
  return parseInt(bits, 2);
}

/** Two's complement interpretation */
export function toSignedValue(bits: string, n: BitWidth): number {
  const u = toNaturalValue(bits);
  const msb = bits[0] === "1";
  if (!msb) return u;
  return u - (1 << n);
}
