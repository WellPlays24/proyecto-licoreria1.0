// ============================================
// COMPONENTE DASHBOARD ADMIN
// ============================================

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { CategoryService } from '../../../core/services/category';
import { OrderService } from '../../../core/services/order';
import { Product } from '../../../shared/models/product';
import { Order } from '../../../shared/models/order';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [
    MatIcon,
    NgIf, NgFor,
    MatSpinner,
    MatCard, MatCardContent, MatCardHeader, MatCardTitle,
    MatChip, MatChipsModule,
    CommonModule
  ]
})
export class Dashboard implements OnInit {
  // Estadísticas
  totalProducts = 0;
  totalCategories = 0;
  totalOrders = 0;
  totalSales = 0;

  // Pedidos por estado
  pendingOrders = 0;
  processingOrders = 0;
  shippedOrders = 0;
  deliveredOrders = 0;

  // Productos con bajo stock
  lowStockProducts: Product[] = [];

  // Últimos pedidos
  recentOrders: Order[] = [];

  // ✅ FIX: Inicializar en false para evitar NG0100
  loading = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Usamos setTimeout para mover la actualización a la siguiente macrotarea
    // y evitar ExpressionChangedAfterItHasBeenCheckedError si se llama muy rápido
    setTimeout(() => {
      this.loading = true;
      this.cd.detectChanges(); // Forzar actualización para mostrar spinner

      forkJoin({
        productsResponse: this.productService.getAll(false),
        categoriesResponse: this.categoryService.getAll(),
        ordersResponse: this.orderService.getAll()
      }).subscribe({
        next: (result) => {
          // 1. Procesar Productos
          const products = result.productsResponse.products;
          this.totalProducts = products.length;
          this.lowStockProducts = products
            .filter(p => p.stock < 10)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 5);

          // 2. Procesar Categorías
          this.totalCategories = result.categoriesResponse.categories.length;

          // 3. Procesar Pedidos
          const orders = result.ordersResponse.orders;
          this.totalOrders = orders.length;

          // Calcular total de ventas
          this.totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);

          // Contar pedidos por estado
          this.pendingOrders = orders.filter(o => o.status === 'pendiente').length;
          this.processingOrders = orders.filter(o => o.status === 'procesando').length;
          this.shippedOrders = orders.filter(o => o.status === 'enviado').length;
          this.deliveredOrders = orders.filter(o => o.status === 'entregado').length;

          // Últimos 5 pedidos
          this.recentOrders = orders
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);

          this.loading = false;
          this.cd.detectChanges(); // ✅ FIX: Forzar actualización de la vista con los datos
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.loading = false;
          this.cd.detectChanges();
        }
      });
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pendiente': 'warn',
      'procesando': 'accent',
      'enviado': 'primary',
      'entregado': 'primary',
      'cancelado': 'warn'
    };
    return colors[status] || 'primary';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pendiente': 'schedule',
      'procesando': 'autorenew',
      'enviado': 'local_shipping',
      'entregado': 'check_circle',
      'cancelado': 'cancel'
    };
    return icons[status] || 'info';
  }
}