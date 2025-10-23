import { Injectable, NgZone } from '@angular/core';
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

  constructor(private apiService: ApiService, private router: Router, private ngZone: NgZone) {
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<string> {
    return this.apiService.postText('/auth/register', request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', request).pipe(
      tap((response) => {
        this.ngZone.run(() => {
          this.setSession(response);
        });
      })
    );
  }

  // --- FIX 1: Public logout (for user clicks) ---
  // This version clears state AND navigates.
  logout(): void {
    this.clearSession();
    this.router.navigate(['/home']); // Use '/home' or '/'
  }

  // --- FIX 2: Private session clear (for internal checks) ---
  // This version ONLY clears state. NO navigation.
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // --- FIX 3: Use clearSession() here ---
  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    } // If the token is expired, log out silently and return false

    if (this.isTokenExpired(token)) {
      this.clearSession(); // Use the silent clearSession
      return false;
    }
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
    localStorage.setItem('token', authResult.token); // Decode JWT to get user info

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

  // --- FIX 4: Use clearSession() here ---
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr && !this.isTokenExpired(token)) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearSession(); // Use the silent clearSession
      }
    } else {
      this.clearSession(); // Use the silent clearSession
    }
  }

  // --- FIX 5: Correct token expiration logic ---
  private isTokenExpired(token: string): boolean {
    try {
      // Use the decodeToken method to get the payload
      const payload = this.decodeToken(token);

      // The standard JWT claim is 'exp', not 'expiryTime'
      if (!payload.exp) {
        return true; // No expiration claim, treat as invalid
      }

      const expiryTime = payload.exp * 1000; // 'exp' is in seconds
      return Date.now() >= expiryTime;
    } catch (error) {
      return true;
    }
  }
}
