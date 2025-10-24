import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadCart } from './states/cart/cart.action';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from '@shared/components/toast/toast';
import { ZardToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ToastComponent, ZardToastComponent],
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
