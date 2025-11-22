// ============================================
// GUARD DE ROLES
// Protege rutas según el rol del usuario
// ============================================

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener roles permitidos de la configuración de la ruta
  const allowedRoles = route.data['roles'] as Array<string>;
  const userRole = authService.getUserRole();

  // Si no hay roles especificados, permitir acceso
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene uno de los roles permitidos
  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // Si no tiene el rol correcto, redirigir según su rol
  if (userRole === 'admin') {
    router.navigate(['/admin/dashboard']);
  } else if (userRole === 'cliente') {
    router.navigate(['/products']);
  } else {
    router.navigate(['/']);
  }

  return false;
};