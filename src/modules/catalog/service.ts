import { z } from "zod";
import type { CacheProvider } from "@/infrastructure/cache/contract";
import { CacheProviderFactory } from "@/infrastructure/cache/factory";
import type { ProductDto } from "./product.dto";
import type { ProductRepository } from "./repository.contract";
import { ProductRepositoryFactory } from "./repository.factory";

const productSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  price: z.number().int(),
  image: z.string(),
  description: z.string(),
  stock: z.number().int(),
});

export interface CatalogServiceContract {
  list(): Promise<readonly ProductDto[]>;
  getById(id: string): Promise<ProductDto | undefined>;
}

export class CatalogService implements CatalogServiceContract {
  constructor(
    private readonly repository: ProductRepository,
    private readonly cache: CacheProvider,
  ) {}
  async list(): Promise<readonly ProductDto[]> {
    try {
      const cached = await this.cache.get("catalog:products:v1");
      if (cached) {
        const parsed = z.array(productSchema).safeParse(JSON.parse(cached));
        if (parsed.success) return parsed.data;
      }
    } catch (error) {
      console.error("Catalog cache read failed", error);
    }
    const products = await this.repository.list();
    try {
      await this.cache.set("catalog:products:v1", JSON.stringify(products), 60);
    } catch (error) {
      console.error("Catalog cache write failed", error);
    }
    return products;
  }
  async getById(id: string): Promise<ProductDto | undefined> {
    return (await this.list()).find((item) => item.id === id);
  }
}

export const catalogService: CatalogServiceContract = new CatalogService(
  ProductRepositoryFactory.create(),
  CacheProviderFactory.create(),
);
