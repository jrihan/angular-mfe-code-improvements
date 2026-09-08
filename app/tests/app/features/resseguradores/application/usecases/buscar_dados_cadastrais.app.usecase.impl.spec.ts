import { BuscarDadosCadastraisUseCaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/buscar_dados_cadastrais.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { BuscarDadosCadastraisRequestInterface } from '../../../../../../src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntityFactory } from '../../../../shared/factories/response/buscar_dados_cadastrais_response_entity.factory';

describe('BuscarDadosCadastraisUseCaseImpl', () => {
  let usecase: BuscarDadosCadastraisUseCaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const params: BuscarDadosCadastraisRequestInterface = {
    documentNumber: '12345678000199',
    documentType: 'CNPJ',
    countryCode: 'BR',
  };

  const mockResponse = BuscarDadosCadastraisResponseEntityFactory.create({
    idCliente: 'CLI-123',
  });

  beforeEach(() => {
    repositoryMock = {
      buscarRessegurador: jest.fn(),
      listarResseguradores: jest.fn(),
      cadastrarRessegurador: jest.fn(),
      atualizarRessegurador: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
    } as any;

    usecase = new BuscarDadosCadastraisUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.buscarDadosCadastrais com os parâmetros recebidos e retornar o resultado', async () => {
    repositoryMock.buscarDadosCadastrais.mockResolvedValue(mockResponse);

    const result = await usecase.execute(params);

    expect(repositoryMock.buscarDadosCadastrais).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockResponse);
  });
});
