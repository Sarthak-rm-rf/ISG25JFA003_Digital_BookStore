import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/book.model';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, NavbarComponent],
  template: `
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-7xl mx-auto px-4">
        <button 
          (click)="goBack()"
          class="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Categories Management</h1>
            <p class="text-muted-foreground">Organize your library with categories and genres</p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              (click)="onAddCategory()"
              class="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <span class="material-icons mr-2">category</span>
              Add Category
            </button>

            <z-switch
              [ngModel]="isDarkMode"
              (ngModelChange)="toggleTheme($event)"
              class="theme-switch"
            ></z-switch>

            <button
              (click)="goToProfile()"
              class="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent/80 transition-colors"
              title="My Profile">
              <span class="material-icons">home</span>
            </button>

            <div class="relative">
              <button
                (click)="toggleProfileMenu($event)"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent/80 transition-colors">
                <span class="material-icons">person</span>
              </button>

              <div *ngIf="isProfileMenuOpen" 
                  class="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                <button
                  (click)="logout()"
                  class="w-full px-4 py-2 text-sm text-left hover:bg-accent/50 transition-colors flex items-center">
                  <span class="material-icons text-base mr-2">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
          <button
            (click)="onAddCategory()"
            class="bg-[#ff5722] text-white px-6 py-3 rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span class="material-icons mr-2">category</span>
            Add Category
          </button>
        </div>

        <!-- Loading State -->
        @if (loading && categories.length === 0) {
        <div class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"
          ></div>
          <p class="mt-4 text-gray-600 text-lg">Loading categories...</p>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (category of categories; track category.categoryId) {
          <div
            class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div
                  class="w-12 h-12 bg-linear-to-br from-[#ff5722] to-[#ff7043] rounded-full flex items-center justify-center mr-4"
                >
                  <span class="material-icons text-white text-xl">category</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ category.name }}</h3>
                  <p class="text-gray-500 text-sm">Category</p>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ category.description || 'No description available for this category.' }}
              </p>
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-100">
              <button
                (click)="onEditCategory(category)"
                class="flex-1 bg-[#fff3e0] text-[#ff5722] px-6 py-3 rounded-xl hover:bg-[#ffe0b2] transition-all duration-200 flex items-center justify-center font-medium"
              >
                <span class="material-icons text-sm mr-1">edit</span>
                Edit
              </button>
              <button
                (click)="onDeleteCategory(category)"
                class="flex-1 bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center font-medium"
              >
                <span class="material-icons text-sm mr-1">delete</span>
                Delete
              </button>
            </div>
          </div>
          }
        </div>
        }
      </div>

      <!-- Add Category Modal -->
      @if (showAddModal) {
      <div
        class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-9999 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Add New Category</h3>
                <p class="text-gray-500 text-sm mt-1">Create a new category</p>
              </div>
              <button
                (click)="cancelAddCategory()"
                class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label for="newCategoryName" class="block text-sm font-semibold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="newCategoryName"
                [(ngModel)]="newCategoryName"
                placeholder="Enter category name"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div class="mb-8">
              <label
                for="newCategoryDescription"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="newCategoryDescription"
                [(ngModel)]="newCategoryDescription"
                placeholder="Enter category description (optional)"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200 resize-none"
              >
              </textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelAddCategory()"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmAddCategory()"
                [disabled]="!newCategoryName.trim()"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Edit Category Modal -->
      @if (showEditModal && categoryToEdit) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Category</h3>
              <button (click)="cancelEditCategory()" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label for="editCategoryName" class="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                id="editCategoryName"
                [(ngModel)]="editCategoryName"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div class="mb-6">
              <label
                for="editCategoryDescription"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="editCategoryDescription"
                [(ngModel)]="editCategoryDescription"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              </textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelEditCategory()"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmEditCategory()"
                [disabled]="!editCategoryName.trim()"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      <!-- Delete Confirmation Modal -->
      <app-confirmation-modal
        [show]="showDeleteModal"
        [title]="'Delete Category'"
        [message]="
          'Are you sure you want to delete category \\'' +
          (categoryToDelete?.name || '') +
          '\\'? This action cannot be undone.'
        "
        [isDestructive]="true"
        (confirm)="confirmDeleteCategory()"
        (cancel)="cancelDeleteCategory()"
      >
      </app-confirmation-modal>
    </div>
  `,
})
export class CategoriesManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  showDeleteModal = false;
  showAddModal = false;
  showEditModal = false;
  categoryToDelete: Category | null = null;
  categoryToEdit: Category | null = null;

  // Form data
  newCategoryName = '';
  newCategoryDescription = '';
  editCategoryName = '';
  editCategoryDescription = '';
  isDarkMode: boolean = document.documentElement.classList.contains('dark');
  isProfileMenuOpen = false;

  constructor(private categoryService: CategoryService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.syncTheme();
    this.loadCategories();
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

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
        this.toastService.showError(
          'Error loading categories: ' + (err.message || 'Unknown error')
        );
        this.loading = false;
      },
    });
  }

  onAddCategory(): void {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
    this.showAddModal = true;
  }

  onEditCategory(category: Category): void {
    this.categoryToEdit = category;
    this.editCategoryName = category.name;
    this.editCategoryDescription = category.description || '';
    this.showEditModal = true;
  }

  onDeleteCategory(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  confirmAddCategory(): void {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        name: this.newCategoryName.trim(),
        description: this.newCategoryDescription.trim(),
      };

      this.categoryService.addCategory(newCategory).subscribe({
        next: () => {
          this.toastService.showSuccess(`Category "${newCategory.name}" added successfully`);
          this.loadCategories();
          this.showAddModal = false;
          this.clearAddForm();
        },
        error: (err: any) => {
          console.error('Error adding category:', err);
          this.toastService.showError('Error adding category: ' + (err.message || 'Unknown error'));
          this.showAddModal = false;
        },
      });
    }
  }

  confirmEditCategory(): void {
    if (this.categoryToEdit && this.editCategoryName.trim()) {
      const updatedCategory: Category = {
        ...this.categoryToEdit,
        name: this.editCategoryName.trim(),
        description: this.editCategoryDescription.trim(),
      };

      this.categoryService
        .updateCategory(this.categoryToEdit.categoryId!, updatedCategory)
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              `Category "${updatedCategory.name}" updated successfully`
            );
            this.loadCategories();
            this.showEditModal = false;
            this.categoryToEdit = null;
          },
          error: (err: any) => {
            console.error('Error updating category:', err);
            this.toastService.showError(
              'Error updating category: ' + (err.message || 'Unknown error')
            );
            this.showEditModal = false;
            this.categoryToEdit = null;
          },
        });
    }
  }

  confirmDeleteCategory(): void {
    if (this.categoryToDelete && this.categoryToDelete.categoryId) {
      this.categoryService.deleteCategory(this.categoryToDelete.categoryId).subscribe({
        next: () => {
          this.toastService.showSuccess(
            `Category "${this.categoryToDelete?.name}" deleted successfully`
          );
          this.loadCategories();
          this.showDeleteModal = false;
          this.categoryToDelete = null;
        },
        error: (err: any) => {
          console.error('Error deleting category:', err);
          this.toastService.showError(
            'Error deleting category: ' + (err.message || 'Unknown error')
          );
          this.showDeleteModal = false;
          this.categoryToDelete = null;
        },
      });
    }
  }

  cancelAddCategory(): void {
    this.showAddModal = false;
    this.clearAddForm();
  }

  cancelEditCategory(): void {
    this.showEditModal = false;
    this.categoryToEdit = null;
  }

  cancelDeleteCategory(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  clearAddForm(): void {
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }
}
