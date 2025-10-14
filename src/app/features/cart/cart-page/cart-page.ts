import { Component, signal } from "@angular/core";
import { CartCard } from "../components/cart-card/cart-card";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'cart-page',
  imports: [CartCard,NavbarComponent],
  templateUrl: './cart-page.html',
})
export class CartPage {
  protected readonly title = signal('ISG25JFA003_Digital_BookStore');
}