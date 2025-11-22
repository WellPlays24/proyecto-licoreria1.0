// ============================================
// MAIN.TS - CONFIGURACIÓN PRINCIPAL
// ============================================

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from '../src/app/core/interceptors/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimationsAsync()
  ]
}).catch((err) => console.error(err));