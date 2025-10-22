import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inventory, UpdateStockRequest, LowStockAlert } from '../../models/inventory.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private apiService: ApiService) {}

  getAllInventory(): Observable<Inventory[]> {
    return this.apiService.get<any[]>('/inventory').pipe(
      map(apiInventory => apiInventory.map(apiItem => ({
        inventoryId: apiItem.inventoryId,
        book: {
          bookId: apiItem.book.bookId,
          title: apiItem.book.title,
          author: { name: apiItem.book.author.name },
          category: { name: apiItem.book.category.name },
          price: apiItem.book.price,
          description: apiItem.book.description || '',
          isbn: apiItem.book.isbn || '',
          publicationDate: apiItem.book.publicationDate || '',
          publisher: apiItem.book.publisher || '',
          imageUrl: apiItem.book.imageUrl,
          averageRating: apiItem.book.averageRating,
          totalReviews: apiItem.book.totalReviews,
          stockQuantity: apiItem.book.stockQuantity
        },
        stockQuantity: apiItem.stockQuantity
      })))
    );
  }

  getInventoryById(id: number): Observable<Inventory> {
    return this.apiService.get<Inventory>(`/inventory/get/${id}`);
  }

  updateStock(request: UpdateStockRequest): Observable<Inventory> {
    return this.apiService.put<Inventory>('/inventory/update-stock', request);
  }

  getLowStockAlerts(): Observable<LowStockAlert[]> {
    return this.apiService.get<any[]>('/inventory/low-stock-alerts').pipe(
      map(apiAlerts => {
        console.log('Raw API response for low stock alerts:', apiAlerts);
        return apiAlerts.map(apiAlert => {
          console.log('Processing alert:', apiAlert);
          
          // Handle different possible API response structures
          const book = apiAlert.book || apiAlert;
          const title = book.title || book.bookTitle || 'Unknown Book';
          
          return {
            inventoryId: apiAlert.inventoryId || apiAlert.id,
            book: {
              bookId: book.bookId || book.id,
              title: title,
              author: { 
                name: book.author?.name || book.authorName || 'Unknown Author' 
              },
              category: { 
                name: book.category?.name || book.categoryName || 'Unknown Category' 
              },
              price: book.price || 0,
              description: book.description || '',
              isbn: book.isbn || '',
              publicationDate: book.publicationDate || '',
              publisher: book.publisher || '',
              imageUrl: book.imageUrl,
              averageRating: book.averageRating,
              totalReviews: book.totalReviews,
              stockQuantity: book.stockQuantity
            },
            currentStock: apiAlert.currentStock || apiAlert.stockQuantity || apiAlert.quantity || 0,
            threshold: apiAlert.threshold || apiAlert.lowStockThreshold || 5
          };
        });
      })
    );
  }
}