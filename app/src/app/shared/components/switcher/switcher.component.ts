import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switcher',
  standalone: true,
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
  imports: [CommonModule],
})
export class SwitcherComponent {
  @Input() checked = false;
  @Input() label?: string;

  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
