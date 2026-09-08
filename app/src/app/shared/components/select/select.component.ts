import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { IdsIconModule } from '@ids/angular';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule, IdsIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecione';

  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;
  selected?: SelectOption;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  select(option: SelectOption) {
    this.selected = option;
    this.valueChange.emit(option.value);
    this.isOpen = false;
  }
}
