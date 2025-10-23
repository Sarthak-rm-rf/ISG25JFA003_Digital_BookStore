import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Review {
  reviewId: number;
  title: string;
  reviewerName: string;
  comment: string;
  rating: number;
  bookId: number;
}

// This DTO matches the ReviewRequestDTO in your backend
export interface ReviewPayload {
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/v1/review';

  constructor(private http: HttpClient) {}

  // ✨ FIX: Add the getAuthHeaders method
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); 
    if (!token) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Fetches all reviews for a specific book.
   */
  getBookReviews(bookId: number): Observable<Review[]> {
    // You may also need to add headers here if it's a protected endpoint
    return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`, { // ✅ Corrected
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Creates a new review for a specific book.
   */
  createReview(bookId: number, payload: ReviewPayload): Observable<any> {
    // ✨ FIX: Pass the authentication headers with the request
    return this.http.post(`${this.apiUrl}/createReview/${bookId}`, payload, { // ✅ Corrected
      headers: this.getAuthHeaders() 
    });
  }

}