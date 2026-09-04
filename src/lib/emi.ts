// No-cost EMI amortises MRP, not the discounted price, because the "no-cost"
// framing means the customer forgoes the up-front discount in exchange for
// paying the sticker price over tenure at 0% interest. Amortising the sale
// price would let the customer capture both the discount and the interest-free
// financing, which is not what the merchant or 1Fi bears. Every plan in a
// no-cost ladder therefore uses mrpPaise as principal — monthly x tenure sums
// back to the MRP, and the sale-vs-MRP delta is the customer's forgone value.

export interface ComputeMonthlyInstalmentInput {
  principalPaise: number;
  tenureMonths: number;
  annualRatePercent: number;
}

export function computeMonthlyInstalmentPaise({
  principalPaise,
  tenureMonths,
  annualRatePercent,
}: ComputeMonthlyInstalmentInput): number {
  if (tenureMonths <= 0) {
    throw new Error("tenureMonths must be positive");
  }
  if (principalPaise < 0 || annualRatePercent < 0) {
    throw new Error("principalPaise and annualRatePercent must be non-negative");
  }

  if (annualRatePercent === 0) {
    return Math.round(principalPaise / tenureMonths);
  }

  const monthlyRate = annualRatePercent / 1200;
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);
  return Math.round(
    (principalPaise * monthlyRate * growthFactor) / (growthFactor - 1),
  );
}

export interface EmiPlanLadderRow {
  tenureMonths: number;
  annualRatePercent: number;
  monthlyAmountPaise: number;
  totalPayablePaise: number;
  cashbackPaise: number;
  isNoCost: boolean;
  displayOrder: number;
}

export interface BuildEmiPlanLadderInput {
  mrpPaise: number;
  cashbackPaise: number;
}

const STANDARD_TENURE_LADDER: ReadonlyArray<{
  tenureMonths: number;
  annualRatePercent: number;
}> = [
  { tenureMonths: 3, annualRatePercent: 0 },
  { tenureMonths: 6, annualRatePercent: 0 },
  { tenureMonths: 12, annualRatePercent: 0 },
  { tenureMonths: 24, annualRatePercent: 0 },
  { tenureMonths: 36, annualRatePercent: 10.5 },
  { tenureMonths: 48, annualRatePercent: 10.5 },
  { tenureMonths: 60, annualRatePercent: 10.5 },
];

export function buildEmiPlanLadder({
  mrpPaise,
  cashbackPaise,
}: BuildEmiPlanLadderInput): EmiPlanLadderRow[] {
  return STANDARD_TENURE_LADDER.map((rung, index) => {
    const monthlyAmountPaise = computeMonthlyInstalmentPaise({
      principalPaise: mrpPaise,
      tenureMonths: rung.tenureMonths,
      annualRatePercent: rung.annualRatePercent,
    });
    return {
      tenureMonths: rung.tenureMonths,
      annualRatePercent: rung.annualRatePercent,
      monthlyAmountPaise,
      totalPayablePaise: monthlyAmountPaise * rung.tenureMonths,
      cashbackPaise,
      isNoCost: rung.annualRatePercent === 0,
      displayOrder: index,
    };
  });
}
