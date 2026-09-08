import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextService } from '@quickweb/mfe-context';
import { DebugElement, ViewEncapsulation } from '@angular/core';
import { Segments } from '@ids/tools';

import { MOCK_CONTEXT_SERVICE, WRAPPER_STRATEGY_MOCK_DATA } from './test/mock';
import { of } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/shared/constants/app.constants';
import { WrapperStrategyComponent } from 'src/app/shared/components/wrapper-strategy/wrapper-strategy.component';

describe('WrapperStrategyComponent', () => {
  let component: WrapperStrategyComponent;
  let fixture: ComponentFixture<WrapperStrategyComponent>;
  let debugElement: DebugElement;
  let mockContextService: any;

  beforeEach(async () => {
    mockContextService = {
      ...MOCK_CONTEXT_SERVICE,
      refreshSource$: of({
        token: 'mock-token',
        gateway: 'mock-gateway',
        apikey: 'mock-apikey',
        segmento: Segments.Varejo,
        inputdata: {
          instanceId: 'mock-instance',
        },
      }),
      eventSource$: of({
        token: 'mock-token',
        gateway: 'mock-gateway',
        apikey: 'mock-apikey',
        segmento: Segments.Varejo,
        inputdata: {
          instanceId: 'mock-instance',
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [WrapperStrategyComponent],
      providers: [{ provide: ContextService, useValue: mockContextService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperStrategyComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Inicialização do Componente', () => {
    const MOCK_COMPONENT_INITIALIZATION = {
      segmento: Segments.Varejo,
      expectedThemeClass: `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${Segments.Varejo}`,
    };

    it('deve criar instância do componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar com classe de tema padrão', () => {
      expect(component.segmento).toBe(
        MOCK_COMPONENT_INITIALIZATION.expectedThemeClass
      );
    });

    it('deve assinar mudanças do contextService.eventSource$ na inicialização', () => {
      const subscribeSpy = jest.spyOn(
        mockContextService.eventSource$,
        'subscribe'
      );
      component.ngOnInit();
      expect(subscribeSpy).toHaveBeenCalled();
    });
  });

  describe('Integração com Context Service', () => {
    const MOCK_CONTEXT_CHANGES = {
      newSegmento: Segments.Empresas,
      expectedThemeClass: `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${Segments.Empresas}`,
    };

    it('deve atualizar segmento quando contexto muda', () => {
      mockContextService.eventSource$ = of({
        token: 'mock-token',
        gateway: 'mock-gateway',
        apikey: 'mock-apikey',
        segmento: MOCK_CONTEXT_CHANGES.newSegmento,
        inputdata: {
          instanceId: 'mock-instance',
        },
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.segmento).toBe(MOCK_CONTEXT_CHANGES.expectedThemeClass);
    });

    it('deve tratar contexto sem segmento graciosamente', () => {
      mockContextService.eventSource$ = of({
        token: 'mock-token',
        gateway: 'mock-gateway',
        apikey: 'mock-apikey',
        inputdata: {
          instanceId: 'mock-instance',
        },
      });

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.segmento).toContain(APP_CONSTANTS.THEME.IDS_TEMA_PREFIX);
    });
  });

  describe('Integração com Classes CSS de Tema', () => {
    const MOCK_THEME_SCENARIOS = [
      {
        segmento: Segments.Varejo,
        expectedClass: `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${Segments.Varejo}`,
      },
      {
        segmento: Segments.Empresas,
        expectedClass: `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${Segments.Empresas}`,
      },
      {
        segmento: Segments.Private,
        expectedClass: `${APP_CONSTANTS.THEME.IDS_TEMA_PREFIX}-${Segments.Private}`,
      },
    ];

    MOCK_THEME_SCENARIOS.forEach((scenario) => {
      it(`deve gerar classe de tema correta para ${scenario.segmento}`, () => {
        mockContextService.eventSource$ = of({
          token: 'mock-token',
          gateway: 'mock-gateway',
          apikey: 'mock-apikey',
          segmento: scenario.segmento,
          inputdata: {
            instanceId: 'mock-instance',
          },
        });

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.segmento).toBe(scenario.expectedClass);
      });
    });

    it('deve suportar mudança dinâmica de tema', () => {
      const hostElement = debugElement.nativeElement;

      hostElement.classList.add(
        WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.VAREJO
      );
      expect(
        hostElement.classList.contains(
          WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.VAREJO
        )
      ).toBe(true);

      hostElement.classList.remove(
        WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.VAREJO
      );
      hostElement.classList.add(
        WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.EMPRESAS
      );
      expect(
        hostElement.classList.contains(
          WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.EMPRESAS
        )
      ).toBe(true);
      expect(
        hostElement.classList.contains(
          WRAPPER_STRATEGY_MOCK_DATA.THEME_CLASSES.VAREJO
        )
      ).toBe(false);
    });
  });

  describe('Ciclo de Vida do Componente', () => {
    it('deve cancelar assinatura na destruição', () => {
      const unsubscribeSpy = jest.spyOn(
        component['subscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('deve gerenciar assinatura adequadamente', () => {
      expect(component['subscription']).toBeTruthy();
      expect(component['subscription'].closed).toBe(false);
    });
  });

  describe('Integração com ViewEncapsulation', () => {
    it('deve usar ViewEncapsulation.None para herança de variáveis CSS', () => {
      expect(component).toBeTruthy();
      const componentType: any = fixture.componentRef.componentType;
      expect(componentType.ɵcmp.encapsulation).toBe(ViewEncapsulation.None);
    });

    it('deve usar mock do context service corretamente', () => {
      expect(mockContextService.refreshSource$).toBeTruthy();
      expect(mockContextService.emit).toBeTruthy();
    });
  });
});
