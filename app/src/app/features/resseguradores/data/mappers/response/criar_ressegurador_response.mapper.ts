import { ReinsuranceAccountMapper } from 'src/app/shared/data/mappers/reinsurance_account.mapper';
import { ProfileTypeEnum } from 'src/app/shared/domain/enum/profile_type.enum';
import { CriarResseguradorResponseEntity } from '../../../domain/entities/response/criar_ressegurador_response.entity';
import { CriarResseguradorResponseDto } from '../../dtos/response/criar_ressegurador_response.dto';

export class CriarResseguradorResponseMapper {
  static toEntity(
    dto: CriarResseguradorResponseDto
  ): CriarResseguradorResponseEntity {
    return new CriarResseguradorResponseEntity({
      codigoRessegurador: dto.codigo_ressegurador || 0,
      codigoIdentificacaoPessoa: dto.codigo_identificacao_pessoa || '',
      codigoSusep: dto.codigo_susep || 0,
      tipoPerfil: dto.tipo_perfil as ProfileTypeEnum,
      informacaoContaResseguro: ReinsuranceAccountMapper.toEntity(
        dto.informacao_conta_resseguro
      ),
    });
  }

  static toDto(
    entity: CriarResseguradorResponseEntity
  ): CriarResseguradorResponseDto {
    return {
      codigo_ressegurador: entity.codigoRessegurador,
      codigo_identificacao_pessoa: entity.codigoIdentificacaoPessoa,
      codigo_susep: entity.codigoSusep,
      tipo_perfil: entity.tipoPerfil,
      informacao_conta_resseguro: ReinsuranceAccountMapper.toDto(
        entity.informacaoContaResseguro
      ),
    };
  }
}
