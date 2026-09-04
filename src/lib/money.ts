const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(paise: number): string {
  if (!Number.isFinite(paise)) {
    throw new Error("formatInr expected a finite number of paise");
  }
  const rupees = Math.round(paise) / 100;
  return inrFormatter.format(rupees);
}

export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) {
    throw new Error("rupeesToPaise expected a finite number of rupees");
  }
  return Math.round(rupees * 100);
}
