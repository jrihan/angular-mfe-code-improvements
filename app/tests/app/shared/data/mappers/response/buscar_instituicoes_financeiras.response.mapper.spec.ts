import { BuscarInstituicoesFinanceirasResponseMapper } from '../../../../../../src/app/shared/data/mappers/response/buscar_instituicoes_financeiras.response.mapper';
import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

describe('BuscarInstituicoesFinanceirasResponseMapper', () => {
  it('deve converter um DTO completo em entidade', () => {
    const entity = BuscarInstituicoesFinanceirasResponseMapper.toEntity({
      data: [{ codigo: '341', nome: 'Banco Itau' }],
    });

    expect(entity).toBeInstanceOf(BuscarInstituicoesFinanceirasResponseEntity);
    expect(entity.data).toEqual([{ codigo: '341', nome: 'Banco Itau' }]);
  });

  it('deve usar valores padrao para codigo e nome ausentes', () => {
    const entity = BuscarInstituicoesFinanceirasResponseMapper.toEntity({
      data: [{ codigo: undefined as any, nome: null as any }],
    } as any);

    expect(entity.data).toEqual([{ codigo: '', nome: '' }]);
  });

  it('deve retornar lista vazia quando data estiver ausente', () => {
    const entity = BuscarInstituicoesFinanceirasResponseMapper.toEntity(
      {} as any
    );

    expect(entity.data).toEqual([]);
  });
});
