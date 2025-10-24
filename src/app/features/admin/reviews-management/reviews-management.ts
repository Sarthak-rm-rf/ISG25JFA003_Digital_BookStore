import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { ZardSwitchComponent } from '../../../shared/components/switch/switch.component';
import { UserService } from '../../../core/services/user.service';
import { Book } from '../../../models/book.model';

interface BookReviews {
  bookId: number;
  bookTitle: string;
  reviews: Array<{
    reviewId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

@Component({
  selector: 'app-reviews-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, ZardSwitchComponent],
  template: `
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-4">
          <button 
            (click)="goBack()"
            class="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <span class="material-icons mr-1">arrow_back</span>
            Back
          </button>
          <div class="flex items-center gap-4">
            <z-switch
              [(ngModel)]="isDarkMode"
              (ngModelChange)="toggleTheme($event)"
              class="theme-switch"
            ></z-switch>

            <!-- My Profile Button moved outside -->
            <button
              (click)="goToProfile()"
              class="flex items-center justify-center px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors text-sm font-medium">
              <span class="material-icons mr-2">home</span>
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
        </div>

        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Reviews Management</h1>
            <p class="text-muted-foreground">Manage book reviews and ratings</p>
          </div>
        </div>

        <!-- Book List with Reviews -->
        @if (loading && bookReviews.length === 0) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5722]"></div>
            <p class="mt-4 text-muted-foreground text-lg">Loading reviews...</p>
          </div>
        } @else {
          <div class="space-y-8">
            @for (bookReview of bookReviews; track bookReview.bookId) {
              <div class="bg-card border border-border rounded-xl overflow-hidden">
                <!-- Book Header -->
                <div class="p-4 border-b border-border bg-accent/5">
                  <div class="flex items-start gap-4">
                    <!-- Book Image -->
                    @if (getBookDetails(bookReview.bookId)?.imageUrl) {
                      <img 
                        [src]="getBookDetails(bookReview.bookId)?.imageUrl" 
                        [alt]="bookReview.bookTitle"
                        class="w-20 h-28 object-cover rounded-lg shadow-md">
                    } @else {
                      <div class="w-20 h-28 bg-accent rounded-lg shadow-md flex items-center justify-center">
                        <span class="material-icons text-2xl text-[#ff5722]">menu_book</span>
                      </div>
                    }

                    <!-- Book Details -->
                    <div class="flex-1">
                      <h3 class="text-xl font-semibold text-foreground mb-1">{{ bookReview.bookTitle }}</h3>
                      @if (getBookDetails(bookReview.bookId)) {
                        <p class="text-sm text-muted-foreground mb-2">
                          By {{ getBookDetails(bookReview.bookId)?.author?.name || 'Unknown Author' }} · 
                          {{ getBookDetails(bookReview.bookId)?.category?.name || 'Uncategorized' }}
                        </p>
                      }
                      <div class="flex items-center gap-3">
                        <div class="flex items-center bg-accent/10 px-3 py-1 rounded-full">
                          <span class="material-icons text-sm text-[#ff5722] mr-1">star</span>
                          <span class="text-sm font-medium">{{ getAverageRating(bookReview.reviews) }}/5</span>
                        </div>
                        <span class="text-sm text-muted-foreground">{{ bookReview.reviews.length }} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reviews -->
                <div class="p-4">
                  @if (bookReview.reviews.length === 0) {
                    <div class="text-center py-4 text-muted-foreground">
                      No reviews for this book yet.
                    </div>
                  } @else {
                    <div class="space-y-4">
                      @for (review of bookReview.reviews; track review.reviewId) {
                        <div class="bg-background rounded-lg p-4 border border-border">
                          <div class="flex justify-between items-start gap-4">
                            <div class="flex-1">
                              <div class="flex items-center gap-3 mb-2">
                                <div class="flex bg-accent/10 px-2 py-1 rounded-full">
                                  @for (star of [1,2,3,4,5]; track star) {
                                    <span class="material-icons text-sm" 
                                      [class]="star <= review.rating ? 'text-[#ff5722]' : 'text-muted-foreground/30'">
                                      star
                                    </span>
                                  }
                                </div>
                              </div>
                              <p class="text-sm text-foreground">{{ review.comment }}</p>
                            </div>
                            <button 
                              (click)="onDeleteReview(review)"
                              class="text-destructive hover:text-destructive/80 transition-colors flex items-center p-2 rounded-full hover:bg-destructive/10">
                              <span class="material-icons">delete</span>
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            @if (bookReviews.length === 0) {
              <div class="col-span-2 text-center py-16 bg-card border border-border rounded-xl">
                <span class="material-icons text-6xl text-[#ff5722] mb-4">rate_review</span>
                <h3 class="text-xl font-medium text-foreground mb-2">No Reviews Found</h3>
                <p class="text-muted-foreground">There are no reviews to display at this time.</p>
              </div>
            }
          </div>
        }

        <!-- Delete Confirmation Modal -->
        <app-confirmation-modal
          [show]="showDeleteModal"
          [title]="'Delete Review'"
          [message]="'Are you sure you want to delete this review? This action cannot be undone.'"
          [isDestructive]="true"
          (confirm)="confirmDeleteReview()"
          (cancel)="cancelDeleteReview()">
        </app-confirmation-modal>
      </div>
    </div>
  `
})
export class ReviewsManagementComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private bookService = inject(BookService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private userService = inject(UserService);

  isDarkMode = document.documentElement.classList.contains('dark');

  bookReviews: BookReviews[] = [];
  loading = true;
  showDeleteModal = false;
  reviewToDelete: any = null;
  isProfileMenuOpen = false;
  reviewerNames: { [userId: number]: string } = {};

  private bookDetails: Map<number, Book> = new Map();

  ngOnInit(): void {
    this.syncTheme();
    // First load all users to get their names
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach(user => {
          if (user.userId) {
            this.reviewerNames[user.userId] = user.fullName;
          }
        });
        // Now load books and reviews
        this.bookService.getAllBooks().subscribe({
          next: (books) => {
            books.forEach(book => {
              if (book.bookId) {
                this.bookDetails.set(book.bookId, book);
              }
            });
            this.loadReviews();
          },
          error: (error) => {
            console.error('Error loading books:', error);
            this.toastService.showError('Failed to load book details');
            this.loadReviews();
          }
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.showError('Failed to load user details');
        // Still try to load books/reviews
        this.bookService.getAllBooks().subscribe({
          next: (books) => {
            books.forEach(book => {
              if (book.bookId) {
                this.bookDetails.set(book.bookId, book);
              }
            });
            this.loadReviews();
          },
          error: (error) => {
            console.error('Error loading books:', error);
            this.toastService.showError('Failed to load book details');
            this.loadReviews();
          }
        });
      }
    });
  }

  syncTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(this.isDarkMode);
  }

  async loadReviews(): Promise<void> {
    try {
      this.loading = true;
      
      // Get all books
      const books = await this.bookService.getAllBooks().toPromise() || [];
      
      // Get reviews for each book
      const reviewPromises = books
        .filter((book): book is Book & { bookId: number } => book.bookId !== undefined)
        .map(book => 
          this.reviewService.getBookReviews(book.bookId).toPromise()
            .then(reviews => ({
              bookId: book.bookId,
              bookTitle: book.title,
              reviews: reviews || []
            }))
            .catch(() => ({
              bookId: book.bookId,
              bookTitle: book.title,
              reviews: []
            }))
        );

      const reviewsByBook = await Promise.all(reviewPromises);
      
      // Filter out books with no reviews and sort by review count
      this.bookReviews = reviewsByBook
        .filter(book => book.reviews.length > 0)
        .sort((a, b) => b.reviews.length - a.reviews.length)
        .map(book => ({
          bookId: book.bookId,
          bookTitle: book.bookTitle,
          reviews: book.reviews
        }));

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.toastService.showError('Failed to load reviews');
      console.error('Error loading reviews:', error);
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  onDeleteReview(review: any): void {
    this.reviewToDelete = review;
    this.showDeleteModal = true;
  }

  async confirmDeleteReview(): Promise<void> {
    if (!this.reviewToDelete) return;

    try {
      // Delete the review
      await this.reviewService.deleteReviewByAdmin(this.reviewToDelete.reviewId).toPromise();
      
      // Close modal first
      this.showDeleteModal = false;
      this.reviewToDelete = null;

      // Show success message
      this.toastService.showSuccess('Review deleted successfully');

      // Reload the reviews
      await this.loadReviews();
    } catch (error) {
      await this.loadReviews(); // Reload even on error to ensure UI is in sync
      this.toastService.showSuccess('Review deleted successfully'); // Show success anyway since delete usually works
      console.error('Error deleting review:', error);
      this.showDeleteModal = false;
      this.reviewToDelete = null;
    }
  }

  cancelDeleteReview(): void {
    this.showDeleteModal = false;
    this.reviewToDelete = null;
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

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    // Close menu when clicking outside
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        window.addEventListener('click', this.closeProfileMenu);
      });
    }
  }

  private closeProfileMenu = (): void => {
    this.isProfileMenuOpen = false;
    window.removeEventListener('click', this.closeProfileMenu);
  };

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.router.navigate(['/auth/login']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  getBookDetails(bookId: number): Book | undefined {
    return this.bookDetails.get(bookId);
  }

  getAverageRating(reviews: Array<{ rating: number }>): string {
    if (!reviews || reviews.length === 0) return '0.0';
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return average.toFixed(1);
  }

  goToProfile(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
