import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, request).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('firstName', response.firstName);
      }),
    );
  }

  register(request: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.url}/register`, request);
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getFirstName(): string | null {
    return localStorage.getItem('firstName');
  }
}
