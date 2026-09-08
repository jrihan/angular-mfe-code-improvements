import { AddressEntity } from './address.entity';
import { EmailEntity } from './email.entity';
import { PhoneEntity } from './phone.entity';

export class RegistrationDataEntity {
  public readonly nomeCompleto: string;
  public readonly nomeFantasia: string;
  public readonly tipoDocumento: string;
  public readonly numeroDocumento: string;
  public readonly pais: string;
  public readonly enderecos: AddressEntity[] | null;
  public readonly telefones: PhoneEntity[] | null;
  public readonly emails: EmailEntity[] | null;

  constructor(props: Omit<RegistrationDataEntity, 'copyWith'>) {
    this.nomeCompleto = props.nomeCompleto;
    this.nomeFantasia = props.nomeFantasia;
    this.tipoDocumento = props.tipoDocumento;
    this.numeroDocumento = props.numeroDocumento;
    this.pais = props.pais;
    this.enderecos = props.enderecos;
    this.telefones = props.telefones;
    this.emails = props.emails;
  }

  public copyWith(
    props: Partial<Omit<RegistrationDataEntity, 'copyWith'>>
  ): RegistrationDataEntity {
    return new RegistrationDataEntity({
      ...this,
      ...props,
    });
  }
}
