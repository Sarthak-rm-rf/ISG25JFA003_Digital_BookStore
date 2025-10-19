import { CartState } from './cart/cart.reducer';

export interface IProduct {
  id: number;
  author: string;
  title: string;
  rating: number;
  quantity: number;
  imageUrl: string;
  price: number;
}

export interface AppState {
  cart: CartState;
}
