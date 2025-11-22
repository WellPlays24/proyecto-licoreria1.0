// ============================================
// SERVICIO DE CARRITO
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartResponse, AddToCartRequest, UpdateQuantityRequest } from '../../shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  // BehaviorSubject para actualizar el badge del carrito
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ============================================
  // OBTENER CARRITO
  // ============================================
  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      tap(response => this.cartCountSubject.next(response.items_count))
    );
  }

  // ============================================
  // AGREGAR AL CARRITO
  // ============================================
  addItem(data: AddToCartRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ============================================
  // ACTUALIZAR CANTIDAD
  // ============================================
  updateQuantity(productId: number, quantity: number): Observable<any> {
    const data: UpdateQuantityRequest = { quantity };
    return this.http.put(`${this.apiUrl}/update/${productId}`, data).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ============================================
  // ELIMINAR DEL CARRITO
  // ============================================
  removeItem(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  // ============================================
  // VACIAR CARRITO
  // ============================================
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => this.cartCountSubject.next(0))
    );
  }

  // ============================================
  // REFRESCAR CANTIDAD DEL CARRITO
  // ============================================
  refreshCartCount(): void {
    this.getCart().subscribe();
  }

  // ============================================
  // OBTENER CANTIDAD ACTUAL
  // ============================================
  getCartCount(): number {
    return this.cartCountSubject.value;
  }
}