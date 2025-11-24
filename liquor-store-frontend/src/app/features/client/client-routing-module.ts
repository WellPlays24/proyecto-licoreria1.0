// ============================================
// RUTAS DEL MÓDULO CLIENT
// ============================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';

import { ProductList } from './products/product-list/product-list';
import { ProductDetail } from './products/product-detail/product-detail';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';
import { Invoices } from './invoices/invoices';
import { Profile } from './profile/profile';

const routes: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['cliente', 'admin'] },
    children: [
      {
        path: '',
        component: ProductList
      },
      {
        path: ':id',
        component: ProductDetail
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }