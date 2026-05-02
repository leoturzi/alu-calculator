export type Operation = "add" | "sub";

export type BitWidth = 4 | 8 | 16;

export type FlagSet = {
  Z: boolean;
  N: boolean;
  C: boolean;
  V: boolean;
};

/** Unsigned / signed relational comparisons over current bit patterns */
export type ComparisonBlock = {
  unsigned: { eq: boolean; gt: boolean; lt: boolean };
  signed: { eq: boolean; gt: boolean; lt: boolean };
};

/** Snapshot passed from parent into OperationWorkbench */
export type WorkbenchSnapshot = {
  n: BitWidth;
  operation: Operation;
  aBits: string;
  bBits: string;
  resultBits: string;
  /** Two's complement of B as n-bit pattern (only meaningful when operation === 'sub') */
  negBBits?: string;
  carryOut: boolean;
};
