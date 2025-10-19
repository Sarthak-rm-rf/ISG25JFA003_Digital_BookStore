import { Component, effect, Input, NgZone, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/states/app.state';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input() products!: IProduct[];
  @Input() selectedAddress: any;

  couponCode: string = '';
  discount: number = 0;
  couponApplied: boolean = false;
  isLoading: boolean = false; // For place order button
  orderConfirmed = signal(false);
  orderDetails: any = {};

  constructor(private zone: NgZone, router: Router) {
    effect(() => {
      if (this.orderConfirmed()) {
        setTimeout(() => router.navigate(['/order-confirmed']), 1000);
      }
    });
  }

  subtotal(): number {
    return this.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }

  gstAmount(): number {
    return (this.subtotal() - this.discount) * 0.18;
  }

  totalAmount(): number {
    return this.subtotal() - this.discount + this.gstAmount();
  }

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'SALE100' && !this.couponApplied) {
      this.discount = 100.0;
      this.couponApplied = true;
    } else {
      alert('Invalid coupon code.');
    }
  }

  getCartTotalPaise(): number {
    return Math.round(this.totalAmount() * 100);
  }

  createOrderRequest() {
    const currentCartId = this.products;
  }

  placeOrder() {
    this.isLoading = true;
    setTimeout(() => {
      console.log('Placing order with total:', this.totalAmount());
      setTimeout(() => (this.isLoading = false), 1200);
      const amount = this.getCartTotalPaise();
      const self = this;
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
        amount: amount, // Amount in paise
        currency: 'INR',
        name: 'ISG25JFA003 Digital Bookstore',
        description: 'Test Transaction',
        image: 'https://cdn-icons-png.flaticon.com/512/891/891419.png',
        handler: function (response: any) {
          self.zone.run(() => {
            self.products = [];
            self.orderConfirmed.set(true);
            self.orderDetails = {
              paymentId: response.razorpay_payment_id,
              amount: amount / 100,
              date: new Date().toLocaleString(),
            };
          });
        },
        prefill: {
          name: 'Demo User',
          email: 'demo.user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#d76538ff',
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }, 2000);
  }
}
