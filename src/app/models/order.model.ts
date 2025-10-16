import { Book } from './book.model';

export interface Order {
  orderId?: number;
  userId: number;
  orderItems: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  orderDate?: string;
  shippingAddress: ShippingAddress;
  paymentId?: number;
}

export interface OrderItem {
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
  CANCELLED = 'CANCELLED'
}

export interface PlaceOrderRequest {
  shippingAddress: ShippingAddress;
}

export interface BuyNowRequest {
  bookId: number;
  quantity: number;
  shippingAddress: ShippingAddress;
}

