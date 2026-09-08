import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IdsIconModule, IdsMainButtonModule } from '@ids/angular';

@Component({
  selector: 'app-retry-state',
  templateUrl: './retry_state.component.html',
  styleUrls: ['./retry_state.component.scss'],
  standalone: true,
  imports: [CommonModule, IdsMainButtonModule, IdsIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RetryStateComponent {
  @Input() title = 'Não foi possível carregar os dados';

  @Input() description =
    'Tente novamente em instantes ou volte para a tela anterior.';

  @Input() showRetryAction = true;

  @Input() retryLabel = 'Tentar novamente';

  @Input() backLabel = 'Voltar';

  @Output() retry = new EventEmitter<void>();

  @Output() back = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
