import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectCartProducts } from 'src/app/states/cart/cart.selector';
import { AppState, IProduct } from 'src/app/states/app.state';
import { map, Observable } from 'rxjs';
import {
  decrementProduct,
  incrementProduct,
  removeFromCart,
} from 'src/app/states/cart/cart.action';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css',
})
export class CartItemsComponent {
  @Input() products!: Observable<IProduct[]>;
  @Output() productsChange = new EventEmitter<any[]>();

  constructor(private store: Store<AppState>) {}

  cartService = inject(CartService);

  decreaseQuantity(product: IProduct) {
    if (product.quantity > 1) {
      this.store.dispatch(decrementProduct({ productId: product.id }));
      const bookId = product.id;
      const quantity = product.quantity;
      this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
        console.log('item added to cart');
      });
      this.emitChanges();
    }
  }

  increaseQuantity(product: IProduct) {
    if (product.quantity < 100) {
      this.store.dispatch(incrementProduct({ productId: product.id }));
      const bookId = product.id;
      const quantity = product.quantity;
      this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
        console.log('item added to cart');
      });
      this.emitChanges();
    }
  }

  deleteProduct(product: IProduct) {
    this.cartService.removeCartItem(product.id).subscribe((response) => {
      this.store.dispatch(removeFromCart({ productId: product.id }));
    });
  }

  toggleLike(product: any) {
    product.liked = !product.liked;
    this.emitChanges();
  }

  private emitChanges() {
    this.products.subscribe((product) => {
      this.productsChange.emit(product);
    });
  }
}
