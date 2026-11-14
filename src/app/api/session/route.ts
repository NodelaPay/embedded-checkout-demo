import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { guestSession } from "@/infrastructure/http/guest-session";
export function GET(request: NextRequest) {
  return guestSession(request).attach(NextResponse.json({ ready: true }));
}
