import { BuscarDadosCadastraisUseCaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/buscar_dados_cadastrais.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { BuscarDadosCadastraisRequestInterface } from '../../../../../../src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntityFactory } from '../../../../shared/factories/response/buscar_dados_cadastrais_response_entity.factory';

describe('BuscarDadosCadastraisUseCaseImpl', () => {
  let usecase: BuscarDadosCadastraisUseCaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const mockParams: BuscarDadosCadastraisRequestInterface = {
    documentNumber: '12345678000199',
    documentType: 'CNPJ',
    countryCode: 'BR',
  };

  const mockResponse = BuscarDadosCadastraisResponseEntityFactory.create({
    idCliente: 'CLI-987',
  });

  beforeEach(() => {
    repositoryMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
      atualizarBroker: jest.fn(),
    } as any;

    usecase = new BuscarDadosCadastraisUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.buscarDadosCadastrais com os parâmetros recebidos e retornar o resultado', async () => {
    repositoryMock.buscarDadosCadastrais.mockResolvedValue(mockResponse);

    const result = await usecase.execute(mockParams);

    expect(repositoryMock.buscarDadosCadastrais).toHaveBeenCalledWith(
      mockParams
    );
    expect(result).toEqual(mockResponse);
  });
});
