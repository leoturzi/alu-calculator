"use client";

import type { BitWidth, Operation } from "@/lib/alu/types";
import type { DerivedAluState } from "@/lib/alu/validation";
import { OperationColumn } from "./OperationColumn";
import { SubtractionAddColumn } from "./SubtractionAddColumn";
import { DecimalOperationColumn } from "./DecimalOperationColumn";

type EditableField = {
  value: string;
  onChange: (v: string) => void;
  validation?: boolean | null;
};

type Props = {
  n: BitWidth;
  operation: Operation;
  aBits: string;
  bBits: string;
  onChangeA: (v: string) => void;
  onChangeB: (v: string) => void;
  resultInput: EditableField;
  negBInput: EditableField;
  natAInput: EditableField;
  natBInput: EditableField;
  natResultInput: EditableField;
  sigAInput: EditableField;
  sigBInput: EditableField;
  sigResultInput: EditableField;
  /** Revealed computed state — drives carry display */
  computed: DerivedAluState | null;
};

export function OperationWorkbench({
  n,
  operation,
  aBits,
  bBits,
  onChangeA,
  onChangeB,
  resultInput,
  negBInput,
  natAInput,
  natBInput,
  natResultInput,
  sigAInput,
  sigBInput,
  sigResultInput,
  computed,
}: Props) {
  const carryOut = computed?.snapshot.carryOut ?? null;

  return (
    <div className="flex flex-col gap-y-8 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-10 sm:gap-y-10 md:gap-x-12 lg:gap-x-14">
      {/* Original binary column */}
      <div className="shrink-0">
        <OperationColumn
          operation={operation}
          aInput={{ value: aBits, onChange: onChangeA }}
          bInput={{ value: bBits, onChange: onChangeB }}
          resultInput={resultInput}
          carryOut={carryOut}
        />
      </div>

      {/* Suma Complemento (subtraction as addition) */}
      {operation === "sub" && (
        <div className="shrink-0">
          <SubtractionAddColumn
            n={n}
            aInput={{ value: aBits, onChange: onChangeA }}
            negBInput={negBInput}
            resultInput={resultInput}
            carryOut={carryOut}
          />
        </div>
      )}

      {/* Naturales decimal column */}
      <div className="shrink-0">
        <DecimalOperationColumn
          variant="natural"
          operation={operation}
          aInput={natAInput}
          bInput={natBInput}
          resultInput={natResultInput}
        />
      </div>

      {/* Enteros decimal column */}
      <div className="shrink-0">
        <DecimalOperationColumn
          variant="twos"
          operation={operation}
          aInput={sigAInput}
          bInput={sigBInput}
          resultInput={sigResultInput}
        />
      </div>
    </div>
  );
}
