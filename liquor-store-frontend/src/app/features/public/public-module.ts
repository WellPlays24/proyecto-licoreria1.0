// ============================================
// MÓDULO PÚBLICO
// ============================================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing-module';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

// Components
import { Home } from './home/home';
import { Nosotros } from './nosotros/nosotros';

@NgModule({
  declarations: [
    
  ],
  imports: [
    Home,
    Nosotros,

    CommonModule,
    PublicRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule
  ]
})
export class PublicModule { }