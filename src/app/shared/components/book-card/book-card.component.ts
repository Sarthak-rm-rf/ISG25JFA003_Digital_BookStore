import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { RouterModule } from '@angular/router';
import { Book } from '../../../core/services/book.service';
=======
import { Book } from '../../../models/book.model';
>>>>>>> 212b2cc (admin dashboard)

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
}
