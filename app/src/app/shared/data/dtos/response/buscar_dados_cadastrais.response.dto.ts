import { BankAccountDto } from '../bank_account.dto';
import { RegistrationDataDto } from '../registration_data.dto';

export interface BuscarDadosCadastraisResponseDto {
  id_cliente: string;
  situacao_cadastral: string;
  dados_cadastrais: RegistrationDataDto;
  dados_conta: BankAccountDto[];
}
