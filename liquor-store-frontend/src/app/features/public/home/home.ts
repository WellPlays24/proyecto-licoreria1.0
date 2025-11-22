// ============================================
// COMPONENTE HOME (Página Principal)
// ============================================

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { CategoryService } from '../../../core/services/category';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatSpinner } from '@angular/material/progress-spinner';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [
    MatIcon,
    NgIf,
    MatCard,
    MatCardContent,
    MatSpinner,
    NgFor
  ]
})
export class Home implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  loading = true;
  isAuthenticated = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(true).subscribe({
      next: (response) => {
        this.products = response.products;
        // Obtener los primeros 8 productos como destacados
        this.featuredProducts = this.products.slice(0, 8);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
      }
    });
  }

  loadProducts0(): void {
  this.loading = true;

  this.productService.getAll(true).subscribe({
    next: (response) => {
      console.log(response);  // Debería mostrar { products: [...], total: x }

      this.products = response.products;     // ✔️ CORRECTO
      this.featuredProducts = this.products.slice(0, 8); // ✔️ CORRECTO
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar productos:', error);
      this.loading = false;
    }
  });
}


  onProductClick(product: Product): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/products', product.id]);
    } else {
      this.snackBar.open(
        'Debes iniciar sesión para ver los detalles del producto',
        'Iniciar Sesión',
        {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }
      ).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToProducts(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/products']);
    } else {
      this.goToLogin();
    }
  }
}