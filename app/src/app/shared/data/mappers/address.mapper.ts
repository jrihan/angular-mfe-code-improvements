import { AddressEntity } from '../../domain/entities/address.entity';
import { AddressTypeEnum } from '../../domain/enum/address_type.enum';
import { AddressDto } from '../dtos/address.dto';

export class AddressMapper {
  static toEntity(dto: AddressDto): AddressEntity {
    let proposito = AddressTypeEnum.OUTROS;
    if (dto.proposito_endereco) {
      const val = dto.proposito_endereco.trim().toUpperCase();
      if (val === 'PRINCIPAL') proposito = AddressTypeEnum.PRINCIPAL;
      else if (val === 'COMERCIAL') proposito = AddressTypeEnum.COMERCIAL;
    }

    return new AddressEntity({
      propositoEndereco: proposito,
      logradouro: dto.logradouro || '',
      numero: dto.numero || '',
      complemento: dto.complemento || '',
      bairro: dto.bairro || '',
      cep: dto.cep || '',
      cidade: dto.cidade || '',
      uf: dto.uf || '',
      pais: dto.pais || '',
      regiao: dto.regiao,
      codigoAreaPostal: dto.codigo_area_postal,
    });
  }

  static toDto(entity: AddressEntity): AddressDto {
    const isBrasil = (entity.pais || '').trim().toUpperCase() === 'BR';

    // Campos em branco/apenas espaços são omitidos do payload.
    const dto: AddressDto = {};
    AddressMapper.setIfPresent(dto, 'proposito_endereco', entity.propositoEndereco);
    AddressMapper.setIfPresent(dto, 'logradouro', entity.logradouro);
    AddressMapper.setIfPresent(dto, 'numero', entity.numero);
    AddressMapper.setIfPresent(dto, 'complemento', entity.complemento);
    AddressMapper.setIfPresent(dto, 'bairro', entity.bairro);
    AddressMapper.setIfPresent(dto, 'cidade', entity.cidade);
    AddressMapper.setIfPresent(dto, 'pais', entity.pais);

    if (isBrasil) {
      // Endereço nacional (BR): UF e CEP se aplicam; regiao/codigo_area_postal não.
      AddressMapper.setIfPresent(dto, 'uf', entity.uf);
      AddressMapper.setIfPresent(dto, 'cep', entity.cep);
    } else {
      // Endereço estrangeiro: UF e CEP não se aplicam (omitidos);
      // regiao e codigo_area_postal são repassados quando preenchidos.
      AddressMapper.setIfPresent(dto, 'regiao', entity.regiao);
      AddressMapper.setIfPresent(dto, 'codigo_area_postal', entity.codigoAreaPostal);
    }

    return dto;
  }

  private static setIfPresent(
    dto: AddressDto,
    key: keyof AddressDto,
    value: string | null | undefined
  ): void {
    const normalized = String(value ?? '').trim();
    if (normalized) {
      dto[key] = normalized;
    }
  }
}
