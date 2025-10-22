import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventory, UpdateStockRequest } from '../../../models/inventory.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ZardToastComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-background text-foreground py-8">
      <div class="max-w-7xl mx-auto px-4">
        <button 
          (click)="goBack()"
          class="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
        <!-- Low Stock Alert Banner -->
        @if (getLowStockItems().length > 0) {
          <div class="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div class="flex items-center mb-4">
              <span class="material-icons text-destructive mr-2">warning</span>
              <h2 class="text-lg font-semibold text-destructive">Low Stock Alert: {{ getLowStockItems().length }} {{ getLowStockItems().length === 1 ? 'book' : 'books' }} need attention</h2>
            </div>
            <div class="space-y-3">
              @for (item of getLowStockItems(); track item.inventoryId) {
                <div class="flex items-center justify-between bg-card p-3 rounded-lg border border-destructive/20">
                  <div class="flex items-center space-x-4">
                    @if (item.book.imageUrl) {
                      <img [src]="item.book.imageUrl" [alt]="item.book.title" class="h-12 w-9 object-cover rounded">
                    } @else {
                      <div class="h-12 w-9 bg-accent rounded flex items-center justify-center">
                        <span class="material-icons text-primary">book</span>
                      </div>
                    }
                    <div>
                      <h3 class="font-medium text-foreground">{{ item.book.title }}</h3>
                      <p class="text-destructive">Only {{ item.stockQuantity }} units remaining</p>
                    </div>
                  </div>
                  <button 
                    (click)="onUpdateStock(item)"
                    class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl">
                    <span class="material-icons text-sm mr-1">add</span>
                    Add Stock
                  </button>
                </div>
              }
            </div>
          </div>
        }
        
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
            <p class="text-muted-foreground">Monitor and manage book stock levels</p>
          </div>
          <button 
            (click)="loadInventory()"
            [disabled]="loading"
            class="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50">
            <span class="material-icons mr-2">refresh</span>
            Refresh Inventory
          </button>
        </div>
        


        <!-- Loading State -->
        @if (loading && inventory.length === 0) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p class="mt-4 text-muted-foreground text-lg">Loading inventory...</p>
          </div>
        } @else {
          <div class="bg-card border border-border rounded-lg overflow-x-auto">
            @if (inventory.length === 0) {
              <div class="p-16 text-center">
                <span class="material-icons text-6xl text-muted mb-4">inventory_2</span>
                <h3 class="text-lg font-medium text-foreground mb-2">No inventory found</h3>
                <p class="text-muted-foreground">There are no inventory items to display at this time.</p>
              </div>
            } @else {
              <table class="min-w-full divide-y divide-border">
                <thead class="bg-muted">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Book Details
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-card divide-y divide-border">
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
                            <div class="h-12 w-8 bg-accent rounded mr-4 flex items-center justify-center">
                              <span class="material-icons text-primary text-sm">book</span>
                            </div>
                          }
                          <div>
                            <div class="text-sm font-medium text-foreground">{{ item.book.title }}</div>
                            <div class="text-sm text-muted-foreground">ISBN: {{ item.book.isbn || 'N/A' }}</div>
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
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-destructive/20 text-destructive border border-destructive/30">
                            Low Stock ({{ item.stockQuantity }} units)
                          </span>
                        } @else if (item.stockQuantity < 20) {
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-warning/20 text-warning border border-warning/30">
                            Medium Stock ({{ item.stockQuantity }} units)
                          </span>
                        } @else {
                          <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-success/20 text-success border border-success/30">
                            Good Stock ({{ item.stockQuantity }} units)
                          </span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          (click)="onUpdateStock(item)"
                          class="bg-accent text-primary px-6 py-3 rounded-xl hover:bg-accent/80 transition-all duration-200 flex items-center font-medium">
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
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border border-border w-96 shadow-lg rounded-xl bg-card">
            <div class="mt-3">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-foreground">Update Stock</h3>
                <button 
                  (click)="cancelUpdateStock()"
                  class="text-muted-foreground hover:text-foreground transition-colors">
                  <span class="material-icons">close</span>
                </button>
              </div>
              
              <div class="mb-4">
                <p class="text-sm text-muted-foreground mb-2">
                  <strong class="text-foreground">Book:</strong> {{ selectedItem.book.title }}
                </p>
                <p class="text-sm text-muted-foreground mb-4">
                  <strong class="text-foreground">Current Stock:</strong> {{ selectedItem.stockQuantity }} units
                </p>
              </div>
              
              <div class="mb-6">
                <label for="stockQuantity" class="block text-sm font-medium text-foreground mb-2">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  [(ngModel)]="newStockQuantity"
                  min="0"
                  class="w-full px-4 py-3 border border-input bg-background text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  (click)="cancelUpdateStock()"
                  class="px-6 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-all duration-200 font-medium">
                  Cancel
                </button>
                <button
                  (click)="confirmUpdateStock()"
                  [disabled]="newStockQuantity < 0"
                  class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
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
  showUpdateModal = false;
  selectedItem: Inventory | null = null;
  newStockQuantity: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.inventory = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading inventory:', err);
        this.toastService.showError('Error loading inventory: ' + (err.message || 'Unknown error'));
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
          this.toastService.showSuccess(`Stock updated successfully for "${this.selectedItem?.book.title}"`);
          this.loadInventory(); // Reload inventory to get updated data
          this.showUpdateModal = false;
          this.selectedItem = null;
        },
        error: (err) => {
          console.error('Error updating stock:', err);
          this.toastService.showError('Error updating stock: ' + (err.message || 'Unknown error'));
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

  goBack(): void {
    this.location.back();
  }



  getLowStockItems(): Inventory[] {
    return this.inventory.filter(item => item.stockQuantity < 10)
      .sort((a, b) => a.stockQuantity - b.stockQuantity); // Sort by lowest stock first
  }
}
