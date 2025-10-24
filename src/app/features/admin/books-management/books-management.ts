import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../core/services/book.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ToastService } from 'src/app/core/services/toast.service';
import { ZardToastComponent } from 'src/app/shared/components/toast/toast.component';
@Component({
  selector: 'app-books-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent, NavbarComponent],
  templateUrl: './books-management.html',
  styleUrls: ['./books-management.css'],
})
export class BooksManagementComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  showDeleteModal = false;
  bookToDelete: Book | null = null;

  constructor(
    private bookService: BookService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        // service already transforms API responses to our Book model
        this.books = data;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showError('Error loading books: ' + (err.message || 'Unknown error'));
        this.loading = false;
      },
    });
  }

  onAddNewBook(): void {
    this.router.navigate(['/admin/book-form']);
    // this.toastService.showSuccess('Book added successfully');
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
        this.toastService.showSuccess('Book deleted successfully');
        this.loadBooks(); // Reload the books list
        this.bookToDelete = null;
      },
      error: (err) => {
        this.toastService.showError('Error deleting book: ' + (err.message || 'Unknown error'));
        this.loading = false;
        this.showDeleteModal = false;
        this.bookToDelete = null;
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  private toBook(bookResponse: any): Book {
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
      stockQuantity: bookResponse.stockQuantity,
    };
  }
}
