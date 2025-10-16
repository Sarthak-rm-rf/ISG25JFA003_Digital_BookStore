import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-reviews-management',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-3xl font-bold mb-8">Reviews Management</h1>
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <span class="material-icons text-6xl text-gray-400 mb-4">rate_review</span>
          <p class="text-gray-600">Reviews management functionality</p>
        </div>
      </div>
    </div>
  `
})
export class ReviewsManagementComponent {}
