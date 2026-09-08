import { MailPurposeEnum } from '../enum/mail_purpose.enum';

export class EmailEntity {
  public readonly propositoEmail: MailPurposeEnum;
  public readonly email: string;
  public readonly nomeContato: string | null;

  constructor(props: Omit<EmailEntity, 'copyWith'>) {
    this.propositoEmail = props.propositoEmail;
    this.email = props.email;
    this.nomeContato = props.nomeContato;
  }

  public copyWith(props: Partial<Omit<EmailEntity, 'copyWith'>>): EmailEntity {
    return new EmailEntity({
      ...this,
      ...props,
    });
  }
}
