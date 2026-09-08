import { RegistrationDataMapper } from 'src/app/shared/data/mappers/registration_data.mapper';
import { BuscarBrokerResponseEntity } from '../../../domain/entities/response/buscar_broker_response.entity';
import { BuscarBrokerResponseDto } from '../../dtos/response/buscar_broker_response.dto';
import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';

export class BuscarBrokerResponseMapper {
  static toEntity(dto: BuscarBrokerResponseDto): BuscarBrokerResponseEntity {
    if (!dto) {
      throw new Error('DTO inválido para mapeamento.');
    }

    return new BuscarBrokerResponseEntity({
      codigoTipoPersona: dto.codigo_tipo_persona,
      idCliente: dto.id_cliente,
      idDbResseguro: dto.id_dbresseguro,
      situacaoCadastral: dto.situacao_cadastral,
      codigoSusep: dto.codigo_susep,
      dadosCadastrais: RegistrationDataMapper.toEntity(dto.dados_cadastrais),
      dadosConta: ((dto.dados_conta || []) as any[])
        .filter(Boolean)
        .map((conta) => BankAccountMapper.toEntity(conta)),
    });
  }

  static toDto(entity: BuscarBrokerResponseEntity): BuscarBrokerResponseDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      codigo_tipo_persona: entity.codigoTipoPersona,
      id_cliente: entity.idCliente,
      id_dbresseguro: entity.idDbResseguro,
      situacao_cadastral: entity.situacaoCadastral,
      codigo_susep: entity.codigoSusep,
      dados_cadastrais: RegistrationDataMapper.toDto(entity.dadosCadastrais),
      dados_conta: ((entity.dadosConta || []) as any[])
        .filter(Boolean)
        .map((conta) => BankAccountMapper.toDto(conta)),
    };
  }
}
