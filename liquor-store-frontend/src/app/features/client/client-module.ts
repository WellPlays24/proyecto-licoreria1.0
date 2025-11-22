// ============================================
// MÓDULO CLIENTE
// ============================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing-module';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { ProductList } from './products/product-list/product-list';
import { ProductDetail } from './products/product-detail/product-detail';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';
import { Invoices } from './invoices/invoices';
import { Profile } from './profile/profile';

@NgModule({
  declarations: [
    
  ],
  imports: [
    ProductList,
    ProductDetail,
    Cart,
    Orders,
    Invoices,
    Profile,

    CommonModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class ClientModule { }