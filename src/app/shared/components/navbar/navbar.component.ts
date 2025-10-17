import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ZardSwitchComponent } from '../switch/switch.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  // protected readonly darkmodeService = inject(DarkModeService);

  // constructor(){
  //   this.darkmodeService.initTheme();
  // }

  // isDarkMode: boolean = this.darkmodeService.getCurrentTheme() === 'dark';

  currentUser = getCurrentUser();

  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log('mounted');
  }

  // toggleTheme(): void {
  //   this.darkmodeService.toggleTheme();

  //   this.isDarkMode = this.darkmodeService.getCurrentTheme() === 'dark';
  // }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  redirect() {
    this.router.navigate(['cart']);
  }
}
