import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css'
})
export class CartItemsComponent {
  @Input() products: any[] = [];
  @Output() productsChange = new EventEmitter<any[]>();

  decreaseQuantity(product: any) {
    if (product.quantity > 1) product.quantity--;
    this.emitChanges();
  }

  increaseQuantity(product: any) {
    if (product.quantity < 100) product.quantity++;
    this.emitChanges();
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.emitChanges();
  }
  
  toggleLike(product: any) {
    product.liked = !product.liked;
    this.emitChanges();
  }
  
  private emitChanges() {
    this.productsChange.emit(this.products);
  }
}
