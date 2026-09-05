import { database } from "@/lib/database";
import { apiError, apiSuccess } from "@/lib/api-response";
import { serializeProductDetail } from "@/lib/serializers";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const product = await database.product.findUnique({
      where: { slug },
      include: {
        variants: {
          include: {
            emiPlans: { orderBy: { displayOrder: "asc" } },
          },
          orderBy: [{ storageLabel: "asc" }, { colourName: "asc" }],
        },
      },
    });

    if (!product) {
      return apiError(
        "PRODUCT_NOT_FOUND",
        `No product with slug "${slug}"`,
        404,
      );
    }

    return apiSuccess(serializeProductDetail(product));
  } catch (error) {
    console.error("[api/products/:slug] failed", error);
    return apiError("INTERNAL", "Could not load product", 500);
  }
}
