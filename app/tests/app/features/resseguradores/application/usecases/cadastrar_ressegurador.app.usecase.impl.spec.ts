import { CadastrarResseguradorUseCaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/cadastrar_ressegurador.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { CriarResseguradorRequestEntityFactory } from '../../../../shared/factories/criar_ressegurador_request_entity.factory';
import { CriarResseguradorResponseEntityFactory } from '../../../../shared/factories/criar_ressegurador_response_entity.factory';

describe('CadastrarResseguradorUseCaseImpl', () => {
  let usecase: CadastrarResseguradorUseCaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const payload = CriarResseguradorRequestEntityFactory.create();
  const mockResponse = CriarResseguradorResponseEntityFactory.create({
    codigoRessegurador: 1234,
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

    usecase = new CadastrarResseguradorUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.cadastrarRessegurador com o payload recebido e retornar o resultado', async () => {
    repositoryMock.cadastrarRessegurador.mockResolvedValue(mockResponse);

    const result = await usecase.execute(payload);

    expect(repositoryMock.cadastrarRessegurador).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockResponse);
  });
});
