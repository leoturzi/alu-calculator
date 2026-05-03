# ALU Calculator (Simulador ALU)

Interactive web app for learning how **n-bit addition and subtraction** work the way an arithmetic unit does: binary operands, ripple carry, status flags, and how results read in **unsigned (ℕ)** vs **two’s-complement (ℤ)** interpretation.

The **UI is in Spanish** (labels such as *Operación*, *Banderas*, *Comparación*, *Interpretación*). Core logic lives in `lib/alu/` and is covered by unit tests.

## What you can do

- Choose **bit width** `4`, `8`, `16`, or `32` and operation **add** or **sub** (subtraction as *A + ¬B + 1* with per-column visualization where relevant).
- Enter operands as binary strings and fill in:
  - Result (and negated *B* for subtraction when applicable)
  - Decimal views as natural numbers and as signed values
  - **Flags** Z (zero), N (negative / sign), C (carry), V (overflow)
  - **Unsigned vs signed** comparisons (greater / equal / less)
  - **Interpretation**: whether the bit pattern is “valid” in ℕ vs ℤ and which flag backs that (e.g. carry vs overflow)
- **Práctica**: generate random operands for drill.
- **Calcular**: reveal the correct answers from the engine (does not replace your own practice unless you use it as a check).
- **Validar**: compare your entries to the derived ALU state and highlight mistakes.

## Tech stack

- [Next.js](https://nextjs.org) (App Router), React 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Vitest](https://vitest.dev) for tests
- [Geist Mono](https://vercel.com/font) for numeric/binary display

## Scripts

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
npm test       # vitest run
```

## Layout

| Path | Role |
|------|------|
| `app/` | Next.js routes, layout, global styles |
| `components/alu/` | Calculator UI (toolbar, workbench, flags, comparison, interpretation) |
| `lib/alu/` | Binary helpers, ripple add/subtract, flags, comparison, validation, practice helpers |

## Learn more about Next.js

This repo started from `create-next-app`. For framework docs and deployment, see [Next.js documentation](https://nextjs.org/docs).
