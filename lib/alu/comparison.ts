import type { BitWidth } from "./types";
import type { ComparisonBlock } from "./types";
import { toNaturalValue, toSignedValue } from "./binary";

export function compareBlock(
  aBits: string,
  bBits: string,
  n: BitWidth,
): ComparisonBlock {
  const ua = toNaturalValue(aBits);
  const ub = toNaturalValue(bBits);
  const sa = toSignedValue(aBits, n);
  const sb = toSignedValue(bBits, n);
  return {
    unsigned: {
      eq: ua === ub,
      gt: ua > ub,
      lt: ua < ub,
    },
    signed: {
      eq: sa === sb,
      gt: sa > sb,
      lt: sa < sb,
    },
  };
}
