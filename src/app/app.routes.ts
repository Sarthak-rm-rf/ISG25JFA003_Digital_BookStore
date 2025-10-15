import { RouterModule, Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';;
import { HomeComponent } from './features/home/home.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
    {path: 'cart', component: CartPage},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    {path: '',loadChildren: () => import('./features/home/home.routes').then(m => m.ProductsRoutingModule)}
];
