// ============================================
// INTERCEPTOR HTTP
// Agrega automáticamente el token JWT a todas las peticiones
// ============================================

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clonar la petición y agregar el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar la respuesta y errores
  return next(authReq).pipe(
    catchError((error) => {
      // Si el error es 401 (no autorizado), hacer logout
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      // Si el error es 403 (prohibido)
      if (error.status === 403) {
        console.error('Acceso denegado: No tienes permisos para esta acción');
      }

      return throwError(() => error);
    })
  );
};