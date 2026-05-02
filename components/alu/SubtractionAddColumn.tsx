"use client";

import { BitsRow } from "./BinaryBitsRow";
import { columnTitleClass, operationGridClass } from "./operationGridClasses";

type Props = {
  aBits: string;
  /** −B como patrón de n bits en complemento a 2 */
  negBTwosBits: string;
  resultBits: string | null;
  carryOut: boolean | null;
};

/** Segunda columna binaria: resta vista como A + (−B) con −B en C2 */
export function SubtractionAddColumn({
  aBits,
  negBTwosBits,
  resultBits,
  carryOut,
}: Props) {
  const rowResult = resultBits ?? "—".repeat(aBits.length);

  return (
    <div className="flex flex-col gap-2">
      <div className={columnTitleClass}>Resta → suma</div>
      <div className={`border-l border-emerald-400/70 pl-3 dark:border-emerald-600/60 ${operationGridClass}`}>
        <span className="pointer-events-none select-none opacity-0">.</span>
        <BitsRow bits={aBits} />

        <span className="flex items-end justify-center pb-px">+</span>
        <BitsRow bits={negBTwosBits} />

        <span className="pointer-events-none select-none opacity-0">.</span>
        <BitsRow
          bits={rowResult}
          muted={resultBits === null}
          resultRow
          prependRippleCarry={carryOut}
        />
      </div>
    </div>
  );
}
