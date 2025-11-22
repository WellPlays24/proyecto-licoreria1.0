// ============================================
// CONFIGURACIÓN DE RUTAS PRINCIPALES
// ============================================

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  // ============================================
  // RUTAS PÚBLICAS
  // ============================================
  {
    path: '',
    loadChildren: () => import('./features/public/public-module').then(m => m.PublicModule)
  },

  // ============================================
  // RUTAS DE AUTENTICACIÓN
  // ============================================
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },

  // ============================================
  // RUTAS DE CLIENTE (requieren autenticación)
  // ============================================
  {
    path: 'products',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente', 'admin'] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'cart',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente'] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'orders',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente'] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'invoices',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente'] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
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
  // RUTA 404 - Página no encontrada
  // ============================================
  {
    path: '**',
    redirectTo: ''
  }
];