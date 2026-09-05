import { Suspense } from "react";
import type { Metadata } from "next";
import { database } from "@/lib/database";
import { serializeProductListItem } from "@/lib/serializers";
import { AppShell } from "@/components/ui/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { SectionTabs } from "@/components/shop/SectionTabs";
import { MarketplacePanel } from "@/components/shop/MarketplacePanel";
import { EmptySection } from "@/components/shop/EmptySection";

export const metadata: Metadata = {
  title: "Shop · 1Fi",
  description: "Shop today, pay later using mutual funds.",
};

const VALID_TABS = new Set(["top-brands", "nearby-stores", "marketplace"]);
const DEFAULT_TAB = "marketplace" as const;

type TabValue = "top-brands" | "nearby-stores" | "marketplace";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function loadMarketplaceProducts() {
  const products = await database.product.findMany({
    include: {
      variants: {
        include: { emiPlans: true },
        orderBy: [{ storageLabel: "asc" }, { colourName: "asc" }],
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return products.map(serializeProductListItem);
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const rawTab = typeof params.tab === "string" ? params.tab : undefined;
  const activeTab: TabValue =
    rawTab && VALID_TABS.has(rawTab) ? (rawTab as TabValue) : DEFAULT_TAB;

  const marketplaceProducts =
    activeTab === "marketplace" ? await loadMarketplaceProducts() : null;

  return (
    <AppShell>
      <main className="px-5 pt-5 pb-8 md:px-8 md:pt-8">
        <PromoBanner />
        <div className="relative -mt-6 md:-mt-7 z-10">
          <Suspense fallback={<Skeleton className="h-12 w-full" />}>
            <SectionTabs />
          </Suspense>
        </div>
        <div className="mt-6">
          {activeTab === "marketplace" && marketplaceProducts ? (
            <MarketplacePanel products={marketplaceProducts} />
          ) : null}
          {activeTab === "top-brands" ? (
            <EmptySection section="top-brands" />
          ) : null}
          {activeTab === "nearby-stores" ? (
            <EmptySection section="nearby-stores" />
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
