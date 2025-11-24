import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user';
import { OrderService } from '../../../../core/services/order';
import { Order } from '../../../../shared/models/order';

@Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FormsModule
    ],
    templateUrl: './order-form.html',
    styleUrl: './order-form.css'
})
export class OrderForm implements OnInit {
    order: Order | null = null;
    newStatus: string = '';
    loading = false;
    orderId: number | null = null;

    statusOptions = [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'procesando', label: 'Procesando' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'entregado', label: 'Entregado' },
        { value: 'cancelado', label: 'Cancelado' }
    ];

    constructor(
        private orderService: OrderService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.orderId = +params['id'];
                this.loadOrder(this.orderId);
            }
        });
    }

    loadOrder(id: number): void {
        this.loading = true;
        this.orderService.getById(id).subscribe({
            next: (response: any) => {
                // Handle both { order: ... } and direct Order object
                if (response && response.order) {
                    this.order = response.order;
                } else if (response && response.id) {
                    this.order = response;
                } else {
                    console.error('Unexpected response structure:', response);
                    this.showSnackBar('Error: Formato de respuesta incorrecto', 'error');
                    this.loading = false;
                    this.cdr.detectChanges();
                    return;
                }

                if (this.order) {
                    this.newStatus = this.order.status;

                    // Fetch user details if customer_name is missing but user_id exists
                    if (!this.order.customer_name && this.order.user_id) {
                        this.loadUser(this.order.user_id);
                    } else {
                        this.loading = false;
                        this.cdr.detectChanges();
                    }
                } else {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            },
            error: (error) => {
                console.error('Error loading order', error);
                this.showSnackBar('Error al cargar el pedido', 'error');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Since /api/users/:id is 404, we try to find the user info from the orders list
    loadUser(userId: number): void {
        this.orderService.getAll().subscribe({
            next: (response) => {
                // Find any order with the same user_id that has customer info
                const orderWithUser = response.orders.find(o => o.user_id === userId && o.customer_name);

                if (this.order && orderWithUser) {
                    this.order.customer_name = orderWithUser.customer_name;
                    this.order.customer_email = orderWithUser.customer_email;
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Error loading orders list for user info', error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    updateStatus(): void {
        if (!this.order || this.newStatus === this.order.status) return;

        this.loading = true;
        this.orderService.updateStatus(this.order.id, this.newStatus).subscribe({
            next: () => {
                this.showSnackBar('Estado actualizado correctamente', 'success');
                this.loadOrder(this.order!.id); // Reload to refresh data
            },
            error: (error) => {
                console.error('Error updating status', error);
                this.showSnackBar('Error al actualizar el estado', 'error');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    private showSnackBar(message: string, type: 'success' | 'error'): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
        });
    }
}
