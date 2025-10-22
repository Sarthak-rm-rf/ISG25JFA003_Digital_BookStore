import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Order } from 'src/app/features/user-profile/user-profile';
import { Cart } from 'src/app/features/user-profile/user-profile';

import {
  OrderRequest,
  OrderResponse,
  Order as ModelOrder,
  BuyNowRequest,
  OrderStatus,
} from 'src/app/models/order.model';
import { Address } from 'src/app/models/address.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/v1/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  placeOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/placeOrder`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user`, {
      headers: this.getAuthHeaders(),
    });
  }

  buyNow(request: BuyNowRequest): Observable<ModelOrder> {
    return this.http.post<ModelOrder>(`${this.apiUrl}/buy-now`, request, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllOrders(): Observable<ModelOrder[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/getAllOrders`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((apiOrders) => {
          console.log('Raw API response for orders:', apiOrders);
          return apiOrders.map((apiOrder) => {
            console.log('Processing order:', apiOrder);

            const orderStatus =
              apiOrder.orderStatus || apiOrder.status || 'PENDING';

            return {
              orderId: apiOrder.orderId || apiOrder.id,
              userId: apiOrder.userId,
              orderItems: apiOrder.orderItems || [],
              totalAmount: apiOrder.totalAmount || 0,
              orderStatus: orderStatus as OrderStatus,
              orderDate: apiOrder.orderDate,
              shippingAddress: apiOrder.shippingAddress || {},
              paymentId: apiOrder.paymentId,
            } as ModelOrder;
          });
        })
      );
  }
}