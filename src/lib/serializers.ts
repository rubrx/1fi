import { Prisma } from "@prisma/client";
import type { EmiPlan } from "@prisma/client";
import { formatInr } from "./money";

type ProductWithFullNesting = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: { emiPlans: true };
    };
  };
}>;

type VariantWithPlans = Prisma.VariantGetPayload<{
  include: { emiPlans: true };
}>;

export interface SerializedEmiPlan {
  id: string;
  tenureMonths: number;
  monthlyAmountPaise: number;
  monthlyDisplay: string;
  annualRatePercent: string;
  interestLabel: string;
  isNoCost: boolean;
  cashbackPaise: number;
  cashbackDisplay: string;
  totalPayablePaise: number;
  totalPayableDisplay: string;
}

export interface SerializedVariant {
  id: string;
  storageLabel: string;
  colourName: string;
  colourHex: string;
  imageUrl: string;
  mrpPaise: number;
  mrpDisplay: string;
  pricePaise: number;
  priceDisplay: string;
  isDefault: boolean;
  inStock: boolean;
  emiPlans: SerializedEmiPlan[];
}

export interface SerializedProductDetail {
  slug: string;
  name: string;
  brand: string;
  category: string;
  isNew: boolean;
  description: string | null;
  variants: SerializedVariant[];
}

export interface SerializedProductListItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  isNew: boolean;
  imageUrl: string;
  fromPricePaise: number;
  fromPriceDisplay: string;
  lowestMonthlyPaise: number;
  lowestMonthlyDisplay: string;
  variantCount: number;
}

function interestLabelFor(rate: Prisma.Decimal): string {
  const asNumber = Number(rate);
  return asNumber === 0 ? "0% interest" : `${asNumber}% interest`;
}

export function serializeEmiPlan(plan: EmiPlan): SerializedEmiPlan {
  return {
    id: plan.id,
    tenureMonths: plan.tenureMonths,
    monthlyAmountPaise: plan.monthlyAmountPaise,
    monthlyDisplay: formatInr(plan.monthlyAmountPaise),
    annualRatePercent: Number(plan.annualRatePercent).toFixed(2),
    interestLabel: interestLabelFor(plan.annualRatePercent),
    isNoCost: plan.isNoCost,
    cashbackPaise: plan.cashbackPaise,
    cashbackDisplay: formatInr(plan.cashbackPaise),
    totalPayablePaise: plan.totalPayablePaise,
    totalPayableDisplay: formatInr(plan.totalPayablePaise),
  };
}

export function serializeVariant(variant: VariantWithPlans): SerializedVariant {
  return {
    id: variant.id,
    storageLabel: variant.storageLabel,
    colourName: variant.colourName,
    colourHex: variant.colourHex,
    imageUrl: variant.imageUrl,
    mrpPaise: variant.mrpPaise,
    mrpDisplay: formatInr(variant.mrpPaise),
    pricePaise: variant.pricePaise,
    priceDisplay: formatInr(variant.pricePaise),
    isDefault: variant.isDefault,
    inStock: variant.inStock,
    emiPlans: variant.emiPlans.map(serializeEmiPlan),
  };
}

export function serializeProductDetail(
  product: ProductWithFullNesting,
): SerializedProductDetail {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    isNew: product.isNew,
    description: product.description,
    variants: product.variants.map(serializeVariant),
  };
}

export function serializeProductListItem(
  product: ProductWithFullNesting,
): SerializedProductListItem {
  const variantsInStock = product.variants.filter((v) => v.inStock);
  const priceCandidates = variantsInStock.length
    ? variantsInStock
    : product.variants;

  const cheapestVariant = priceCandidates.reduce((cheapest, current) =>
    current.pricePaise < cheapest.pricePaise ? current : cheapest,
  );

  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];

  const allPlans = product.variants.flatMap((v) => v.emiPlans);
  const lowestMonthlyPaise = allPlans.reduce(
    (lowest, plan) =>
      plan.monthlyAmountPaise < lowest ? plan.monthlyAmountPaise : lowest,
    Number.POSITIVE_INFINITY,
  );

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    isNew: product.isNew,
    imageUrl: defaultVariant.imageUrl,
    fromPricePaise: cheapestVariant.pricePaise,
    fromPriceDisplay: formatInr(cheapestVariant.pricePaise),
    lowestMonthlyPaise,
    lowestMonthlyDisplay: formatInr(lowestMonthlyPaise),
    variantCount: product.variants.length,
  };
}
