interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface OrderRequest {
  cartId: number | string;
  addressId: number | string;
  items: OrderItem[];
}
