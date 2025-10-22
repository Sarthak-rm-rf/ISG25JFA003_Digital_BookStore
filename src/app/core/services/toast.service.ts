// Create this file at: src/app/core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  public toastState = this.toastSubject.asObservable();

  show(type: 'success' | 'error' | 'info', message: string, duration: number = 5000) {
    this.toastSubject.next({ type, message, duration });
  }

  showSuccess(message: string, duration: number = 3000) {
    this.show('success', message, duration);
  }

  showError(message: string, duration: number = 5000) {
    this.show('error', message, duration);
  }
}