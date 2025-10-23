import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService } from '../../../core/services/toast.service';
import { ZardToastComponent } from '../../../shared/components/toast/toast.component';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, NavbarComponent, ZardToastComponent, ZardSwitchComponent],
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
            <h1 class="text-3xl font-bold text-foreground mb-2">Users Management</h1>
            <p class="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div class="flex items-center gap-4">
            <button 
              (click)="loadUsers()"
              [disabled]="loading"
              class="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
              <span class="material-icons">refresh</span>
              Refresh Users
            </button>

            <z-switch
              [ngModel]="isDarkMode"
              (ngModelChange)="toggleTheme($event)"
              class="theme-switch"
            ></z-switch>

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
        </div>
        


        <!-- Loading State -->
        @if (loading && users.length === 0) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="mt-2 text-muted-foreground">Loading users...</p>
          </div>
        } @else {
          <div class="bg-card rounded-lg shadow-md overflow-x-auto">
            @if (users.length === 0) {
              <div class="p-12 text-center">
                <span class="material-icons text-6xl text-muted mb-4">person_off</span>
                <h3 class="text-lg font-medium text-foreground mb-2">No users found</h3>
                <p class="text-muted-foreground">There are no users to display at this time.</p>
                
              </div>
            } @else {
              <table class="min-w-full divide-y divide-border">
                <thead class="bg-accent">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-accent-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-accent-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-accent-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-accent-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-accent-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-background divide-y divide-border">
                  @for (user of users; track user.userId) {
                    <tr class="hover:bg-muted/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-bold text-primary">{{ user.userId || 'N/A' }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-foreground">{{ user.fullName }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-foreground">{{ user.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border"
                              [class]="user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'">
                          {{ user.role }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        @if (user.role !== 'ADMIN') {
                          <button 
                            (click)="onDeleteUser(user)"
                            class="text-destructive hover:text-destructive/80 transition-colors flex items-center">
                            <span class="material-icons text-sm mr-1">delete</span>
                            Delete
                          </button>
                        } @else {
                          <span class="text-muted-foreground italic">Protected</span>
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

      <!-- Confirmation Modal -->
      <app-confirmation-modal
        [show]="showDeleteModal"
        [title]="'Delete User'"
        [message]="'Are you sure you want to delete user \\'' + (userToDelete?.fullName || '') + '\\'? This action cannot be undone.'"
        [isDestructive]="true"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()">
      </app-confirmation-modal>
    </div>
  `
})
export class UsersManagementComponent implements OnInit {
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
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        // Validate and filter users with valid roles
        this.users = (data || []).filter(user => this.isValidRole(user.role));
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.toastService.showError('Authentication required. Please login as admin.');
        } else if (err.status === 403) {
          this.toastService.showError('Access denied. Admin privileges required.');
        } else if (err.status === 404) {
          this.toastService.showError('Users endpoint not found.');
        } else {
          this.toastService.showError('Error loading users: ' + (err.message || 'Unknown error'));
        }
        
        this.loading = false;
      }
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
          this.toastService.showSuccess(`User "${this.userToDelete?.fullName}" deleted successfully`);
          this.loadUsers(); // Reload users to get updated list with correct ordering
          this.showDeleteModal = false;
          this.userToDelete = null;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          
          if (err.status === 401) {
            this.toastService.showError('Cannot delete this user.');
          } else if (err.status === 403) {
            this.toastService.showError('Access denied. Admin privileges required.');
          } else if (err.status === 404) {
            this.toastService.showError('User not found. It may have been already deleted.');
            this.loadUsers(); // Refresh the list
          } else if (err.status === 204) {
            // Successfully deleted with no content
            this.toastService.showSuccess(`User "${this.userToDelete?.fullName}" deleted successfully`);
            this.loadUsers();
          } else {
            this.toastService.showError('An error occurred while deleting the user. Please try again.');
          }
          
          this.showDeleteModal = false;
          this.userToDelete = null;
        }
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

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    const html = document.documentElement;
    const theme = isDark ? 'dark' : 'light';
    
    html.classList.toggle('dark', isDark);
    html.setAttribute('data-theme', theme);
    html.style.colorScheme = theme;
    localStorage.setItem('dark', theme);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    // Close menu when clicking outside
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', this.closeProfileMenu.bind(this), { once: true });
      });
    }
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
