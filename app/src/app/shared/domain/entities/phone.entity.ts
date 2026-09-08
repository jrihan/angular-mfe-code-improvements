import { PhonePurposeEnum } from '../enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../enum/phone_type.enum';

export class PhoneEntity {
  public readonly propositoTelefone: PhonePurposeEnum;
  public readonly tipoTelefone: PhoneTypeEnum;
  public readonly ddi: number;
  public readonly ddd: number;
  public readonly numero: number;
  public readonly nomeContato?: string;

  constructor(props: Omit<PhoneEntity, 'copyWith'>) {
    this.propositoTelefone = props.propositoTelefone;
    this.tipoTelefone = props.tipoTelefone;
    this.ddi = props.ddi;
    this.ddd = props.ddd;
    this.numero = props.numero;
    this.nomeContato = props.nomeContato;
  }

  public copyWith(props: Partial<Omit<PhoneEntity, 'copyWith'>>): PhoneEntity {
    return new PhoneEntity({
      ...this,
      ...props,
    });
  }
}
