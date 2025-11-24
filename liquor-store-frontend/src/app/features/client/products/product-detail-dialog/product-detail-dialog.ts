import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Product } from '../../../../shared/models/product';
import { CartService } from '../../../../core/services/cart';

@Component({
    selector: 'app-product-detail-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './product-detail-dialog.html',
    styleUrl: './product-detail-dialog.css'
})
export class ProductDetailDialog {
    quantity: number = 1;

    constructor(
        public dialogRef: MatDialogRef<ProductDetailDialog>,
        @Inject(MAT_DIALOG_DATA) public product: Product,
        private cartService: CartService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    increaseQuantity(): void {
        if (this.quantity < this.product.stock) {
            this.quantity++;
        } else {
            this.snackBar.open(`Solo hay ${this.product.stock} unidades disponibles`, 'Cerrar', { duration: 2000 });
        }
    }

    decreaseQuantity(): void {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    addToCart(): void {
        if (this.product.stock === 0) {
            this.snackBar.open('Producto agotado', 'Cerrar', { duration: 3000 });
            return;
        }

        this.cartService.addItem({ product_id: this.product.id, quantity: this.quantity }).subscribe({
            next: () => {
                this.dialogRef.close();
                this.snackBar.open(`${this.product.name} añadido al carrito`, 'Ver Carrito', {
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

    close(): void {
        this.dialogRef.close();
    }
}
