import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { Store } from '@ngrx/store';
import { loadCart } from './states/cart/cart.action';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from "@shared/components/toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ISG25JFA003_Digital_BookStore');

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadCart());
  }
}
