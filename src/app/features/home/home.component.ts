import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { Book, BookApiResponse } from '../../models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = null;
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books.map(this.toBook);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load books. Please try again later.';
        this.loading = false;
        console.error('Error loading books:', error);
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.bookService.searchBooksByTitle(this.searchQuery).subscribe({
        next: (books) => {
          this.books = books.map(this.toBook);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search books. Please try again later.';
          this.loading = false;
          console.error('Error searching books:', error);
        }
      });
    } else {
      this.loadBooks();
    }
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
