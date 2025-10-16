import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for ngIf
  templateUrl: './add-to-cart-button.html',
  styleUrls: ['./add-to-cart-button.css']
})
export class AddToCartButton {

  @Input()
  quantity: number = 0;


  @Output()
  quantityChange = new EventEmitter<number>();


  increment() {
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }


  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}