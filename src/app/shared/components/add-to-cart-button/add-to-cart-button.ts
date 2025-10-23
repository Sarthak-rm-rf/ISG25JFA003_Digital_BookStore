import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState, IProduct } from 'src/app/states/app.state';
import {
  decrementProduct,
  incrementProduct,
  removeFromCart,
} from 'src/app/states/cart/cart.action';
import { CartService } from 'src/app/core/services/cart.service';
import { Subscription } from 'rxjs';
import { selectProductQuantityInCart } from 'src/app/states/cart/cart.selector';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-button.html',
  styleUrls: ['./add-to-cart-button.css'],
})
export class AddToCartButton {
  @Input()
  product!: IProduct;
  quantity: number = 0;

  @Output()
  handleAdd = new EventEmitter<IProduct>();
  quantityChange = new EventEmitter<number>();

  private quantitySub!: Subscription;
  private cartService = inject(CartService);

  constructor(private store: Store<AppState>, private router: Router , private toast : ToastService) {}

  ngOnInit() {
    if (this.product && this.product.id) {
      this.quantitySub = this.store
        .select(selectProductQuantityInCart({ productId: this.product.id }))
        .subscribe((quantityFromStore) => {
          this.quantity = quantityFromStore;
        });
    }
  }

  ngOnDestroy(): void {
    if (this.quantitySub) {
      this.quantitySub.unsubscribe();
    }
  }

  removeFromCart() {
    this.store.dispatch(removeFromCart({ productId: this.product.id }));
  }

  createCartItemRequest() {
    return {
      bookId: this.product.id,
      quantity: 1,
    };
  }

  addToCart(product: IProduct) {
    this.handleAdd.emit(product);
    this.quantityChange.emit(this.quantity);
    const item = this.createCartItemRequest();
    this.cartService.addToCart(item).subscribe((item) => {
      console.log('Item added to cart');
    });

    this.showToast(product.title);
  }

  increment(product: IProduct) {
    const productId = product.id;
    this.store.dispatch(incrementProduct({ productId }));
    const bookId = this.product.id;
    const quantity = this.quantity + 1;
    this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
      console.log('item updated on cart');
    });
  }

  decrement(product: IProduct) {
    if (this.quantity > 0) {
      const productId = product.id;
      this.store.dispatch(decrementProduct({ productId }));
      const bookId = this.product.id;
      const quantity = this.quantity - 1;
      this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
        console.log('item updated on cart');
      });
    }
  }

  // showToast(title: string) {
  //   toast(`${title} Added to Cart`, {
  //     description: `Your item has been added to cart successfully`,
  //     action: {
  //       label: 'View',
  //       onClick: () => this.router.navigate(['/cart']),
  //     },
  //   });
  // }

  showToast(title: string) {
    this.toast.showSuccess(`${title} added to cart successfully!`);
  }
}
