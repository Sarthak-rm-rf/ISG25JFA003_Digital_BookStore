import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book, BookApiResponse } from '../../models/book.model';

export interface BookRequest {
  title: string;
  authorName: string;
  categoryName: string;
  price: number;
  description?: string;
  isbn?: string;
  publicationDate?: string;
  publisher?: string;
  stockQuantity?: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/v1/books';

  constructor(private http: HttpClient) { }

  private transformApiResponseToBook(resp: BookApiResponse): Book {
    return {
      bookId: resp.bookId ?? undefined,
      title: resp.title,
      author: { name: resp.authorName },
      category: { name: resp.categoryName },
      price: resp.price,
      description: resp.description ?? '',
      isbn: resp.isbn ?? '',
      publicationDate: resp.publicationDate ?? '',
      publisher: resp.publisher ?? '',
      imageUrl: resp.imageUrl,
      averageRating: resp.averageRating,
      totalReviews: resp.totalReviews,
      stockQuantity: resp.stockQuantity
    } as Book;
  }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(this.apiUrl).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<BookApiResponse>(`${this.apiUrl}/get/${id}`).pipe(
      map(resp => this.transformApiResponseToBook(resp))
    );
  }

  getBooksByAuthor(authorId: number): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/author/${authorId}`).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  getBooksByCategory(categoryId: number): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  searchBooksByTitle(title: string): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/findByTitle`, {
      params: { title }
    }).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  searchBooksByAuthor(authorName: string): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/findByAuthor`, { params: { authorName } }).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  searchBooksByCategory(categoryName: string): Observable<Book[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/search/category/${categoryName}`).pipe(
      map(list => list.map(item => this.transformApiResponseToBook(item)))
    );
  }

  addBook(book: BookRequest): Observable<Book> {
    return this.http.post<BookApiResponse>(`${this.apiUrl}/addBook`, book).pipe(
      map(resp => this.transformApiResponseToBook(resp))
    );
  }

  updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<BookApiResponse>(`${this.apiUrl}/update/${id}`, book).pipe(
      map(resp => this.transformApiResponseToBook(resp))
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
