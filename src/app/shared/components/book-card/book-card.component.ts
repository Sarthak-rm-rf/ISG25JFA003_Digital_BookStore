import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../../core/services/book.service';
import { AddToCartButton } from "../add-to-cart-button/add-to-cart-button";

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, AddToCartButton],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
}
