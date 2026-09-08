import { ResseguradorProfileTypeEnum } from '../../enums/ressegurador_profile_type.enum';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { BankAccountEntity } from 'src/app/shared/domain/entities/bank_account.entity';

export class BuscarResseguradorResponseEntity {
  public readonly codigoTipoPersona: string;
  public readonly idCliente: string;
  public readonly idDbResseguro: string;
  public readonly situacaoCadastral: string;
  public readonly codigoSusep: number;
  public readonly tipoPerfil: ResseguradorProfileTypeEnum;
  public readonly dadosCadastrais: RegistrationDataEntity;
  public readonly dadosConta: BankAccountEntity[];

  constructor(props: Omit<BuscarResseguradorResponseEntity, 'copyWith'>) {
    this.codigoTipoPersona = props.codigoTipoPersona;
    this.idCliente = props.idCliente;
    this.idDbResseguro = props.idDbResseguro;
    this.situacaoCadastral = props.situacaoCadastral;
    this.codigoSusep = props.codigoSusep;
    this.tipoPerfil = props.tipoPerfil;
    this.dadosCadastrais = props.dadosCadastrais;
    this.dadosConta = props.dadosConta;
  }
}
