import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { Store } from '@ngrx/store';
import { loadCart } from './states/cart/cart.action';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from "@shared/components/toast/toast";
import { Toast } from 'primeng/toast';
import { ZardToastComponent } from '@shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ToastComponent, ZardToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ISG25JFA003_Digital_BookStore');

  constructor(private store: Store, private router: Router) {
    // Subscribe to router events to update body class
    this.router.events.subscribe(() => {
      if (this.isAdminRoute()) {
        document.body.classList.add('admin-route');
      } else {
        document.body.classList.remove('admin-route');
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(loadCart());
  }

  isAdminRoute(): boolean {
    return this.router.url.includes('/admin');
  }
}
