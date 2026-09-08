import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';
import { AddressMapper } from 'src/app/shared/data/mappers/address.mapper';
import { EmailMapper } from 'src/app/shared/data/mappers/email.mapper';
import { PhoneMapper } from 'src/app/shared/data/mappers/phone.mapper';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { DocumentTypeEnum } from 'src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';
import { RegistrationDataDto } from 'src/app/shared/data/dtos/registration_data.dto';

import {
  CriarResseguradorRequestEntity,
  ReinsuranceEntity,
} from '../../../domain/entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorRequestDto } from '../../dtos/request/criar_ressegurador_request.dto';

export class CriarResseguradorRequestMapper {
  static toEntity(
    dto: CriarResseguradorRequestDto
  ): CriarResseguradorRequestEntity {
    if (!dto) {
      throw new Error('DTO inválido para mapeamento.');
    }

    return new CriarResseguradorRequestEntity({
      codigoTipoPersona: dto.tipo_pessoa as PersonTypeEnum,
      tipoDocumento: dto.tipo_documento as DocumentTypeEnum,
      numeroDocumento: dto.numero_documento || '',
      pais: dto.pais || '',
      codigoSusep: dto.codigo_susep || 0,
      ressegurador: new ReinsuranceEntity({
        tipoPerfil: dto.ressegurador?.tipo_perfil as PersonTypeEnum,
      }),
      dadosConta: BankAccountMapper.toEntity(dto.dados_conta),
      dadosCadastrais: CriarResseguradorRequestMapper.toEntityDadosCadastrais(
        dto.dados_cadastrais
      ),
    });
  }

  static toDto(
    entity: CriarResseguradorRequestEntity
  ): CriarResseguradorRequestDto {
    if (!entity) {
      throw new Error('Entidade inválida para mapeamento.');
    }

    return {
      tipo_pessoa: entity.codigoTipoPersona,
      tipo_documento: entity.tipoDocumento,
      numero_documento: entity.numeroDocumento,
      pais: entity.pais,
      codigo_susep: entity.codigoSusep,
      ressegurador: {
        tipo_perfil: entity.ressegurador?.tipoPerfil,
      },
      dados_conta: BankAccountMapper.toDto(entity.dadosConta),
      dados_cadastrais: CriarResseguradorRequestMapper.toDtoDadosCadastrais(
        entity.dadosCadastrais
      ),
    };
  }

  private static toEntityDadosCadastrais(
    dto:
      | Omit<RegistrationDataDto, 'tipo_documento' | 'numero_documento'>
      | null
      | undefined
  ): Omit<RegistrationDataEntity, 'tipoDocumento' | 'numeroDocumento'> {
    return {
      nomeCompleto: dto?.nome_completo || '',
      nomeFantasia: dto?.nome_fantasia || '',
      pais: dto?.pais || '',
      enderecos: ((dto?.enderecos || []) as any[])
        .filter(Boolean)
        .map((addr) => AddressMapper.toEntity(addr)),
      telefones: ((dto?.telefones || []) as any[])
        .filter(Boolean)
        .map((phone) => PhoneMapper.toEntity(phone)),
      emails: ((dto?.emails || []) as any[])
        .filter(Boolean)
        .map((email) => EmailMapper.toEntity(email)),
    } as any;
  }

  private static toDtoDadosCadastrais(
    entity:
      | Omit<RegistrationDataEntity, 'tipoDocumento' | 'numeroDocumento'>
      | null
      | undefined
  ): Omit<RegistrationDataDto, 'tipo_documento' | 'numero_documento'> {
    // Blocos vazios/ausentes são omitidos do payload (nem null, nem lista vazia).
    const dto: Omit<
      RegistrationDataDto,
      'tipo_documento' | 'numero_documento'
    > = {
      nome_completo: entity?.nomeCompleto || '',
      nome_fantasia: entity?.nomeFantasia || '',
      pais: entity?.pais || '',
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
}
