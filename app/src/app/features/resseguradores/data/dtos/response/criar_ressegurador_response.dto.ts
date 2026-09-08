import { ReinsuranceAccountDto } from '../../../../../shared/data/dtos/reinsurance_account.dto';

export interface CriarResseguradorResponseDto {
  codigo_ressegurador: number;
  codigo_identificacao_pessoa: string;
  codigo_susep: number;
  tipo_perfil: string;
  informacao_conta_resseguro: ReinsuranceAccountDto;
}
