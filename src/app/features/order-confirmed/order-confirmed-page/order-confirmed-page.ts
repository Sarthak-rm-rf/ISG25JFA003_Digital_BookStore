import { Component, signal } from "@angular/core";
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { OrderConfirmCard } from "../components/order-confirm-card/order-confirm-card";
import { ProgressBar } from "@shared/components/progress-bar/progress-bar";

@Component({
  selector: 'order-confirmed-page',
  imports: [OrderConfirmCard, NavbarComponent],
  templateUrl: './order-confirmed-page.html',
})
export class OrderConfirmCardPage {

}