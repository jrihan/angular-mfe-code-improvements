import { EmailMapper } from '../../../../../src/app/shared/data/mappers/email.mapper';
import { EmailEntity } from '../../../../../src/app/shared/domain/entities/email.entity';
import { MailPurposeEnum } from '../../../../../src/app/shared/domain/enum/mail_purpose.enum';
import { EmailDto } from '../../../../../src/app/shared/data/dtos/email.dto';

describe('EmailMapper', () => {
  describe('toEntity', () => {
    it('deve mapear proposito PRINCIPAL', () => {
      const entity = EmailMapper.toEntity({
        proposito_email: 'principal',
        email: 'teste@teste.com',
        nome_contato: 'Maria',
      });

      expect(entity).toBeInstanceOf(EmailEntity);
      expect(entity.propositoEmail).toBe(MailPurposeEnum.PRINCIPAL);
      expect(entity.email).toBe('teste@teste.com');
      expect(entity.nomeContato).toBe('Maria');
    });

    it('deve usar OUTROS para proposito diferente de PRINCIPAL', () => {
      const entity = EmailMapper.toEntity({
        proposito_email: 'SECUNDARIO',
        email: 'rh@teste.com',
        nome_contato: 'José',
      });

      expect(entity.propositoEmail).toBe(MailPurposeEnum.OUTROS);
    });

    it('deve usar OUTROS e valores padrão quando os campos estiverem ausentes', () => {
      const entity = EmailMapper.toEntity({} as EmailDto);

      expect(entity.propositoEmail).toBe(MailPurposeEnum.OUTROS);
      expect(entity.email).toBe('');
      expect(entity.nomeContato).toBe('');
    });
  });

  describe('toDto', () => {
    it('deve converter a entidade em DTO', () => {
      const entity = new EmailEntity({
        propositoEmail: MailPurposeEnum.PRINCIPAL,
        email: 'teste@teste.com',
        nomeContato: 'Maria',
      });

      const dto = EmailMapper.toDto(entity);

      expect(dto).toEqual({
        proposito_email: MailPurposeEnum.PRINCIPAL,
        email: 'teste@teste.com',
        nome_contato: 'Maria',
      });
    });

    it('nao deve enviar nome_contato quando nomeContato for null', () => {
      const entity = new EmailEntity({
        propositoEmail: MailPurposeEnum.OUTROS,
        email: 'teste@teste.com',
        nomeContato: null,
      });

      const dto = EmailMapper.toDto(entity);

      expect(dto).toEqual({
        proposito_email: MailPurposeEnum.OUTROS,
        email: 'teste@teste.com',
      });
      expect(dto).not.toHaveProperty('nome_contato');
    });
  });
});
