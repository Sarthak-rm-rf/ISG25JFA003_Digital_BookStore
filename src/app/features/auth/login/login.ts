

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = ''; // This property is displayed in your HTML template
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // It's good practice to keep minLength for basic validation,
      // but the main error for wrong password comes from the backend.
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = ''; // Clear previous errors

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.showToast(response.role);
        localStorage.setItem('authToken', response.token);
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: HttpErrorResponse) => { // Specify the error type
        // this.showErrorToast(); // Show the generic toast

        // --- THIS IS THE CHANGE ---
        // Set a specific, user-friendly message for the inline error display
        // You can check err.status if your backend provides specific codes (e.g., 401)
        if (err.status === 401 || err.status === 403) {
          this.error = 'Invalid email or password. Please try again.'; 
        } else {
          // Fallback for other errors (network issues, server errors)
          this.error = 'Login failed due to an unexpected error. Please try again later.';
        }
        // --- END OF CHANGE ---

        console.error('Login Error:', err); // Keep logging the actual error for debugging
        this.loading = false;
      },
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  showToast(role: String) {
    toast.success('Logged in successfully', {
      description: `You have logged in as a ${role}`,
    });
  }

  // showErrorToast() {
  //   toast.error('Login Failed', { // Changed title slightly
  //     description: 'Please check your email and password.', // More specific description
  //   });
  // }
}