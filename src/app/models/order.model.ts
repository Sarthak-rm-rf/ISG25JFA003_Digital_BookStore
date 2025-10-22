import { Book } from './book.model';

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


export interface DetailedOrderItem {
  orderItemId?: number;
  book: Book;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  shippingAddressId?: number;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface Order {
  orderId?: number;
  userId: number;
  orderItems: DetailedOrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  orderDate?: string;
  shippingAddress: ShippingAddress;
  paymentId?: number;
}

export interface PlaceOrderRequest {
  shippingAddress: ShippingAddress;
}

export interface BuyNowRequest {
  bookId: number;
  quantity: number;
  shippingAddress: ShippingAddress;
}