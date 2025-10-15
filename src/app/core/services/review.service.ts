import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  bookId: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/v1/review';

  constructor(private http: HttpClient) { }

  getBookReviews(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${bookId}`);
  }

  addReview(bookId: number, review: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/createReview/${bookId}`, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${reviewId}`);
  }
}
