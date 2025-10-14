import { Routes } from '@angular/router';
import { CartPage } from './features/cart/cart-page/cart-page';
import { HomePage } from './features/user/home/home-page/home-page';

export const routes: Routes = [
    {path: 'cart', component: CartPage},
    {path: '', component: HomePage}
];
