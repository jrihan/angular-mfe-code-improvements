import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarService, SnackbarData } from '../../services/snackbar.service';
import { CommonModule } from '@angular/common';
import { IdsSnackbarModule } from '@ids/angular';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  standalone: true,
  imports: [CommonModule, IdsSnackbarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SnackbarComponent implements OnInit, OnDestroy {
  message = '';
  durationInSeconds = 3;
  variant: 'success' | 'error' | 'info' | 'warning' = 'info';
  show = false;
  private sub: Subscription | undefined;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.sub = this.snackbarService.snackbar$.subscribe(
      (data: SnackbarData) => {
        this.message = data.message;
        // O snackbar do IDS recebe a duração em segundos
        this.durationInSeconds = data.duration / 1000;
        this.variant = data.variant;
        this.show = data.show;
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onShowChange(show: boolean): void {
    this.show = show;
    if (!show) {
      this.snackbarService.hideSnackbar();
    }
  }
}
