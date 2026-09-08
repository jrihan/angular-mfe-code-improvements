import { BankAccountEntity } from '../bank_account.entity';
import { RegistrationDataEntity } from '../registration_data.entity';

export class BuscarDadosCadastraisResponseEntity {
  public readonly idCliente: string;
  public readonly situacaoCadastral: string;
  public readonly dadosCadastrais: RegistrationDataEntity;
  public readonly dadosConta: BankAccountEntity[];

  constructor(props: Omit<BuscarDadosCadastraisResponseEntity, 'copyWith'>) {
    this.idCliente = props.idCliente;
    this.situacaoCadastral = props.situacaoCadastral;
    this.dadosCadastrais = props.dadosCadastrais;
    this.dadosConta = props.dadosConta;
  }
}
