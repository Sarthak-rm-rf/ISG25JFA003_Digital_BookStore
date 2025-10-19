import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { IProduct } from 'src/app/states/app.state';
import { decrementProduct, incrementProduct } from 'src/app/states/cart/cart.action';

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

  constructor(private store: Store) {}

  addToCart(product: IProduct) {
    this.handleAdd.emit(product);
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }

  increment(product: IProduct) {
    const productId = product.id;
    this.store.dispatch(incrementProduct({ productId }));
    this.quantity++;
  }

  decrement(product: IProduct) {
    if (this.quantity > 0) {
      const productId = product.id;
      this.store.dispatch(decrementProduct({ productId }));
      this.quantity--;
    }
  }
}
