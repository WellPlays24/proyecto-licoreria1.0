// ============================================
// SERVICIO DE CATEGORÍAS
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryResponse } from '../../shared/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // ============================================
  // OBTENER TODAS LAS CATEGORÍAS
  // ============================================
  getAll(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.apiUrl);
  }

  // ============================================
  // OBTENER CATEGORÍA POR ID
  // ============================================
  getById(id: number): Observable<{ category: Category }> {
    return this.http.get<{ category: Category }>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // CREAR CATEGORÍA (ADMIN)
  // ============================================
  create(category: Partial<Category>): Observable<{ message: string; category: Category }> {
    return this.http.post<{ message: string; category: Category }>(this.apiUrl, category);
  }

  // ============================================
  // ACTUALIZAR CATEGORÍA (ADMIN)
  // ============================================
  update(id: number, category: Partial<Category>): Observable<{ message: string; category: Category }> {
    return this.http.put<{ message: string; category: Category }>(`${this.apiUrl}/${id}`, category);
  }

  // ============================================
  // ELIMINAR CATEGORÍA (ADMIN)
  // ============================================
  delete(id: number): Observable<{ message: string; category: Category }> {
    return this.http.delete<{ message: string; category: Category }>(`${this.apiUrl}/${id}`);
  }
}