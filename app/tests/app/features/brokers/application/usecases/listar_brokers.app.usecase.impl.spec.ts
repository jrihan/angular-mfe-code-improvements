import { ListarBrokersUseCaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/listar_brokers.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { PaginationParams } from '../../../../../../src/app/shared/interfaces/pagination-params.interface';
import { ListarBrokersResponseEntityFactory } from '../../domain/factories/response/listar_broker_response.factory';

describe('ListarBrokersUseCaseImpl', () => {
  let usecase: ListarBrokersUseCaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const mockParams: PaginationParams = {
    page: 0,
    size: 10,
  };

  const mockResponse = ListarBrokersResponseEntityFactory.create({
    page: {
      size: 10,
      number: 0,
      totalElements: 1,
      totalPages: 1,
    },
  });

  beforeEach(() => {
    repositoryMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
    } as any;

    usecase = new ListarBrokersUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.listarBrokers com os parâmetros informados e retornar a listagem', async () => {
    repositoryMock.listarBrokers.mockResolvedValue(mockResponse);

    const result = await usecase.execute(mockParams);

    expect(repositoryMock.listarBrokers).toHaveBeenCalledWith(mockParams);
    expect(result).toEqual(mockResponse);
  });
});
