import type { OrderDto, OrderItemDto } from "./order.dto";
export interface OrderRepository {
  list(guestId: string): Promise<readonly OrderDto[]>;
  get(guestId: string, orderId: string): Promise<OrderDto | undefined>;
  markPaid(orderId: string): Promise<void>;
  getByKey(guestId: string, key: string): Promise<OrderDto | undefined>;
  create(
    guestId: string,
    key: string,
    customer: OrderDto["customer"],
    items: readonly OrderItemDto[],
  ): Promise<OrderDto>;
}
