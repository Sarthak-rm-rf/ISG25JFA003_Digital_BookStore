import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Book, Author, Category } from '../../../models/book.model';
import { BookService, BookRequest } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { CategoryService } from '../../../core/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ToastService  } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './book-form.html',
  styleUrls: ['./book-form.css']
})
export class BookFormComponent implements OnInit {
  book: Book = {
    title: '',
    author: { name: '' },
    category: { name: '' },
    price: 0,
    description: '',
    isbn: '',
    publicationDate: '',
    publisher: '',
    imageUrl: ''
  };
  
  authors: Author[] = [];
  categories: Category[] = [];
  isEditMode = false;
  loading = false;
  errorMessage = '';
  showAuthorForm = false;
  showCategoryForm = false;
  newAuthorName = '';
  newCategoryName = '';
  newCategoryDescription = '';

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAuthorsAndCategories();
    
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.isEditMode = true;
      this.loadBook(parseInt(bookId));
    }
  }

  loadAuthorsAndCategories(): void {
    this.authorService.getAllAuthors().subscribe({
      next: (authors) => {
        this.authors = authors || [];
      },
      error: (err) => {
        this.errorMessage = 'Error loading authors: ' + (err.message || 'Unknown error');
        this.authors = [];
      }
    });

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
      },
      error: (err) => {
        this.errorMessage = 'Error loading categories: ' + (err.message || 'Unknown error');
        this.categories = [];
      }
    });
  }

  loadBook(bookId: number): void {
    this.loading = true;
    this.bookService.getBookById(bookId).subscribe({
      next: (bookResponse) => {
        this.book = this.toBook(bookResponse);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading book details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateBook();
    } else {
      this.createBook();
    }
  }

  validateForm(): boolean {
    if (!this.book.title.trim()) {
      this.errorMessage = 'Title is required';
      return false;
    }
    if (this.book.price && this.book.price < 0) {
      this.errorMessage = 'Price cannot be negative';
      return false;
    }

    return true;
  }

  createBook(): void {
    const bookRequest = this.toBookRequest(this.book);
    this.bookService.addBook(bookRequest).subscribe({
      next: (createdBook: Book) => {
        this.loading = false;
        this.router.navigate(['/admin/books-management']);
        this.toastService.showSuccess('Book created successfully');
      },
      error: (err: HttpErrorResponse) => {
       this.toastService.showError('Error creating book');
        this.loading = false;
      }
    });
  }

  updateBook(): void {
    if (!this.book.bookId) {
      this.errorMessage = 'Book ID is required for update';
      this.loading = false;
      return;
    }
    const bookRequest = this.toBookRequest(this.book);
    this.bookService.updateBook(this.book.bookId, bookRequest).subscribe({
      next: (updatedBook: Book) => {
        this.loading = false;
        this.router.navigate(['/admin/books-management']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Error updating book';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/books-management']);
  }

  onAuthorChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      if (target.value === '__ADD_NEW__') {
        this.showAuthorForm = true;
        this.showCategoryForm = false; 
      } else if (target.value) {
        const selectedAuthor = this.authors.find(author => author.name === target.value);
        if (selectedAuthor) {
          this.book.author = selectedAuthor;
        } else {
          this.book.author = { name: target.value };
        }
        this.showAuthorForm = false;
      } else {
        this.book.author = { name: '' };
        this.showAuthorForm = false;
      }
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      if (target.value === '__ADD_NEW__') {
        this.showCategoryForm = true;
        this.showAuthorForm = false; 
      } else if (target.value) {
        const selectedCategory = this.categories.find(category => category.name === target.value);
        if (selectedCategory) {
          this.book.category = selectedCategory;
        } else {
          this.book.category = { name: target.value };
        }
        this.showCategoryForm = false;
      } else {
        this.book.category = { name: '' };
        this.showCategoryForm = false;
      }
    }
  }

  toggleAuthorForm(): void {
    this.showAuthorForm = !this.showAuthorForm;
    this.newAuthorName = '';
  }

  createAuthor(): void {
    if (!this.newAuthorName.trim()) {
      this.errorMessage = 'Author name is required';
      return;
    }

    const newAuthor: Author = {
      name: this.newAuthorName.trim()
    };

    this.authorService.addAuthor(newAuthor).subscribe({
      next: (createdAuthor) => {
        this.authors.push(createdAuthor);
        this.book.author = createdAuthor;
        this.newAuthorName = '';
        this.showAuthorForm = false;
      },
      error: (err) => {
        this.errorMessage = 'Error creating author: ' + (err.message || 'Unknown error');
      }
    });
  }

  cancelAuthorCreation(): void {
    this.showAuthorForm = false;
    this.newAuthorName = '';
  }

  toggleCategoryForm(): void {
    this.showCategoryForm = !this.showCategoryForm;
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }

    const newCategory: Category = {
      name: this.newCategoryName.trim(),
      description: this.newCategoryDescription.trim() || undefined
    };

    this.categoryService.addCategory(newCategory).subscribe({
      next: (createdCategory) => {
        this.categories.push(createdCategory);
        this.book.category = createdCategory;
        this.newCategoryName = '';
        this.newCategoryDescription = '';
        this.showCategoryForm = false;
      },
      error: (err) => {
        this.errorMessage = 'Error creating category: ' + (err.message || 'Unknown error');
      }
    });
  }

  cancelCategoryCreation(): void {
    this.showCategoryForm = false;
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  private toBookRequest(book: Book): BookRequest {
    return {
      title: book.title,
      authorName: book.author.name,
      categoryName: book.category.name,
      price: book.price,
      description: book.description,
      isbn: book.isbn,
      publicationDate: book.publicationDate,
      publisher: book.publisher,
      stockQuantity: book.stockQuantity || 0,
      imageUrl: book.imageUrl
    };
  }

  private toBook(bookResponse: any): Book {
    // If response is already our Book model, return it
    if (bookResponse && bookResponse.author && bookResponse.category) {
      return bookResponse as Book;
    }

    // Otherwise map from API response shape
    return {
      bookId: bookResponse?.bookId,
      title: bookResponse?.title,
      author: { name: bookResponse?.authorName || '' },
      category: { name: bookResponse?.categoryName || '' },
      price: bookResponse?.price || 0,
      description: bookResponse?.description || '',
      isbn: bookResponse?.isbn || '',
      publicationDate: bookResponse?.publicationDate || '',
      publisher: bookResponse?.publisher || '',
      imageUrl: bookResponse?.imageUrl,
      stockQuantity: bookResponse?.stockQuantity
    } as Book;
  }
}
