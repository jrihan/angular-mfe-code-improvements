import {
  AfterContentInit,
  Component,
  ContentChildren,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdsIconModule } from '@ids/angular';
import { MultiselectOptionComponent } from './multiselect-option.component';

export interface MultiSelectOption<T = any> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  imports: [CommonModule, IdsIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultiselectComponent<T = any> implements AfterContentInit {
  @Input() placeholder = 'Selecione opções';

  @Input() set selected(val: MultiSelectOption<T>[]) {
    this.selectedOptions = val ?? [];
  }

  @Output() selectionChange = new EventEmitter<MultiSelectOption<T>[]>();

  @ContentChildren(MultiselectOptionComponent)
  projectedOptions!: QueryList<MultiselectOptionComponent<T>>;

  isOpen = false;

  options: MultiSelectOption<T>[] = [];
  selectedOptions: MultiSelectOption<T>[] = [];

  ngAfterContentInit(): void {
    this.options = this.projectedOptions.map((opt) => ({
      value: opt.value,
      label: opt.resolvedLabel,
    }));
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  isSelected(option: MultiSelectOption<T>): boolean {
    return this.selectedOptions.some((o) => o.value === option.value);
  }

  selectOption(option: MultiSelectOption<T>): void {
    if (this.isSelected(option)) {
      this.selectedOptions = this.selectedOptions.filter(
        (o) => o.value !== option.value
      );
    } else {
      this.selectedOptions = [...this.selectedOptions, option];
    }

    this.selectionChange.emit([...this.selectedOptions]);
  }

  get selectedCount(): number {
    return this.selectedOptions.length;
  }
}
