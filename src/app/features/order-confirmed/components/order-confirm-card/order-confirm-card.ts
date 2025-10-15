import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-order-confirmation',
  standalone: true, // Mark component as standalone
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './order-confirm-card.html',
  styleUrls: ['./order-confirm-card.css']
})
export class OrderConfirmCard implements OnInit {

  orderId: string = '';
  deliveryDate: Date = new Date();
  deliveryAddress = {
    name: 'John Newman',
    street: '2125 Chestnut St',
    city: 'San Francisco',
    zip: 'CA 94123'
  };
  orderedItems = [
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
      name: 'To Kill a Mockingbird',
      quantity: 1,
    },
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg',
      name: '1984',
      quantity: 1,
    },
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg',
      name: 'Harry Potter and the Sorcerer\'s Stone',
      quantity: 1,

    }
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Generate a random order ID for demonstration
    this.orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Calculate delivery date (5 days from now)
    this.deliveryDate.setDate(this.deliveryDate.getDate() + 5);
  }

  navigateToHome(): void {
    this.router.navigate(['/']); // Navigate to the homepage
  }

}