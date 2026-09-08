export class ContratoResponseEntity {
  public readonly id: string;
  public readonly nomeDoContrato: string;
  public readonly status: string;
  public readonly vigencia: string;
  public readonly tipoDeContrato: string;
  public readonly modalidadeDeContrato: string;
  public readonly baseDeCobertura: string;
  public readonly submodalidade: string;
  public readonly companhia: string;
  public readonly broker: string;
  public readonly resseguradoras: string;

  constructor(props: Omit<ContratoResponseEntity, 'copyWith'>) {
    this.id = props.id;
    this.nomeDoContrato = props.nomeDoContrato;
    this.status = props.status;
    this.vigencia = props.vigencia;
    this.tipoDeContrato = props.tipoDeContrato;
    this.modalidadeDeContrato = props.modalidadeDeContrato;
    this.baseDeCobertura = props.baseDeCobertura;
    this.submodalidade = props.submodalidade;
    this.companhia = props.companhia;
    this.broker = props.broker;
    this.resseguradoras = props.resseguradoras;
  }
}
