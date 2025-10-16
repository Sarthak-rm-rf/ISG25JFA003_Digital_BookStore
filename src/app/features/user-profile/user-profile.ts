import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

// --- Interfaces for structuring our data ---
interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled';
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Address {
  id: string;
  type: 'Home' | 'Work';
  street: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

interface User {
  name: string;
  avatarUrl: string;
  orders: Order[];
  cart: CartItem[];
  addresses: Address[];
}


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile {
  // --- MOCK DATA (Replace with data from your backend) ---
  currentUser: User = {
    name: 'Alex Doe',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    orders: [
      { id: 'ORD789', date: '2025-10-12', total: 75.50, status: 'Delivered' },
      { id: 'ORD456', date: '2025-09-28', total: 120.00, status: 'Delivered' },
      { id: 'ORD123', date: '2025-08-15', total: 45.00, status: 'Cancelled' }
    ],
    cart: [
      { id: 'BK001', name: 'The Midnight Library', quantity: 1, price: 15.99, imageUrl: 'https://placehold.co/100x150/5e5e5e/ffffff?text=Book' },
      { id: 'BK002', name: 'Project Hail Mary', quantity: 1, price: 18.50, imageUrl: 'https://placehold.co/100x150/5e5e5e/ffffff?text=Book' }
    ],
    addresses: [
      { id: 'ADR1', type: 'Home', street: '123 Main St', city: 'Metropolis', zip: '12345', isDefault: true },
      { id: 'ADR2', type: 'Work', street: '456 Business Ave', city: 'Metropolis', zip: '12346', isDefault: false }
    ]
  };

  // --- Properties for the Change Password form ---
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = ''; // ✨ New property for confirmation
  
  // ✨ Booleans to toggle password visibility
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;


  // --- State for managing the active tab ---
  activeSection: 'orders' | 'cart' | 'address' = 'orders';

  // --- Methods ---
  changePassword() {
    // ✨ Add validation for matching passwords
    if (this.newPassword !== this.confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }

    // In a real app, you would call an API here.
    console.log('Changing password...');
    console.log('Old Password:', this.oldPassword);
    console.log('New Password:', this.newPassword);
    alert('Password change request sent! (See console for details)');
    
    // Reset fields after submission
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  setActiveSection(section: 'orders' | 'cart' | 'address') {
    this.activeSection = section;
  }

  get cartTotal(): number {
    return this.currentUser.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

