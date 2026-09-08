import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  'em-andamento': { label: 'Em Andamento', class: 'status-in-progress' },
  'concluido': { label: 'Concluído', class: 'status-done' },
  'com-rateio': { label: 'Com Rateio', class: 'status-with-split' },
  'carregar-arquivos': { label: 'Carregar Arquivos', class: 'status-upload-required' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="status-badge"
      [ngClass]="config.class"
      role="status"
      [attr.aria-label]="'Status: ' + config.label"
    >
      {{ config.label }}
    </span>
  `,
  styleUrls: ['./status-badge.component.css'],
})
export class StatusBadgeComponent {
  @Input() status = '';

  get config() {
    return (
      STATUS_CONFIG[this.status] ?? {
        label: this.status,
        class: 'status-unknown',
      }
    );
  }
}