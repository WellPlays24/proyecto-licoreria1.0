// ============================================
// COMPONENTE HOME (Página Principal)
// ============================================

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailDialog } from '../../client/products/product-detail-dialog/product-detail-dialog';

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
    NgFor,
    MatDialogModule
  ]
})
export class Home implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  loading = false;
  isAuthenticated = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadData();
  }

  loadData(): void {
    // Usamos setTimeout para mover la actualización a la siguiente macrotarea
    setTimeout(() => {
      this.loading = true;
      this.cd.detectChanges();

      this.loadCategories();
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll(true).subscribe({
      next: (response) => {
        this.products = response.products;
        // Obtener los primeros 8 productos como destacados
        this.featuredProducts = this.products.slice(0, 8);
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  onProductClick(product: Product): void {
    if (this.isAuthenticated) {
      this.dialog.open(ProductDetailDialog, {
        data: product,
        width: '500px',
        maxWidth: '95vw',
        panelClass: 'product-detail-dialog'
      });
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