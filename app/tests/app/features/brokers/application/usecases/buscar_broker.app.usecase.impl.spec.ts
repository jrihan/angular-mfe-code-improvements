import { BuscarBrokerUseCaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/buscar_broker.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { BuscarBrokerResponseEntityFactory } from '../../domain/factories/response/buscar_broker_response.factory';

describe('BuscarBrokerUseCaseImpl', () => {
  let usecase: BuscarBrokerUseCaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const mockEntity = BuscarBrokerResponseEntityFactory.create({
    idCliente: 'CLI-123',
  });

  beforeEach(() => {
    repositoryMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
    } as any;

    usecase = new BuscarBrokerUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.buscarBroker e retornar o resultado esperado', async () => {
    repositoryMock.buscarBroker.mockResolvedValue(mockEntity);

    const result = await usecase.execute('CLI-123');

    expect(repositoryMock.buscarBroker).toHaveBeenCalledWith('CLI-123');
    expect(result).toEqual(mockEntity);
  });
});
