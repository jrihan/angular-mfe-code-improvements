import { faker } from '@faker-js/faker';
import { CriarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/criar_ressegurador_response.entity';
import { ReinsuranceAccountEntity } from '../../../../src/app/shared/domain/entities/reinsurance_account.entity';
import { ProfileTypeEnum } from '../../../../src/app/shared/domain/enum/profile_type.enum';

export class ReinsuranceAccountEntityFactory {
  static create(
    override?: Partial<Omit<ReinsuranceAccountEntity, 'copyWith'>>
  ): ReinsuranceAccountEntity {
    return new ReinsuranceAccountEntity({
      agencia: override?.agencia ?? faker.string.numeric(4),
      banco:
        override?.banco ?? faker.helpers.arrayElement(['341', '001', '033']),
      codigoTipoConta: override?.codigoTipoConta ?? 'C',
      numeroContaOutraInstituicaoFinanceira:
        override?.numeroContaOutraInstituicaoFinanceira ??
        faker.finance.accountNumber(),
      numeroDigitoValidadorContaOutraInstituicaoFinanceira:
        override?.numeroDigitoValidadorContaOutraInstituicaoFinanceira ??
        faker.string.numeric(1),
      numeroUnicoConta:
        override && override.hasOwnProperty('numeroUnicoConta')
          ? override.numeroUnicoConta ?? null
          : faker.string.numeric(9),
    });
  }
}

export class CriarResseguradorResponseEntityFactory {
  static create(
    override?: Partial<Omit<CriarResseguradorResponseEntity, 'copyWith'>>
  ): CriarResseguradorResponseEntity {
    return new CriarResseguradorResponseEntity({
      codigoRessegurador:
        override?.codigoRessegurador ??
        faker.number.int({ min: 1000, max: 9999 }),
      codigoIdentificacaoPessoa:
        override?.codigoIdentificacaoPessoa ??
        `cli_${faker.string.alphanumeric(9)}`,
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      tipoPerfil:
        override?.tipoPerfil ??
        faker.helpers.arrayElement([
          ProfileTypeEnum.ADMITIDA,
          ProfileTypeEnum.EVENTUAL,
          ProfileTypeEnum.LOCAL,
        ]),
      informacaoContaResseguro:
        override?.informacaoContaResseguro ??
        ReinsuranceAccountEntityFactory.create(),
    });
  }
}
