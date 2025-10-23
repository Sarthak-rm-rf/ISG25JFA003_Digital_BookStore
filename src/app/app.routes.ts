import { RouterModule, Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';;
import { HomeComponent } from './features/home/home';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { OrderConfirmCardPage } from './features/order-confirmed/order-confirmed-page/order-confirmed-page';
//import { BookListComponent } from './features/books/book-list/book-list.component';
import { DashboardComponent as AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { InventoryComponent } from './features/admin/inventory/inventory';
import { BooksManagementComponent } from './features/admin/books-management/books-management';
import { BookFormComponent } from './features/admin/book-form/book-form';
import { AuthorsManagementComponent } from './features/admin/authors-management/authors-management';
import { CategoriesManagementComponent } from './features/admin/categories-management/categories-management';
import { OrdersManagementComponent } from './features/admin/orders-management/orders-management';
import { UsersManagementComponent } from './features/admin/users-management/users-management';
import { ReviewsManagementComponent } from './features/admin/reviews-management/reviews-management';
import { adminGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';

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
    { path: 'cart', component: CartPage },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'order-confirmed', component: OrderConfirmCardPage },
    { path: '', loadChildren: () => import('./features/home/home.routes').then(m => m.ProductsRoutingModule) },
    { path: 'book/:id', loadComponent: () => import('./features/book-detail/book-detail').then(m => m.BookDetailComponent) },
    {
        path: 'user-profile',
        loadComponent: () => import('./features/user-profile/user-profile').then(m => m.UserProfile)
    },
    {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'books-management', component: BooksManagementComponent },
      { path: 'book-form', component: BookFormComponent },
      { path: 'book-form/:id', component: BookFormComponent },
      { path: 'authors-management', component: AuthorsManagementComponent },
      { path: 'categories-management', component: CategoriesManagementComponent },
      { path: 'orders-management', component: OrdersManagementComponent },
      { path: 'users-management', component: UsersManagementComponent },
      { path: 'reviews-management', component: ReviewsManagementComponent }
    ]
  },
];
