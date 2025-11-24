import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<{ users: User[] }> {
        return this.http.get<{ users: User[] }>(this.apiUrl);
    }

    getById(id: number): Observable<{ user: User }> {
        return this.http.get<{ user: User }>(`${this.apiUrl}/${id}`);
    }

    create(user: User): Observable<{ message: string; user: User }> {
        return this.http.post<{ message: string; user: User }>(this.apiUrl, user);
    }

    update(id: number, user: Partial<User>): Observable<{ message: string; user: User }> {
        return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/${id}`, user);
    }

    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    getCurrentUser(): Observable<{ user: User }> {
        return this.http.get<{ user: User }>(`${environment.apiUrl}/auth/profile`);
    }

    updateProfile(data: Partial<User>): Observable<{ message: string; user: User }> {
        return this.http.put<{ message: string; user: User }>(`${environment.apiUrl}/auth/profile`, data);
    }
}
