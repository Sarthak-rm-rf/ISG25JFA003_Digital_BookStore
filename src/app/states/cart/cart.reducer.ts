import { createReducer, on } from '@ngrx/store';
import { addToCart, decrementProduct, incrementProduct } from './cart.action';
import { Book } from 'src/app/core/services/book.service';
import { IProduct } from '../app.state';

export interface CartState {
  products: IProduct[];
}

export const initialState: CartState = {
  products: [],
};

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { product }) => {
    const updatedProduct = [...state.products, product];
    return {
      ...state,
      products: updatedProduct,
    };
  }),
  on(incrementProduct, (state, { productId }) => {
    const updatedProduct = state.products.map((product) =>
      product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
    );
    return {
      ...state,
      products: updatedProduct,
    };
  }),
  on(decrementProduct, (state, { productId }) => {
    const updatedProduct = state.products.map((product) =>
      product.id === productId ? { ...product, quantity: product.quantity - 1 } : product
    );
    return {
      ...state,
      products: updatedProduct,
    };
  })
);
