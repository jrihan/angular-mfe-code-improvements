import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';
import { AtualizarBrokerRequestEntity } from '../../../domain/entities/request/atualizar_broker_request.entity';
import { AtualizarBrokerRequestDto } from '../../dtos/request/atualizar_broker_request.dto';
import { EmailMapper } from 'src/app/shared/data/mappers/email.mapper';
import { AddressMapper } from 'src/app/shared/data/mappers/address.mapper';
import { PhoneMapper } from 'src/app/shared/data/mappers/phone.mapper';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { RegistrationDataDto } from 'src/app/shared/data/dtos/registration_data.dto';

export class AtualizarBrokerRequestMapper {
  private static toDtoDadosCadastrais(
    entity:
      | Omit<
          RegistrationDataEntity,
          'tipoDocumento' | 'numeroDocumento' | 'pais'
        >
      | null
      | undefined
  ): Omit<RegistrationDataDto, 'tipo_documento' | 'numero_documento' | 'pais'> {
    const dto: Omit<
      RegistrationDataDto,
      'tipo_documento' | 'numero_documento' | 'pais'
    > = {
      nome_completo: entity?.nomeCompleto || '',
      nome_fantasia: entity?.nomeFantasia || '',
    };

    if (entity?.enderecos?.length) {
      dto.enderecos = entity.enderecos
        .filter(Boolean)
        .map((endereco) => AddressMapper.toDto(endereco));
    }

    if (entity?.telefones?.length) {
      dto.telefones = entity.telefones
        .filter(Boolean)
        .map((telefone) => PhoneMapper.toDto(telefone));
    }

    if (entity?.emails?.length) {
      dto.emails = entity.emails
        .filter(Boolean)
        .map((email) => EmailMapper.toDto(email));
    }

    return dto;
  }

  static toDto(
    entity: AtualizarBrokerRequestEntity
  ): AtualizarBrokerRequestDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      codigo_susep: entity.codigoSusep,
      numero_documento: entity.numeroDocumento,
      pais: entity.pais,
      tipo_documento: entity.tipoDocumento,
      tipo_pessoa: entity.codigoTipoPersona,
      dados_conta: BankAccountMapper.toDto(entity.dadosConta),
      dados_cadastrais: AtualizarBrokerRequestMapper.toDtoDadosCadastrais(
        entity.dadosCadastrais
      ),
    } as AtualizarBrokerRequestDto;
  }
}
