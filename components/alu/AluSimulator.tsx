"use client";

import { useState } from "react";
import type { BitWidth } from "@/lib/alu/types";
import { ConfigBar } from "./ConfigBar";
import { ModePractice } from "./ModePractice";
import { ModeVerify } from "./ModeVerify";

type Screen = "home" | "practice" | "verify";

export default function AluSimulator() {
  const [screen, setScreen] = useState<Screen>("home");
  const [n, setN] = useState<BitWidth>(4);

  if (screen === "practice") {
    return (
      <>
        <ConfigBar n={n} onChangeN={setN} />
        <ModePractice key={n} n={n} onBack={() => setScreen("home")} />
      </>
    );
  }

  if (screen === "verify") {
    return (
      <>
        <ConfigBar n={n} onChangeN={setN} />
        <ModeVerify key={n} n={n} onBack={() => setScreen("home")} />
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Edu · ALU n-bit
        </p>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Simulador ALU
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Suma y resta sobre patrones de n bits con vistas binarias y decimales (ℕ y
          complemento a 2). Elige práctica para autocorregir o comprobación para ver el
          resultado exacto.
        </p>
      </header>

      <ConfigBar n={n} onChangeN={setN} />

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500"
          onClick={() => setScreen("practice")}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Práctica
          </span>
          <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Ejercicios aleatorios
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Completa resultado, flags y comparaciones; recibe retroalimentación.
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-500"
          onClick={() => setScreen("verify")}
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">
            Comprobación
          </span>
          <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Calculadora guiada
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Introduce A, B y la operación; muestra binario, decimal y flags.
          </span>
        </button>
      </div>
    </div>
  );
}
