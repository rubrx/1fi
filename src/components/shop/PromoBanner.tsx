import { Sparkles } from "lucide-react";

export function PromoBanner() {
  return (
    <section
      aria-labelledby="promo-banner-heading"
      className="relative overflow-hidden rounded-card text-white px-6 pt-6 pb-16 sm:pt-8 sm:pb-20"
      style={{
        background:
          "linear-gradient(135deg, var(--color-banner-from), var(--color-banner-to))",
      }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        No-cost EMIs
      </span>

      <h1
        id="promo-banner-heading"
        className="mt-5 text-[32px] leading-[1.15] font-bold"
      >
        <span className="block">Shop today,</span>
        <span className="block italic font-medium">Pay later using</span>
        <span className="block">Mutual funds.</span>
      </h1>

      <p className="mt-4 max-w-md text-[15px] text-white/80 leading-snug">
        No credit score required. No interest. Backed by your investments.
      </p>
    </section>
  );
}
