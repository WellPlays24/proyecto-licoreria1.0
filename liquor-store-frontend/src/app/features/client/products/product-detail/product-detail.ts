// ============================================
// COMPONENTE PRODUCT DETAIL (CLIENTE) - RF03, RF04
// ============================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product';
import { CartService } from '../../../../core/services/cart';
import { Product } from '../../../../shared/models/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, NgIf } from '@angular/common';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatCardContent, MatDivider,
    MatIcon, MatChip, MatChipsModule,
    MatProgressSpinnerModule, MatButtonModule,
    NgIf,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule
  ]
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  quantityControl = new FormControl(1, [Validators.required, Validators.min(1)]);
  loading = true;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (response) => {
        this.product = response.product;

        // Configurar validador de cantidad máxima según stock (RF03)
        if (this.product.stock > 0) {
          this.quantityControl.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(this.product.stock)
          ]);
          this.quantityControl.updateValueAndValidity();
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar producto:', error);
        this.loading = false;
        this.snackBar.open('Error al cargar el producto', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/products']);
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantityControl.value! < this.product.stock) {
      this.quantityControl.setValue(this.quantityControl.value! + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantityControl.value! > 1) {
      this.quantityControl.setValue(this.quantityControl.value! - 1);
    }
  }

  addToCart(): void {
    if (!this.product || this.quantityControl.invalid) {
      return;
    }

    // RF04: Verificar que hay stock disponible
    if (this.product.stock === 0) {
      this.snackBar.open(
        'Producto no disponible por falta de stock',
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    // RF03: Verificar que la cantidad no exceda el stock
    const quantity = this.quantityControl.value!;
    if (quantity > this.product.stock) {
      this.snackBar.open(
        `Solo hay ${this.product.stock} unidades disponibles`,
        'Cerrar',
        {
          duration: 4000,
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    this.addingToCart = true;

    this.cartService.addItem({
      product_id: this.product.id,
      quantity: quantity
    }).subscribe({
      next: () => {
        this.addingToCart = false;
        this.snackBar.open(
          `✓ ${this.product!.name} agregado al carrito`,
          'Ver Carrito',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        ).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });

        // Resetear cantidad a 1
        this.quantityControl.setValue(1);
      },
      error: (error) => {
        this.addingToCart = false;

        // RF04: Manejar error de falta de stock desde el backend
        const errorMessage = error.error?.message || error.error?.error || 'Error al agregar al carrito';

        this.snackBar.open(
          errorMessage,
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getStockStatus(): { text: string; color: string; icon: string } {
    if (!this.product) {
      return { text: '', color: '', icon: '' };
    }

    if (this.product.stock === 0) {
      return {
        text: 'Agotado',
        color: 'warn',
        icon: 'close'
      };
    } else if (this.product.stock < 5) {
      return {
        text: `Solo ${this.product.stock} unidades disponibles`,
        color: 'accent',
        icon: 'warning'
      };
    } else {
      return {
        text: `${this.product.stock} unidades disponibles`,
        color: 'primary',
        icon: 'check_circle'
      };
    }
  }

  getQuantityErrorMessage(): string {
    if (this.quantityControl.hasError('required')) {
      return 'La cantidad es requerida';
    }
    if (this.quantityControl.hasError('min')) {
      return 'La cantidad mínima es 1';
    }
    if (this.quantityControl.hasError('max')) {
      return `Solo hay ${this.product?.stock} unidades disponibles`;
    }
    return '';
  }
}