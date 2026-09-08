import { ReinsuranceAccountEntity } from 'src/app/shared/domain/entities/reinsurance_account.entity';
import { ProfileTypeEnum } from 'src/app/shared/domain/enum/profile_type.enum';

export class CriarResseguradorResponseEntity {
  public readonly codigoRessegurador: number;
  public readonly codigoIdentificacaoPessoa: string;
  public readonly codigoSusep: number;
  public readonly tipoPerfil: ProfileTypeEnum;
  public readonly informacaoContaResseguro: ReinsuranceAccountEntity;

  constructor(props: Omit<CriarResseguradorResponseEntity, 'copyWith'>) {
    this.codigoRessegurador = props.codigoRessegurador;
    this.codigoIdentificacaoPessoa = props.codigoIdentificacaoPessoa;
    this.codigoSusep = props.codigoSusep;
    this.tipoPerfil = props.tipoPerfil;
    this.informacaoContaResseguro = props.informacaoContaResseguro;
  }
}
