import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order';
import { Order } from '../../../shared/models/order';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'date', 'total', 'status', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  loading = false; // ✅ FIX: Inicializar en false para evitar NG0100

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders(): void {
    // Usamos setTimeout para mover la actualización a la siguiente macrotarea
    setTimeout(() => {
      this.loading = true;
      this.cd.detectChanges();

      this.orderService.getMyOrders().subscribe({
        next: (response) => {
          this.dataSource.data = response.orders;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error loading orders', error);
          this.snackBar.open('Error al cargar los pedidos', 'Cerrar', { duration: 3000 });
          this.loading = false;
          this.cd.detectChanges();
        }
      });
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

  viewOrderDetails(order: Order): void {
    // Por ahora solo mostramos un mensaje, podrías implementar un modal con detalles
    this.snackBar.open(`Pedido #${order.id} - Total: $${order.total}`, 'Cerrar', { duration: 4000 });
  }
}
