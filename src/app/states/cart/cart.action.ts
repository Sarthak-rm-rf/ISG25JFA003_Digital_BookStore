import { createAction, props } from '@ngrx/store';
import { Book } from 'src/app/core/services/book.service';
import { IProduct } from '../app.state';

export const addToCart = createAction('[Cart Component] AddToCart', props<{ product: IProduct }>());

export const incrementProduct = createAction(
  '[Cart Component] IncrementProduct',
  props<{ productId: number }>()
);

export const decrementProduct = createAction(
  '[Cart Component] decrementProduct',
  props<{ productId: number }>()
);

export const clearCart = createAction('[Cart Component] clearCart');

export const loadCart = createAction('[Cart API] Load Cart');

export const loadCartSuccess = createAction(
  '[Cart API] Load Cart Success',
  props<{ products: IProduct[] }>()
);

export const loadCartFailure = createAction(
  '[Cart API] Load Cart Failure',
  props<{ error: any }>()
);
