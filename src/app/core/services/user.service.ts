import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<any[]>('/users/all').pipe(
      map(apiUsers => apiUsers.map(apiUser => ({
        userId: apiUser.userId,
        fullName: apiUser.email, // Backend returns fullName in email field
        email: apiUser.fullName, // Backend returns email in fullName field
        role: 'USER' as const // All users from this endpoint are USER role
      })))
    );
  }

  getUserById(userId: number): Observable<User> {
    return this.apiService.get<User>(`/users/${userId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.apiService.delete(`/users/${userId}`);
  }
}

