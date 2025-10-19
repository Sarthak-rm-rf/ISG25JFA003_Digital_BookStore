import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { IProduct } from 'src/app/states/app.state';
import { decrementProduct, incrementProduct } from 'src/app/states/cart/cart.action';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for ngIf
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

  private cartService = inject(CartService);

  constructor(private store: Store) {}

  createCartItemRequest() {
    return {
      bookId: this.product.id,
      quantity: this.product.quantity,
    };
  }

  addToCart(product: IProduct) {
    this.handleAdd.emit(product);
    this.quantity++;
    this.quantityChange.emit(this.quantity);
    const item = this.createCartItemRequest();
    this.cartService.addToCart(item).subscribe((item) => {
      console.log('Item added to cart');
    });
  }

  increment(product: IProduct) {
    const productId = product.id;
    this.store.dispatch(incrementProduct({ productId }));
    this.quantity++;
    const bookId = this.product.id;
    const quantity = this.product.quantity;
    this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
      console.log('item updated on cart');
    });
  }

  decrement(product: IProduct) {
    if (this.quantity > 0) {
      const productId = product.id;
      this.store.dispatch(decrementProduct({ productId }));
      this.quantity--;
      const bookId = this.product.id;
      const quantity = this.product.quantity;
      this.cartService.updateCartItem(bookId, quantity).subscribe((item) => {
        console.log('item updated on cart');
      });
    }
  }
}
