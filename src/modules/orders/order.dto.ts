export interface OrderItemDto {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  image: string;
}
export interface OrderDto {
  id: string;
  status: "awaiting_payment";
  subtotal: number;
  total: number;
  currency: "USD";
  createdAt: string;
  items: readonly OrderItemDto[];
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode: string;
  };
}
export interface CreateOrderDto {
  customer: OrderDto["customer"];
  idempotencyKey: string;
}
