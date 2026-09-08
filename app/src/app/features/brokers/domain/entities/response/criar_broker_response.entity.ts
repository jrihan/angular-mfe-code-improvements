import { ReinsuranceAccountEntity } from 'src/app/shared/domain/entities/reinsurance_account.entity';

export class CriarBrokerResponseEntity {
  public readonly codigoBroker: number;
  public readonly codigoIdentificacaoPessoa: string;
  public readonly codigoSusep: number;
  public readonly informacaoContaResseguro: ReinsuranceAccountEntity;

  constructor(props: Omit<CriarBrokerResponseEntity, 'copyWith'>) {
    this.codigoBroker = props.codigoBroker;
    this.codigoIdentificacaoPessoa = props.codigoIdentificacaoPessoa;
    this.codigoSusep = props.codigoSusep;
    this.informacaoContaResseguro = props.informacaoContaResseguro;
  }
}
