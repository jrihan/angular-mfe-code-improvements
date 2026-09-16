import { BankAccountTypeEnum } from '../enum/bank_account_type.enum';

export class BankAccountEntity {
  public readonly contaSelecionada?: boolean;
  public readonly codigoBanco: string;
  public readonly codigoAgencia: string;
  public readonly codigoTipoConta: BankAccountTypeEnum;
  public readonly codigoConta: string;
  public readonly dac: string;
  public readonly iban?: string;
  public readonly swift?: string;

  constructor(
    props: Omit<BankAccountEntity, 'copyWith' | 'isInternational'>
  ) {
    this.contaSelecionada = props.contaSelecionada;
    this.codigoBanco = props.codigoBanco;
    this.codigoAgencia = props.codigoAgencia;
    this.codigoTipoConta = props.codigoTipoConta;
    this.codigoConta = props.codigoConta;
    this.dac = props.dac;
    this.iban = props.iban;
    this.swift = props.swift;
  }

  get isInternational(): boolean {
    return !!this.iban || !!this.swift;
  }

  public copyWith(
    props: Partial<Omit<BankAccountEntity, 'copyWith' | 'isInternational'>>
  ): BankAccountEntity {
    return new BankAccountEntity({
      ...this,
      ...props,
    });
  }
}
