// Create this file at: src/app/shared/components/toast/toast.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from 'src/app/core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }
  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }
  toasts: (ToastMessage & { id: number })[] = [];
  private toastSubscription!: Subscription;
  private nextId = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSubscription = this.toastService.toastState.subscribe(
      (toast) => {
        this.addToast(toast);
      }
    );
  }

  ngOnDestroy() {
    this.toastSubscription.unsubscribe();
  }

  addToast(toast: ToastMessage) {
    const id = this.nextId++;
    this.toasts.push({ ...toast, id });
    setTimeout(() => this.removeToast(id), toast.duration || 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: 'success' | 'error' | 'info'): string {
    switch (type) {
      case 'success': return '✔️';
      case 'error': return '✖️';
      case 'info': return 'ℹ️';
    }
  }
}