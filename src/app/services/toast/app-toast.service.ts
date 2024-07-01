import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  delay?: number;
  type?: 'error' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  toasts: ToastInfo[] = [];

  show(header: string, body: string, type: 'error' | 'success' = 'error', delay: number = 6000) {
    const toast: ToastInfo = { header, body, type, delay };
    this.toasts.push(toast);
    setTimeout(() => {
      this.remove(toast);
    }, delay);
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
