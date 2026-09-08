import { BankAccountDto } from '../../../../../shared/data/dtos/bank_account.dto';
import { RegistrationDataDto } from '../../../../../shared/data/dtos/registration_data.dto';

export interface CriarBrokerRequestDto {
  tipo_pessoa: string;
  tipo_documento: string;
  numero_documento: string;
  pais: string;
  codigo_susep: number;
  dados_conta: BankAccountDto;
  dados_cadastrais: Omit<
    RegistrationDataDto,
    'tipo_documento' | 'numero_documento'
  >;
}
