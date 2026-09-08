import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { BuscarInstituicoesFinanceirasResponseDto } from '../../dtos/response/buscar_instituicoes_financeiras.response.dto';

export class BuscarInstituicoesFinanceirasResponseMapper {
  static toEntity(
    dto: BuscarInstituicoesFinanceirasResponseDto
  ): BuscarInstituicoesFinanceirasResponseEntity {
    return new BuscarInstituicoesFinanceirasResponseEntity({
      data: (dto.data || []).map((instituicao) => ({
        codigo: instituicao.codigo || '',
        nome: instituicao.nome || '',
      })),
    });
  }
}
