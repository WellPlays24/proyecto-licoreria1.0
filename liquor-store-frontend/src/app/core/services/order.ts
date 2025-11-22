// ============================================
// SERVICIO DE PEDIDOS
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderResponse, CreateOrderResponse, UpdateStatusRequest } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // ============================================
  // CREAR PEDIDO DESDE CARRITO
  // ============================================
  createFromCart(): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/create`, {});
  }

  // ============================================
  // OBTENER MIS PEDIDOS
  // ============================================
  getMyOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/my-orders`);
  }

  // ============================================
  // OBTENER PEDIDO POR ID
  // ============================================
  getById(id: number): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // OBTENER TODOS LOS PEDIDOS (ADMIN)
  // ============================================
  getAll(status?: string): Observable<OrderResponse> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<OrderResponse>(this.apiUrl, { params });
  }

  // ============================================
  // ACTUALIZAR ESTADO DEL PEDIDO (ADMIN)
  // ============================================
  updateStatus(id: number, status: string): Observable<{ message: string; order: Order }> {
    const data: UpdateStatusRequest = { 
      status: status as 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
    };
    return this.http.patch<{ message: string; order: Order }>(`${this.apiUrl}/${id}/status`, data);
  }
}