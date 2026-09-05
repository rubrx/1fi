"use client";

import { useMemo, useState } from "react";
import type { SerializedProductListItem } from "@/lib/serializers";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGrid } from "./ProductGrid";
import { SearchField } from "./SearchField";

interface MarketplacePanelProps {
  products: readonly SerializedProductListItem[];
}

function matchesQuery(
  product: SerializedProductListItem,
  needle: string,
): boolean {
  const target = `${product.name} ${product.brand}`.toLowerCase();
  return target.includes(needle);
}

export function MarketplacePanel({ products }: MarketplacePanelProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  const visibleProducts = useMemo(() => {
    if (!trimmed) return products;
    return products.filter((product) => matchesQuery(product, trimmed));
  }, [products, trimmed]);

  return (
    <section
      id="section-panel-marketplace"
      role="tabpanel"
      aria-labelledby="section-tab-marketplace"
      className="space-y-5"
    >
      <SearchField value={query} onValueChange={setQuery} />
      <h2 className="text-[26px] font-bold text-ink tracking-tight">
        1Fi Marketplace
      </h2>
      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <EmptyState message={`No products match "${query.trim()}".`} />
      )}
    </section>
  );
}
