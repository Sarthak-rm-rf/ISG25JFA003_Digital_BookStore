import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { ToastComponent } from '@shared/components/toast/toast';
import { ShaderAnimationComponent } from '../../shared/components/shader-animation/shader-animation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, NavbarComponent ,  ShaderAnimationComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
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
        this.books = books;
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
          this.books = books;
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
}
