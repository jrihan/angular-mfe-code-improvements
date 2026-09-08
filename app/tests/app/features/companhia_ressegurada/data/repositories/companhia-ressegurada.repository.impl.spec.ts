import { CompanhiaResseguradaRepositoryImpl } from '../../../../../../src/app/features/companhia_ressegurada/data/repositories/companhia-ressegurada.repository.impl';
import { CompanhiaResseguradaDatasource } from '../../../../../../src/app/features/companhia_ressegurada/data/datasources/companhia-ressegurada.datasource';
import { CompanhiaResseguradaMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/listagem-dados-cadastrais.mapper';
import { CadastroCompanhiaResseguradaMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/cadastro-companhia-ressegurada.mapper';
import { EntityGenerator } from '../../../../../../src/app/shared/entity-generator';
import { CompanhiaResseguradaListItemMapper } from 'src/app/features/companhia_ressegurada/data/mappers/companhia-ressegurada-list-item.mapper';
import { ListagemInstituicoesFinanceirasMapper } from 'src/app/features/companhia_ressegurada/data/mappers/instituicoes-financeiras.mapper';

describe('CompanhiaResseguradaRepositoryImpl', () => {
  let datasource: jest.Mocked<CompanhiaResseguradaDatasource>;
  let repository: CompanhiaResseguradaRepositoryImpl;

  beforeEach(() => {
    datasource = {
      buscarDadosCadastrais: jest.fn(),
      enviarCadastro: jest.fn(),
      listarCompanhias: jest.fn(),
      buscarBancos: jest.fn(),
    } as any;
    repository = new CompanhiaResseguradaRepositoryImpl(datasource);
    jest.clearAllMocks();
  });

  it('deve buscarDadosCadastrais e mapear para entity', async () => {
    const entity = EntityGenerator.companhiaResseguradaResponseEntity({
      min: 1,
      max: 1,
    });
    const dto = CompanhiaResseguradaMapper.toDTO(entity);
    const expectedEntity = CompanhiaResseguradaMapper.toEntity(dto as any);

    datasource.buscarDadosCadastrais.mockResolvedValue(dto as any);
    const result = await repository.buscarDadosCadastrais('123');
    expect(datasource.buscarDadosCadastrais).toHaveBeenCalledWith(
      '123',
      '',
      ''
    );
    expect(result).toEqual(expectedEntity);
  });

  it('deve enviarCadastro convertendo para DTO', async () => {
    const entity = EntityGenerator.cadastroCompanhiaRessegurada();
    const dto = CadastroCompanhiaResseguradaMapper.toDTO(entity);
    datasource.enviarCadastro.mockResolvedValue({ status: 'ok' });
    const result = await repository.enviarCadastro(entity as any);
    expect(datasource.enviarCadastro).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ status: 'ok' });
  });

  it('deve listarCompanhias e mapear content', async () => {
    const dto = EntityGenerator.companhiaResseguradaListItem();
    const dtoList = [dto];
    datasource.listarCompanhias.mockResolvedValue({
      content: dtoList,
      page: { size: 1 },
    });
    const result = await repository.listarCompanhias();
    expect(datasource.listarCompanhias).toHaveBeenCalled();
    expect(result.content).toEqual(
      dtoList.map(CompanhiaResseguradaListItemMapper.toEntity)
    );
    expect(result.page).toEqual({ size: 1 });
  });

  it('deve buscarBancos', async () => {
    const bancos = { data: [{ codigo: '001', nome: 'BANCO DO BRASIL S.A.' }] };
    datasource.buscarBancos.mockResolvedValue(bancos as any);

    const result = await repository.buscarBancos();
    expect(result).toEqual(
      ListagemInstituicoesFinanceirasMapper.toEntity(bancos)
    );
    expect(datasource.buscarBancos).toHaveBeenCalled();
  });
});
