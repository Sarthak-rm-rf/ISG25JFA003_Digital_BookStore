import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookApiResponse } from '../../models/book.model';

export interface BookRequest {
    title: string;
    authorName: string;
    categoryName: string;
    price: number;
    description: string;
    isbn: string;
    publicationDate: string;
    publisher: string;
    stockQuantity: number;
    imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/v1/books';

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<BookApiResponse> {
    return this.http.get<BookApiResponse>(`${this.apiUrl}/get/${id}`);
  }

  getBooksByAuthor(authorId: number): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/author/${authorId}`);
  }

  getBooksByCategory(categoryId: number): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  searchBooksByTitle(title: string): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/findByTitle`, {
        params: { title }
    });
  }

  searchBooksByAuthor(authorName: string): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/findByAuthor`);
  }

  searchBooksByCategory(categoryName: string): Observable<BookApiResponse[]> {
    return this.http.get<BookApiResponse[]>(`${this.apiUrl}/search/category/${categoryName}`);
  }

  addBook(book: BookRequest): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/addBook`, book);
  }

  updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/update/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
