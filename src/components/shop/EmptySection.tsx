import { EmptyState } from "@/components/ui/EmptyState";

type SectionKind = "top-brands" | "nearby-stores";

const MESSAGES: Record<SectionKind, string> = {
  "top-brands": "Brand partners land here soon.",
  "nearby-stores": "Nearby stores land here soon.",
};

interface EmptySectionProps {
  section: SectionKind;
}

export function EmptySection({ section }: EmptySectionProps) {
  return (
    <section
      id={`section-panel-${section}`}
      role="tabpanel"
      aria-labelledby={`section-tab-${section}`}
    >
      <EmptyState message={MESSAGES[section]} />
    </section>
  );
}
