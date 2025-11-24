import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../../core/services/order';
import { ProductService } from '../../../../core/services/product';
import { Order } from '../../../../shared/models/order';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatTooltipModule,
        MatSnackBarModule,
        RouterModule
    ],
    templateUrl: './order-list.html',
    styleUrl: './order-list.css'
})
export class OrderList implements OnInit, AfterViewInit {
    // ✅ Ahora incluye 'actions'
    displayedColumns = ['id', 'customer', 'date', 'total', 'status', 'actions'];
    dataSource = new MatTableDataSource<Order>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private orderService: OrderService,
        private productService: ProductService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadOrders();
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadOrders(): void {
        this.orderService.getAll().subscribe({
            next: (response) => {
                this.dataSource.data = response.orders;
            },
            error: (error) => {
                console.error('Error loading orders', error);
                this.snackBar.open('Error al cargar los pedidos', 'Cerrar', { duration: 3000 });
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editOrder(order: Order): void {
        // Opcional: puedes abrir un modal o navegar — ya estás usando routerLink en el HTML
        console.log('Editar pedido', order.id);
        // Ejemplo si prefieres programáticamente:
        // this.router.navigate(['/orders', order.id]);
    }

    deleteOrder(order: Order): void {
        if (!confirm(`¿Estás seguro de eliminar el pedido #${order.id}? Esto devolverá los productos al stock.`)) {
            return;
        }

        // 1. Obtener detalles completos del pedido (para restaurar stock)
        this.orderService.getById(order.id).subscribe({
            next: (response: any) => {
                const orderDetails = response.order || response;

                if (!orderDetails.details || orderDetails.details.length === 0) {
                    // Sin productos → eliminar directamente
                    this.executeDelete(order.id);
                    return;
                }

                // 2. Restaurar stock de cada producto
                const stockUpdates = orderDetails.details.map((detail: any) => {
                    return new Promise<void>((resolve) => {
                        this.productService.getById(detail.product_id).subscribe({
                            next: (prodResponse) => {
                                const currentStock = prodResponse.product.stock;
                                const newStock = currentStock + detail.quantity;

                                this.productService.updateStock(detail.product_id, newStock).subscribe({
                                    next: () => resolve(),
                                    error: (err) => {
                                        console.error(`Error restoring stock for product ${detail.product_id}`, err);
                                        resolve(); // Continuar aunque falle
                                    }
                                });
                            },
                            error: (err) => {
                                console.error(`Error fetching product ${detail.product_id}`, err);
                                resolve();
                            }
                        });
                    });
                });

                // 3. Eliminar pedido tras restaurar stock
                Promise.all(stockUpdates).then(() => {
                    this.executeDelete(order.id);
                });
            },
            error: (err) => {
                console.error('Error fetching order details for deletion', err);
                this.snackBar.open('Error al procesar la eliminación', 'Cerrar', { duration: 3000 });
            }
        });
    }

    private executeDelete(id: number): void {
        this.orderService.delete(id).subscribe({
            next: () => {
                this.snackBar.open('Pedido eliminado y stock restaurado', 'Cerrar', { duration: 3000 });
                this.loadOrders();
            },
            error: (error) => {
                console.error('Error deleting order', error);
                this.snackBar.open('Error al eliminar el pedido', 'Cerrar', { duration: 3000 });
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pendiente': return 'status-pending';
            case 'procesando': return 'status-processing';
            case 'enviado': return 'status-shipped';
            case 'entregado': return 'status-delivered';
            case 'cancelado': return 'status-cancelled';
            default: return 'status-default';
        }
    }
}