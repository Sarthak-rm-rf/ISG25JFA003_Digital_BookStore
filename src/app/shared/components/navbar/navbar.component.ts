import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ZardSwitchComponent } from '../switch/switch.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTotalCartItemCount } from 'src/app/states/cart/cart.selector';
import { AppState } from 'src/app/states/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
// import { DarkModeService } from '../../services/darkmode.service';

const getCurrentUser = () => {
  return {
    userId: '123',
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/300',
    location: 'Coimbatore, In',
  };
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, ZardSwitchComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isScrolled = false;

  currentUser = getCurrentUser();
  isDarkMode: boolean = false;
  cartItemCount$!: Observable<number>;
  isAuthenticated$: Observable<boolean>;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 5;
  }

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser = this.authService.currentUser$;
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialThemeIsDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    this.cartItemCount$ = this.store.select(selectTotalCartItemCount);

    // ✨ FIX: Corrected the variable name typo here
    this.isDarkMode = initialThemeIsDark;
    this.applyTheme(initialThemeIsDark);
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme(isDark);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
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
