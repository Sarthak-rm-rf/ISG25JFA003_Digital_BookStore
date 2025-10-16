import { Book } from './book.model';

export interface Inventory {
  inventoryId?: number;
  book: Book;
  stockQuantity: number;
  lastUpdated?: string;
  lowStockThreshold?: number;
}

export interface UpdateStockRequest {
  bookId: number;
  stockQuantity: number; // Changed from 'quantity' to 'stockQuantity' to match backend
}

export interface LowStockAlert {
  inventoryId: number;
  book: Book;
  currentStock: number;
  threshold: number;
}

