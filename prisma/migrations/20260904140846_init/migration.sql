-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "storageLabel" TEXT NOT NULL,
    "colourName" TEXT NOT NULL,
    "colourHex" TEXT NOT NULL,
    "mrpPaise" INTEGER NOT NULL,
    "pricePaise" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmiPlan" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "annualRatePercent" DECIMAL(5,2) NOT NULL,
    "monthlyAmountPaise" INTEGER NOT NULL,
    "totalPayablePaise" INTEGER NOT NULL,
    "cashbackPaise" INTEGER NOT NULL DEFAULT 0,
    "isNoCost" BOOLEAN NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "EmiPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutIntent" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "emiPlanId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_productId_storageLabel_colourName_key" ON "Variant"("productId", "storageLabel", "colourName");

-- CreateIndex
CREATE UNIQUE INDEX "EmiPlan_variantId_tenureMonths_key" ON "EmiPlan"("variantId", "tenureMonths");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutIntent_reference_key" ON "CheckoutIntent"("reference");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmiPlan" ADD CONSTRAINT "EmiPlan_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
