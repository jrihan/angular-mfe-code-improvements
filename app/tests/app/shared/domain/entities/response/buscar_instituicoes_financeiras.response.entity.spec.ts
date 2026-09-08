import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

describe('BuscarInstituicoesFinanceirasResponseEntity', () => {
  it('deve materializar a lista de instituicoes financeiras', () => {
    const entity = new BuscarInstituicoesFinanceirasResponseEntity({
      data: [{ codigo: '341', nome: 'Banco Itau' }],
    });

    expect(entity.data).toEqual([{ codigo: '341', nome: 'Banco Itau' }]);
  });

  it('deve usar lista vazia quando data estiver ausente', () => {
    const entity = new BuscarInstituicoesFinanceirasResponseEntity({
      data: undefined as any,
    });

    expect(entity.data).toEqual([]);
  });
});
