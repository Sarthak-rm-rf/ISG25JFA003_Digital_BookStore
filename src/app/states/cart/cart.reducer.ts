import { createReducer, on } from '@ngrx/store';
import {
  addToCart,
  clearCart,
  decrementProduct,
  incrementProduct,
  loadCart,
  loadCartFailure,
  loadCartSuccess,
  removeFromCart,
} from './cart.action';
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
  on(loadCart, (state) => ({
    ...state,
    loading: true, // Set loading to true when the request starts
    error: null,
  })),

  on(loadCartSuccess, (state, { products }) => ({
    ...state,
    products: products, // Replace state with data from backend
    loading: false,
  })),

  on(loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false, // Stop loading
    error: error, // Store the error
  })),
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
  }),
  on(clearCart, (state) => {
    return {
      ...state,
      products: [],
    };
  }),
  on(removeFromCart, (state, { productId }) => {
    const updatedProduct = state.products.filter((product) => product.id !== productId);
    return {
      ...state,
      products: updatedProduct,
    };
  })
);
