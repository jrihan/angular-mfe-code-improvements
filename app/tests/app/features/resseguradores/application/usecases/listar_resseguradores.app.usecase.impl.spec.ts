import { ListarResseguradoresUseCaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/listar_resseguradores.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { ListarResseguradoresResponseEntity } from '../../../../../../src/app/features/resseguradores/domain/entities/response/listar_resseguradores_response.entity';
import { ResseguradorFactory } from '../../../../shared/factories/ressegurador.factory';

describe('ListarResseguradoresUseCaseImpl', () => {
  let usecase: ListarResseguradoresUseCaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const mockResponse: ListarResseguradoresResponseEntity = {
    content: [ResseguradorFactory.create()],
    page: {
      size: 10,
      number: 0,
      totalElements: 1,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    repositoryMock = {
      buscarRessegurador: jest.fn(),
      listarResseguradores: jest.fn(),
    } as any;

    usecase = new ListarResseguradoresUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.listarResseguradores e retornar o resultado de listagem', async () => {
    repositoryMock.listarResseguradores.mockResolvedValue(mockResponse);

    const result = await usecase.execute();

    expect(repositoryMock.listarResseguradores).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
