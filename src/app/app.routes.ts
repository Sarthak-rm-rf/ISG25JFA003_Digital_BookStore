import { RouterModule, Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';;
import { HomeComponent } from './features/home/home.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { OrderConfirmCardPage } from './features/order-confirmed/order-confirmed-page/order-confirmed-page';
//import { BookListComponent } from './features/books/book-list/book-list.component';

export const routes: Routes = [
    { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
    },
    { 
    path: 'home', 
    component: HomeComponent 
    },
    // {path: 'books', component: BookListComponent },
    {path: 'cart', component: CartPage},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    {path: 'order-confirmed', component: OrderConfirmCardPage},
    {path: '',loadChildren: () => import('./features/home/home.routes').then(m => m.ProductsRoutingModule)},
  {
        path: 'user-profile',
        loadComponent: () => import('./features/user-profile/user-profile').then(m => m.UserProfile)
    }
];
