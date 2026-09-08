import { of, throwError } from 'rxjs';
import { BrokersDatasourceImpl } from '../../../../../../src/app/features/brokers/data/datasources/brokers.datasource.impl';
import { environment } from '../../../../../../src/environments/environment';

describe('BrokersDatasourceImpl', () => {
  let datasource: BrokersDatasourceImpl;
  let httpClientMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    };
    datasource = new BrokersDatasourceImpl(httpClientMock);
  });

  it('deve ser instanciado', () => {
    expect(datasource).toBeTruthy();
  });

  describe('buscarDadosCadastrais', () => {
    it('deve remover apenas caracteres especiais e preservar letras do documento', async () => {
      const mockResponse = { id: 1 };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarDadosCadastrais({
        documentNumber: '12.ABC/345-6',
        documentType: 'CNPJ',
        countryCode: 'BR',
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/12ABC3456`,
        {
          params: {
            tipoDocumento: 'CNPJ',
            paisEmissorDocumento: 'BR',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarDadosCadastrais({
        documentNumber: '123',
        documentType: 'CNPJ',
        countryCode: 'BR',
      });

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(
        datasource.buscarDadosCadastrais({
          documentNumber: '123',
          documentType: 'CNPJ',
          countryCode: 'BR',
        })
      ).rejects.toEqual(errorResponse);
    });
  });

  describe('atualizarBroker', () => {
    const payload: any = { codigo_susep: 12345 };

    it('deve atualizar broker com sucesso', async () => {
      httpClientMock.put.mockReturnValue(of(null));

      const result = await datasource.atualizarBroker(payload);

      expect(httpClientMock.put).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/brokers`,
        payload
      );
      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.put.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.atualizarBroker(payload);

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.put.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.atualizarBroker(payload)).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('buscarInstituicoesFinanceiras', () => {
    it('deve buscar instituições financeiras com sucesso', async () => {
      const mockResponse = { data: [{ codigo: '341', nome: 'Banco Itaú' }] };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarInstituicoesFinanceiras();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/instituicoes-financeiras`
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarInstituicoesFinanceiras();

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.buscarInstituicoesFinanceiras()).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('buscarBroker', () => {
    it('deve buscar um broker com sucesso', async () => {
      const mockResponse = { id_dbresseguro: '123' };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarBroker('123');

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/brokers/123`
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarBroker('123');

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.buscarBroker('123')).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('listarBrokers', () => {
    it('deve listar brokers com sucesso', async () => {
      const mockResponse = { content: [] };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.listarBrokers();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/brokers`,
        { params: undefined }
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.listarBrokers();

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.listarBrokers()).rejects.toEqual(errorResponse);
    });
  });

  describe('cadastrarBroker', () => {
    it('deve cadastrar broker com sucesso', async () => {
      const payload: any = { codigo_susep: 12345 };
      const mockResponse = { codigo_broker: 1 };
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const result = await datasource.cadastrarBroker(payload);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/brokers`,
        payload
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null se der erro 404', async () => {
      const payload: any = { codigo_susep: 12345 };
      httpClientMock.post.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.cadastrarBroker(payload);

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const payload: any = { codigo_susep: 12345 };
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.cadastrarBroker(payload)).rejects.toEqual(
        errorResponse
      );
    });
  });
});
