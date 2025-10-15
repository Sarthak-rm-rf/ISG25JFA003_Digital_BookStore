import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CartItemResponse {
  cartItemId: number;
  bookId: number;
  bookTitle: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartResponse {
  cartItems: CartItemResponse[];
  total: number;
  // You can add other properties like userId or cartId if they exist in your DTO
}

interface CartItemRequest {
  bookId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/v1/cart/user';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Example: retrieving a JWT token from local storage.
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Handle case where the user is not authenticated
        console.error('No authentication token found.');
        return new HttpHeaders({
            'Content-Type': 'application/json'
        });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetches the current user's cart.
   * Corresponds to: GET /api/v1/cart/user
   */
  getCart(): Observable<CartResponse> {
    // console.log(this.getAuthHeaders().get('Authorization'));
    return this.http.get<CartResponse>(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Adds an item to the user's cart.
   * Corresponds to: POST /api/v1/cart/items/user/add
   * @param item - An object containing the bookId and quantity to add.
   */
  addToCart(item: CartItemRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/items/user/add`, item, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Updates the quantity of an item in the cart.
   * Corresponds to: PUT /api/v1/cart/items/user/update/{bookId}
   * @param bookId - The ID of the book to update.
   * @param quantity - The new quantity for the cart item.
   */
  updateCartItem(bookId: number, quantity: number): Observable<CartResponse> {
    const params = new HttpParams().set('quantity', quantity.toString());
    // The PUT request body is empty as the data is sent via params.
    return this.http.put<CartResponse>(`${this.apiUrl}/items/user/update/${bookId}`, {}, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  /**
   * Removes a specific item from the cart.
   * Corresponds to: DELETE /api/v1/cart/items/user/delete/{bookId}
   * @param bookId - The ID of the book to remove.
   */
  removeCartItem(bookId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/items/user/delete/${bookId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' // The backend returns a plain string message
    });
  }

  /**
   * Clears all items from the user's cart.
   * Corresponds to: DELETE /api/v1/cart/items/user/clear
   */
  clearCart(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/items/user/clear`, {
      headers: this.getAuthHeaders()
    });
  }
}
