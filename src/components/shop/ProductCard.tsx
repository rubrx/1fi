import Link from "next/link";
import type { SerializedProductListItem } from "@/lib/serializers";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { classNames } from "@/lib/class-names";

interface ProductCardProps {
  product: SerializedProductListItem;
}

// Real product photography isn't shipped in the repo; we render a typographic
// placeholder so the grid still reads as a grid of products in the demo.
function ProductImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="relative aspect-square bg-hairline flex items-center justify-center overflow-hidden">
      <span
        aria-hidden="true"
        className="text-[96px] font-bold text-ink-faint/25 select-none"
      >
        {name.charAt(0)}
      </span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`${product.name} — from ${product.fromPriceDisplay}, EMIs from ${product.lowestMonthlyDisplay} per month`}
      className={classNames(
        "block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "group",
      )}
    >
      <Card className="overflow-hidden transition-shadow group-hover:shadow-md h-full">
        <div className="relative">
          <ProductImagePlaceholder name={product.name} />
          {product.isNew ? (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-pill">
              New
            </span>
          ) : null}
        </div>
        <div className="p-4 space-y-2">
          <Chip>{product.brand}</Chip>
          <h3 className="text-lg font-semibold text-ink leading-snug">
            {product.name}
          </h3>
          <p
            className="text-2xl font-bold text-ink"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {product.fromPriceDisplay}
          </p>
          <p
            className="text-sm font-medium text-brand-violet"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            from {product.lowestMonthlyDisplay}/mo
          </p>
        </div>
      </Card>
    </Link>
  );
}
