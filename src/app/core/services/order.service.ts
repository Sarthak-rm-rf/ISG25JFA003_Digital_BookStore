import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/features/user-profile/user-profile';
import { OrderRequest, OrderResponse } from 'src/app/models/order.model';
import { Cart } from 'src/app/features/user-profile/user-profile';
import { Address } from 'src/app/models/address.model';


@Injectable({
  providedIn: 'root',
})
export class OrdrerService {
  private apiUrl = 'http://localhost:8080/api/v1/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    // Example: retrieving a JWT token from local storage.
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle case where the user is not authenticated
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
  // This is used by your user-profile page
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user`, {
      headers: this.getAuthHeaders(),
    });
}
}
