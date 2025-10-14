import { Component, signal } from "@angular/core";

@Component({
  selector: 'cart-page',
  imports: [],
  templateUrl: './cart-page.html',
})
export class CartPage {
  protected readonly title = signal('ISG25JFA003_Digital_BookStore');
}