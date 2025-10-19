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
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import { Address } from 'src/app/models/address.model';

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

  constructor(private store: Store<AppState>, private userService: UserService) {}
  ngOnInit(): void {
    this.products = this.store.select(selectCartProducts);
    this.addressSub = this.userService.getUserAddresses().subscribe(
      (data) => {
        this.addresses = data;
        if (this.addresses && this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0];
        }
      },
      (error) => {
        console.log('Error fetching addresses', error);
      }
    );
  }

  addresses: Address[] = [];
  private addressSub!: Subscription;

  selectedAddress: any = this.addresses.length > 0 ? this.addresses[0] : null;
  isAddressModalVisible = false;
  // cartService = inject(CartService);
  bookService = inject(BookService);

  // --- Event Handlers from Child Components ---

  handleAddressSelected(address: any) {
    this.selectedAddress = address;
  }

  handleSaveAddress(newAddress: any) {
    // 'newAddress' is the object from your form
    this.userService.addUserAddress(newAddress).subscribe(
      (savedAddress: Address) => {
        // 1. Add the address returned from the server (with its new ID) to your local array
        this.addresses.push(savedAddress);

        // 2. Auto-select the new address
        this.selectedAddress = savedAddress;

        // 3. Close the modal
        this.isAddressModalVisible = false;
      },
      (error) => {
        console.error('Error saving address:', error);
        // Optionally, show an error message to the user
      }
    );
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
