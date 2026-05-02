"use client";

import type { ComparisonBlock } from "@/lib/alu/types";

type CmpKey = "eq" | "gt" | "lt";

type Props = {
  value: ComparisonBlock;
  readOnly: boolean;
  onChange?: (next: ComparisonBlock) => void;
};

export function ComparisonBlockView({ value, readOnly, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CmpColumn
        title="Como ℕ (Naturales)"
        subtitle=""
        branch={value.unsigned}
        nameU="unsigned"
        readOnly={readOnly}
        onPick={(k) =>
          onChange?.({ ...value, unsigned: exclusivePick(k) })
        }
      />
      <CmpColumn
        title="Como ℤ (Enteros)"
        subtitle=""
        branch={value.signed}
        nameU="signed"
        readOnly={readOnly}
        onPick={(k) =>
          onChange?.({ ...value, signed: exclusivePick(k) })
        }
      />
    </div>
  );
}

function exclusivePick(key: CmpKey): ComparisonBlock["unsigned"] {
  return { eq: key === "eq", gt: key === "gt", lt: key === "lt" };
}

const OPTS: { key: CmpKey; label: string }[] = [
  { key: "eq", label: "A = B" },
  { key: "gt", label: "A > B" },
  { key: "lt", label: "A < B" },
];

function CmpColumn({
  title,
  subtitle,
  branch,
  nameU,
  readOnly,
  onPick,
}: {
  title: string;
  subtitle: string;
  branch: ComparisonBlock["unsigned"];
  nameU: string;
  readOnly: boolean;
  onPick: (k: CmpKey) => void;
}) {
  const active = OPTS.find((o) => branch[o.key])?.key ?? null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        {title}
        <span className="ml-1.5 font-normal normal-case text-zinc-400 dark:text-zinc-500">
          {subtitle}
        </span>
      </h3>

      <div className="mt-3 flex flex-col gap-1.5 font-mono text-sm">
        {OPTS.map(({ key, label }) => {
          const isActive = branch[key];

          if (readOnly) {
            return (
              <div
                key={key}
                className={`rounded px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {label}
              </div>
            );
          }

          return (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors ${
                isActive
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={`cmp-${nameU}`}
                checked={isActive}
                onChange={() => onPick(key)}
              />
              {label}
            </label>
          );
        })}
      </div>

      {/* en práctica: si ninguno está seleccionado, aviso sutil */}
      {!readOnly && active === null && (
        <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-600">
          Seleccioná una opción
        </p>
      )}
    </div>
  );
}
