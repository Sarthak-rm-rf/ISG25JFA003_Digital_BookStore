import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventory, UpdateStockRequest } from '../../../models/inventory.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardToastComponent, ZardSwitchComponent],
  template: `
    <div class="min-h-screen bg-white text-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-4">
          <button
            (click)="goBack()"
            class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span class="material-icons mr-1">arrow_back</span>
            Back
          </button>
          <div class="flex items-center gap-4">
            <z-switch
              [ngModel]="isDarkMode"
              (ngModelChange)="toggleTheme($event)"
              class="theme-switch"
            ></z-switch>

        <button
          (click)="goToProfile()"
          class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <span class="material-icons">home</span>
        </button>

            <div class="relative">
              <button
                (click)="toggleProfileMenu($event)"
                class="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span class="material-icons">person</span>
              </button>

              <div
                *ngIf="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                <button
                  (click)="logout()"
                  class="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors flex items-center"
                >
                  <span class="material-icons text-base mr-2">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        @if (getLowStockItems().length > 0) {
        <div
          class="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg"
        >
          <div class="flex items-center mb-4">
            <span class="material-icons text-red-600 mr-2">warning</span>
            <h2 class="text-lg font-semibold text-red-800">
              Low Stock Alert: {{ getLowStockItems().length }}
              {{ getLowStockItems().length === 1 ? 'book' : 'books' }} need
              attention
            </h2>
          </div>
          <div class="space-y-3">
            @for (item of getLowStockItems(); track item.inventoryId) {
            <div
              class="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200"
            >
              <div class="flex items-center space-x-4">
                @if (item.book.imageUrl) {
                <img
                  [src]="item.book.imageUrl"
                  [alt]="item.book.title"
                  class="h-12 w-9 object-cover rounded"
                />
                } @else {
                <div
                  class="h-12 w-9 bg-[#fff3e0] rounded flex items-center justify-center"
                >
                  <span class="material-icons text-[#ff5722]">book</span>
                </div>
                }
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ item.book.title }}
                  </h3>
                  <p class="text-red-600">
                    Only {{ item.stockQuantity }} units remaining
                  </p>
                </div>
              </div>
              <button
                (click)="onUpdateStock(item)"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl"
              >
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
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p class="text-gray-600">
              Monitor and manage book stock levels
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              (click)="loadInventory()"
              [disabled]="loading"
              class="bg-[#ff5722] text-white px-6 py-3 rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span class="material-icons mr-2">refresh</span>
              Refresh Inventory
            </button>
          </div>
        </div>

        @if (loading && inventory.length === 0) {
        <div class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"
          ></div>
          <p class="mt-4 text-gray-600 text-lg">Loading inventory...</p>
        </div>
        } @else {
        <div
          class="bg-white border border-gray-200 rounded-lg overflow-x-auto"
        >
          @if (inventory.length === 0) {
          <div class="p-16 text-center">
            <span class="material-icons text-6xl text-gray-300 mb-4"
              >inventory_2</span
            >
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No inventory found
            </h3>
            <p class="text-gray-500">
              There are no inventory items to display at this time.
            </p>
          </div>
          } @else {
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-[#fff3e0]">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Book Details
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Current Stock
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
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
                      class="h-12 w-8 object-cover rounded mr-4"
                    />
                    } @else {
                    <div
                      class="h-12 w-8 bg-[#fff3e0] rounded mr-4 flex items-center justify-center"
                    >
                      <span class="material-icons text-[#ff5722] text-sm"
                        >book</span
                      >
                    </div>
                    }
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ item.book.title }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ISBN: {{ item.book.isbn || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-lg font-bold"
                    [class]="
                      item.stockQuantity < 10
                        ? 'text-red-600'
                        : item.stockQuantity < 20
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    "
                  >
                    {{ item.stockQuantity }}
                  </div>
                  <div class="text-xs text-gray-500">units</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  @if (item.stockQuantity < 10) {
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200"
                  >
                    Low Stock ({{ item.stockQuantity }} units)
                  </span>
                  } @else if (item.stockQuantity < 20) {
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"
                  >
                    Medium Stock ({{ item.stockQuantity }} units)
                  </span>
                  } @else {
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"
                  >
                    Good Stock ({{ item.stockQuantity }} units)
                  </span>
                  }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    (click)="onUpdateStock(item)"
                    class="bg-[#fff3e0] text-[#ff5722] px-6 py-3 rounded-xl hover:bg-[#ffe0b2] transition-all duration-200 flex items-center font-medium"
                  >
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

      @if (showUpdateModal && selectedItem) {
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <div
          class="relative top-20 mx-auto p-5 border border-gray-200 w-96 shadow-lg rounded-xl bg-white"
        >
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Update Stock</h3>
              <button
                (click)="cancelUpdateStock()"
                class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-2">
                <strong class="text-gray-900">Book:</strong>
                {{ selectedItem.book.title }}
              </p>
              <p class="text-sm text-gray-600 mb-4">
                <strong class="text-gray-900">Current Stock:</strong>
                {{ selectedItem.stockQuantity }} units
              </p>
            </div>

            <div class="mb-6">
              <label
                for="stockQuantity"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                New Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                [(ngModel)]="newStockQuantity"
                min="0"
                class="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelUpdateStock()"
                class="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmUpdateStock()"
                [disabled]="newStockQuantity < 0"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class InventoryComponent implements OnInit {
  // All TypeScript code below is 100% from File 1.
  inventory: Inventory[] = [];
  loading = false;
  showUpdateModal = false;
  selectedItem: Inventory | null = null;
  newStockQuantity: number = 0;
  isDarkMode: boolean = document.documentElement.classList.contains('dark');
  isProfileMenuOpen = false;

  constructor(
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncTheme();
    this.loadInventory();
  }

  syncTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(this.isDarkMode);
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
        this.toastService.showError(
          'Error loading inventory: ' + (err.message || 'Unknown error')
        );
        this.loading = false;
      },
    });
  }

  onUpdateStock(item: Inventory): void {
    this.selectedItem = item;
    this.newStockQuantity = item.stockQuantity;
    this.showUpdateModal = true;
  }

  confirmUpdateStock(): void {
    if (
      this.selectedItem &&
      this.selectedItem.book.bookId &&
      this.newStockQuantity >= 0
    ) {
      const request: UpdateStockRequest = {
        bookId: this.selectedItem.book.bookId,
        stockQuantity: this.newStockQuantity,
      };

      this.inventoryService.updateStock(request).subscribe({
        next: (updatedItem) => {
          this.toastService.showSuccess(
            `Stock updated successfully for "${this.selectedItem?.book.title}"`
          );
          this.loadInventory(); // Reload inventory to get updated data
          this.showUpdateModal = false;
          this.selectedItem = null;
        },
        error: (err) => {
          console.error('Error updating stock:', err);
          this.toastService.showError(
            'Error updating stock: ' + (err.message || 'Unknown error')
          );
          this.showUpdateModal = false;
          this.selectedItem = null;
        },
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

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    // Close menu when clicking outside
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', this.closeProfileMenu.bind(this), {
          once: true,
        });
      });
    }
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.router.navigate(['/auth/login']);
    }
  }

  getLowStockItems(): Inventory[] {
    return this.inventory
      .filter((item) => item.stockQuantity < 10)
      .sort((a, b) => a.stockQuantity - b.stockQuantity); // Sort by lowest stock first
  }

  goToProfile(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}