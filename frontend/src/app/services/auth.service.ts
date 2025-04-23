// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Ensure HttpClient is imported
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  
  constructor(private http: HttpClient) {  // HttpClient is correctly injected
    this.loadUser();
  }

  private loadUser() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getUserInfo().subscribe();
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.getUserInfo().subscribe();
          }
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, { username, email, password });
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/user/`)
      .pipe(
        tap(user => {
          this.userSubject.next(user);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    return this.http.post<any>(`${this.apiUrl}/auth/logout/`, {});
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get user$(): Observable<any> {
    return this.userSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
