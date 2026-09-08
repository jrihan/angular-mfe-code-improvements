import { BuscarCompanhiaPorCnpjUseCaseImpl } from '../../../../../../src/app/features/companhia_ressegurada/application/usecases/buscar-dados-cadastrais.app.usecase.impl';
import { ListagemInstituicoesFinanceirasUseCaseImpl } from '../../../../../../src/app/features/companhia_ressegurada/application/usecases/buscar-bancos.app.usecase.impl';
import { EnviarCadastroCompanhiaUseCaseImpl } from '../../../../../../src/app/features/companhia_ressegurada/application/usecases/enviar-cadastro-companhia.app.usecase.impl';
import { ListarCompanhiasResseguradasUseCaseImpl } from '../../../../../../src/app/features/companhia_ressegurada/application/usecases/listar-companhias-resseguradas.app.usecase.impl';
import { CompanhiaResseguradaRepository } from '../../../../../../src/app/features/companhia_ressegurada/domain/repositories/companhia-ressegurada.repository';

describe('CompanhiaRessegurada Application UseCases', () => {
  let repositoryMock: jest.Mocked<CompanhiaResseguradaRepository>;

  beforeEach(() => {
    repositoryMock = {
      buscarDadosCadastrais: jest.fn(),
      enviarCadastro: jest.fn(),
      listarCompanhias: jest.fn(),
      buscarBancos: jest.fn(),
    } as any;
  });

  describe('BuscarCompanhiaPorCnpjUseCaseImpl', () => {
    let usecase: BuscarCompanhiaPorCnpjUseCaseImpl;

    beforeEach(() => {
      usecase = new BuscarCompanhiaPorCnpjUseCaseImpl(repositoryMock);
    });

    it('deve chamar repository.buscarDadosCadastrais com CNPJ e retornar o resultado', async () => {
      const mockResult: any = { id: 1, nome: 'Companhia S/A' };
      repositoryMock.buscarDadosCadastrais.mockResolvedValue(mockResult);

      const result = await usecase.execute('12345678000199');

      expect(repositoryMock.buscarDadosCadastrais).toHaveBeenCalledWith(
        '12345678000199'
      );
      expect(result).toBe(mockResult);
    });
  });

  describe('ListagemInstituicoesFinanceirasUseCaseImpl', () => {
    let usecase: ListagemInstituicoesFinanceirasUseCaseImpl;

    beforeEach(() => {
      usecase = new ListagemInstituicoesFinanceirasUseCaseImpl(repositoryMock);
    });

    it('deve chamar repository.buscarBancos e retornar o resultado', async () => {
      const mockResult: any = { data: [{ codigo: '001', nome: 'BB' }] };
      repositoryMock.buscarBancos.mockResolvedValue(mockResult);

      const result = await usecase.execute();

      expect(repositoryMock.buscarBancos).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('EnviarCadastroCompanhiaUseCaseImpl', () => {
    let usecase: EnviarCadastroCompanhiaUseCaseImpl;

    beforeEach(() => {
      usecase = new EnviarCadastroCompanhiaUseCaseImpl(repositoryMock);
    });

    it('deve chamar repository.enviarCadastro com payload e retornar o resultado', async () => {
      const mockPayload: any = { numero_documento: '123' };
      const mockResult: any = { status: 'ok' };
      repositoryMock.enviarCadastro.mockResolvedValue(mockResult);

      const result = await usecase.execute(mockPayload);

      expect(repositoryMock.enviarCadastro).toHaveBeenCalledWith(mockPayload);
      expect(result).toBe(mockResult);
    });
  });

  describe('ListarCompanhiasResseguradasUseCaseImpl', () => {
    let usecase: ListarCompanhiasResseguradasUseCaseImpl;

    beforeEach(() => {
      usecase = new ListarCompanhiasResseguradasUseCaseImpl(repositoryMock);
    });

    it('deve chamar repository.listarCompanhias e retornar o resultado', async () => {
      const mockResult: any = { content: [] };
      repositoryMock.listarCompanhias.mockResolvedValue(mockResult);

      const result = await usecase.execute();

      expect(repositoryMock.listarCompanhias).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });
});
