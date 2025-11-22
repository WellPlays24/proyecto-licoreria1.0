// ============================================
// RUTAS DEL MÓDULO PUBLIC
// ============================================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Nosotros } from './nosotros/nosotros';

const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'nosotros',
    component: Nosotros
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }