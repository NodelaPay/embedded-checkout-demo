import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/infrastructure/http/api-error";
import { guestSession } from "@/infrastructure/http/guest-session";
import { enforceRateLimit } from "@/infrastructure/http/rate-limit";
import { accountService } from "./service";
const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40),
  city: z.string().trim().max(120),
  address: z.string().trim().max(300),
  postalCode: z.string().trim().max(30),
});
export class AccountController {
  static async get(request: NextRequest) {
    try {
      const session = guestSession(request);
      return session.attach(
        NextResponse.json({
          profile: (await accountService.get(session.id)) ?? null,
        }),
      );
    } catch (error) {
      return errorResponse(error);
    }
  }
  static async put(request: NextRequest) {
    try {
      await enforceRateLimit(request, "account:write", 30, 60);
      const session = guestSession(request);
      const profile = profileSchema.parse(await request.json());
      await accountService.save(session.id, profile);
      return session.attach(NextResponse.json({ profile }));
    } catch (error) {
      return errorResponse(error);
    }
  }
  static async delete(request: NextRequest) {
    try {
      await enforceRateLimit(request, "account:write", 30, 60);
      const session = guestSession(request);
      await accountService.remove(session.id);
      return session.attach(NextResponse.json({ profile: null }));
    } catch (error) {
      return errorResponse(error);
    }
  }
}
