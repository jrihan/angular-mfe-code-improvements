import { ReinsuranceAccountDto } from '../../../../../shared/data/dtos/reinsurance_account.dto';

export interface CriarBrokerResponseDto {
  codigo_broker: number;
  codigo_identificacao_pessoa: string;
  codigo_susep: number;
  informacao_conta_resseguro: ReinsuranceAccountDto;
}
