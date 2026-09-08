import { BuscarInstituicoesFinanceirasAppUsecaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/buscar_instituicoes_financeiras.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

describe('BuscarInstituicoesFinanceirasAppUsecaseImpl', () => {
  let usecase: BuscarInstituicoesFinanceirasAppUsecaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const mockResponse = new BuscarInstituicoesFinanceirasResponseEntity({
    data: [{ codigo: '341', nome: 'Banco Itaú' }],
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
