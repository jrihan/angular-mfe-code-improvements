import { HttpErrorResponse } from '@angular/common/http';

export const HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS = {
  CENARIO_ERRO_COM_DETAIL: {
    DESCRIPTION:
      'Quando o backend retorna payload padronizado com detail, Então deve exibir a mensagem do detail',
    DETAIL: 'Detalhe do erro de negócio',
    EXPECTED_MESSAGE: 'Detalhe do erro de negócio',
  },
  CENARIO_ERRO_COM_TITLE: {
    DESCRIPTION:
      'Quando o backend retorna payload padronizado sem detail mas com title, Então deve exibir a mensagem do title',
    TITLE: 'Título do erro',
    EXPECTED_MESSAGE: 'Título do erro',
  },
  CENARIO_ERRO_SEM_DETAIL_E_SEM_TITLE: {
    DESCRIPTION:
      'Quando o backend retorna payload sem detail e sem title, Então deve exibir a mensagem padrão',
    EXPECTED_MESSAGE: 'Ocorreu um erro inesperado.',
  },
  CENARIO_ERRO_COM_MESSAGE: {
    DESCRIPTION:
      'Quando não há payload mas existe message no erro, Então deve exibir a message',
    MESSAGE: 'Http failure response',
    EXPECTED_MESSAGE: 'Http failure response',
  },
  CENARIO_ERRO_SEM_INFORMACOES: {
    DESCRIPTION:
      'Quando não há payload nem message, Então deve exibir a mensagem padrão',
    EXPECTED_MESSAGE: 'Ocorreu um erro inesperado.',
  },
  CONSTANTES: {
    DEFAULT_MESSAGE: 'Ocorreu um erro inesperado.',
    VARIANT: 'error',
    DURATION: 30000,
    URL: '/api/teste',
  },
};

export const buildHttpErrorResponse = (error: any): HttpErrorResponse =>
  new HttpErrorResponse({
    error,
    status: 500,
    statusText: 'Server Error',
    url: HTTP_ERROR_INTERCEPTOR_MOCK_SCENARIOS.CONSTANTES.URL,
  });
