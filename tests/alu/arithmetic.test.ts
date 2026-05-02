import { describe, expect, it } from "vitest";
import { rippleAddSubtract } from "../../lib/alu/arithmetic";
import { deriveFlags } from "../../lib/alu/flags";

describe("rippleAddSubtract", () => {
  it("suma 3 + 5 en 4 bits", () => {
    const r = rippleAddSubtract("0011", "0101", 4, "add");
    expect(r.resultBits).toBe("1000");
    expect(r.carryOut).toBe(false);
  });

  it("suma 15 + 1 en 4 bits provoca carry unsigned", () => {
    const r = rippleAddSubtract("1111", "0001", 4, "add");
    expect(r.resultBits).toBe("0000");
    expect(r.carryOut).toBe(true);
  });

  it("resta 5 − 3 en 4 bits", () => {
    const r = rippleAddSubtract("0101", "0011", 4, "sub");
    expect(r.resultBits).toBe("0010");
  });

  it("resta con minuendo menor que sustraendo (unsigned wrap)", () => {
    const r = rippleAddSubtract("0011", "0111", 4, "sub");
    expect(r.resultBits).toBe("1100");
  });

  it("resta 1000 − 0010 (sumador): resultado truncado + cout forma patrón de n+1 bits", () => {
    const r = rippleAddSubtract("1000", "0010", 4, "sub");
    expect(r.resultBits).toBe("0110");
    expect(r.carryOut).toBe(true);
    const extended = `${r.carryOut ? "1" : "0"}${r.resultBits}`;
    expect(extended).toBe("10110");
  });
});

describe("deriveFlags", () => {
  it("detecta overflow con signo en 7 + 1 (4 bits)", () => {
    const ripple = rippleAddSubtract("0111", "0001", 4, "add");
    const f = deriveFlags(ripple.resultBits, ripple);
    expect(f.V).toBe(true);
    expect(f.Z).toBe(false);
    expect(ripple.resultBits).toBe("1000");
    expect(f.C).toBe(false);
  });

  it("en SUB el flag C coincide con cout del sumador (ej. 1000−0010 → cout=1 → C)", () => {
    const ripple = rippleAddSubtract("1000", "0010", 4, "sub");
    expect(ripple.carryOut).toBe(true);
    const f = deriveFlags(ripple.resultBits, ripple);
    expect(f.C).toBe(true);
  });
});
