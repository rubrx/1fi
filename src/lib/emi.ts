// TODO(phase-2): implement per SPEC.md §4 and CLAUDE.md rule 3/4.
// No-cost EMI amortises MRP, not the discounted price.

export interface ComputeMonthlyInstalmentInput {
  principalPaise: number;
  tenureMonths: number;
  annualRatePercent: number;
}

export function computeMonthlyInstalmentPaise(
  input: ComputeMonthlyInstalmentInput,
): number {
  void input;
  throw new Error("computeMonthlyInstalmentPaise not implemented (phase 2)");
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

export function buildEmiPlanLadder(
  input: BuildEmiPlanLadderInput,
): EmiPlanLadderRow[] {
  void input;
  throw new Error("buildEmiPlanLadder not implemented (phase 2)");
}
