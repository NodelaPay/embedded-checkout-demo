import type { ProductDto } from "./product.dto";

export interface ProductRepository {
  list(): Promise<readonly ProductDto[]>;
}
