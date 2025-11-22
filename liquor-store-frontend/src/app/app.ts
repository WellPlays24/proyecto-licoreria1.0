// ============================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { AuthService } from './core/services/auth';
import { CartService } from './core/services/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Navbar,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Licorería Online';

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Si el usuario está autenticado, cargar el contador del carrito
    if (this.authService.isAuthenticated() && this.authService.isClient()) {
      this.cartService.refreshCartCount();
    }
  }
}