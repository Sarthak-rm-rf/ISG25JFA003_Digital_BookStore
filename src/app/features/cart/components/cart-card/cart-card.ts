import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsComponent } from "../cart-items/cart-items";
import { OrderSummaryComponent } from "../order-summary/order-summary";
import { SavedAddressesComponent } from "../saved-addresses/saved-addresses";
import { AddAddress } from "../add-address/add-address";
import { CartService } from 'src/app/core/services/cart.service';
import { BookService } from 'src/app/core/services/book.service';

// Import the new child components

@Component({
  selector: 'cart-card',
  standalone: true,
  imports: [
    CommonModule,
    CartItemsComponent,
    OrderSummaryComponent,
    SavedAddressesComponent,
    AddAddress
],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css'
})
export class CartCard implements OnInit {
  ngOnInit(): void {
    this.loadCart();
  }

  // --- Main State Management ---
  // cart = this.getCart();
  // cartItems = this.cart.subscribe(cart => cart.cartItems) || [];
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



  addresses = [
    { id: 1, fullName: 'Rohan Sharma', phone: '9876543210', addressLine1: '101, Marine Drive Apartments', addressLine2: 'Opposite Wankhede Stadium', postalCode: '400020', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 2, fullName: 'Priya Patel', phone: '9123456780', addressLine1: 'B-2, Hauz Khas Village', addressLine2: '', postalCode: '110016', city: 'New Delhi', state: 'Delhi', country: 'India' },
  ];

  selectedAddress: any = this.addresses.length > 0 ? this.addresses[0] : null;
  isAddressModalVisible = false;
  cartService = inject(CartService);
  bookService = inject(BookService);

  // --- Event Handlers from Child Components ---

  handleProductUpdate(updatedProducts: any[]) {
    this.products = updatedProducts;
  }

  handleAddressSelected(address: any) {
    this.selectedAddress = address;
  }

  handleSaveAddress(newAddress: any) {
    const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id)) + 1 : 1;
    const addressToAdd = { id: newId, ...newAddress };
    
    this.addresses.push(addressToAdd);
    this.selectedAddress = addressToAdd; // Auto-select the new address
    this.isAddressModalVisible = false;
  }

  loadCart(){
    return this.cartService.getCart().subscribe({
      next: (cart) => {
        console.log(cart);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }
}
