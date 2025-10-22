import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ZardSwitchComponent } from '../switch/switch.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTotalCartItemCount } from 'src/app/states/cart/cart.selector';
import { AppState } from 'src/app/states/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ZardSwitchComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isDarkMode: boolean = false;
  isProfileMenuOpen: boolean = false;

  cartItemCount$!: Observable<number>;
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>; // ✨ ADDED: To get user data like avatarUrl

  // Click outside listener
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 5;
    this.isProfileMenuOpen = false; // Close menu on scroll
  }

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
    private elementRef: ElementRef // ✨ ADDED: For click-outside detection
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$; // ✨ ADDED: Initialize currentUser$
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialThemeIsDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    this.cartItemCount$ = this.store.select(selectTotalCartItemCount);

    this.isDarkMode = initialThemeIsDark;
    this.applyTheme(initialThemeIsDark);
  }

  loginClick() {
    this.router.navigate(['/login']);
  }

  signUpClick() {
    this.router.navigate(['/register']);
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme(isDark);
  }

  // ✨ UPDATED: To stop event propagation
  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation(); // Prevents document:click from firing immediately
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  // ✨ ADDED: Logout method
  logout(): void {
    this.authService.logout(); // Call your auth service's logout method
    this.isProfileMenuOpen = false; // Close the menu
  }

  // ✨ ADDED: Method to get profile route based on user role
  getProfileRoute(): string {
    if (this.authService.isAdmin()) {
      return '/admin/dashboard';
    }
    return '/user-profile';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToContact(): void {
    const footer = document.getElementById('contact-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  redirect() {
    this.router.navigate(['/cart']);
  }
}
