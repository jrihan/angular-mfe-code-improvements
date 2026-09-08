import { RegistrationDataEntity } from '../../domain/entities/registration_data.entity';
import { RegistrationDataDto } from '../dtos/registration_data.dto';
import { AddressMapper } from './address.mapper';
import { EmailMapper } from './email.mapper';
import { PhoneMapper } from './phone.mapper';

export class RegistrationDataMapper {
  static toEntity(
    dto: RegistrationDataDto | null | undefined
  ): RegistrationDataEntity {
    return new RegistrationDataEntity({
      nomeCompleto: dto?.nome_completo || '',
      nomeFantasia: dto?.nome_fantasia || '',
      tipoDocumento: dto?.tipo_documento || '',
      numeroDocumento: dto?.numero_documento || '',
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
    });
  }

  static toDto(
    entity: RegistrationDataEntity | null | undefined
  ): RegistrationDataDto {
    return {
      nome_completo: entity?.nomeCompleto || '',
      nome_fantasia: entity?.nomeFantasia || '',
      tipo_documento: entity?.tipoDocumento || '',
      numero_documento: entity?.numeroDocumento || '',
      pais: entity?.pais || '',
      enderecos: ((entity?.enderecos || []) as any[])
        .filter(Boolean)
        .map((addr) => AddressMapper.toDto(addr)),
      telefones: ((entity?.telefones || []) as any[])
        .filter(Boolean)
        .map((phone) => PhoneMapper.toDto(phone)),
      emails: ((entity?.emails || []) as any[])
        .filter(Boolean)
        .map((email) => EmailMapper.toDto(email)),
    };
  }
}
