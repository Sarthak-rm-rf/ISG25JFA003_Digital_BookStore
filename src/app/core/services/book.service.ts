import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  bookId: number;
  title: string;
  authorName: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/v1/books';

  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/get/${id}`);
  }

  getBooksByAuthor(authorId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/author/${authorId}`);
  }

  getBooksByCategory(categoryId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  searchBooksByTitle(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/findByTitle`, {
        params: { title }
    });
  }

  searchBooksByAuthor(authorName: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/findByAuthor`);
  }

  searchBooksByCategory(categoryName: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search/category/${categoryName}`);
  }

//   addBook(book: BookRequest): Observable<Book> {
//     return this.http.post<Book>(`${this.apiUrl}/addBook`, book);
//   }

//   updateBook(id: number, book: BookRequest): Observable<Book> {
//     return this.http.put<Book>(`${this.apiUrl}/update/${id}`, book);
//   }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
