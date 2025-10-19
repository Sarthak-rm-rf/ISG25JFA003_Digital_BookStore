import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { ProgressBar } from '@shared/components/progress-bar/progress-bar'; // Import CommonModule
import { Address } from 'src/app/models/address.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true, // Mark component as standalone
  imports: [CommonModule, ProgressBar], // Import CommonModule here
  templateUrl: './order-confirm-card.html',
  styleUrls: ['./order-confirm-card.css'],
})
export class OrderConfirmCard implements OnInit {
  orderId: string = '';
  deliveryDate: Date = new Date();
  addressData = localStorage.getItem('address');
  deliveryAddress: Address = this.addressData ? JSON.parse(this.addressData) : {};
  orderData = localStorage.getItem('order');
  orderedItems = this.orderData ? JSON.parse(this.orderData) : [];
  constructor(private router: Router) {}

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
