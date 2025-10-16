import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventory, UpdateStockRequest } from '../../../models/inventory.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
            <p class="text-gray-600">Monitor and manage book stock levels</p>
          </div>
          <button 
            (click)="loadInventory()"
            [disabled]="loading"
            class="bg-[#ff5722] text-white px-6 py-3 rounded-lg disabled:opacity-50 flex items-center">
            <span class="material-icons mr-2">refresh</span>
            Refresh Inventory
          </button>
        </div>
        
        <!-- Error Message -->
        @if (errorMessage) {
          <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex justify-between items-center">
            <div class="flex items-center">
              <span class="material-icons text-red-400 mr-3">error</span>
              <p class="text-red-800">{{ errorMessage }}</p>
            </div>
            <button 
              (click)="dismissError()"
              class="text-red-600">
              <span class="material-icons">close</span>
            </button>
          </div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg flex justify-between items-center">
            <div class="flex items-center">
              <span class="material-icons text-green-400 mr-3">check_circle</span>
              <p class="text-green-800">{{ successMessage }}</p>
            </div>
            <button 
              (click)="dismissSuccess()"
              class="text-green-600">
              <span class="material-icons">close</span>
            </button>
          </div>
        }

        <!-- Loading State -->
        @if (loading && inventory.length === 0) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"></div>
            <p class="mt-4 text-gray-600 text-lg">Loading inventory...</p>
          </div>
        } @else {
          <div class="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            @if (inventory.length === 0) {
              <div class="p-16 text-center">
                <span class="material-icons text-6xl text-gray-300 mb-4">inventory_2</span>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No inventory found</h3>
                <p class="text-gray-500">There are no inventory items to display at this time.</p>
              </div>
            } @else {
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-[#fff3e0]">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (item of inventory; track item.inventoryId) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          @if (item.book.imageUrl) {
                            <img 
                              [src]="item.book.imageUrl" 
                              [alt]="item.book.title"
                              class="h-12 w-8 object-cover rounded mr-4">
                          } @else {
                            <div class="h-12 w-8 bg-[#fff3e0] rounded mr-4 flex items-center justify-center">
                              <span class="material-icons text-[#ff5722] text-sm">book</span>
                            </div>
                          }
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ item.book.title }}</div>
                            <div class="text-sm text-gray-500">ISBN: {{ item.book.isbn || 'N/A' }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-lg font-bold"
                             [class]="item.stockQuantity < 10 ? 'text-red-600' : item.stockQuantity < 20 ? 'text-yellow-600' : 'text-green-600'">
                          {{ item.stockQuantity }}
                        </div>
                        <div class="text-xs text-gray-500">units</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        @if (item.stockQuantity < 10) {
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                            Low Stock
                          </span>
                        } @else if (item.stockQuantity < 20) {
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Medium Stock
                          </span>
                        } @else {
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                            Good Stock
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          (click)="onUpdateStock(item)"
                          class="text-[#ff5722] flex items-center">
                          <span class="material-icons text-sm mr-1">edit</span>
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        }
      </div>

      <!-- Update Stock Modal -->
      @if (showUpdateModal && selectedItem) {
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Update Stock</h3>
                <button 
                  (click)="cancelUpdateStock()"
                  class="text-gray-400 hover:text-gray-600">
                  <span class="material-icons">close</span>
                </button>
              </div>
              
              <div class="mb-4">
                <p class="text-sm text-gray-600 mb-2">
                  <strong>Book:</strong> {{ selectedItem.book.title }}
                </p>
                <p class="text-sm text-gray-600 mb-4">
                  <strong>Current Stock:</strong> {{ selectedItem.stockQuantity }} units
                </p>
              </div>
              
              <div class="mb-6">
                <label for="stockQuantity" class="block text-sm font-medium text-gray-700 mb-2">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  [(ngModel)]="newStockQuantity"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  (click)="cancelUpdateStock()"
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
                <button
                  (click)="confirmUpdateStock()"
                  [disabled]="newStockQuantity < 0"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  showUpdateModal = false;
  selectedItem: Inventory | null = null;
  newStockQuantity: number = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.errorMessage = '';
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventory = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        this.errorMessage = 'Error loading inventory: ' + (err.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  onUpdateStock(item: Inventory): void {
    this.selectedItem = item;
    this.newStockQuantity = item.stockQuantity;
    this.showUpdateModal = true;
  }

  confirmUpdateStock(): void {
    if (this.selectedItem && this.selectedItem.book.bookId && this.newStockQuantity >= 0) {
      const request: UpdateStockRequest = {
        bookId: this.selectedItem.book.bookId,
        stockQuantity: this.newStockQuantity
      };

      this.inventoryService.updateStock(request).subscribe({
        next: (updatedItem) => {
          this.successMessage = `Stock updated successfully for "${this.selectedItem?.book.title}"`;
          this.loadInventory(); // Reload inventory to get updated data
          this.showUpdateModal = false;
          this.selectedItem = null;
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error updating stock:', err);
          this.errorMessage = 'Error updating stock: ' + (err.message || 'Unknown error');
          this.showUpdateModal = false;
          this.selectedItem = null;
        }
      });
    }
  }

  cancelUpdateStock(): void {
    this.showUpdateModal = false;
    this.selectedItem = null;
    this.newStockQuantity = 0;
  }

  dismissError(): void {
    this.errorMessage = '';
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }
}
