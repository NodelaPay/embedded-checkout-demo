import { Header } from "@/modules/storefront/components";
import { ProductDetail } from "@/modules/catalog/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Header />
      <ProductDetail id={id} />
    </>
  );
}
