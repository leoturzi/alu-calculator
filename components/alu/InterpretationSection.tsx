"use client";

import type { FlagSet, InterpretationAnswer } from "@/lib/alu/types";

type ValidationState = {
  natValid: boolean | null;
  natFlag: boolean | null;
  sigValid: boolean | null;
  sigFlag: boolean | null;
};

type Props = {
  value: InterpretationAnswer;
  onChange?: (next: InterpretationAnswer) => void;
  validation?: ValidationState | null;
};

const FLAG_KEYS: (keyof FlagSet)[] = ["C", "V", "N", "Z"];
const FLAG_LABELS: Record<keyof FlagSet, string> = {
  C: "C",
  V: "V",
  N: "S",
  Z: "Z",
};

export function InterpretationSection({ value, onChange, validation }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <InterpRow
        label="ℕ"
        sublabel="naturales"
        valid={value.natValid}
        flag={value.natFlag}
        validValidation={validation?.natValid ?? null}
        flagValidation={validation?.natFlag ?? null}
        readOnly={!onChange}
        onChangeValid={(v) => onChange?.({ ...value, natValid: v })}
        onChangeFlag={(f) => onChange?.({ ...value, natFlag: f })}
      />
      <InterpRow
        label="ℤ"
        sublabel="enteros"
        valid={value.sigValid}
        flag={value.sigFlag}
        validValidation={validation?.sigValid ?? null}
        flagValidation={validation?.sigFlag ?? null}
        readOnly={!onChange}
        onChangeValid={(v) => onChange?.({ ...value, sigValid: v })}
        onChangeFlag={(f) => onChange?.({ ...value, sigFlag: f })}
      />
    </div>
  );
}

function InterpRow({
  label,
  sublabel,
  valid,
  flag,
  validValidation,
  flagValidation,
  readOnly,
  onChangeValid,
  onChangeFlag,
}: {
  label: string;
  sublabel: string;
  valid: boolean | null;
  flag: keyof FlagSet | null;
  validValidation: boolean | null;
  flagValidation: boolean | null;
  readOnly: boolean;
  onChangeValid: (v: boolean) => void;
  onChangeFlag: (f: keyof FlagSet) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Domain label */}
      <span className="w-28 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold">{label}</span>
        <span className="ml-1 font-normal">{sublabel}</span>
      </span>

      {/* Validity segmented control */}
      <div
        className={`flex rounded-md border overflow-hidden ${
          validValidation === true
            ? "border-emerald-400"
            : validValidation === false
              ? "border-rose-400"
              : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        {(
          [
            { value: true, label: "Válido" },
            { value: false, label: "No válido" },
          ] as const
        ).map(({ value: optVal, label: optLabel }) => {
          const isActive = valid === optVal;
          return (
            <button
              key={String(optVal)}
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && onChangeValid(optVal)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              } ${readOnly ? "cursor-default" : "cursor-pointer"} border-r border-zinc-300 last:border-r-0 dark:border-zinc-600`}
            >
              {optLabel}
            </button>
          );
        })}
      </div>

      {/* Flag justification label */}
      <span className="text-xs text-zinc-500 dark:text-zinc-400">porque</span>

      {/* Flag chip selector */}
      <div
        className={`flex rounded-md border overflow-hidden ${
          flagValidation === true
            ? "border-emerald-400"
            : flagValidation === false
              ? "border-rose-400"
              : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        {FLAG_KEYS.map((k) => {
          const isActive = flag === k;
          return (
            <button
              key={k}
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && onChangeFlag(k)}
              className={`w-8 py-1 font-mono text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              } ${readOnly ? "cursor-default" : "cursor-pointer"} border-r border-zinc-300 last:border-r-0 dark:border-zinc-600`}
            >
              {FLAG_LABELS[k]}
            </button>
          );
        })}
      </div>

      {/* "= 0 / = 1" hint when flag is selected */}
      {flag && !readOnly && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {flag === "C" ? "= 0 (suma) / = 1 (resta)" : "= 0"}
        </span>
      )}
    </div>
  );
}
