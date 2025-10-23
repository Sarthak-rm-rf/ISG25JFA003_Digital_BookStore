import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../models/book.model';
import { ReviewService, Review } from '../../core/services/review.service';
import { Observable, switchMap } from 'rxjs';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  reviews$!: Observable<Review[]>;
  reviews: Review[] = [];
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService
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
}
