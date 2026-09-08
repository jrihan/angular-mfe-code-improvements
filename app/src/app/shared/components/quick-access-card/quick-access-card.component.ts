import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IdsIconModule } from '@ids/angular';

@Component({
  selector: 'app-quick-access-card',
  standalone: true,
  templateUrl: './quick-access-card.component.html',
  styleUrls: ['./quick-access-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IdsIconModule, RouterModule],
})
export class QuickAccessCardComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() clickable = true;
  @Input() routerLink: any[] | string = '';
  @Input() disabled = false;

  @Output() quickAccessClick = new EventEmitter<void>();

  onCardClick(event: Event) {
    if (this.clickable && !this.disabled) {
      event.preventDefault();
      this.quickAccessClick.emit();
    }
  }
}
