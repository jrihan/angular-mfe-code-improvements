import { BankAccountEntity } from 'src/app/shared/domain/entities/bank_account.entity';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { DocumentTypeEnum } from 'src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';

export class CriarBrokerRequestEntity {
  public readonly codigoTipoPersona: PersonTypeEnum;
  public readonly tipoDocumento: DocumentTypeEnum;
  public readonly numeroDocumento: string;
  public readonly pais: string;
  public readonly codigoSusep: number;
  public readonly dadosConta: BankAccountEntity;
  public readonly dadosCadastrais: Omit<
    RegistrationDataEntity,
    'tipoDocumento' | 'numeroDocumento' | 'pais'
  >;

  constructor(props: Omit<CriarBrokerRequestEntity, 'copyWith'>) {
    this.codigoTipoPersona = props.codigoTipoPersona;
    this.tipoDocumento = props.tipoDocumento;
    this.numeroDocumento = props.numeroDocumento;
    this.pais = props.pais;
    this.codigoSusep = props.codigoSusep;
    this.dadosConta = props.dadosConta;
    this.dadosCadastrais = props.dadosCadastrais;
  }
}
