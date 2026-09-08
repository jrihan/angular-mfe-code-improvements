import { BuscarResseguradorUseCaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/buscar_ressegurador.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { ResseguradorFactory } from '../../../../shared/factories/ressegurador.factory';

describe('BuscarResseguradorUseCaseImpl', () => {
  let usecase: BuscarResseguradorUseCaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const mockEntity = ResseguradorFactory.create({ idCliente: 'CLI-123' });

  beforeEach(() => {
    repositoryMock = {
      buscarRessegurador: jest.fn(),
      listarResseguradores: jest.fn(),
    } as any;

    usecase = new BuscarResseguradorUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.buscarRessegurador e retornar o resultado esperado', async () => {
    repositoryMock.buscarRessegurador.mockResolvedValue(mockEntity);

    const result = await usecase.execute('CLI-123');

    expect(repositoryMock.buscarRessegurador).toHaveBeenCalledWith('CLI-123');
    expect(result).toEqual(mockEntity);
  });
});
