import {
  ListarResseguradoresResponseEntity,
  ListagemBuscarResseguradorResponseEntity,
} from '../../../domain/entities/response/listar_resseguradores_response.entity';
import { ListarResseguradoresResponseDto } from '../../dtos/response/listar_resseguradores_response.dto';
import { BuscarResseguradorResponseMapper } from './buscar_ressegurador_response.mapper';

export class ListarResseguradoresResponseMapper {
  static toEntity(
    dto: ListarResseguradoresResponseDto
  ): ListarResseguradoresResponseEntity {
    if (!dto) {
      throw new Error('DTO inválido para mapeamento.');
    }

    const contentMapped = ((dto.content || []) as any[])
      .filter(Boolean)
      .map((item) => {
        const resseguradorEntity = BuscarResseguradorResponseMapper.toEntity({
          codigo_tipo_persona: item.codigo_tipo_persona,
          id_cliente: item.id_cliente,
          id_dbresseguro: item.id_dbresseguro,
          situacao_cadastral: item.situacao_cadastral,
          codigo_susep: item.codigo_susep,
          tipo_perfil: item.tipo_perfil,
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

        return resseguradorEntity as ListagemBuscarResseguradorResponseEntity;
      });

    return new ListarResseguradoresResponseEntity(contentMapped, {
      size: dto.page?.size || 0,
      number: dto.page?.number || 0,
      totalElements: dto.page?.totalElements || 0,
      totalPages: dto.page?.totalPages || 0,
    });
  }

  static toDto(
    entity: ListarResseguradoresResponseEntity
  ): ListarResseguradoresResponseDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      content: ((entity.content || []) as any[])
        .filter(Boolean)
        .map((item) => ({
          codigo_tipo_persona: item.codigoTipoPersona,
          id_cliente: item.idCliente,
          id_dbresseguro: item.idDbResseguro,
          situacao_cadastral: item.situacaoCadastral,
          codigo_susep: item.codigoSusep,
          tipo_perfil: item.tipoPerfil,
          dados_cadastrais: {
            nome_completo: item.dadosCadastrais.nomeCompleto,
            nome_fantasia: item.dadosCadastrais.nomeFantasia,
            tipo_documento: item.dadosCadastrais.tipoDocumento,
            numero_documento: item.dadosCadastrais.numeroDocumento,
            pais: item.dadosCadastrais.pais,
          },
        })),
      page: {
        size: entity.page?.size || 0,
        number: entity.page?.number || 0,
        totalElements: entity.page?.totalElements || 0,
        totalPages: entity.page?.totalPages || 0,
      },
    };
  }
}
