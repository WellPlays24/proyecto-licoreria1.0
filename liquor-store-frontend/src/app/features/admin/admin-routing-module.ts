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
import { OrderList } from './orders/order-list/order-list';
import { OrderForm } from './orders/order-form/order-form';
import { Invoices } from './invoices/invoices';
import { UserList } from './users/user-list/user-list';
import { UserForm } from './users/user-form/user-form';

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
    component: OrderList
  },
  {
    path: 'orders/edit/:id',
    component: OrderForm
  },
  {
    path: 'invoices',
    component: Invoices
  },
  {
    path: 'users',
    component: UserList
  },
  {
    path: 'users/new',
    component: UserForm
  },
  {
    path: 'users/edit/:id',
    component: UserForm
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }