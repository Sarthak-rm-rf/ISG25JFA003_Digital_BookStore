import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author } from '../../../models/book.model';
import { AuthorService } from '../../../core/services/author.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-authors-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    ZardToastComponent, // Kept from File 1
    ZardSwitchComponent, // Kept from File 1
  ],
  template: `
    <div class="min-h-screen bg-white text-gray-900 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <button
          (click)="goBack()"
          class="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back
        </button>
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Authors Management
            </h1>
            <p class="text-gray-600">
              Manage your library's authors and their information
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              (click)="onAddAuthor()"
              class="bg-[#ff5722] text-white px-6 py-3 rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span class="material-icons mr-2">person_add</span>
              Add Author
            </button>

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

        @if (loading && authors.length === 0) {
        <div class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"
          ></div>
          <p class="mt-4 text-gray-600 text-lg">Loading authors...</p>
        </div>
        } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (author of authors; track author.authorId) {
          <div
            class="bg-white text-gray-900 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-[#ff5722] to-[#ff7043] rounded-full flex items-center justify-center mr-4"
                >
                  <span class="material-icons text-white text-xl">person</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ author.name }}
                  </h3>
                  <p class="text-gray-500 text-sm">Author</p>
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-4 border-t border-gray-100">
              <button
                (click)="onEditAuthor(author)"
                class="flex-1 bg-[#fff3e0] text-[#ff5722] px-6 py-3 rounded-xl hover:bg-[#ffe0b2] transition-all duration-200 flex items-center justify-center font-medium"
              >
                <span class="material-icons text-sm mr-1">edit</span>
                Edit
              </button>
              <button
                (click)="onViewBooks(author)"
                class="flex-1 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-100 transition-all duration-200 flex items-center justify-center font-medium"
              >
                <span class="material-icons text-sm mr-1">menu_book</span>
                View Books
              </button>
            </div>
          </div>
          }
        </div>
        }
      </div>

      @if (showAddModal) {
      <div
        class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Add New Author</h3>
                <p class="text-gray-500 text-sm mt-1">
                  Create a new author profile
                </p>
              </div>
              <button
                (click)="cancelAddAuthor()"
                class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label
                for="newAuthorName"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Author Name *
              </label>
              <input
                type="text"
                id="newAuthorName"
                [(ngModel)]="newAuthorName"
                placeholder="Enter author name"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelAddAuthor()"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmAddAuthor()"
                [disabled]="!newAuthorName.trim()"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Author
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      @if (showEditModal && authorToEdit) {
      <div
        class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Author</h3>
              <button
                (click)="cancelEditAuthor()"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label
                for="editAuthorName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Author Name *
              </label>
              <input
                type="text"
                id="editAuthorName"
                [(ngModel)]="editAuthorName"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <button
                (click)="cancelEditAuthor()"
                class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                (click)="confirmEditAuthor()"
                [disabled]="!editAuthorName.trim()"
                class="px-6 py-3 bg-[#ff5722] text-white rounded-xl hover:bg-[#e64a19] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Author
              </button>
            </div>
          </div>
        </div>
      </div>
      }

      <app-confirmation-modal
        [show]="showDeleteModal"
        [title]="'Delete Author'"
        [message]="
          'Are you sure you want to delete author \\'' +
          (authorToDelete?.name || '') +
          '\\'? This action cannot be undone.'
        "
        [isDestructive]="true"
        (confirm)="confirmDeleteAuthor()"
        (cancel)="cancelDeleteAuthor()"
      >
      </app-confirmation-modal>

      @if (showBooksModal && selectedAuthor) {
      <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div class="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                Books by {{ selectedAuthor.name }}
              </h3>
              <button
                (click)="closeBooksModal()"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span class="material-icons">close</span>
              </button>
            </div>
            <div *ngIf="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-2 text-gray-600">Loading books...</p>
            </div>
            <div
              *ngIf="!loading && booksByAuthor.length === 0"
              class="text-center py-8"
            >
              <p class="text-gray-600">No books found for this author.</p>
            </div>
            <div *ngIf="!loading && booksByAuthor.length > 0">
              <ul class="divide-y divide-gray-200">
                <li
                  *ngFor="let book of booksByAuthor"
                  class="py-4 flex items-center justify-between"
                >
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ book.title }}</h4>
                    <p class="text-gray-500 text-sm">{{ book.categoryName }}</p>
                  </div>
                  <span class="material-icons text-blue-500">menu_book</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class AuthorsManagementComponent implements OnInit {
  // All TypeScript code below is 100% from File 1.
  authors: Author[] = [];
  loading = false;
  showDeleteModal = false;
  showAddModal = false;
  showEditModal = false;
  authorToDelete: Author | null = null;
  authorToEdit: Author | null = null;

  // Form data
  newAuthorName = '';
  newAuthorBiography = ''; // This property exists in your logic
  editAuthorName = '';
  editAuthorBiography = ''; // This property exists in your logic
  isDarkMode: boolean = document.documentElement.classList.contains('dark');
  isProfileMenuOpen = false;

  // New properties for viewing books
  showBooksModal = false;
  booksByAuthor: any[] = [];
  selectedAuthor: Author | null = null;

  constructor(
    private authorService: AuthorService,
    private toastService: ToastService,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncTheme();
    this.loadAuthors();
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

  loadAuthors(): void {
    this.loading = true;
    this.authorService.getAllAuthors().subscribe({
      next: (data) => {
        this.authors = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading authors:', err);
        this.toastService.showError(
          'Error loading authors: ' + (err.message || 'Unknown error')
        );
        this.loading = false;
      },
    });
  }

  onAddAuthor(): void {
    this.newAuthorName = '';
    this.newAuthorBiography = '';
    this.showAddModal = true;
  }

  onEditAuthor(author: Author): void {
    this.authorToEdit = author;
    this.editAuthorName = author.name;
    this.editAuthorBiography = author.biography || '';
    this.showEditModal = true;
  }

  onDeleteAuthor(author: Author): void {
    this.authorToDelete = author;
    this.showDeleteModal = true;
    this.loading = true;
  }

  onViewBooks(author: Author): void {
    if (author.authorId === undefined || author.authorId === null) {
      this.toastService.showError('Invalid author ID.');
      return;
    }
    this.selectedAuthor = author;
    this.showBooksModal = true;
    this.booksByAuthor = [];
    this.loading = true;
    this.authorService.getBooksByAuthor(author.authorId).subscribe({
      next: (books: any[]) => {
        this.booksByAuthor = books || [];
        this.loading = false;
        if (!this.booksByAuthor.length) {
          this.toastService.showError('No books found for this author.');
        }
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 404) {
          this.toastService.showError('No books found for this author.');
        } else {
          this.toastService.showError(
            'Error fetching books: ' + (err.message || 'Unknown error')
          );
        }
      },
    });
  }

  confirmAddAuthor(): void {
    if (this.newAuthorName.trim()) {
      const newAuthor: Author = {
        name: this.newAuthorName.trim(),
        biography: this.newAuthorBiography.trim(),
      };

      this.authorService.addAuthor(newAuthor).subscribe({
        next: () => {
          this.toastService.showSuccess(
            `Author "${newAuthor.name}" added successfully`
          );
          this.loadAuthors();
          this.showAddModal = false;
          this.clearAddForm();
        },
        error: (err) => {
          console.error('Error adding author:', err);
          this.toastService.showError(
            'Error adding author: ' + (err.message || 'Unknown error')
          );
          this.showAddModal = false;
        },
      });
    }
  }

  confirmEditAuthor(): void {
    if (this.authorToEdit && this.editAuthorName.trim()) {
      const updatedAuthor: Author = {
        ...this.authorToEdit,
        name: this.editAuthorName.trim(),
        biography: this.editAuthorBiography.trim(),
      };

      this.authorService
        .updateAuthor(this.authorToEdit.authorId!, updatedAuthor)
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              `Author "${updatedAuthor.name}" updated successfully`
            );
            this.loadAuthors();
            this.showEditModal = false;
            this.authorToEdit = null;
          },
          error: (err) => {
            console.error('Error updating author:', err);
            this.toastService.showError(
              'Error updating author: ' + (err.message || 'Unknown error')
            );
            this.showEditModal = false;
            this.authorToEdit = null;
          },
        });
    }
  }

  confirmDeleteAuthor(): void {
    if (this.authorToDelete && this.authorToDelete.authorId) {
      this.authorService.deleteAuthor(this.authorToDelete.authorId).subscribe({
        next: () => {
          this.toastService.showSuccess(
            `Author "${this.authorToDelete?.name}" deleted successfully`
          );
          this.loadAuthors();
          this.showDeleteModal = false;
          this.authorToDelete = null;
        },
        // --- Updated Error Block ---
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting author:', err); // Log the full error object

          let displayMessage = 'Error deleting author.'; // Default message

          // Check if the backend sent a custom error message
          // This is the most common case
          if (err.error && typeof err.error === 'object' && err.error.message) {
            displayMessage = err.error.message;
          }
          // Check if the backend sent the error as a plain string
          else if (err.error && typeof err.error === 'string') {
            displayMessage = err.error;
          }
          // Fallback for network or other unknown errors
          else if (err.message) {
            displayMessage = err.message;
          }

          // Show the extracted message in the toast
          this.toastService.showError(displayMessage);

          // Reset the UI
          this.showDeleteModal = false;
          this.authorToDelete = null;
        },
        // --- End of Updated Block ---
      });
    }
  }

  cancelAddAuthor(): void {
    this.showAddModal = false;
    this.clearAddForm();
  }

  cancelEditAuthor(): void {
    this.showEditModal = false;
    this.authorToEdit = null;
  }

  cancelDeleteAuthor(): void {
    this.showDeleteModal = false;
    this.authorToDelete = null;
  }

  closeBooksModal(): void {
    this.showBooksModal = false;
    this.selectedAuthor = null;
    this.booksByAuthor = [];
  }

  clearAddForm(): void {
    this.newAuthorName = '';
    this.newAuthorBiography = '';
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

  goToProfile(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}