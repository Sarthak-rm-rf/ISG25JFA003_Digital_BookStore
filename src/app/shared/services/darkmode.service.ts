// import { Injectable } from '@angular/core';
 
// @Injectable({
//   providedIn: 'root',
// })
// export class DarkModeService {
//   private readonly storageKey = 'dark';
 
//   initTheme(): void {
//     this.applyTheme('dark');
//   }
 
//   toggleTheme(): void {
//     const currentTheme = this.getCurrentTheme();
//     this.applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
//   }
 
//   getCurrentTheme(): 'light' | 'dark' {
//     return (localStorage.getItem(this.storageKey) as 'light' | 'dark') || 'light';
//   }
 
//   private applyTheme(theme: 'light' | 'dark'): void {
//     const html = document.documentElement;
//     const isDark = theme === 'dark';
 
//     html.classList.toggle('dark', isDark);
//     html.setAttribute('data-theme', theme);
//     html.style.colorScheme = theme;
//     localStorage.setItem(this.storageKey, theme);
//   }
// }