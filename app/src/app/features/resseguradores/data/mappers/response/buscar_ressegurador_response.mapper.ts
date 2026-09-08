import { RegistrationDataMapper } from 'src/app/shared/data/mappers/registration_data.mapper';
import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';
import { BuscarResseguradorResponseEntity } from '../../../domain/entities/response/buscar_ressegurador_response.entity';
import { BuscarResseguradorResponseDto } from '../../dtos/response/buscar_ressegurador_response.dto';
import { ResseguradorProfileTypeEnum } from '../../../domain/enums/ressegurador_profile_type.enum';
import { ListarResseguradoresResponseMapper } from './listar_resseguradores_response.mapper';

export class BuscarResseguradorResponseMapper {
  private static parseProfileType(
    value: string | undefined
  ): ResseguradorProfileTypeEnum {
    if (!value) {
      return ResseguradorProfileTypeEnum.LOCAL;
    }
    const normalized = value.trim().toUpperCase();
    if (normalized === 'LOCAL') {
      return ResseguradorProfileTypeEnum.LOCAL;
    }
    if (normalized === 'EVENTUAL') {
      return ResseguradorProfileTypeEnum.EVENTUAL;
    }
    if (normalized === 'ADMITIDA') {
      return ResseguradorProfileTypeEnum.ADMITIDA;
    }
    return ResseguradorProfileTypeEnum.LOCAL;
  }

  static toEntity(
    dto: BuscarResseguradorResponseDto
  ): BuscarResseguradorResponseEntity {
    if (!dto) {
      throw new Error('DTO inválido para mapeamento.');
    }

    return new BuscarResseguradorResponseEntity({
      codigoTipoPersona: dto.codigo_tipo_persona,
      idCliente: dto.id_cliente,
      idDbResseguro: dto.id_dbresseguro,
      situacaoCadastral: dto.situacao_cadastral,
      codigoSusep: dto.codigo_susep,
      tipoPerfil: this.parseProfileType(dto.tipo_perfil),
      dadosCadastrais: RegistrationDataMapper.toEntity(dto.dados_cadastrais),
      dadosConta: ((dto.dados_conta || []) as any[])
        .filter(Boolean)
        .map((conta) => BankAccountMapper.toEntity(conta)),
    });
  }

  static toDto(
    entity: BuscarResseguradorResponseEntity
  ): BuscarResseguradorResponseDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      codigo_tipo_persona: entity.codigoTipoPersona,
      id_cliente: entity.idCliente,
      id_dbresseguro: entity.idDbResseguro,
      situacao_cadastral: entity.situacaoCadastral,
      codigo_susep: entity.codigoSusep,
      tipo_perfil: entity.tipoPerfil,
      dados_cadastrais: RegistrationDataMapper.toDto(entity.dadosCadastrais),
      dados_conta: ((entity.dadosConta || []) as any[])
        .filter(Boolean)
        .map((conta) => BankAccountMapper.toDto(conta)),
    };
  }
}

// Para manter compatibilidade com os specs que esperavam o ResseguradorMapper anterior
export class ResseguradorMapper {
  static toEntity(
    dto: BuscarResseguradorResponseDto
  ): BuscarResseguradorResponseEntity {
    return BuscarResseguradorResponseMapper.toEntity(dto);
  }

  static toDto(
    entity: BuscarResseguradorResponseEntity
  ): BuscarResseguradorResponseDto {
    return BuscarResseguradorResponseMapper.toDto(entity);
  }

  static toListagemEntity(dto: BuscarResseguradorResponseDto) {
    const entity = this.toEntity(dto);
    return {
      ...entity,
      dadosCadastrais: entity.dadosCadastrais.copyWith({
        enderecos: [],
        telefones: [],
        emails: [],
      }),
    };
  }

  static toListarResseguradoresResponseEntity(dto: any) {
    return ListarResseguradoresResponseMapper.toEntity(dto);
  }
}
