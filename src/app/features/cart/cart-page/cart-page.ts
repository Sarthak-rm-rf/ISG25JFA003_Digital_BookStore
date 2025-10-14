import { Component, signal } from "@angular/core";
import { CartCard } from "../components/cart-card/cart-card";

@Component({
  selector: 'cart-page',
  imports: [CartCard],
  templateUrl: './cart-page.html',
})
export class CartPage {
  protected readonly title = signal('ISG25JFA003_Digital_BookStore');
}