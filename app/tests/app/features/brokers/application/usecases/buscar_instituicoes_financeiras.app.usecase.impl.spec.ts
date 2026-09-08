import { BuscarInstituicoesFinanceirasAppUsecaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/buscar_instituicoes_financeiras.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

describe('BuscarInstituicoesFinanceirasAppUsecaseImpl', () => {
  let usecase: BuscarInstituicoesFinanceirasAppUsecaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const mockResponse = new BuscarInstituicoesFinanceirasResponseEntity({
    data: [{ codigo: '341', nome: 'Banco Itaú' }],
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

    usecase = new BuscarInstituicoesFinanceirasAppUsecaseImpl(repositoryMock);
  });

  it('deve chamar o repository.buscarInstituicoesFinanceiras e retornar o resultado', async () => {
    repositoryMock.buscarInstituicoesFinanceiras.mockResolvedValue(
      mockResponse
    );

    const result = await usecase.execute();

    expect(repositoryMock.buscarInstituicoesFinanceiras).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
