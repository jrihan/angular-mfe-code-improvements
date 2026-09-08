import { TestBed } from '@angular/core/testing';
import {
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError, lastValueFrom } from 'rxjs';

import { HttpErrorInterceptor } from 'src/app/core/overrides/http-error.interceptor';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import {
  HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS,
  buildHttpErrorResponse,
} from './test/mock';

declare const expect: jest.Expect;

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let snackbarService: { showSnackbar: jest.Mock };
  let mockRequest: HttpRequest<any>;

  const { CONSTANTES } = HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS;

  beforeEach(() => {
    snackbarService = { showSnackbar: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        { provide: SnackbarService, useValue: snackbarService },
      ],
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
    mockRequest = new HttpRequest('GET', CONSTANTES.URL);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const buildNextHandler = (error?: HttpErrorResponse): HttpHandler => ({
    handle: jest.fn(() => (error ? throwError(() => error) : of({} as any))),
  });

  it('deve ser criado', () => {
    expect(interceptor).toBeTruthy();
  });

  it('Quando a requisição é bem-sucedida, Então deve repassar o evento sem exibir snackbar', async () => {
    const next = buildNextHandler();

    const result = await lastValueFrom(
      interceptor.intercept(mockRequest, next)
    );

    expect(result).toEqual({});
    expect(next.handle).toHaveBeenCalledWith(mockRequest);
    expect(snackbarService.showSnackbar).not.toHaveBeenCalled();
  });

  it(
    HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_DETAIL.DESCRIPTION,
    async () => {
      const cenario =
        HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_DETAIL;
      const error = buildHttpErrorResponse({
        detail: cenario.DETAIL,
        title: 'Outro título',
      });
      const next = buildNextHandler(error);

      await expect(
        lastValueFrom(interceptor.intercept(mockRequest, next))
      ).rejects.toBe(error);

      expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
        cenario.EXPECTED_MESSAGE,
        CONSTANTES.VARIANT,
        CONSTANTES.DURATION
      );
    }
  );

  it(
    HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_TITLE.DESCRIPTION,
    async () => {
      const cenario =
        HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_TITLE;
      const error = buildHttpErrorResponse({ title: cenario.TITLE });
      const next = buildNextHandler(error);

      await expect(
        lastValueFrom(interceptor.intercept(mockRequest, next))
      ).rejects.toBe(error);

      expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
        cenario.EXPECTED_MESSAGE,
        CONSTANTES.VARIANT,
        CONSTANTES.DURATION
      );
    }
  );

  it(
    HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_SEM_DETAIL_E_SEM_TITLE
      .DESCRIPTION,
    async () => {
      const cenario =
        HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_SEM_DETAIL_E_SEM_TITLE;
      const error = buildHttpErrorResponse({ status: 500 });
      const next = buildNextHandler(error);

      await expect(
        lastValueFrom(interceptor.intercept(mockRequest, next))
      ).rejects.toBe(error);

      expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
        cenario.EXPECTED_MESSAGE,
        CONSTANTES.VARIANT,
        CONSTANTES.DURATION
      );
    }
  );

  it(
    HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_MESSAGE.DESCRIPTION,
    async () => {
      // const cenario = HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_COM_MESSAGE;
      // error.error nulo força o fluxo a usar error.message
      const error = new HttpErrorResponse({
        error: null,
        status: 0,
        statusText: 'Unknown Error',
      });
      const next = buildNextHandler(error);

      await expect(
        lastValueFrom(interceptor.intercept(mockRequest, next))
      ).rejects.toBe(error);

      expect(snackbarService.showSnackbar).toHaveBeenCalledTimes(1);
      const [mensagem, variante, duracao] =
        snackbarService.showSnackbar.mock.calls[0];
      expect(typeof mensagem).toBe('string');
      expect(mensagem.length).toBeGreaterThan(0);
      expect(variante).toBe(CONSTANTES.VARIANT);
      expect(duracao).toBe(CONSTANTES.DURATION);
    }
  );

  it(
    HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_SEM_INFORMACOES
      .DESCRIPTION,
    async () => {
      const cenario =
        HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CENARIO_ERRO_SEM_INFORMACOES;
      // Sem error e sem message -> mensagem padrão
      const error = {
        error: null,
        message: '',
      } as unknown as HttpErrorResponse;
      const next = buildNextHandler(error);

      await expect(
        lastValueFrom(interceptor.intercept(mockRequest, next))
      ).rejects.toBe(error);

      expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
        cenario.EXPECTED_MESSAGE,
        CONSTANTES.VARIANT,
        CONSTANTES.DURATION
      );
    }
  );
});
