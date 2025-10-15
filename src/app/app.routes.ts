import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BookDetailComponent } from './features/book-detail/book-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: '**', redirectTo: '' }
];
