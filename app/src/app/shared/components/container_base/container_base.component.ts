import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  IdsFormSelectionModule,
  IdsIconModule,
  IdsMainButtonModule,
  IdsSwitchModule,
} from '@ids/angular';

@Component({
  selector: 'container-base',
  templateUrl: './container_base.component.html',
  styleUrls: ['./container_base.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IdsFormSelectionModule,
    IdsSwitchModule,
    IdsIconModule,
    IdsMainButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContainerBaseComponent {
  @Input() title?: string;

  @Input() done: boolean = false;

  @Input() doneLabel = 'Preenchido';

  @Input() showStatus = true;

  @Input() showLeftHeader = false;

  @Input() buttonTitle?: string;

  @Input() buttonIcon?: string;

  @Input() secondButtonTitle?: string;

  @Input() secondButtonIcon?: string;

  @Input() showSecondButton: boolean = false;

  @Output() secondButtonClick = new EventEmitter<void>();

  @Input() showSwitcher: boolean = false;

  @Input() switcherLabel = 'Vincular';

  @Input() switcherChecked = false;

  @Output() switcherCheckedChange = new EventEmitter<boolean>();

  @Output() buttonClick = new EventEmitter<void>();

  expanded: boolean = true;

  get containerClasses(): Record<string, boolean> {
    return {
      'is-done': this.showStatus && this.done,
    };
  }

  onButtonClick() {
    this.buttonClick.emit();
  }

  onSecondButtonClick() {
    this.secondButtonClick.emit();
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
