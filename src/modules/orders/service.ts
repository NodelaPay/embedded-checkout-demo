import { DomainError } from "@/shared/domain-error";
import type { CartServiceContract } from "@/modules/cart/service";
import { cartService } from "@/modules/cart/service";
import type { CatalogServiceContract } from "@/modules/catalog/service";
import { catalogService } from "@/modules/catalog/service";
import type { CreateOrderDto, OrderDto, OrderItemDto } from "./order.dto";
import type { OrderRepository } from "./repository.contract";
import { OrderRepositoryFactory } from "./repository.factory";

export interface OrdersServiceContract {
  list(guestId: string): Promise<readonly OrderDto[]>;
  quote(
    guestId: string,
  ): Promise<{
    items: readonly OrderItemDto[];
    subtotal: number;
    total: number;
    currency: "USD";
  }>;
  create(guestId: string, input: CreateOrderDto): Promise<OrderDto>;
}
export class OrdersService implements OrdersServiceContract {
  constructor(
    private readonly repository: OrderRepository,
    private readonly cart: CartServiceContract,
    private readonly catalog: CatalogServiceContract,
  ) {}
  list(guestId: string) {
    return this.repository.list(guestId);
  }
  async quote(guestId: string) {
    const cartItems = await this.cart.list(guestId);
    const products = await this.catalog.list();
    const items: OrderItemDto[] = cartItems.map(({ productId, quantity }) => {
      const product = products.find((candidate) => candidate.id === productId);
      if (!product || product.stock < quantity)
        throw new DomainError(
          "invalid_input",
          `Product ${productId} is unavailable`,
        );
      return {
        productId,
        title: product.title,
        unitPrice: product.price,
        quantity,
        image: product.image,
      };
    });
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    return { items, subtotal, total: subtotal, currency: "USD" as const };
  }
  async create(guestId: string, input: CreateOrderDto) {
    const existing = await this.repository.getByKey(
      guestId,
      input.idempotencyKey,
    );
    if (existing) return existing;
    const quote = await this.quote(guestId);
    if (quote.items.length === 0)
      throw new DomainError("invalid_input", "Bag is empty");
    const order = await this.repository.create(
      guestId,
      input.idempotencyKey,
      input.customer,
      quote.items,
    );
    await this.cart.clear(guestId);
    return order;
  }
}
export const ordersService: OrdersServiceContract = new OrdersService(
  OrderRepositoryFactory.create(),
  cartService,
  catalogService,
);
