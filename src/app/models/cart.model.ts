import { Book } from './book.model';

export interface Cart {
  cartId?: number;
  userId: number;
  cartItems: CartItem[];
  totalAmount?: number;
}

export interface CartItem {
  cartItemId?: number;
  book: Book;
  quantity: number;
  price?: number;
}

export interface AddToCartRequest {
  bookId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  bookId: number;
  quantity: number;
}

