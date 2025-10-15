import { RouterModule, Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';;
import { HomeComponent } from './features/home/home.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: 'cart', component: CartPage},
    {path: '',loadChildren: () => import('./features/home/home.routes').then(m => m.ProductsRoutingModule)},
    {
        path: 'user-profile',
        loadComponent: () => import('./features/user-profile/user-profile').then(m => m.UserProfile)
    }
];
