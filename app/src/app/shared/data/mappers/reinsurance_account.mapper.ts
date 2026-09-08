import { ReinsuranceAccountEntity } from '../../domain/entities/reinsurance_account.entity';
import { ReinsuranceAccountDto } from '../dtos/reinsurance_account.dto';

export class ReinsuranceAccountMapper {
  static toEntity(dto: ReinsuranceAccountDto): ReinsuranceAccountEntity {
    return new ReinsuranceAccountEntity({
      agencia: dto.agencia || '',
      banco: dto.banco || '',
      codigoTipoConta: dto.codigo_tipo_conta || '',
      numeroContaOutraInstituicaoFinanceira:
        dto.numero_conta_outra_instituicao_financeira || '',
      numeroDigitoValidadorContaOutraInstituicaoFinanceira:
        dto.numero_digito_validador_conta_outra_instituicao_financeira || '',
      numeroUnicoConta: dto.numero_unico_conta || '',
    });
  }

  static toDto(entity: ReinsuranceAccountEntity): ReinsuranceAccountDto {
    return {
      agencia: entity.agencia,
      banco: entity.banco,
      codigo_tipo_conta: entity.codigoTipoConta,
      numero_conta_outra_instituicao_financeira:
        entity.numeroContaOutraInstituicaoFinanceira,
      numero_digito_validador_conta_outra_instituicao_financeira:
        entity.numeroDigitoValidadorContaOutraInstituicaoFinanceira,
      numero_unico_conta: entity.numeroUnicoConta,
    };
  }
}
