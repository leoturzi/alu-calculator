export type Operation = "add" | "sub";

export type BitWidth = 4 | 8 | 16 | 32;

export type FlagSet = {
  Z: boolean;
  N: boolean;
  C: boolean;
  V: boolean;
};

/** "gt" | "eq" | "lt" for a single comparison direction; null = not yet answered */
export type CmpSymbol = "gt" | "eq" | "lt" | null;

/** Unsigned / signed relational comparisons over current bit patterns */
export type ComparisonBlock = {
  unsigned: CmpSymbol;
  signed: CmpSymbol;
};

/** User's interpretation answer for validity in ℕ and ℤ */
export type InterpretationAnswer = {
  natValid: boolean | null;
  natFlag: keyof FlagSet | null;
  sigValid: boolean | null;
  sigFlag: keyof FlagSet | null;
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
