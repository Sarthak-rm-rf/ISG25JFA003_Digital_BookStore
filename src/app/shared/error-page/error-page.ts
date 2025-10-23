import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink], // Import RouterLink for the button
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
  // No specific logic needed for this simple page
}
