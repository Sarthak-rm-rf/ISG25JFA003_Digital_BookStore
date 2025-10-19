interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface OrderRequest {
  cartId: number;
  addressId: number;
  items: OrderItem[];
}

interface OrderItemResponse {
  itemId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  addressId: number;
  items: OrderItemResponse[];
  totalAmount: number;
  placedAt: string;
}
