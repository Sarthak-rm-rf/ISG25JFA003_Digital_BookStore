import { createSelector } from '@ngrx/store';
import { AppState, IProduct } from '../app.state';
import { CartState } from './cart.reducer';

export const selectCartState = (state: AppState) => state.cart;

export const selectCartProducts = createSelector(selectCartState, (state: CartState) => {
  return state.products;
});

export const selectTotalCartItemCount = createSelector(
  selectCartProducts,
  (products: IProduct[]): number => {
    return products.reduce((total, product) => total + product.quantity, 0);
  }
);

export const selectProductQuantityInCart = (props: { productId: number }) =>
  createSelector(selectCartProducts, (items: IProduct[]) => {
    const item = items.find((i) => i.id === props.productId);
    return item ? item.quantity : 0;
  });
