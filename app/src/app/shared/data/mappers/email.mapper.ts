import { EmailEntity } from '../../domain/entities/email.entity';
import { MailPurposeEnum } from '../../domain/enum/mail_purpose.enum';
import { EmailDto } from '../dtos/email.dto';

export class EmailMapper {
  static toEntity(dto: EmailDto): EmailEntity {
    let proposito = MailPurposeEnum.OUTROS;
    if (dto.proposito_email) {
      const val = dto.proposito_email.trim().toUpperCase();
      if (val === 'PRINCIPAL') proposito = MailPurposeEnum.PRINCIPAL;
    }

    return new EmailEntity({
      propositoEmail: proposito,
      email: dto.email || '',
      nomeContato: dto.nome_contato || '',
    });
  }

  static toDto(entity: EmailEntity): EmailDto {
    return {
      proposito_email: entity.propositoEmail,
      email: entity.email,
      ...(entity.nomeContato !== null
        ? { nome_contato: entity.nomeContato }
        : {}),
    };
  }
}
