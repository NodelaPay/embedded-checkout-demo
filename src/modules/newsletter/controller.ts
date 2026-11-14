import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/infrastructure/http/api-error";
import { enforceRateLimit } from "@/infrastructure/http/rate-limit";
import { newsletterService } from "./service";
const schema = z.object({ email: z.email().max(254) });
export class NewsletterController {
  static async post(request: NextRequest) {
    try {
      await enforceRateLimit(request, "newsletter:subscribe", 10, 60);
      const { email } = schema.parse(await request.json());
      await newsletterService.subscribe(email);
      return NextResponse.json({ subscribed: true });
    } catch (error) {
      return errorResponse(error);
    }
  }
}
