import { database } from "@/lib/database";
import { apiError, apiSuccess } from "@/lib/api-response";
import { serializeEmiPlan } from "@/lib/serializers";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const variantId = new URL(request.url).searchParams.get("variantId");

    if (!variantId) {
      return apiError(
        "MISSING_VARIANT_ID",
        "variantId query parameter is required",
        400,
      );
    }

    const variant = await database.variant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
        emiPlans: { orderBy: { displayOrder: "asc" } },
      },
    });

    if (!variant || variant.product.slug !== slug) {
      return apiError(
        "PLAN_VARIANT_MISMATCH",
        "Variant not found for this product",
        404,
      );
    }

    return apiSuccess(variant.emiPlans.map(serializeEmiPlan));
  } catch (error) {
    console.error("[api/products/:slug/emi-plans] failed", error);
    return apiError("INTERNAL", "Could not load EMI plans", 500);
  }
}
