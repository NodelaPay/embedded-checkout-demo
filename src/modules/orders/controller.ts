import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse } from "@/infrastructure/http/api-error";
import { guestSession } from "@/infrastructure/http/guest-session";
import { enforceRateLimit } from "@/infrastructure/http/rate-limit";
import { ordersService } from "./service";
const schema = z.object({
  idempotencyKey: z.uuid(),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.email().max(254),
    phone: z.string().trim().min(1).max(40),
    city: z.string().trim().min(1).max(120),
    address: z.string().trim().min(1).max(300),
    postalCode: z.string().trim().min(1).max(30),
  }),
});
export class OrdersController {
  static async list(request: NextRequest) {
    try {
      const session = guestSession(request);
      return session.attach(
        NextResponse.json({ orders: await ordersService.list(session.id) }),
      );
    } catch (error) {
      return errorResponse(error);
    }
  }
  static async quote(request: NextRequest) {
    try {
      const session = guestSession(request);
      return session.attach(
        NextResponse.json(await ordersService.quote(session.id)),
      );
    } catch (error) {
      return errorResponse(error);
    }
  }
  static async create(request: NextRequest) {
    try {
      await enforceRateLimit(request, "orders:create", 10, 60);
      const session = guestSession(request);
      const input = schema.parse(await request.json());
      const order = await ordersService.create(session.id, input);
      return session.attach(NextResponse.json({ order }, { status: 201 }));
    } catch (error) {
      return errorResponse(error);
    }
  }
}
