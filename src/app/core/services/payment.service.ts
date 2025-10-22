import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  type: string;
  transactionId: string;
  amount: number;
  identifier: string;
  orderId: number;
}

export interface PaymentResponse {
  paymentId: number;
  transactionId: string;
  status: string;
  orderId: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiUrl = 'localhost:8080/api/v1/payment';

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

  savePaymentRequest(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    const user = localStorage.getItem('user');
    let userId = -1;
    if (user) {
      userId = JSON.parse(user).userId;
    }
    return this.http.post<PaymentResponse>(`${this.apiUrl}/user/${userId}/validate`, {
      headers: this.getAuthHeaders(),
      params: paymentRequest,
    });
  }
}
