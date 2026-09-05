import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function apiError(
  code: string,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

// Excludes O, 0, I, 1 to keep spoken/typed references unambiguous.
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCheckoutReference(): string {
  const bytes = randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += REFERENCE_ALPHABET[bytes[i] & 31];
  }
  return `1FI-${suffix}`;
}
