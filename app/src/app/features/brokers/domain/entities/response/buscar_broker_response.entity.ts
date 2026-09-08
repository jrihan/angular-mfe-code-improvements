import { BankAccountEntity } from 'src/app/shared/domain/entities/bank_account.entity';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';

export class BuscarBrokerResponseEntity {
  public readonly codigoTipoPersona: string;
  public readonly idCliente: string;
  public readonly idDbResseguro: string;
  public readonly situacaoCadastral: string;
  public readonly codigoSusep: number;
  public readonly dadosCadastrais: RegistrationDataEntity;
  public readonly dadosConta: BankAccountEntity[];

  constructor(props: Omit<BuscarBrokerResponseEntity, 'copyWith'>) {
    this.codigoTipoPersona = props.codigoTipoPersona;
    this.idCliente = props.idCliente;
    this.idDbResseguro = props.idDbResseguro;
    this.situacaoCadastral = props.situacaoCadastral;
    this.codigoSusep = props.codigoSusep;
    this.dadosCadastrais = props.dadosCadastrais;
    this.dadosConta = props.dadosConta;
  }
}
