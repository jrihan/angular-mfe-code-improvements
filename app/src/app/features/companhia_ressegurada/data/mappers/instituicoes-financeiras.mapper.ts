import { ListagemInstituicoesFinanceirasEntity } from '../../domain/entities/instituicoes-financeiras.entity';

export class ListagemInstituicoesFinanceirasMapper {
  static toEntity(
    dto: ListagemInstituicoesFinanceirasEntity
  ): ListagemInstituicoesFinanceirasEntity {
    return {
      data: dto.data.map((banco) => ({
        codigo: banco.codigo,
        nome: banco.nome,
      })),
    };
  }
}
