import { BankAccountDto } from 'src/app/shared/data/dtos/bank_account.dto';
import { RegistrationDataDto } from 'src/app/shared/data/dtos/registration_data.dto';

export interface BuscarResseguradorResponseDto {
  codigo_tipo_persona: string;
  id_cliente: string;
  id_dbresseguro: string;
  situacao_cadastral: string;
  codigo_susep: number;
  tipo_perfil: string;
  dados_cadastrais: RegistrationDataDto;
  dados_conta: BankAccountDto[];
}

export type ResseguradorDto = BuscarResseguradorResponseDto;
