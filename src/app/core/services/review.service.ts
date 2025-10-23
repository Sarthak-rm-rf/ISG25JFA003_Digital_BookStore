import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Review {
  reviewId: number;
  userId: number;
  userName: string;
  comment: string;
  rating: number;
  bookId: number;
  bookTitle: string;
  createdAt: string;
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
    return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`, {
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Creates a new review for a specific book.
   */
  createReview(bookId: number, payload: ReviewPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReview/${bookId}`, payload, {
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Fetches all reviews across all books.
   */
  getAllBookReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deletes a specific review.
   */
  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${reviewId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Deletes a review (Admin only).
   */
  deleteReviewByAdmin(reviewId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/deleteByAdmin/${reviewId}`, {
      headers: this.getAuthHeaders()
    });
  }

}