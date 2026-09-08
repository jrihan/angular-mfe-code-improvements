import { CadastrarBrokerUseCaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/cadastrar_broker.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { CriarBrokerRequestFactory } from '../../domain/factories/request/criar_broker_request.factory';
import { CriarBrokerResponseEntityFactory } from '../../domain/factories/response/criar_broker_response.factory';

describe('CadastrarBrokerUseCaseImpl', () => {
  let usecase: CadastrarBrokerUseCaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const mockPayload = CriarBrokerRequestFactory.create({
    numeroDocumento: '12345678000199',
  });
  const mockResponse = CriarBrokerResponseEntityFactory.create({
    codigoBroker: 1234,
  });

  beforeEach(() => {
    repositoryMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
    } as any;

    usecase = new CadastrarBrokerUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.cadastrarBroker com o payload e retornar o resultado esperado', async () => {
    repositoryMock.cadastrarBroker.mockResolvedValue(mockResponse);

    const result = await usecase.execute(mockPayload);

    expect(repositoryMock.cadastrarBroker).toHaveBeenCalledWith(mockPayload);
    expect(result).toEqual(mockResponse);
  });
});
