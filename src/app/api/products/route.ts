import { database } from "@/lib/database";
import { apiError, apiSuccess } from "@/lib/api-response";
import { serializeProductListItem } from "@/lib/serializers";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("q")?.trim();

    const products = await database.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { brand: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        variants: {
          include: { emiPlans: true },
          orderBy: [{ storageLabel: "asc" }, { colourName: "asc" }],
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return apiSuccess(products.map(serializeProductListItem));
  } catch (error) {
    console.error("[api/products] failed", error);
    return apiError("INTERNAL", "Could not load products", 500);
  }
}
