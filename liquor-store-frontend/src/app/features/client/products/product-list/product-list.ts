// ============================================
// COMPONENTE PRODUCT LIST (CLIENTE) - RF02
// ============================================

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../../core/services/product';
import { CategoryService } from '../../../../core/services/category';
import { CartService } from '../../../../core/services/cart';
import { Product } from '../../../../shared/models/product';
import { Category } from '../../../../shared/models/category';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductDetailDialog } from '../product-detail-dialog/product-detail-dialog';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  imports: [
    CommonModule,
    MatIcon,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatChipsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  searchControl = new FormControl('');
  selectedCategory: number | null = null;

  loading = false; // ✅ FIX: Inicializar en false para evitar NG0100

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.setupSearch();
  }

  loadData(): void {
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
        this.filteredProducts = this.products;
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

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filterProducts(searchTerm || '');
      });
  }

  filterProducts(searchTerm: string): void {
    let filtered = this.products;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category_id === this.selectedCategory);
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.filterProducts(this.searchControl.value || '');
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.selectedCategory = null;
    this.filteredProducts = this.products;
  }

  viewProduct(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.dialog.open(ProductDetailDialog, {
      data: product,
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'product-detail-dialog'
    });
  }

  getStockStatus(stock: number): { text: string; color: string } {
    if (stock === 0) {
      return { text: 'Agotado', color: 'warn' };
    } else if (stock < 5) {
      return { text: 'Pocas unidades', color: 'accent' };
    } else {
      return { text: 'Disponible', color: 'primary' };
    }
  }

  addToCart(product: Product, event: Event, quantity: number = 1): void {
    event.stopPropagation();

    if (product.stock === 0) {
      this.snackBar.open('Producto agotado', 'Cerrar', { duration: 3000 });
      return;
    }

    if (quantity > product.stock) {
      this.snackBar.open(`Solo hay ${product.stock} unidades disponibles`, 'Cerrar', { duration: 3000 });
      return;
    }

    this.cartService.addItem({ product_id: product.id, quantity }).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} añadido al carrito`, 'Ver Carrito', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: (error) => {
        console.error('Error al añadir al carrito:', error);
        this.snackBar.open('Error al añadir al carrito', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
