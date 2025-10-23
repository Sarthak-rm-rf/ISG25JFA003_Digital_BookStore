import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Author } from '../../../models/book.model';
import { AuthorService } from '../../../core/services/author.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-authors-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="min-h-screen bg-white py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Authors Management</h1>
            <p class="text-gray-600">Manage your library's authors and their information</p>
          </div>
          <button
            (click)="onAddAuthor()"
            class="bg-[#ff5722] text-white px-6 py-3 rounded-xl hover:bg-[#e64a19] transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span class="material-icons mr-2">person_add</span>
            Add Author
          </button>
        </div>

        <!-- Loading State -->
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
            class="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div
                  class="w-12 h-12 bg-linear-to-br from-[#ff5722] to-[#ff7043] rounded-full flex items-center justify-center mr-4"
                >
                  <span class="material-icons text-white text-xl">person</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ author.name }}</h3>
                  <p class="text-gray-500 text-sm">Author</p>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ author.biography || 'No biography available for this author.' }}
              </p>
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
                (click)="onDeleteAuthor(author)"
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

      <!-- Add Author Modal -->
      @if (showAddModal) {
      <div
        class="fixed inset-0 bg-black bg-opacity-30 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Add New Author</h3>
                <p class="text-gray-500 text-sm mt-1">Create a new author profile</p>
              </div>
              <button
                (click)="cancelAddAuthor()"
                class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label for="newAuthorName" class="block text-sm font-semibold text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                id="newAuthorName"
                [(ngModel)]="newAuthorName"
                placeholder="Enter author name"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div class="mb-8">
              <label
                for="newAuthorBiography"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                Biography
              </label>
              <textarea
                id="newAuthorBiography"
                [(ngModel)]="newAuthorBiography"
                placeholder="Enter author biography (optional)"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff5722] focus:border-transparent transition-all duration-200 resize-none"
              >
              </textarea>
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

      <!-- Edit Author Modal -->
      @if (showEditModal && authorToEdit) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Author</h3>
              <button (click)="cancelEditAuthor()" class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="mb-6">
              <label for="editAuthorName" class="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                id="editAuthorName"
                [(ngModel)]="editAuthorName"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div class="mb-6">
              <label for="editAuthorBiography" class="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                id="editAuthorBiography"
                [(ngModel)]="editAuthorBiography"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
              </textarea>
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

      <!-- Delete Confirmation Modal -->
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
    </div>
  `,
})
export class AuthorsManagementComponent implements OnInit {
  authors: Author[] = [];
  loading = false;
  showDeleteModal = false;
  showAddModal = false;
  showEditModal = false;
  authorToDelete: Author | null = null;
  authorToEdit: Author | null = null;

  // Form data
  newAuthorName = '';
  newAuthorBiography = '';
  editAuthorName = '';
  editAuthorBiography = '';

  constructor(private authorService: AuthorService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadAuthors();
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
        this.toastService.showError('Error loading authors: ' + (err.message || 'Unknown error'));
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
  }

  confirmAddAuthor(): void {
    if (this.newAuthorName.trim()) {
      const newAuthor: Author = {
        name: this.newAuthorName.trim(),
        biography: this.newAuthorBiography.trim(),
      };

      this.authorService.addAuthor(newAuthor).subscribe({
        next: () => {
          this.toastService.showSuccess(`Author "${newAuthor.name}" added successfully`);
          this.loadAuthors();
          this.showAddModal = false;
          this.clearAddForm();
        },
        error: (err) => {
          console.error('Error adding author:', err);
          this.toastService.showError('Error adding author: ' + (err.message || 'Unknown error'));
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

      this.authorService.updateAuthor(this.authorToEdit.authorId!, updatedAuthor).subscribe({
        next: () => {
          this.toastService.showSuccess(`Author "${updatedAuthor.name}" updated successfully`);
          this.loadAuthors();
          this.showEditModal = false;
          this.authorToEdit = null;
        },
        error: (err) => {
          console.error('Error updating author:', err);
          this.toastService.showError('Error updating author: ' + (err.message || 'Unknown error'));
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
        error: (err) => {
          console.error('Error deleting author:', err);
          this.toastService.showError('Error deleting author: ' + (err.message || 'Unknown error'));
          this.showDeleteModal = false;
          this.authorToDelete = null;
        },
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

  clearAddForm(): void {
    this.newAuthorName = '';
    this.newAuthorBiography = '';
  }
}
