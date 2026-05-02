"use client";

import type { FieldResult } from "@/lib/alu/validation";

type Props = {
  results: FieldResult[] | null;
};

export function ValidationFeedback({ results }: Props) {
  if (!results || results.length === 0) return null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        Retroalimentación
      </h3>
      <ul className="space-y-2 text-sm">
        {results.map((r) => (
          <li
            key={r.field}
            className={`flex items-center justify-between gap-4 rounded px-2 py-1 font-medium ${
              r.ok
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                : "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
            }`}
          >
            <span>{r.field}</span>
            <span>{r.ok ? "Correcto" : "Incorrecto"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
