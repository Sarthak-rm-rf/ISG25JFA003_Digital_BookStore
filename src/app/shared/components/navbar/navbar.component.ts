import { Component, HostListener ,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZardSwitchComponent } from '../switch/switch.component';


const getCurrentUser = () => {
  return {
    userId: '123',
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/300',
    location: 'Coimbatore, In'
  }
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ZardSwitchComponent, 
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  
  currentUser = getCurrentUser();
  isDarkMode: boolean = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 5;
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialThemeIsDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    
    // ✨ FIX: Corrected the variable name typo here
    this.isDarkMode = initialThemeIsDark; 
    this.applyTheme(initialThemeIsDark);
  }

  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    this.applyTheme(isDark);
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
}