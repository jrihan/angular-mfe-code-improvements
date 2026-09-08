import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface MultiselectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-multiselect-summary',
  templateUrl: './multiselect-summary.component.html',
  styleUrls: ['./multiselect-summary.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MultiselectSummaryComponent {
  @Input() label!: string;
  @Input() options: MultiselectOption[] = [];

  @Output() remove = new EventEmitter<MultiselectOption>();
}
