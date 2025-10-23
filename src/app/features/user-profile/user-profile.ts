import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserService, UpdateUserPayload, AddressPayload } from '../../core/services/user.service';
import { BookService } from '../../core/services/book.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { SavedAddressesComponent } from '../cart/components/saved-addresses/saved-addresses';
import { ReviewService, ReviewPayload } from '../../core/services/review.service';
import { ToastService } from 'src/app/core/services/toast.service';


// --- Data Interfaces ---
export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface OrderItem {
  orderItemId: number;
  itemId: number; // This is the bookId
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  isReviewed: boolean;
}


export interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fullName: string;
  phone: string;
}


export interface CartItem {
  cartItemId: number;
  bookId: number;
  bookTitle: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  cartId: number;
  totalAmount: number;
  itemCount: number;
  cartItems: CartItem[];
}

export interface UserProfileData extends User {
  orders: Order[];
  cart: Cart;
  addresses: Address[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
  // --- Form Properties ---
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = ''; // ✨ New property for confirmation
  passwordMismatchError = false;
  
  // ✨ Booleans to toggle password visibility
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Active tab state
  activeSection: 'orders' | 'cart' | 'address' = 'orders';

  // User data from the server
  currentUser: UserProfileData | null = null;

  isAddressModalOpen = false;
  newAddress: AddressPayload = {
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  };

  isReviewModalOpen = false;
  currentReviewingBook: Order | null = null;
  newReviewRating = 0;
  newReviewComment = '';
  starRatingArray = [1, 2, 3, 4, 5];
user: any;

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    forkJoin({
      profile: this.userService.getCurrentUser(),
      orders: this.userService.getUserOrders(),
      cart: this.userService.getUserCart(),
      addresses: this.userService.getUserAddresses()
    }).subscribe({
      next: ({ profile, orders, cart , addresses}) => {
        this.currentUser = profile as UserProfileData;
        this.currentUser.orders = orders;
        this.currentUser.cart = cart;
        this.currentUser.addresses= addresses;
      },
      error: err => {
        console.error('Failed to load user profile data:', err);
        this.toastService.showError('Failed to load your profile! Please login again.');      }
    });
  }

  openAddressModal() {
    this.isAddressModalOpen = true;
  }

  closeAddressModal() {
    this.isAddressModalOpen = false;
    this.newAddress = { fullName: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '', country: '' };
  }

  onAddressSubmit() {
    this.userService.addUserAddress(this.newAddress).subscribe({
      next: (savedAddress) => {
        this.currentUser?.addresses.push(savedAddress);
        this.toastService.showSuccess('Address added successfully!'); // ✨ Replaced alert        this.closeAddressModal();
      },
      error: (err) => {
        this.toastService.showError('Failed to add address.'); // ✨ Replaced alert
      }
    });
  }

  changePassword() {
    if (!this.currentUser) {
      this.toastService.showError('User data not loaded yet. Please try again.');
      return;
    }
    if (!this.oldPassword || !this.newPassword) {
        this.toastService.showError('Please fill in both the old and new password fields.');
        return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMismatchError = true;
      return;
    }

    const payload: UpdateUserPayload = {
      fullName: this.currentUser.fullName,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };

    this.userService.updateUserProfile(payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Password changed successfully!');
      },
      error: err => {
        this.toastService.showSuccess('Password change failed! Please check your old password.');
        console.error(err);
      }
    });

    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.passwordMismatchError = false;
  }

  setActiveSection(section: 'orders' | 'cart' | 'address') {
    this.activeSection = section;
  }

  get cartTotal(): number {
    return this.currentUser?.cart?.totalAmount ?? 0;
  }

  openReviewModal(orderItem: Order) {
    this.currentReviewingBook = orderItem;
    this.newReviewRating = 0;
    this.newReviewComment = '';
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.currentReviewingBook = null;
  }

  setRating(rating: number) {
    this.newReviewRating = rating;
  }

  onReviewSubmit() {
    if (!this.currentReviewingBook) return;

    if (this.newReviewRating === 0 || !this.newReviewComment.trim()) {
      this.toastService.showError('Please provide a rating and a comment.');
      return;
    }

    const payload: ReviewPayload = {
      rating: this.newReviewRating,
      comment: this.newReviewComment
    };

    const bookId = this.currentReviewingBook.itemId;

    this.reviewService.createReview(bookId, payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Review submitted successfully! Thank you.');
        this.currentReviewingBook!.isReviewed = true;
        this.closeReviewModal();
      },
      error: err => {
        console.error('Failed to submit review:', err);
        this.toastService.showError('Failed to submit review. You may have already reviewed this item.');
      }
    });
  }
}