import { CompanhiaResseguradaListItemDto } from '../dtos/companhia-ressegurada-list-item.dto';
import { CompanhiaResseguradaListItemEntity } from '../../domain/entities/companhia-ressegurada-list-item.entity';

export class CompanhiaResseguradaListItemMapper {
  static toEntity(
    dto: CompanhiaResseguradaListItemDto
  ): CompanhiaResseguradaListItemEntity {
    return {
      codigo_tipo_persona: dto.codigo_tipo_persona,
      id_cliente: dto.id_cliente,
      id_dbresseguro: dto.id_dbresseguro,
      situacao_cadastral: dto.situacao_cadastral,
      codigo_susep: dto.codigo_susep,
      codigo_companhia_ressegurada: dto.codigo_companhia_ressegurada,
      codigo_centro_custo: dto.codigo_centro_custo,
      dados_cadastrais: dto.dados_cadastrais,
    };
  }
}
