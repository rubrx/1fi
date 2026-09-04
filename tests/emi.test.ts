import { describe, expect, it } from "vitest";
import { formatInr } from "../src/lib/money";
import {
  buildEmiPlanLadder,
  computeMonthlyInstalmentPaise,
} from "../src/lib/emi";

const IPHONE_MRP_PAISE = 13490000; // ₹1,34,900

describe("computeMonthlyInstalmentPaise — no-cost reference figures", () => {
  it("3 months on ₹1,34,900 → ₹44,967", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: IPHONE_MRP_PAISE,
      tenureMonths: 3,
      annualRatePercent: 0,
    });
    expect(formatInr(monthly)).toBe("₹44,967");
  });

  it("6 months on ₹1,34,900 → ₹22,483", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: IPHONE_MRP_PAISE,
      tenureMonths: 6,
      annualRatePercent: 0,
    });
    expect(formatInr(monthly)).toBe("₹22,483");
  });

  it("12 months on ₹1,34,900 → ₹11,242", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: IPHONE_MRP_PAISE,
      tenureMonths: 12,
      annualRatePercent: 0,
    });
    expect(formatInr(monthly)).toBe("₹11,242");
  });

  it("24 months on ₹1,34,900 → ₹5,621", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: IPHONE_MRP_PAISE,
      tenureMonths: 24,
      annualRatePercent: 0,
    });
    expect(formatInr(monthly)).toBe("₹5,621");
  });
});

describe("computeMonthlyInstalmentPaise — interest-bearing", () => {
  // Independent check: pay the EMI for `n` months and confirm the remaining
  // balance amortises to ~0. Uses month-by-month simulation, not the closed
  // form the implementation uses.
  function remainingBalanceAfterFullTenure(
    principalPaise: number,
    monthlyInstalmentPaise: number,
    tenureMonths: number,
    annualRatePercent: number,
  ): number {
    const monthlyRate = annualRatePercent / 1200;
    let balance = principalPaise;
    for (let month = 0; month < tenureMonths; month += 1) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = monthlyInstalmentPaise - interestForMonth;
      balance -= principalForMonth;
    }
    return balance;
  }

  it("10.5% for 36 months on MRP ₹1,34,900 amortises to ~0", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: IPHONE_MRP_PAISE,
      tenureMonths: 36,
      annualRatePercent: 10.5,
    });
    const residual = remainingBalanceAfterFullTenure(
      IPHONE_MRP_PAISE,
      monthly,
      36,
      10.5,
    );
    // Tolerance: half a rupee (50 paise) across 36 rounded instalments.
    expect(Math.abs(residual)).toBeLessThan(50);
  });

  it("known reference: ₹1,00,000 at 12% for 12 months → ₹8,885/mo", () => {
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: 10000000,
      tenureMonths: 12,
      annualRatePercent: 12,
    });
    expect(formatInr(monthly)).toBe("₹8,885");
  });
});

describe("computeMonthlyInstalmentPaise — edge cases", () => {
  it("tenure of 1 at 0% returns the full principal", () => {
    expect(
      computeMonthlyInstalmentPaise({
        principalPaise: IPHONE_MRP_PAISE,
        tenureMonths: 1,
        annualRatePercent: 0,
      }),
    ).toBe(IPHONE_MRP_PAISE);
  });

  it("tenure of 1 at 12% is principal plus one month's interest", () => {
    // ₹100 × (1 + 0.01) = ₹101
    expect(
      computeMonthlyInstalmentPaise({
        principalPaise: 10000,
        tenureMonths: 1,
        annualRatePercent: 12,
      }),
    ).toBe(10100);
  });

  it("repeating-decimal rate returns an integer paise value", () => {
    // 6% / 3 months on ₹100 → real answer ≈ 33.67 → 3367 paise
    const monthly = computeMonthlyInstalmentPaise({
      principalPaise: 10000,
      tenureMonths: 3,
      annualRatePercent: 6,
    });
    expect(Number.isInteger(monthly)).toBe(true);
    expect(monthly).toBe(3367);
  });

  it("throws on non-positive tenure", () => {
    expect(() =>
      computeMonthlyInstalmentPaise({
        principalPaise: 10000,
        tenureMonths: 0,
        annualRatePercent: 0,
      }),
    ).toThrow();
  });
});

describe("buildEmiPlanLadder", () => {
  const ladder = buildEmiPlanLadder({
    mrpPaise: IPHONE_MRP_PAISE,
    cashbackPaise: 750000,
  });

  it("produces 7 rungs in the 3/6/12/24/36/48/60 order", () => {
    expect(ladder.map((r) => r.tenureMonths)).toEqual([
      3, 6, 12, 24, 36, 48, 60,
    ]);
  });

  it("marks tenures at 0% as no-cost and others as interest-bearing", () => {
    expect(ladder.filter((r) => r.isNoCost).map((r) => r.tenureMonths)).toEqual(
      [3, 6, 12, 24],
    );
    expect(
      ladder.filter((r) => !r.isNoCost).map((r) => r.tenureMonths),
    ).toEqual([36, 48, 60]);
  });

  it("uses MRP as principal even for no-cost plans (₹1,34,900 ÷ 3 = ₹44,967)", () => {
    const threeMonth = ladder.find((r) => r.tenureMonths === 3)!;
    expect(formatInr(threeMonth.monthlyAmountPaise)).toBe("₹44,967");
  });

  it("totalPayablePaise = monthlyAmountPaise × tenureMonths on every row", () => {
    for (const row of ladder) {
      expect(row.totalPayablePaise).toBe(
        row.monthlyAmountPaise * row.tenureMonths,
      );
    }
  });

  it("applies the flat cashback to every row", () => {
    for (const row of ladder) {
      expect(row.cashbackPaise).toBe(750000);
    }
  });

  it("assigns displayOrder ascending from 0", () => {
    expect(ladder.map((r) => r.displayOrder)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
});
