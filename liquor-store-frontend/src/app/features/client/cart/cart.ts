import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';
import { CartItem } from '../../../shared/models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  loading = false;
  processingOrder = false;

  displayedColumns = ['image', 'product', 'price', 'quantity', 'subtotal', 'actions'];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    // Usamos setTimeout para evitar NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
    setTimeout(() => {
      this.loading = true;
      this.cd.detectChanges();

      this.cartService.getCart().subscribe({
        next: (response) => {
          this.cartItems = response.cart;
          this.total = parseFloat(response.total);
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar el carrito:', error);
          this.snackBar.open('Error al cargar el carrito', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.cd.detectChanges();
        }
      });
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      this.snackBar.open('La cantidad mínima es 1', 'Cerrar', { duration: 2000 });
      return;
    }

    if (newQuantity > item.stock) {
      this.snackBar.open(`Solo hay ${item.stock} unidades disponibles`, 'Cerrar', { duration: 3000 });
      return;
    }

    this.cartService.updateQuantity(item.product_id, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al actualizar cantidad:', error);
        this.snackBar.open('Error al actualizar cantidad', 'Cerrar', { duration: 3000 });
      }
    });
  }

  removeItem(item: CartItem): void {
    if (!confirm(`¿Eliminar ${item.product_name} del carrito?`)) {
      return;
    }

    this.cartService.removeItem(item.product_id).subscribe({
      next: () => {
        this.snackBar.open('Producto eliminado del carrito', 'Cerrar', { duration: 2000 });
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.snackBar.open('Error al eliminar producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  clearCart(): void {
    if (!confirm('¿Vaciar todo el carrito?')) {
      return;
    }

    this.cartService.clearCart().subscribe({
      next: () => {
        this.snackBar.open('Carrito vaciado', 'Cerrar', { duration: 2000 });
        this.loadCart();
      },
      error: (error) => {
        console.error('Error al vaciar carrito:', error);
        this.snackBar.open('Error al vaciar carrito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  confirmOrder(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('El carrito está vacío', 'Cerrar', { duration: 3000 });
      return;
    }

    this.processingOrder = true;

    // Crear orden desde el carrito
    this.orderService.createFromCart().subscribe({
      next: (response) => {
        this.processingOrder = false;
        this.snackBar.open('¡Pedido realizado con éxito!', 'Ver Pedidos', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }).onAction().subscribe(() => {
          this.router.navigate(['/orders']);
        });

        // Limpiar carrito localmente
        this.cartItems = [];
        this.total = 0;

        // Refrescar contador del carrito
        this.cartService.refreshCartCount();
      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        this.processingOrder = false;

        const errorMessage = error.error?.message || 'Error al procesar el pedido';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
