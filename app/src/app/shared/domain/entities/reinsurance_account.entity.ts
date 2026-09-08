export class ReinsuranceAccountEntity {
  public readonly agencia: string;
  public readonly banco: string;
  public readonly codigoTipoConta: string;
  public readonly numeroContaOutraInstituicaoFinanceira: string;
  public readonly numeroDigitoValidadorContaOutraInstituicaoFinanceira: string;
  public readonly numeroUnicoConta: string | null;

  constructor(props: Omit<ReinsuranceAccountEntity, 'copyWith'>) {
    this.agencia = props.agencia;
    this.banco = props.banco;
    this.codigoTipoConta = props.codigoTipoConta;
    this.numeroContaOutraInstituicaoFinanceira =
      props.numeroContaOutraInstituicaoFinanceira;
    this.numeroDigitoValidadorContaOutraInstituicaoFinanceira =
      props.numeroDigitoValidadorContaOutraInstituicaoFinanceira;
    this.numeroUnicoConta = props.numeroUnicoConta;
  }

  public copyWith(
    props: Partial<Omit<ReinsuranceAccountEntity, 'copyWith'>>
  ): ReinsuranceAccountEntity {
    return new ReinsuranceAccountEntity({
      ...this,
      ...props,
    });
  }
}
