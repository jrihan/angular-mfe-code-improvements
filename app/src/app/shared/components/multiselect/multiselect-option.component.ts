import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-multiselect-option',
  standalone: true,
  template: '',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MultiselectOptionComponent<T = any> {
  @Input({ required: true }) value!: T;
  @Input() label?: string;

  get resolvedLabel(): string {
    return this.label ?? String(this.value);
  }
}
