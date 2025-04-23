// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private isBrowser: boolean;
  
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, email, password });
  }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, { username, password })
      .pipe(
        tap((response: any) => {
          if (this.isBrowser) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
          }
          this.isAuthenticatedSubject.next(true);
        })
      );
  }
  
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = this.isBrowser ? localStorage.getItem('refresh_token') : null;
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response: any) => {
          if (this.isBrowser) {
            localStorage.setItem('access_token', response.access);
          }
        })
      );
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('access_token') : null;
  }
  
  private hasToken(): boolean {
    return this.isBrowser ? !!localStorage.getItem('access_token') : false;
  }
}