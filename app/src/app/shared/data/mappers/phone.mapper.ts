import { PhoneEntity } from '../../domain/entities/phone.entity';
import { PhonePurposeEnum } from '../../domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../domain/enum/phone_type.enum';
import { PhoneDto } from '../dtos/phone.dto';

export class PhoneMapper {
  static toEntity(dto: PhoneDto): PhoneEntity {
    let proposito = PhonePurposeEnum.OUTROS;
    if (dto.proposito_telefone) {
      const val = dto.proposito_telefone.trim().toUpperCase();
      if (val === 'PRINCIPAL') proposito = PhonePurposeEnum.PRINCIPAL;
      else if (val === 'COMERCIAL') proposito = PhonePurposeEnum.COMERCIAL;
    }

    let tipo = PhoneTypeEnum.MOVEL;
    if (dto.tipo_telefone) {
      const val = dto.tipo_telefone.trim().toUpperCase();
      if (
        val === 'MOVEL' ||
        val === 'MÓVEL' ||
        val === 'MÓVEIS' ||
        val === 'MOVEIS'
      ) {
        tipo = PhoneTypeEnum.MOVEL;
      } else if (val === 'FIXO') {
        tipo = PhoneTypeEnum.FIXO;
      }
    }

    return new PhoneEntity({
      propositoTelefone: proposito,
      tipoTelefone: tipo,
      ddi: dto.ddi,
      ddd: dto.ddd,
      numero: dto.numero,
      nomeContato: dto.nome_contato,
    });
  }

  static toDto(entity: PhoneEntity): PhoneDto {
    return {
      proposito_telefone: entity.propositoTelefone,
      tipo_telefone: entity.tipoTelefone,
      ddi: entity.ddi,
      ddd: entity.ddd,
      numero: entity.numero,
      nome_contato: entity.nomeContato,
    };
  }
}
