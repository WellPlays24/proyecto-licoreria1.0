// ============================================
// SERVICIO DE PRODUCTOS
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductResponse, ProductRequest } from '../../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // ============================================
  // OBTENER TODOS LOS PRODUCTOS
  // ============================================
  getAll(activeOnly: boolean = true): Observable<ProductResponse> {
    let params = new HttpParams();
    if (activeOnly) {
      params = params.set('active', 'true');
    }
    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getAll0(activeOnly: boolean = true): Observable<Product[]> {
  let params = new HttpParams();

  if (activeOnly) {
    params = params.set('active', 'true');
  }

  return this.http.get<Product[]>(this.apiUrl, { params });
}


  // ============================================
  // BUSCAR PRODUCTOS
  // ============================================
  search(query: string): Observable<ProductResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ProductResponse>(`${this.apiUrl}/search`, { params });
  }

  // ============================================
  // OBTENER PRODUCTOS POR CATEGORÍA
  // ============================================
  getByCategory(categoryId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/category/${categoryId}`);
  }

  // ============================================
  // OBTENER PRODUCTO POR ID
  // ============================================
  getById(id: number): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // CREAR PRODUCTO (ADMIN)
  // ============================================
  create(product: ProductRequest): Observable<{ message: string; product: Product }> {
    return this.http.post<{ message: string; product: Product }>(this.apiUrl, product);
  }

  // ============================================
  // ACTUALIZAR PRODUCTO (ADMIN)
  // ============================================
  update(id: number, product: Partial<ProductRequest>): Observable<{ message: string; product: Product }> {
    return this.http.put<{ message: string; product: Product }>(`${this.apiUrl}/${id}`, product);
  }

  // ============================================
  // ACTUALIZAR STOCK (ADMIN)
  // ============================================
  updateStock(id: number, stock: number): Observable<{ message: string; product: Product }> {
    return this.http.patch<{ message: string; product: Product }>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  // ============================================
  // ELIMINAR PRODUCTO (ADMIN)
  // ============================================
  delete(id: number): Observable<{ message: string; product: Product }> {
    return this.http.delete<{ message: string; product: Product }>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // SUBIR IMAGEN (ADMIN)
  // ============================================
  uploadImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/${id}/image`, formData);
  }
}