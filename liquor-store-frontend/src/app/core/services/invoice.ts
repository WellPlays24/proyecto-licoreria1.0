// ============================================
// SERVICIO DE FACTURAS
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice, InvoiceResponse } from '../../shared/models/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  // ============================================
  // OBTENER MIS FACTURAS
  // ============================================
  getMyInvoices(): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(`${this.apiUrl}/my-invoices`);
  }

  // ============================================
  // OBTENER FACTURA POR ID
  // ============================================
  getById(id: number): Observable<{ invoice: Invoice }> {
    return this.http.get<{ invoice: Invoice }>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // OBTENER FACTURA POR ORDER ID
  // ============================================
  getByOrderId(orderId: number): Observable<{ invoice: Invoice }> {
    return this.http.get<{ invoice: Invoice }>(`${this.apiUrl}/order/${orderId}`);
  }

  // ============================================
  // OBTENER TODAS LAS FACTURAS (ADMIN)
  // ============================================
  getAll(): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(this.apiUrl);
  }
}