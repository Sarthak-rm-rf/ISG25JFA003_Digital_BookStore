import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Book } from '../../../models/book.model';
import { AddToCartButton } from '../add-to-cart-button/add-to-cart-button';
import { Store } from '@ngrx/store';
import { addToCart } from 'src/app/states/cart/cart.action';
import { IProduct } from 'src/app/states/app.state';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, AddToCartButton, RouterLink],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
})
export class BookCardComponent {
  @Input() book!: Book;

  product!: IProduct;

  constructor(private store: Store) {}

  ngOnInit(): void {
    if (this.book) {
      this.product = {
        id: this.book.bookId || 0,
        author: this.book.author?.name || '',
        title: this.book.title,
        rating: 4.98,
        quantity: 1,
        imageUrl: this.book.imageUrl || '',
        price: this.book.price,
      };
    }
  }

  addItemToCart(product: IProduct) {
    this.store.dispatch(addToCart({ product }));
  }
}
