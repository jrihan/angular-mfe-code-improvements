import { of, throwError } from 'rxjs';
import { ResseguradoresDatasourceImpl } from '../../../../../../src/app/features/resseguradores/data/datasources/resseguradores.datasource.impl';
import { environment } from '../../../../../../src/environments/environment';

describe('ResseguradoresDatasourceImpl', () => {
  let datasource: ResseguradoresDatasourceImpl;
  let httpClientMock: any;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    };
    datasource = new ResseguradoresDatasourceImpl(httpClientMock);
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
  });

  describe('buscarRessegurador', () => {
    it('deve buscar um ressegurador com sucesso', async () => {
      const mockResponse = { codigo_ressegurador: '123' };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarRessegurador('123');

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/resseguradores/123`
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null quando a resposta for vazia', async () => {
      httpClientMock.get.mockReturnValue(of(null));

      const result = await datasource.buscarRessegurador('123');

      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarRessegurador('123');

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.buscarRessegurador('123')).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('listarResseguradores', () => {
    it('deve listar resseguradores com sucesso', async () => {
      const mockResponse = { content: [] };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.listarResseguradores();

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`,
        { params: undefined }
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null quando a resposta for vazia', async () => {
      httpClientMock.get.mockReturnValue(of(null));

      const result = await datasource.listarResseguradores();

      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.listarResseguradores();

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.listarResseguradores()).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('buscarDadosCadastrais', () => {
    it('deve buscar dados cadastrais limpando o documento e usando os parâmetros informados', async () => {
      const mockResponse = { id_cliente: 'CLI-1' };
      httpClientMock.get.mockReturnValue(of(mockResponse));

      const result = await datasource.buscarDadosCadastrais({
        documentNumber: '12.345.678/0001-90',
        documentType: 'CNPJ',
        countryCode: 'BR',
      });

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/12345678000190`,
        { params: { tipoDocumento: 'CNPJ', paisEmissorDocumento: 'BR' } }
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve usar valores padrão quando documento/tipo/país estiverem ausentes', async () => {
      httpClientMock.get.mockReturnValue(of(null));

      const result = await datasource.buscarDadosCadastrais({
        documentNumber: '',
        documentType: '',
      } as any);

      expect(httpClientMock.get).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/`,
        { params: { tipoDocumento: 'CNPJ', paisEmissorDocumento: 'BR' } }
      );
      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.get.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.buscarDadosCadastrais({
        documentNumber: '123',
        documentType: 'CNPJ',
      } as any);

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      await expect(
        datasource.buscarDadosCadastrais({
          documentNumber: '123',
          documentType: 'CNPJ',
        } as any)
      ).rejects.toEqual(errorResponse);
    });
  });

  describe('cadastrarRessegurador', () => {
    const payload = { codigo_susep: 12345 } as any;

    it('deve cadastrar um ressegurador com sucesso', async () => {
      const mockResponse = { codigo_ressegurador: 1 };
      httpClientMock.post.mockReturnValue(of(mockResponse));

      const result = await datasource.cadastrarRessegurador(payload);

      expect(httpClientMock.post).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`,
        payload
      );
      expect(result).toEqual(mockResponse);
    });

    it('deve retornar null quando a resposta for vazia', async () => {
      httpClientMock.post.mockReturnValue(of(null));

      const result = await datasource.cadastrarRessegurador(payload);

      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.post.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.cadastrarRessegurador(payload);

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.post.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.cadastrarRessegurador(payload)).rejects.toEqual(
        errorResponse
      );
    });
  });

  describe('atualizarRessegurador', () => {
    const payload = { codigo_susep: 12345 } as any;

    it('deve atualizar um ressegurador com sucesso', async () => {
      httpClientMock.put.mockReturnValue(of(null));

      const result = await datasource.atualizarRessegurador(payload);

      expect(httpClientMock.put).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`,
        payload
      );
      expect(result).toBeNull();
    });

    it('deve retornar null se der erro 404', async () => {
      httpClientMock.put.mockReturnValue(throwError(() => ({ status: 404 })));

      const result = await datasource.atualizarRessegurador(payload);

      expect(result).toBeNull();
    });

    it('deve relançar outros erros', async () => {
      const errorResponse = { status: 500, message: 'Internal Error' };
      httpClientMock.put.mockReturnValue(throwError(() => errorResponse));

      await expect(datasource.atualizarRessegurador(payload)).rejects.toEqual(
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
});
