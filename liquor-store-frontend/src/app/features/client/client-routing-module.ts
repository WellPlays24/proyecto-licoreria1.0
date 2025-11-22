// ============================================
// RUTAS DEL MÓDULO CLIENT
// ============================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductList } from './products/product-list/product-list';
import { ProductDetail } from './products/product-detail/product-detail';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';
import { Invoices } from './invoices/invoices';
import { Profile } from './profile/profile';

const routes: Routes = [
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'products/:id',
    component: ProductDetail
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: 'orders',
    component: Orders
  },
  {
    path: 'invoices',
    component: Invoices
  },
  {
    path: 'profile',
    component: Profile
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }