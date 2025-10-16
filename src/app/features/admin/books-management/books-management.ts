import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Book, BookApiResponse } from '../../../models/book.model';
import { BookService } from '../../../core/services/book.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-books-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent, NavbarComponent],
  templateUrl: './books-management.html',
  styleUrls: ['./books-management.css']
})
export class BooksManagementComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  showDeleteModal = false;
  bookToDelete: Book | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.errorMessage = '';
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data.map(this.toBook);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading books: ' + (err.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  onAddNewBook(): void {
    this.router.navigate(['/admin/book-form']);
  }

  onEditBook(book: Book): void {
    if (book.bookId) {
      this.router.navigate(['/admin/book-form', book.bookId]);
    }
  }

  onDeleteBook(book: Book): void {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.bookToDelete?.bookId) {
      return;
    }

    this.loading = true;
    this.bookService.deleteBook(this.bookToDelete.bookId).subscribe({
      next: () => {
        this.loading = false;
        this.showDeleteModal = false;
        this.bookToDelete = null;
        this.successMessage = 'Book deleted successfully';
        this.loadBooks(); // Reload the books list
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error deleting book';
        this.loading = false;
        this.showDeleteModal = false;
        this.bookToDelete = null;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  dismissError(): void {
    this.errorMessage = '';
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  private toBook(bookResponse: BookApiResponse): Book {
    return {
      bookId: bookResponse.bookId,
      title: bookResponse.title,
      author: { name: bookResponse.authorName },
      category: { name: bookResponse.categoryName },
      price: bookResponse.price,
      description: bookResponse.description || '',
      isbn: bookResponse.isbn || '',
      publicationDate: bookResponse.publicationDate || '',
      publisher: bookResponse.publisher || '',
      imageUrl: bookResponse.imageUrl,
      stockQuantity: bookResponse.stockQuantity
    };
  }
}
