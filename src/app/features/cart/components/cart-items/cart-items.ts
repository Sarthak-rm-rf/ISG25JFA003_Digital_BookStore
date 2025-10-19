import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectCartProducts } from 'src/app/states/cart/cart.selector';
import { AppState, IProduct } from 'src/app/states/app.state';
import { map, Observable } from 'rxjs';
import { decrementProduct, incrementProduct } from 'src/app/states/cart/cart.action';
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

  decreaseQuantity(product: IProduct) {
    if (product.quantity > 1) {
      this.store.dispatch(decrementProduct({ productId: product.id }));
      this.emitChanges();
    }
  }

  increaseQuantity(product: IProduct) {
    if (product.quantity < 100) {
      this.store.dispatch(incrementProduct({ productId: product.id }));
      this.emitChanges();
    }
  }

  deleteProduct(index: number) {
    this.products.subscribe((product) => product.splice(index, 1));
    this.emitChanges();
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
