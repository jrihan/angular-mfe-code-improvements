import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarData {
  show: boolean;
  message: string;
  duration: number;
  variant: SnackbarVariant;
}

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackbarSubject = new BehaviorSubject<SnackbarData>({
    show: false,
    message: '',
    duration: 3000,
    variant: 'info',
  });

  snackbar$ = this.snackbarSubject.asObservable();

  showSnackbar(
    message: string,
    variant: SnackbarVariant = 'info',
    duration = 3000
  ) {
    this.snackbarSubject.next({ show: true, message, duration, variant });
  }

  hideSnackbar() {
    this.snackbarSubject.next({ ...this.snackbarSubject.value, show: false });
  }
}
