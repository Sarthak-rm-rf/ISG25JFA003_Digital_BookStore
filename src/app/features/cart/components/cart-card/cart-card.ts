import { NgIf } from '@angular/common';
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'cart-card',
  imports: [NgIf],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css'
})
export class CartCard {

  constructor(private zone: NgZone) {}

  products = [
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
      author: 'Harper Lee',
      name: 'To Kill a Mockingbird',
      quantity: 1,
      price: 299,
      rating: 4.8,
      liked: false
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
      author: 'George Orwell',
      name: '1984',
      quantity: 1,
      price: 199,
      rating: 4.7,
      liked: false
    },
    {
      image: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg',
      author: 'J.K. Rowling',
      name: 'Harry Potter and the Sorcerer\'s Stone',
      quantity: 1,
      price: 249,
      rating: 4.9,
      liked: false
    }
  ];

isLoading = false;
orderConfirmed = false;
orderDetails: any = {};

getCartTotalPaise(): number {
  let total = 0;
  for (const product of this.products) {
    total += product.price * product.quantity;
  }
  return Math.round(total * 100); // Convert rupees to paise
}

placeOrder() {
  this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false;
    const amount = this.getCartTotalPaise();
    const self = this;
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
      amount: amount, // Amount in paise
      currency: 'INR',
      name: 'Bookstore Demo',
      description: 'Test Transaction',
      image: 'https://cdn-icons-png.flaticon.com/512/891/891419.png',
      handler: function (response: any) {
        self.zone.run(() => {
          self.products = [];
          self.orderConfirmed = true;
          self.orderDetails = {
            paymentId: response.razorpay_payment_id,
            amount: amount / 100,
            date: new Date().toLocaleString()
          };
        });
      },
      prefill: {
        name: 'Demo User',
        email: 'demo.user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#d76538ff'
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }, 2000);
}

  toggleLike(product: any) {
    product.liked = !product.liked;
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      product.quantity = 0;
    }
  }

  increaseQuantity(product: any) {
    if (product.quantity < 100) {
      product.quantity++;
    } else {
      product.quantity = 100;
    }
  }
}
