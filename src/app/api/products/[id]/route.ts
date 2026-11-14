import { CatalogController } from "@/modules/catalog/controller";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return CatalogController.get((await params).id);
}
