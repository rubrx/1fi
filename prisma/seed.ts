import { PrismaClient } from "@prisma/client";
import { buildEmiPlanLadder } from "../src/lib/emi";

interface VariantSpec {
  storageLabel: string;
  colourName: string;
  colourHex: string;
  mrpPaise: number;
  pricePaise: number;
  isDefault: boolean;
}

interface ProductSpec {
  slug: string;
  name: string;
  brand: string;
  category: string;
  isNew: boolean;
  description: string;
  cashbackPaise: number;
  variants: VariantSpec[];
}

const productCatalogue: ProductSpec[] = [
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    category: "Smartphones",
    isNew: true,
    description:
      "Titanium body, A19 Pro chip, and the redesigned Pro camera system.",
    cashbackPaise: 750000,
    variants: [
      {
        storageLabel: "256GB",
        colourName: "Cosmic Orange",
        colourHex: "#C8622F",
        mrpPaise: 13490000,
        pricePaise: 12740000,
        isDefault: true,
      },
      {
        storageLabel: "256GB",
        colourName: "Silver",
        colourHex: "#E5E4E2",
        mrpPaise: 13490000,
        pricePaise: 12740000,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Cosmic Orange",
        colourHex: "#C8622F",
        mrpPaise: 15490000,
        pricePaise: 14690000,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Silver",
        colourHex: "#E5E4E2",
        mrpPaise: 15490000,
        pricePaise: 14690000,
        isDefault: false,
      },
    ],
  },
  {
    slug: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    isNew: false,
    description:
      "Galaxy AI, 200MP camera, and a built-in S Pen in a titanium frame.",
    cashbackPaise: 650000,
    variants: [
      {
        storageLabel: "256GB",
        colourName: "Titanium Black",
        colourHex: "#2E2E2E",
        mrpPaise: 12999900,
        pricePaise: 10999900,
        isDefault: true,
      },
      {
        storageLabel: "256GB",
        colourName: "Titanium Grey",
        colourHex: "#7C7C7A",
        mrpPaise: 12999900,
        pricePaise: 10999900,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Titanium Black",
        colourHex: "#2E2E2E",
        mrpPaise: 13999900,
        pricePaise: 11999900,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Titanium Grey",
        colourHex: "#7C7C7A",
        mrpPaise: 13999900,
        pricePaise: 11999900,
        isDefault: false,
      },
    ],
  },
  {
    slug: "oneplus-13",
    name: "OnePlus 13",
    brand: "OnePlus",
    category: "Smartphones",
    isNew: true,
    description:
      "Snapdragon 8 Elite, Hasselblad camera, and a 6000mAh silicon-carbon battery.",
    cashbackPaise: 400000,
    variants: [
      {
        storageLabel: "256GB",
        colourName: "Midnight Ocean",
        colourHex: "#0A2A55",
        mrpPaise: 6999900,
        pricePaise: 6499900,
        isDefault: true,
      },
      {
        storageLabel: "256GB",
        colourName: "Arctic Dawn",
        colourHex: "#E8ECF0",
        mrpPaise: 6999900,
        pricePaise: 6499900,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Midnight Ocean",
        colourHex: "#0A2A55",
        mrpPaise: 7499900,
        pricePaise: 6999900,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Arctic Dawn",
        colourHex: "#E8ECF0",
        mrpPaise: 7499900,
        pricePaise: 6999900,
        isDefault: false,
      },
    ],
  },
  {
    slug: "macbook-air-m4",
    name: "MacBook Air M4",
    brand: "Apple",
    category: "Laptops",
    isNew: true,
    description:
      "Apple M4, 18-hour battery life, and a fanless design in a 1.24kg body.",
    cashbackPaise: 800000,
    variants: [
      {
        storageLabel: "256GB",
        colourName: "Midnight",
        colourHex: "#1F2937",
        mrpPaise: 11490000,
        pricePaise: 10490000,
        isDefault: true,
      },
      {
        storageLabel: "256GB",
        colourName: "Starlight",
        colourHex: "#F5F0E6",
        mrpPaise: 11490000,
        pricePaise: 10490000,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Midnight",
        colourHex: "#1F2937",
        mrpPaise: 13490000,
        pricePaise: 12490000,
        isDefault: false,
      },
      {
        storageLabel: "512GB",
        colourName: "Starlight",
        colourHex: "#F5F0E6",
        mrpPaise: 13490000,
        pricePaise: 12490000,
        isDefault: false,
      },
    ],
  },
];

function colourSlug(colourName: string): string {
  return colourName.toLowerCase().replace(/\s+/g, "-");
}

function imageUrlFor(productSlug: string, colourName: string): string {
  return `/products/${productSlug}-${colourSlug(colourName)}.webp`;
}

const database = new PrismaClient();

async function main() {
  // Build every ladder up-front so a bug in emi.ts fails before we touch the DB.
  const ladderByVariantKey = new Map<string, ReturnType<typeof buildEmiPlanLadder>>();
  for (const product of productCatalogue) {
    for (const variant of product.variants) {
      const key = `${product.slug}::${variant.storageLabel}::${variant.colourName}`;
      ladderByVariantKey.set(
        key,
        buildEmiPlanLadder({
          mrpPaise: variant.mrpPaise,
          cashbackPaise: product.cashbackPaise,
        }),
      );
    }
  }

  // Idempotent: wipe in dependency order, then insert.
  await database.checkoutIntent.deleteMany({});
  await database.emiPlan.deleteMany({});
  await database.variant.deleteMany({});
  await database.product.deleteMany({});

  let insertedVariants = 0;
  let insertedPlans = 0;

  for (const product of productCatalogue) {
    const createdProduct = await database.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        category: product.category,
        isNew: product.isNew,
        description: product.description,
      },
    });

    for (const variant of product.variants) {
      const createdVariant = await database.variant.create({
        data: {
          productId: createdProduct.id,
          storageLabel: variant.storageLabel,
          colourName: variant.colourName,
          colourHex: variant.colourHex,
          mrpPaise: variant.mrpPaise,
          pricePaise: variant.pricePaise,
          imageUrl: imageUrlFor(product.slug, variant.colourName),
          isDefault: variant.isDefault,
        },
      });
      insertedVariants += 1;

      const ladder = ladderByVariantKey.get(
        `${product.slug}::${variant.storageLabel}::${variant.colourName}`,
      )!;
      for (const plan of ladder) {
        await database.emiPlan.create({
          data: {
            variantId: createdVariant.id,
            tenureMonths: plan.tenureMonths,
            annualRatePercent: plan.annualRatePercent,
            monthlyAmountPaise: plan.monthlyAmountPaise,
            totalPayablePaise: plan.totalPayablePaise,
            cashbackPaise: plan.cashbackPaise,
            isNoCost: plan.isNoCost,
            displayOrder: plan.displayOrder,
          },
        });
        insertedPlans += 1;
      }
    }
  }

  console.log(
    `Seed complete: ${productCatalogue.length} products, ${insertedVariants} variants, ${insertedPlans} EMI plans`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await database.$disconnect();
  });
