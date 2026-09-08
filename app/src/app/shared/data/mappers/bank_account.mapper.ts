import { BankAccountEntity } from '../../domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../domain/enum/bank_account_type.enum';
import { BankAccountDto } from '../dtos/bank_account.dto';

export class BankAccountMapper {
  static toEntity(dto: BankAccountDto | null | undefined): BankAccountEntity {
    return new BankAccountEntity({
      contaSelecionada: dto?.conta_selecionada,
      codigoBanco: dto?.codigo_banco || '',
      codigoAgencia: dto?.codigo_agencia || '',
      codigoTipoConta: BankAccountMapper.parseCodigoTipoConta(
        dto?.codigo_tipo_conta || dto?.tipo_conta || ''
      ),
      codigoConta: dto?.codigo_conta || '',
      dac: dto?.dac || '',
    });
  }

  static toDto(entity: BankAccountEntity | null | undefined): BankAccountDto {
    return {
      conta_selecionada: entity?.contaSelecionada,
      codigo_banco: entity?.codigoBanco || '',
      codigo_agencia: entity?.codigoAgencia || '',
      codigo_tipo_conta:
        entity?.codigoTipoConta || BankAccountTypeEnum.CONTA_CORRENTE,
      codigo_conta: entity?.codigoConta || '',
      dac: entity?.dac || '',
    };
  }

  private static parseCodigoTipoConta(tipoConta: string): BankAccountTypeEnum {
    if (!tipoConta) return BankAccountTypeEnum.CONTA_CORRENTE;
    const normalized = tipoConta.trim().toUpperCase();

    // Se já for um código curto válido de 1 caracter
    if (['C', 'D', 'N', 'G', 'P', 'I', 'F', 'V'].includes(normalized)) {
      return normalized as BankAccountTypeEnum;
    }

    // Mapeia strings descritivas
    const desc = normalized.toLowerCase();
    if (desc.includes('corrente')) return BankAccountTypeEnum.CONTA_CORRENTE;
    if (desc.includes('desativada'))
      return BankAccountTypeEnum.CONTA_DESATIVADA;
    if (desc.includes('não correntista') || desc.includes('nao correntista'))
      return BankAccountTypeEnum.CONTA_NAO_CORRENTISTA;
    if (desc.includes('pagamento')) return BankAccountTypeEnum.CONTA_PAGAMENTO;
    if (desc.includes('poupança') || desc.includes('poupanca'))
      return BankAccountTypeEnum.CONTA_POUPANCA;
    if (desc.includes('investimento'))
      return BankAccountTypeEnum.CONTA_INVESTIMENTO;
    if (desc.includes('financeira'))
      return BankAccountTypeEnum.CONTA_FINANCEIRA;
    if (desc.includes('virtual')) return BankAccountTypeEnum.CONTA_VIRTUAL;

    return BankAccountTypeEnum.CONTA_CORRENTE;
  }
}
