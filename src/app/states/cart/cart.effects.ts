import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, forkJoin } from 'rxjs';
import { catchError, map, exhaustMap, mergeMap } from 'rxjs/operators';

import * as CartActions from './cart.action';
import { CartService, CartResponse, CartItemResponse } from 'src/app/core/services/cart.service'; // Adjust path
import { BookService } from 'src/app/core/services/book.service';
import { Book } from 'src/app/models/book.model'; // Adjust path
import { IProduct } from '../app.state'; // Adjust path
import { Store } from '@ngrx/store';
import { clearCart } from './cart.action';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);
  private bookService = inject(BookService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      exhaustMap(() =>
        this.cartService.getCart().pipe(
          mergeMap((response: CartResponse) => {
            if (!response.cartItems || response.cartItems.length === 0) {
              return of([]); // Return an observable of an empty array for empty carts
            }

            // Create an array of observables to fetch full book details
            const observables: Observable<IProduct>[] = response.cartItems.map(
              (item: CartItemResponse) => {
                return this.bookService.getBookById(item.bookId).pipe(
                  map((book: Book) => {
                    // Combine cart item data with full book data
                    return {
                      id: item.bookId,
                      title: item.bookTitle,
                      price: item.price,
                      quantity: item.quantity,
                      author: book.author?.name || '',
                      rating: 4.8, // Assuming book has a rating
                      imageUrl: book.imageUrl || '',
                    };
                  })
                );
              }
            );

            // Wait for all book detail requests to complete
            return forkJoin(observables);
          }),
          // Once all data is fetched and combined, dispatch the success action
          map((finalProducts: IProduct[]) => {
            return CartActions.loadCartSuccess({ products: finalProducts });
          }),
          // If any part of the chain fails, dispatch the failure action
          catchError((error) => of(CartActions.loadCartFailure({ error })))
        )
      )
    )
  );

  constructor(private store: Store) {
    this.store.dispatch(clearCart());
  }
}
