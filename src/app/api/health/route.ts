import { database } from "@/lib/database";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    await database.$queryRaw`SELECT 1`;
    return apiSuccess({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("[api/health] db check failed", error);
    return apiError("DB_UNREACHABLE", "Database is not reachable", 503);
  }
}
