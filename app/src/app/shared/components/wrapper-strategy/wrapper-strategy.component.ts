import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ContextService } from '@quickweb/mfe-context';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: `${APP_CONSTANTS.THEME.COMPONENT_NAME}-wrapper`,
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [],
  styleUrls: ['./wrapper-strategy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WrapperStrategyComponent implements OnInit, OnDestroy {
  @HostBinding('attr.class')
  public segmento: string = `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-varejo`;
  private subscription = new Subscription();

  constructor(private contextService: ContextService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.contextService.eventSource$
        .pipe(
          filter((context) => {
            return context != null && context !== undefined;
          }),
          tap((contexto) => {
            const themeClass = `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${contexto?.segmento}`;
            this.segmento = `${themeClass}`;
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
