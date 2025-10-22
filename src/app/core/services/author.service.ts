import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../../models/book.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private apiService: ApiService) {}

  getAllAuthors(): Observable<Author[]> {
    return this.apiService.get<Author[]>('/authors');
  }

  getAuthorById(id: number): Observable<Author> {
    return this.apiService.get<Author>(`/authors/${id}`);
  }

  getAuthorByName(name: string): Observable<Author> {
    return this.apiService.get<Author>('/authors/getAuthor', { name });
  }

  addAuthor(author: Author): Observable<Author> {
    return this.apiService.post<Author>('/authors/add', author);
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.apiService.put<Author>(`/authors/update/${id}`, author);
  }

  deleteAuthor(id: number): Observable<any> {
    return this.apiService.delete(`/authors/delete/${id}`);
  }
}

