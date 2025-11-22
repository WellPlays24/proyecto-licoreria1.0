// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Cargar usuario del localStorage al iniciar
    this.loadUserFromStorage();
  }

  // ============================================
  // REGISTRO
  // ============================================
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  // ============================================
  // LOGIN
  // ============================================
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  // ============================================
  // LOGOUT
  // ============================================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  // ============================================
  // OBTENER PERFIL
  // ============================================
  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/auth/profile`);
  }

  // ============================================
  // ACTUALIZAR PERFIL
  // ============================================
  updateProfile(data: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/auth/profile`, data).pipe(
      tap(response => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  // ============================================
  // VERIFICAR SI ESTÁ AUTENTICADO
  // ============================================
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ============================================
  // OBTENER TOKEN
  // ============================================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ============================================
  // OBTENER USUARIO ACTUAL
  // ============================================
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ============================================
  // OBTENER ROL DEL USUARIO
  // ============================================
  getUserRole(): 'admin' | 'cliente' | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // ============================================
  // VERIFICAR SI ES ADMIN
  // ============================================
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // ============================================
  // VERIFICAR SI ES CLIENTE
  // ============================================
  isClient(): boolean {
    return this.getUserRole() === 'cliente';
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  private handleAuthSuccess(response: AuthResponse): void {
    // Guardar token y usuario en localStorage
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Actualizar BehaviorSubject
    this.currentUserSubject.next(response.user);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar usuario del localStorage', error);
        this.logout();
      }
    }
  }
}