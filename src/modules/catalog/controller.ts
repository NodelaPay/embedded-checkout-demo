import { NextResponse } from "next/server";
import { errorResponse } from "@/infrastructure/http/api-error";
import { catalogService } from "./service";

export class CatalogController {
  static async list() {
    try {
      return NextResponse.json({ products: await catalogService.list() });
    } catch (error) {
      return errorResponse(error);
    }
  }
  static async get(id: string) {
    try {
      const product = await catalogService.getById(id);
      return product
        ? NextResponse.json({ product })
        : NextResponse.json({ error: "Product not found" }, { status: 404 });
    } catch (error) {
      return errorResponse(error);
    }
  }
}
