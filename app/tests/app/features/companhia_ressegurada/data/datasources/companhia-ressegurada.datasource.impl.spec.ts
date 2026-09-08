import { CompanhiaResseguradaDatasourceImpl } from '../../../../../../src/app/features/companhia_ressegurada/data/datasources/companhia-ressegurada.datasource.impl';
import { ContextService } from '../../../../../../src/app/shared/services/context.service';
import { environment } from '../../../../../../src/environments/environment';
import { of, throwError } from 'rxjs';

describe('CompanhiaResseguradaDatasourceImpl', () => {
  let datasource: CompanhiaResseguradaDatasourceImpl;
  let contextServiceMock: jest.Mocked<ContextService>;
  let httpClientMock: any;

  beforeEach(() => {
    contextServiceMock = {
      getBearerToken: jest.fn().mockReturnValue('mocked-token'),
    } as any;

    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };

    datasource = new CompanhiaResseguradaDatasourceImpl(
      contextServiceMock,
      httpClientMock
    );
  });

  it('deve ser instanciado', () => {
    expect(datasource).toBeTruthy();
  });

  describe('buscarDadosCadastrais', () => {
    it('deve buscar dados cadastrais limpando caracteres especiais do documento e enviando query params padrão', async () => {
      const mockResponse = {
        id: 1,
        dados_cadastrais: { nome: 'Empresa Teste' },
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarDadosCadastrais(
        '12.345.678/0001-99'
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/12345678000199`,
        expect.objectContaining({
          params: {
            tipoDocumento: 'CNPJ',
            paisEmissorDocumento: 'BR',
          },
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('deve preservar letras ao limpar um documento alfanumérico', async () => {
      const mockResponse = {
        id: 1,
        dados_cadastrais: { nome: 'Empresa Alfanumérica' },
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarDadosCadastrais(
        '12.ABC/345-6',
        'CNPJ',
        'BR'
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/12ABC3456`,
        expect.objectContaining({
          params: {
            tipoDocumento: 'CNPJ',
            paisEmissorDocumento: 'BR',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve buscar dados cadastrais utilizando query params customizados fornecidos por parâmetro', async () => {
      const mockResponse = {
        id: 1,
        dados_cadastrais: { nome: 'Empresa Customizada' },
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarDadosCadastrais(
        '12345678000199',
        'CPF',
        'US'
      );

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/12345678000199`,
        expect.objectContaining({
          params: {
            tipoDocumento: 'CPF',
            paisEmissorDocumento: 'US',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se resposta for vazia', async () => {
      httpClientMock.get.mockReturnValue(of({}));

      const result = await datasource.buscarDadosCadastrais('123', '', '');

      expect(result).toBeNull();
    });

    it('deve retornar null se resposta contiver mensagens', async () => {
      httpClientMock.get.mockReturnValue(of({ mensagens: ['Erro genérico'] }));

      const result = await datasource.buscarDadosCadastrais('123', '', '');

      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarDadosCadastrais('123', '', '');

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Server Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(
        datasource.buscarDadosCadastrais('123', '', '')
      ).rejects.toEqual(errorResponse);
    });
  });

  describe('enviarCadastro', () => {
    it('deve enviar o cadastro via POST para o endpoint correspondente', async () => {
      const payload: any = {
        numero_documento: '12345678000199',
        companhia_ressegurada: {
          codigo_companhia_ressegurada: 10,
          codigo_centro_custo: 50,
        },
      };

      const mockResponse = { status: 'sucesso' };
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const result = await datasource.enviarCadastro(payload);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/companhias-resseguradas`,
        payload
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listarCompanhias', () => {
    it('deve listar companhias via GET no endpoint correspondente', async () => {
      const mockResponse = {
        content: [{ codigo_companhia_ressegurada: 10 }],
        page: { size: 1, number: 0, totalElements: 1, totalPages: 1 },
      };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.listarCompanhias();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/companhias-resseguradas`
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar lista vazia se o endpoint responder 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.listarCompanhias();

      expect(result).toEqual({
        content: [],
        page: { size: 0, number: 0, totalElements: 0, totalPages: 0 },
      });
    });
  });

  describe('buscarBancos', () => {
    it('deve buscar bancos chamando endpoint correspondente', async () => {
      const mockBancos = { data: [{ codigo: '341', nome: 'Itaú' }] };
      httpClientMock.get.mockReturnValue(of(mockBancos));

      const result = await datasource.buscarBancos();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/instituicoes-financeiras`
      );
      expect(result).toEqual(mockBancos);
    });
  });
});
