import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address, Cart, Order, User } from '../../features/user-profile/user-profile';

export interface UpdateUserPayload {
  fullName: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface AddressPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/profile`);
  }

  // This now expects an array of the new, more complex Order objects
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders/user`);
  }

  getUserCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart/user`);
  }

  getUserAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/addresses/user`);
  }

  addUserAddress(payload: AddressPayload): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/addresses`, payload);
  }

  updateUserProfile(payload: UpdateUserPayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/profile/update`, payload, { responseType: 'text' });
  }
}