// ============================================
// CONFIGURACIÓN DE RUTAS PRINCIPALES
// ============================================

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  // ============================================
  // RUTAS DE AUTENTICACIÓN (más específicas primero)
  // ============================================
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  // ============================================
  // RUTAS DE ADMIN (requieren autenticación y rol admin)
  // ============================================
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },

  // ============================================
  // RUTAS DE CLIENTE (requieren autenticación)
  // ============================================
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client/cart/cart').then(m => m.Cart)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client/orders/orders').then(m => m.Orders)
  },
  {
    path: 'invoices',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client/invoices/invoices').then(m => m.Invoices)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client/profile/profile').then(m => m.Profile)
  },

  // ============================================
  // RUTAS PÚBLICAS (Home y Nosotros - sin autenticación)
  // ============================================
  {
    path: 'nosotros',
    loadComponent: () => import('./features/public/nosotros/nosotros').then(m => m.Nosotros)
  },
  {
    path: '',
    loadComponent: () => import('./features/public/home/home').then(m => m.Home)
  },

  // ============================================
  // RUTA 404 - Página no encontrada
  // ============================================
  {
    path: '**',
    redirectTo: ''
  }
];