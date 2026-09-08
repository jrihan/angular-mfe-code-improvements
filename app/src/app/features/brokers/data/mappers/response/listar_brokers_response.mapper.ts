import {
  ListarBrokersContentEntity,
  ListarBrokersResponseEntity,
} from '../../../domain/entities/response/listar_brokers_response.entity';
import { ListarBrokersResponseDto } from '../../dtos/response/listar_brokers_response.dto';
import { BuscarBrokerResponseMapper } from './buscar_broker_response.mapper';

export class ListarBrokersResponseMapper {
  static toEntity(dto: ListarBrokersResponseDto): ListarBrokersResponseEntity {
    if (!dto) {
      throw new Error('DTO inválido para mapeamento.');
    }

    const contentMapped = ((dto.content || []) as any[])
      .filter(Boolean)
      .map((item) => {
        const brokerEntity = BuscarBrokerResponseMapper.toEntity({
          codigo_tipo_persona: item.codigo_tipo_persona,
          id_cliente: item.id_cliente,
          id_dbresseguro: item.id_dbresseguro,
          situacao_cadastral: item.situacao_cadastral,
          codigo_susep: item.codigo_susep,
          dados_cadastrais: {
            nome_completo: item.dados_cadastrais?.nome_completo || '',
            nome_fantasia: item.dados_cadastrais?.nome_fantasia || '',
            tipo_documento: item.dados_cadastrais?.tipo_documento || '',
            numero_documento: item.dados_cadastrais?.numero_documento || '',
            pais: item.dados_cadastrais?.pais || '',
            enderecos: [],
            telefones: [],
            emails: [],
          },
          dados_conta: null!,
        });

        return brokerEntity as ListarBrokersContentEntity;
      });

    return new ListarBrokersResponseEntity(contentMapped, {
      size: dto.page?.size || 0,
      number: dto.page?.number || 0,
      totalElements: dto.page?.totalElements || 0,
      totalPages: dto.page?.totalPages || 0,
    });
  }
}
