"use client";

import type { BitWidth, Operation, WorkbenchSnapshot } from "@/lib/alu/types";
import { negateTwosComplement } from "@/lib/alu/arithmetic";
import { toNaturalValue, toSignedValue } from "@/lib/alu/binary";
import {
  OperationColumn,
  type OperandInputsConfig,
} from "./OperationColumn";
import { SubtractionAddColumn } from "./SubtractionAddColumn";
import { DecimalOperationColumn } from "./DecimalOperationColumn";

type Props = {
  n: BitWidth;
  operation: Operation;
  aBits: string;
  bBits: string;
  snapshot: WorkbenchSnapshot | null;
  /** Si se define, A y B se editan en la columna binaria (modo comprobación) */
  operandInputs?: OperandInputsConfig;
};

export function OperationWorkbench({
  n,
  operation,
  aBits,
  bBits,
  snapshot,
  operandInputs,
}: Props) {
  const resultBits = snapshot?.resultBits ?? null;
  const carryOut = snapshot?.carryOut ?? null;

  const negBTwosBits =
    operation === "sub" ? negateTwosComplement(bBits, n) : null;

  const natResult =
    resultBits !== null ? toNaturalValue(resultBits) : null;
  const sigResult =
    resultBits !== null ? toSignedValue(resultBits, n) : null;

  return (
    <div className="-mx-1 flex flex-nowrap items-start gap-x-10 overflow-x-auto px-1 pb-2 [-webkit-overflow-scrolling:touch] md:gap-x-12 lg:gap-x-14">
      <div className="shrink-0">
        <OperationColumn
          operation={operation}
          aBits={aBits}
          bBits={bBits}
          resultBits={resultBits}
          carryOut={carryOut}
          operandInputs={operandInputs}
        />
      </div>
      {operation === "sub" && negBTwosBits && (
        <div className="shrink-0">
          <SubtractionAddColumn
            aBits={aBits}
            negBTwosBits={negBTwosBits}
            resultBits={resultBits}
            carryOut={carryOut}
          />
        </div>
      )}
      <div className="shrink-0">
        <DecimalOperationColumn
          variant="natural"
          operation={operation}
          a={toNaturalValue(aBits)}
          b={toNaturalValue(bBits)}
          result={natResult}
        />
      </div>
      <div className="shrink-0">
        <DecimalOperationColumn
          variant="twos"
          operation={operation}
          a={toSignedValue(aBits, n)}
          b={toSignedValue(bBits, n)}
          result={sigResult}
        />
      </div>
    </div>
  );
}
