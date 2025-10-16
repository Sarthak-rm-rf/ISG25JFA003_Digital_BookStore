import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/book.model';
import { CategoryService } from '../../../core/services/category.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
            <p class="text-gray-600">Organize your library with categories and genres</p>
          </div>
          <button 
            (click)="onAddCategory()"
            class="bg-[#ff5722] text-white px-6 py-3 rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <span class="material-icons mr-2">category</span>
            Add Category
          </button>
        </div>
        
        <!-- Error Message -->
        @if (errorMessage) {
          <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg flex justify-between items-center shadow-sm">
            <div class="flex items-center">
              <span class="material-icons text-red-400 mr-3">error</span>
              <p class="text-red-800">{{ errorMessage }}</p>
            </div>
            <button 
              (click)="dismissError()"
              class="text-red-600 hover:text-red-800 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg flex justify-between items-center shadow-sm">
            <div class="flex items-center">
              <span class="material-icons text-green-400 mr-3">check_circle</span>
              <p class="text-green-800">{{ successMessage }}</p>
            </div>
            <button 
              (click)="dismissSuccess()"
              class="text-green-600 hover:text-green-800 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        }

        <!-- Loading State -->
        @if (loading && categories.length === 0) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"></div>
            <p class="mt-4 text-gray-600 text-lg">Loading categories...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (category of categories; track category.categoryId) {
              <div class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-gradient-to-br from-[#ff5722] to-[#ff7043] rounded-full flex items-center justify-center mr-4">
                      <span class="material-icons text-white text-xl">category</span>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">{{ category.name }}</h3>
                      <p class="text-gray-500 text-sm">Category</p>
                    </div>
                  </div>
                </div>
                
                <div class="mb-6">
                  <p class="text-gray-600 text-sm leading-relaxed">{{ category.description || 'No description available for this category.' }}</p>
                </div>
                
                <div class="flex gap-2 pt-4 border-t border-gray-100">
                  <button 
                    (click)="onEditCategory(category)"
                    class="flex-1 bg-[#fff3e0] text-[#ff5722] px-4 py-2 rounded-lg hover:bg-[#ffe0b2] transition-all duration-200 flex items-center justify-center text-sm font-medium">
                    <span class="material-icons text-sm mr-1">edit</span>
                    Edit
                  </button>
                  <button 
                    (click)="onDeleteCategory(category)"
                    class="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center justify-center text-sm font-medium">
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
        <div class="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Add New Category</h3>
                  <p class="text-gray-500 text-sm mt-1">Create a new category</p>
                </div>
                <button 
                  (click)="cancelAddCategory()"
                  class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200">
              </div>
              
              <div class="mb-8">
                <label for="newCategoryDescription" class="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="newCategoryDescription"
                  [(ngModel)]="newCategoryDescription"
                  placeholder="Enter category description (optional)"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200 resize-none">
                </textarea>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  (click)="cancelAddCategory()"
                  class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium">
                  Cancel
                </button>
                <button
                  (click)="confirmAddCategory()"
                  [disabled]="!newCategoryName.trim()"
                  class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
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
                <button 
                  (click)="cancelEditCategory()"
                  class="text-gray-400 hover:text-gray-600">
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              </div>
              
              <div class="mb-6">
                <label for="editCategoryDescription" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="editCategoryDescription"
                  [(ngModel)]="editCategoryDescription"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                </textarea>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  (click)="cancelEditCategory()"
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
                <button
                  (click)="confirmEditCategory()"
                  [disabled]="!editCategoryName.trim()"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
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
        [message]="'Are you sure you want to delete category \\'' + (categoryToDelete?.name || '') + '\\'? This action cannot be undone.'"
        [isDestructive]="true"
        (confirm)="confirmDeleteCategory()"
        (cancel)="cancelDeleteCategory()">
      </app-confirmation-modal>
    </div>
  `
})
export class CategoriesManagementComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.errorMessage = 'Error loading categories: ' + (err.message || 'Unknown error');
        this.loading = false;
      }
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
        description: this.newCategoryDescription.trim()
      };

      this.categoryService.addCategory(newCategory).subscribe({
        next: () => {
          this.successMessage = `Category "${newCategory.name}" added successfully`;
          this.loadCategories();
          this.showAddModal = false;
          this.clearAddForm();
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error adding category:', err);
          this.errorMessage = 'Error adding category: ' + (err.message || 'Unknown error');
          this.showAddModal = false;
        }
      });
    }
  }

  confirmEditCategory(): void {
    if (this.categoryToEdit && this.editCategoryName.trim()) {
      const updatedCategory: Category = {
        ...this.categoryToEdit,
        name: this.editCategoryName.trim(),
        description: this.editCategoryDescription.trim()
      };

      this.categoryService.updateCategory(this.categoryToEdit.categoryId!, updatedCategory).subscribe({
        next: () => {
          this.successMessage = `Category "${updatedCategory.name}" updated successfully`;
          this.loadCategories();
          this.showEditModal = false;
          this.categoryToEdit = null;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error updating category:', err);
          this.errorMessage = 'Error updating category: ' + (err.message || 'Unknown error');
          this.showEditModal = false;
          this.categoryToEdit = null;
        }
      });
    }
  }

  confirmDeleteCategory(): void {
    if (this.categoryToDelete && this.categoryToDelete.categoryId) {
      this.categoryService.deleteCategory(this.categoryToDelete.categoryId).subscribe({
        next: () => {
          this.successMessage = `Category "${this.categoryToDelete?.name}" deleted successfully`;
          this.loadCategories();
          this.showDeleteModal = false;
          this.categoryToDelete = null;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.errorMessage = 'Error deleting category: ' + (err.message || 'Unknown error');
          this.showDeleteModal = false;
          this.categoryToDelete = null;
        }
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

  dismissError(): void {
    this.errorMessage = '';
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }
}
