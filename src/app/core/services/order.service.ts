import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, PlaceOrderRequest, BuyNowRequest } from '../../models/order.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService) {}

  placeOrder(request: PlaceOrderRequest): Observable<Order> {
    return this.apiService.post<Order>('/orders/placeOrder', request);
  }

  buyNow(request: BuyNowRequest): Observable<Order> {
    return this.apiService.post<Order>('/orders/buy-now', request);
  }

  getUserOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/orders/user');
  }

  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/orders/getAllOrders');
  }
}

