// ============================================
// GUARD NO-AUTH
// Previene que usuarios autenticados accedan a login/register
// ============================================

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si NO está autenticado, permitir acceso a login/register
  if (!authService.isAuthenticated()) {
    return true;
  }

  // Si ya está autenticado, redirigir según su rol
  const userRole = authService.getUserRole();
  
  if (userRole === 'admin') {
    router.navigate(['/admin/dashboard']);
  } else if (userRole === 'cliente') {
    router.navigate(['/products']);
  } else {
    router.navigate(['/']);
  }

  return false;
};