import { Injectable, Inject, OnDestroy } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ContextService } from '@quickweb/mfe-context';
import { Subscription } from 'rxjs';
import { CustomLogService } from '../../../../shared/services/log/log.service';
import { IdGeneratorHelper } from '../../../../shared/helpers/id-generator/id-generator.helper';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Injectable()
export class IsolationThemeOverlay
  extends OverlayContainer
  implements OnDestroy
{
  private currentSegment: string = 'varejo';
  private instanceId: string;
  private subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    private contextService: ContextService,
    private logService: CustomLogService
  ) {
    super(document, platform);
    this.instanceId = IdGeneratorHelper.generateInstanceId(
      'theme-isolation-overlay'
    );
    this.logService.info(
      `Nova instância de ThemeIsolationOverlayService criada: ${this.instanceId}`,
      { instanceId: this.instanceId }
    );
  }

  protected override _createContainer(): void {
    super._createContainer();
    this.applyThemeClasses();

    this.subscription.add(
      this.contextService.eventSource$.subscribe((context) => {
        if (context?.segmento) {
          this.currentSegment = context.segmento;
          this.updateThemeClasses(context.segmento);
          this.logService.debug(`Tema atualizado para: ${context.segmento}`, {
            segmento: context.segmento,
            instanceId: this.instanceId,
          });
        }
      })
    );
  }

  private applyThemeClasses(): void {
    const container = this.getContainerElement();
    if (container) {
      container.classList.add(APP_CONSTANTS.THEME.COMPONENT_NAME);

      const themeClass = `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${this.currentSegment}`;
      container.classList.add(themeClass);
    }
  }

  private updateThemeClasses(segmento: string): void {
    const container = this.getContainerElement();
    if (container) {
      container.classList.forEach((className) => {
        if (className.startsWith(APP_CONSTANTS.THEME.IDS_TEMA_PREFIX)) {
          container.classList.remove(className);
        }
      });

      const themeClass = `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${segmento}`;
      container.classList.add(themeClass);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.logService.info(
      `ThemeIsolationOverlayService destruído: ${this.instanceId}`,
      { instanceId: this.instanceId }
    );
  }

  getInstanceId(): string {
    return this.instanceId;
  }
}
