import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { LowStockAlert } from '../../../models/inventory.model';
import { Order } from '../../../models/order.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalBooks = 0;
  totalOrders = 0;
  totalUsers = 0;
  totalRevenue = 0;
  lowStockAlerts: LowStockAlert[] = [];
  recentOrders: Order[] = [];
  loading = false;

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private userService: UserService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    let completedRequests = 0;
    const totalRequests = 4;

    const checkCompletion = () => {
      completedRequests++;
      if (completedRequests === totalRequests) {
        this.loading = false;
      }
    };

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.totalBooks = books.length;
        checkCompletion();
      },
      error: (error) => {
        console.error('Error loading books:', error);
        checkCompletion();
      }
    });

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        this.recentOrders = orders.slice(0, 10);
        checkCompletion();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        checkCompletion();
      }
    });

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        checkCompletion();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        checkCompletion();
      }
    });

    this.inventoryService.getLowStockAlerts().subscribe({
      next: (alerts) => {
        this.lowStockAlerts = alerts;
        checkCompletion();
      },
      error: (error) => {
        console.error('Error loading stock alerts:', error);
        checkCompletion();
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate to home page
  }
}
