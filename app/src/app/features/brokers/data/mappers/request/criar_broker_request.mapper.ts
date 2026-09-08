import { CriarBrokerRequestEntity } from '../../../domain/entities/request/criar_broker_request.entity';
import { CriarBrokerRequestDto } from '../../dtos/request/criar_broker_request.dto';
import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { RegistrationDataDto } from 'src/app/shared/data/dtos/registration_data.dto';
import { AddressMapper } from 'src/app/shared/data/mappers/address.mapper';
import { PhoneMapper } from 'src/app/shared/data/mappers/phone.mapper';
import { EmailMapper } from 'src/app/shared/data/mappers/email.mapper';

export class CriarBrokerRequestMapper {
  private static toDtoDadosCadastrais(
    entity:
      | Omit<
          RegistrationDataEntity,
          'tipoDocumento' | 'numeroDocumento' | 'pais'
        >
      | null
      | undefined
  ): Omit<RegistrationDataDto, 'tipo_documento' | 'numero_documento' | 'pais'> {
    // Blocos vazios/ausentes são omitidos do payload (nem null, nem lista vazia).
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
        .map((addr) => AddressMapper.toDto(addr));
    }
    if (entity?.telefones?.length) {
      dto.telefones = entity.telefones
        .filter(Boolean)
        .map((phone) => PhoneMapper.toDto(phone));
    }
    if (entity?.emails?.length) {
      dto.emails = entity.emails
        .filter(Boolean)
        .map((email) => EmailMapper.toDto(email));
    }
    return dto;
  }

  static toDto(entity: CriarBrokerRequestEntity): CriarBrokerRequestDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      tipo_pessoa: entity.codigoTipoPersona,
      tipo_documento: entity.tipoDocumento,
      numero_documento: entity.numeroDocumento,
      pais: entity.pais,
      codigo_susep: entity.codigoSusep,
      dados_conta: BankAccountMapper.toDto(entity.dadosConta),
      dados_cadastrais: CriarBrokerRequestMapper.toDtoDadosCadastrais(
        entity.dadosCadastrais
      ),
    } as CriarBrokerRequestDto;
  }
}
