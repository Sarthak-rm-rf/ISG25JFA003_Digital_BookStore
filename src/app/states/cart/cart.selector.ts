import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CartState } from './cart.reducer';

export const selectCartState = (state: AppState) => state.cart;

export const selectCartProducts = createSelector(selectCartState, (state: CartState) => {
  return state.products;
});
