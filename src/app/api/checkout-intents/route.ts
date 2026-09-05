import { z } from "zod";
import { database } from "@/lib/database";
import {
  apiError,
  apiSuccess,
  generateCheckoutReference,
} from "@/lib/api-response";
import { formatInr } from "@/lib/money";

const checkoutIntentSchema = z.object({
  variantId: z.string().min(1, "variantId is required"),
  emiPlanId: z.string().min(1, "emiPlanId is required"),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = checkoutIntentSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(
        "INVALID_BODY",
        "variantId and emiPlanId are required",
        400,
      );
    }

    const plan = await database.emiPlan.findUnique({
      where: { id: parsed.data.emiPlanId },
    });
    if (!plan || plan.variantId !== parsed.data.variantId) {
      return apiError(
        "PLAN_VARIANT_MISMATCH",
        "EMI plan does not belong to this variant",
        400,
      );
    }

    const reference = generateCheckoutReference();
    await database.checkoutIntent.create({
      data: {
        reference,
        variantId: parsed.data.variantId,
        emiPlanId: parsed.data.emiPlanId,
      },
    });

    return apiSuccess(
      {
        reference,
        status: "created",
        monthlyAmountPaise: plan.monthlyAmountPaise,
        monthlyDisplay: formatInr(plan.monthlyAmountPaise),
        tenureMonths: plan.tenureMonths,
      },
      201,
    );
  } catch (error) {
    console.error("[api/checkout-intents] failed", error);
    return apiError("INTERNAL", "Could not create checkout intent", 500);
  }
}
