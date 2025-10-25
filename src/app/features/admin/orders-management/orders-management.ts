import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardSwitchComponent],
  templateUrl: './orders-management.html',
  styleUrls: ['./orders-management.css']
})
export class OrdersManagementComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  selectedOrder: Order | null = null;
  showOrderDetails = false;
  isProfileMenuOpen = false;
  isDarkMode = document.documentElement.classList.contains('dark');

  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);

  ngOnInit(): void {
    this.syncTheme();
    this.loadOrders();
  }

  syncTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(this.isDarkMode);
  }

  loadOrders(): void {
    this.loading = true;
    
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        // Transform API response to match frontend Order interface
        this.orders = (data || []).map(apiOrder => this.transformApiOrderToOrder(apiOrder));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        
        if (err.status === 401) {
          this.toastService.showError('Authentication required. Please login as admin.');
        } else if (err.status === 403) {
          this.toastService.showError('Access denied. Admin privileges required.');
        } else if (err.status === 404) {
          this.toastService.showError('Orders endpoint not found.');
        } else {
          this.toastService.showError('Error loading orders: ' + (err.message || 'Unknown error'));
        }
        
        this.loading = false;
      }
    });
  }

  private transformApiOrderToOrder(apiOrder: any): Order {
    return {
      orderId: apiOrder.orderId,
      userId: apiOrder.userId || 0, // Default if not provided
      orderItems: apiOrder.orderItems || [], // Default empty array if not provided
      totalAmount: apiOrder.totalAmount || 0,
      orderStatus: this.mapApiStatusToOrderStatus(apiOrder.status),
      orderDate: apiOrder.orderDate || new Date().toISOString(),
      shippingAddress: apiOrder.shippingAddress || this.getDefaultShippingAddress(),
      paymentId: apiOrder.paymentId
    };
  }

  private mapApiStatusToOrderStatus(apiStatus: string): OrderStatus {
    switch (apiStatus?.toUpperCase()) {
      case 'PLACED':
        return OrderStatus.PENDING;
      case 'CONFIRMED':
        return OrderStatus.CONFIRMED;
      case 'SHIPPED':
        return OrderStatus.SHIPPED;
      case 'DELIVERED':
        return OrderStatus.DELIVERED;
      case 'CANCELLED':
        return OrderStatus.CANCELLED;
      default:
        return OrderStatus.CONFIRMED;
    }
  }

  private getDefaultShippingAddress(): any {
    return {
      fullName: 'N/A',
      phoneNumber: 'N/A',
      addressLine1: 'Address not available',
      city: 'N/A',
      state: 'N/A',
      pincode: 'N/A',
      country: 'N/A'
    };
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  getStatusClass(status: OrderStatus): string {
    switch(status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: OrderStatus): string {
    switch(status) {
      case OrderStatus.PENDING:
        return 'pending';
      case OrderStatus.CONFIRMED:
        return 'check_circle';
      case OrderStatus.SHIPPED:
        return 'local_shipping';
      case OrderStatus.DELIVERED:
        return 'done_all';
      case OrderStatus.CANCELLED:
        return 'cancel';
      default:
        return 'help';
    }
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    // Close menu when clicking outside
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', this.closeProfileMenu);
      });
    }
  }

  private closeProfileMenu = (): void => {
    this.isProfileMenuOpen = false;
    window.removeEventListener('click', this.closeProfileMenu);
  };

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.router.navigate(['/auth/login']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  goToHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }

}
