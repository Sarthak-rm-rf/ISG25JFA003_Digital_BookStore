import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ZardToastComponent],
  templateUrl: './orders-management.html',
  styleUrls: ['./orders-management.css']
})
export class OrdersManagementComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadOrders();
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

  goBack(): void {
    this.location.back();
  }

}
