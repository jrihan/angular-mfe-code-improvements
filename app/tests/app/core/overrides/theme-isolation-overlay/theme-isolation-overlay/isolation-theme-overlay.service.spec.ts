import { TestBed } from '@angular/core/testing';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ContextService } from '@quickweb/mfe-context';
import { BehaviorSubject } from 'rxjs';

import {
  CENARIO_INICIALIZACAO_SERVICO_SUCESSO,
  CENARIO_CRIACAO_CONTAINER_SUCESSO,
  CENARIO_APLICACAO_CLASSES_TEMA_SUCESSO,
  CENARIO_ATUALIZACAO_TEMA_EMPRESAS,
  CENARIO_ATUALIZACAO_TEMA_VAREJO,
  CENARIO_OBTENCAO_CONTAINER_AUTO_INICIALIZACAO,
  CENARIO_DESTRUICAO_SERVICO_SUCESSO,
  CENARIO_CONTEXTO_SEM_SEGMENTO,
  CENARIO_CONTEXTO_COM_SEGMENTO_EMPRESAS,
  CENARIO_CONTEXTO_COM_SEGMENTO_VAREJO,
} from './test/mock';
import { APP_CONSTANTS } from 'src/app/shared/constants/app.constants';
import { IsolationThemeOverlay } from 'src/app/core/overrides/theme-isolation-overlay/theme-isolation-overlay/isolation-theme-overlay.service';
import { CustomLogService } from 'src/app/shared/services/log/log.service';

describe('IsolationThemeOverlay', () => {
  let service: IsolationThemeOverlay;
  let mockContextService: any;
  let mockEventSource$: BehaviorSubject<any>;
  let mockDocument: any;
  let mockPlatform: any;
  let mockLogService: any;

  beforeEach(() => {
    mockEventSource$ = new BehaviorSubject(null);

    const createMockElement = () => ({
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn().mockReturnValue(false),
        forEach: jest.fn(),
      },
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([]),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      hasAttribute: jest.fn().mockReturnValue(false),
      style: {},
      id: 'mock-overlay-container',
      tagName: 'DIV',
      nodeType: 1,
      parentNode: null,
      childNodes: [],
      firstChild: null,
      lastChild: null,
      nextSibling: null,
      previousSibling: null,
      ownerDocument: null,
    });

    mockDocument = {
      createElement: jest.fn(() => createMockElement()),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn().mockReturnValue([]),
      },
      querySelectorAll: jest.fn().mockReturnValue([]),
      querySelector: jest.fn(),
      documentElement: createMockElement(),
      head: createMockElement(),
    };

    mockPlatform = { isBrowser: true };

    mockContextService = {
      eventSource$: mockEventSource$,
    };

    mockLogService = {
      info: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        IsolationThemeOverlay,
        { provide: ContextService, useValue: mockContextService },
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: Platform, useValue: mockPlatform },
        { provide: CustomLogService, useValue: mockLogService },
      ],
    });

    service = TestBed.inject(IsolationThemeOverlay);
  });

  describe('Inicialização do Serviço', () => {
    it(CENARIO_INICIALIZACAO_SERVICO_SUCESSO.DESCRIPTION, () => {
      expect(service).toBeTruthy();
      expect(service.getInstanceId()).toContain('theme-isolation-overlay');
      expect(mockLogService.info).toHaveBeenCalled();
    });
  });

  describe('Gerenciamento de Container', () => {
    it(CENARIO_CRIACAO_CONTAINER_SUCESSO.DESCRIPTION, () => {
      // Força a criação do container chamando método protegido
      service['_createContainer']();
      expect(mockDocument.createElement).toHaveBeenCalledWith('div');
      expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });

    it(CENARIO_OBTENCAO_CONTAINER_AUTO_INICIALIZACAO.DESCRIPTION, () => {
      service['_createContainer']();
      const container = service.getContainerElement();
      expect(container).toBeTruthy();
      expect(service.getInstanceId()).toContain('theme-isolation-overlay');
    });
  });

  describe('Gerenciamento de Temas', () => {
    it(CENARIO_APLICACAO_CLASSES_TEMA_SUCESSO.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(true),
          forEach: jest.fn(),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      // Força aplicação das classes
      service['applyThemeClasses']();

      expect(mockContainer.classList.add).toHaveBeenCalledWith(
        APP_CONSTANTS.THEME.COMPONENT_NAME
      );
      expect(mockContainer.classList.add).toHaveBeenCalledWith(
        'ids-theme-varejo'
      );
    });

    it(CENARIO_ATUALIZACAO_TEMA_EMPRESAS.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(false),
          forEach: jest.fn((callback) => {
            callback('ids-theme-varejo');
          }),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      service['updateThemeClasses']('empresas');

      expect(mockContainer.classList.remove).toHaveBeenCalledWith(
        'ids-theme-varejo'
      );
      expect(mockContainer.classList.add).toHaveBeenCalledWith(
        'ids-theme-empresas'
      );
    });

    it(CENARIO_ATUALIZACAO_TEMA_VAREJO.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(false),
          forEach: jest.fn((callback) => {
            callback('ids-theme-empresas');
          }),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      service['updateThemeClasses']('varejo');

      expect(mockContainer.classList.remove).toHaveBeenCalledWith(
        'ids-theme-empresas'
      );
      expect(mockContainer.classList.add).toHaveBeenCalledWith(
        'ids-theme-varejo'
      );
    });
  });

  describe('Integração com Context Service', () => {
    it(CENARIO_CONTEXTO_SEM_SEGMENTO.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(true),
          forEach: jest.fn(),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      // Força a subscrição
      service['_createContainer']();
      mockEventSource$.next(CENARIO_CONTEXTO_SEM_SEGMENTO.REQUEST);

      expect(mockContainer.classList.add).toHaveBeenCalledWith(
        APP_CONSTANTS.THEME.COMPONENT_NAME
      );
    });

    it(CENARIO_CONTEXTO_COM_SEGMENTO_EMPRESAS.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(true),
          forEach: jest.fn(),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      service['_createContainer']();
      mockEventSource$.next(CENARIO_CONTEXTO_COM_SEGMENTO_EMPRESAS.REQUEST);

      expect(mockLogService.debug).toHaveBeenCalledWith(
        expect.stringContaining('Tema atualizado para: empresas'),
        expect.objectContaining({
          segmento: 'empresas',
          instanceId: expect.any(String),
        })
      );
    });

    it(CENARIO_CONTEXTO_COM_SEGMENTO_VAREJO.DESCRIPTION, () => {
      const mockContainer = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
          contains: jest.fn().mockReturnValue(true),
          forEach: jest.fn(),
        },
      } as any;
      jest.spyOn(service, 'getContainerElement').mockReturnValue(mockContainer);

      service['_createContainer']();
      mockEventSource$.next(CENARIO_CONTEXTO_COM_SEGMENTO_VAREJO.REQUEST);

      expect(mockLogService.debug).toHaveBeenCalledWith(
        expect.stringContaining('Tema atualizado para: varejo'),
        expect.objectContaining({
          segmento: 'varejo',
          instanceId: expect.any(String),
        })
      );
    });
  });

  describe('Destruição do Serviço', () => {
    it(CENARIO_DESTRUICAO_SERVICO_SUCESSO.DESCRIPTION, () => {
      service.ngOnDestroy();
      expect(mockLogService.info).toHaveBeenCalledWith(
        expect.stringContaining('ThemeIsolationOverlayService destruído'),
        expect.objectContaining({ instanceId: service.getInstanceId() })
      );
    });
  });
});
