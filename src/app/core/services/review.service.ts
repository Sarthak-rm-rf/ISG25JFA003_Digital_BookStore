import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  /**
   * Creates a new review for a specific book.
   */
  createReview(bookId: number, payload: ReviewPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReview/${bookId}`, payload);
  }

  getBookReviews(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`);
  }
}