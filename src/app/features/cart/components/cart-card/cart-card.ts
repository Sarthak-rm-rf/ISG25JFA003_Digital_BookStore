import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemsComponent } from '../cart-items/cart-items';
import { OrderSummary } from '../order-summary/order-summary';
import { SavedAddressesComponent } from '../saved-addresses/saved-addresses';
import { AddAddress } from '../add-address/add-address';
import { CartService } from 'src/app/core/services/cart.service';
import { BookService } from 'src/app/core/services/book.service';
import { ProgressBar } from '@shared/components/progress-bar/progress-bar';
import { AppState, IProduct } from 'src/app/states/app.state';
import { Store } from '@ngrx/store';
import { selectCartProducts } from 'src/app/states/cart/cart.selector';
import { Observable } from 'rxjs';

// Import the new child components

@Component({
  selector: 'cart-card',
  standalone: true,
  imports: [
    CommonModule,
    CartItemsComponent,
    OrderSummary,
    SavedAddressesComponent,
    AddAddress,
    ProgressBar,
  ],
  templateUrl: './cart-card.html',
  styleUrl: './cart-card.css',
})
export class CartCard implements OnInit {
  products!: Observable<IProduct[]>;

  // ngOnInit(): void {
  //   this.loadCart();
  // }

  // --- Main State Management ---
  // cart = this.getCart();
  // cartItems = this.cart.subscribe(cart => cart.cartItems) || [];

  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.products = this.store.select(selectCartProducts);
  }

  addresses = [
    {
      id: 1,
      fullName: 'Rohan Sharma',
      phone: '9876543210',
      addressLine1: '101, Marine Drive Apartments',
      addressLine2: 'Opposite Wankhede Stadium',
      postalCode: '400020',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    {
      id: 2,
      fullName: 'Priya Patel',
      phone: '9123456780',
      addressLine1: 'B-2, Hauz Khas Village',
      addressLine2: '',
      postalCode: '110016',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
    },
  ];

  selectedAddress: any = this.addresses.length > 0 ? this.addresses[0] : null;
  isAddressModalVisible = false;
  // cartService = inject(CartService);
  bookService = inject(BookService);

  // --- Event Handlers from Child Components ---

  handleAddressSelected(address: any) {
    this.selectedAddress = address;
  }

  handleSaveAddress(newAddress: any) {
    const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map((a) => a.id)) + 1 : 1;
    const addressToAdd = { id: newId, ...newAddress };

    this.addresses.push(addressToAdd);
    this.selectedAddress = addressToAdd; // Auto-select the new address
    this.isAddressModalVisible = false;
  }

  // loadCart() {
  //   return this.cartService.getCart().subscribe({
  //     next: (cart) => {
  //       console.log(cart);
  //     },
  //     error: (error) => {
  //       console.error('Error loading cart:', error);
  //     },
  //   });
  // }
}
