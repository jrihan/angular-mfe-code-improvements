import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { IContext, IInteractionEvent } from '@quickweb/mfe-context';

import { MainComponent } from './components/main/main.component';
import { InputData } from './models/inputdata.model';
import { ContextService } from './shared/services/context.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mf-plataformaresseguro-mfe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.ShadowDom,
  standalone: true,
  imports: [CommonModule, MainComponent],
})
export class AppComponent implements OnChanges {
  @Input() context: string;
  @Output() interactionEvent: EventEmitter<IInteractionEvent> =
    new EventEmitter<IInteractionEvent>();
  contextBase: IContext<any>;

  constructor(private contextService: ContextService) {}

  ngOnChanges(simpleChanges: SimpleChanges): void {
    this.changesEventsMfe(simpleChanges);
  }

  private changesEventsMfe(simpleChanges: SimpleChanges): void {
    if (
      simpleChanges.context?.currentValue &&
      typeof simpleChanges.context?.currentValue === 'string'
    ) {
      this.contextBase = JSON.parse(
        simpleChanges.context.currentValue
      ) as IContext<InputData>;
      this.contextBase.segmento ??= 'varejo';
      this.contextService.setContext(this.contextBase);
    }
  }

  interactionEvents(event: IInteractionEvent): void {
    this.interactionEvent.emit(event);
  }

  get isContextValid(): boolean {
    return this.contextBase !== null && this.contextBase !== undefined;
  }
}
