// src/app/products/products-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', // Represents the '/products' path
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild() in feature modules
  exports: [RouterModule]
})
export class ProductsRoutingModule { }