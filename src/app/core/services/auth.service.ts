import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../../models/user.model';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private router: Router) {
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<string> {
    return this.apiService.postText('/auth/register', request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', request).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    window.location.replace('/');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'USER';
  }

  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('/users/profile');
  }

  updateProfile(user: User): Observable<User> {
    return this.apiService.put<User>('/users/profile/update', user);
  }

  deleteAccount(): Observable<any> {
    return this.apiService.delete('/users/deleteProfile');
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);

    // Decode JWT to get user info
    const tokenPayload = this.decodeToken(authResult.token);
    const user: User = {
      userId: tokenPayload.userId,
      fullName: tokenPayload.fullName || tokenPayload.sub,
      email: tokenPayload.sub,
      role: authResult.role as 'USER' | 'ADMIN',
    };

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }
}
