import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-management',
  standalone: true,
  // Imports are 100% from your first file
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent,
    ZardToastComponent,
    ZardSwitchComponent,
  ],
  template: `
    <div class="min-h-screen bg-white py-8">
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
              Users Management
            </h1>
            <p class="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              (click)="loadUsers()"
              [disabled]="loading"
              class="bg-[#ff5722] text-white px-6 py-3 rounded-lg hover:bg-[#e64a19] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span class="material-icons">refresh</span>
              Refresh Users
            </button>

            <z-switch
              [ngModel]="isDarkMode"
              (ngModelChange)="toggleTheme($event)"
              class="theme-switch"
            ></z-switch>

            <button
              (click)="goToHome()"
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

        @if (loading && users.length === 0) {
        <div class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5722]"
          ></div>
          <p class="mt-2 text-gray-600">Loading users...</p>
        </div>
        } @else {
        <div class="bg-white rounded-lg shadow-md overflow-x-auto">
          @if (users.length === 0) {
          <div class="p-12 text-center">
            <span class="material-icons text-6xl text-gray-300 mb-4"
              >person_off</span
            >
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p class="text-gray-500">
              There are no users to display at this time.
            </p>
          </div>
          } @else {
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (user of users; track user.userId) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-[#ff5722]">
                    {{ user.userId || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.fullName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border"
                    [class]="
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    "
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  @if (user.role !== 'ADMIN') {
                  <button
                    (click)="onDeleteUser(user)"
                    class="text-red-600 hover:text-red-800 transition-colors flex items-center"
                  >
                    <span class="material-icons text-sm mr-1">delete</span>
                    Delete
                  </button>
                  } @else {
                  <span class="text-gray-400 italic">Protected</span>
                  }
                </td>
              </tr>
              }
            </tbody>
          </table>
          }
        </div>
        }
      </div>

      <app-confirmation-modal
        [show]="showDeleteModal"
        [title]="'Delete User'"
        [message]="
          'Are you sure you want to delete user \\'' +
          (userToDelete?.fullName || '') +
          '\\'? This action cannot be undone.'
        "
        [isDestructive]="true"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()"
      >
      </app-confirmation-modal>
    </div>
  `,
})
export class UsersManagementComponent implements OnInit {
  // All TypeScript code below is 100% from your first file
  users: User[] = [];
  loading = false;
  showDeleteModal = false;
  userToDelete: User | null = null;
  isDarkMode: boolean = document.documentElement.classList.contains('dark');
  isProfileMenuOpen = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncTheme();
    this.loadUsers();
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

  loadUsers(): void {
    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        // Validate and filter users with valid roles
        this.users = (data || []).filter((user) =>
          this.isValidRole(user.role)
        );
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError(
            'Authentication required. Please login as admin.'
          );
        } else if (err.status === 403) {
          this.toastService.showError(
            'Access denied. Admin privileges required.'
          );
        } else if (err.status === 404) {
          this.toastService.showError('Users endpoint not found.');
        } else {
          this.toastService.showError(
            'Error loading users: ' + (err.message || 'Unknown error')
          );
        }

        this.loading = false;
      },
    });
  }

  isValidRole(role: string): boolean {
    return role === 'USER' || role === 'ADMIN';
  }

  onDeleteUser(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.userToDelete && this.userToDelete.userId) {
      this.userService.deleteUser(this.userToDelete.userId).subscribe({
        next: () => {
          this.toastService.showSuccess(
            `User "${this.userToDelete?.fullName}" deleted successfully`
          );
          this.loadUsers(); // Reload users to get updated list with correct ordering
          this.showDeleteModal = false;
          this.userToDelete = null;
        },
        error: (err) => {
          console.error('Error deleting user:', err);

          if (err.status === 401) {
            this.toastService.showError('Cannot delete this user.');
          } else if (err.status === 403) {
            this.toastService.showError(
              'Access denied. Admin privileges required.'
            );
          } else if (err.status === 404) {
            this.toastService.showError(
              'User not found. It may have been already deleted.'
            );
            this.loadUsers(); // Refresh the list
          } else if (err.status === 204) {
            // Successfully deleted with no content
            this.toastService.showSuccess(
              `User "${this.userToDelete?.fullName}" deleted successfully`
            );
            this.loadUsers();
          } else {
            this.toastService.showError(
              'An error occurred while deleting the user. Please try again.'
            );
          }

          this.showDeleteModal = false;
          this.userToDelete = null;
        },
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
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

  goToHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}