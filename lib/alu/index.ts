export type {
  Operation,
  BitWidth,
  FlagSet,
  ComparisonBlock,
  WorkbenchSnapshot,
} from "./types";
export { BIT_WIDTH_OPTIONS } from "./constants";
export {
  normalizeBinary,
  formatBinaryGrouped,
  bitwiseNot,
  toNaturalValue,
  toSignedValue,
} from "./binary";
export {
  rippleAddSubtract,
  negateTwosComplement,
  computeArithmetic,
  type RippleResult,
  type AluArithmetic,
} from "./arithmetic";
export { deriveFlags } from "./flags";
export { compareBlock } from "./comparison";
export {
  randomBits,
  randomOperation,
  makePracticeProblem,
  type PracticeProblem,
} from "./practice";
export {
  naturalOperationValid,
  signedOperationValid,
  deriveAluState,
  validatePractice,
  type DerivedAluState,
  type PracticeAnswers,
  type FieldResult,
} from "./validation";
