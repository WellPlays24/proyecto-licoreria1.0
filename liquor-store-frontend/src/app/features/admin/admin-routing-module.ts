// ============================================
// RUTAS DEL MÓDULO ADMIN
// ============================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { CategoryList } from './categories/category-list/category-list';
import { CategoryForm } from './categories/category-form/category-form';
import { ProductList } from './products/product-list/product-list';
import { ProductForm } from './products/product-form/product-form';
import { Orders } from './orders/orders';
import { Invoices } from './invoices/invoices';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'categories',
    component: CategoryList
  },
  {
    path: 'categories/new',
    component: CategoryForm
  },
  {
    path: 'categories/edit/:id',
    component: CategoryForm
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'products/new',
    component: ProductForm
  },
  {
    path: 'products/edit/:id',
    component: ProductForm
  },
  {
    path: 'orders',
    component: Orders
  },
  {
    path: 'invoices',
    component: Invoices
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }