"use client";

/**
 * Fila de bits en la rejilla binaria.
 * Si `prependRippleCarry` está definido en la fila de resultado,
 * el bit extra MSB (cout) se renderiza en rojo separado del resto.
 */
export function BitsRow({
  bits,
  muted,
  resultRow,
  prependRippleCarry,
}: {
  bits: string;
  muted?: boolean;
  resultRow?: boolean;
  /** Cout del sumador (1 bit extra a la izquierda del resultado truncado a n bits) */
  prependRippleCarry?: boolean | null;
}) {
  const mutedCls = muted ? "text-zinc-400" : "text-zinc-900 dark:text-zinc-100";
  const borderCls = resultRow
    ? "border-t border-zinc-700 pt-1 dark:border-zinc-300"
    : "";

  const showCarry =
    Boolean(resultRow) &&
    prependRippleCarry !== undefined &&
    prependRippleCarry !== null &&
    !muted;

  if (!showCarry) {
    return (
      <span className={`block text-right ${borderCls} ${mutedCls}`}>
        {bits.split("").join("\u2009")}
      </span>
    );
  }

  const carryChar = prependRippleCarry ? "1" : "0";
  const resultSpaced = bits.split("").join("\u2009");

  return (
    <span className={`block text-right ${borderCls}`}>
      <span className="font-semibold text-red-500 dark:text-red-400">
        {carryChar}
      </span>
      <span className="text-zinc-900 dark:text-zinc-100">
        {"\u2009"}{resultSpaced}
      </span>
    </span>
  );
}
