import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../models/book.model';
import { ReviewService, Review } from '../../core/services/review.service';
import { Observable, switchMap } from 'rxjs';
import { NavbarComponent } from '@shared/components/navbar/navbar';
import { AddToCartButton } from '@shared/components/add-to-cart-button/add-to-cart-button';
import { Store } from '@ngrx/store';
import { incrementProduct, loadCart } from 'src/app/states/cart/cart.action';
import { CartItemRequest, CartService } from 'src/app/core/services/cart.service';
@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css'],
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  reviews$!: Observable<Review[]>;
  reviews: Review[] = [];
  currentSlide = 0;

  cartService = inject(CartService);

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.book$ = this.route.params.pipe(
      switchMap((params) => this.bookService.getBookById(+params['id']))
    );

    this.reviews$ = this.route.params.pipe(
      switchMap((params) => this.reviewService.getBookReviews(+params['id']))
    );

    this.reviews$.subscribe((reviews) => {
      this.reviews = reviews;
    });
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.reviews.length - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide < this.reviews.length - 1 ? this.currentSlide + 1 : 0;
  }

  goToCart(bookId: number): void {
    const cart: CartItemRequest = {
      bookId: bookId,
      quantity: 1,
    };
    this.cartService.addToCart(cart).subscribe((item) => {
      this.store.dispatch(incrementProduct({ productId: bookId }));
      this.store.dispatch(loadCart());
      console.log('added to cart');
      this.router.navigate(['/user/cart']);
    });
  }
}
