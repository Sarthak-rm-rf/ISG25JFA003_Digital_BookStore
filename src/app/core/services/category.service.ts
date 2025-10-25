import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/book.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>('/categories');
  }

  getCategoryById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`/categories/get/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.apiService.post<Category>('/categories/add', category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.apiService.put<Category>(`/categories/update/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.apiService.delete(`/categories/delete/${id}`);
  }

  getBooksByCategory(categoryId: number) {
    return this.apiService.get<any[]>(`/books/category/${categoryId}`);
  }
}

