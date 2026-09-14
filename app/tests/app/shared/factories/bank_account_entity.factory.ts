import { faker } from '@faker-js/faker';
import { BankAccountEntity } from '../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../src/app/shared/domain/enum/bank_account_type.enum';

export class BankAccountEntityFactory {
  static create(
    override?: Partial<Omit<BankAccountEntity, 'copyWith' | 'isInternational'>>,
    isInternational = false,
  ): BankAccountEntity {
    return new BankAccountEntity({
      contaSelecionada: override?.hasOwnProperty('contaSelecionada')
        ? override.contaSelecionada
        : faker.datatype.boolean(),
      codigoBanco:
        override?.codigoBanco ??
        (isInternational
          ? ''
          : faker.helpers.arrayElement(['341', '001', '033', '104'])),
      codigoAgencia:
        override?.codigoAgencia ?? (isInternational ? '' : faker.string.numeric(4)),
      codigoTipoConta:
        override?.codigoTipoConta ??
        (isInternational
          ? BankAccountTypeEnum.CONTA_CORRENTE
          : faker.helpers.arrayElement([
              BankAccountTypeEnum.CONTA_CORRENTE,
              BankAccountTypeEnum.CONTA_POUPANCA,
              BankAccountTypeEnum.CONTA_PAGAMENTO,
              BankAccountTypeEnum.CONTA_INVESTIMENTO,
            ])),
      codigoConta:
        override?.codigoConta ??
        (isInternational
          ? ''
          : faker.string.numeric({ length: { min: 5, max: 10 } })),
      dac: override?.dac ?? (isInternational ? '' : faker.string.numeric(1)),
      iban:
        override?.iban ??
        (isInternational ? 'PT50000201231234567890154' : undefined),
      swift:
        override?.swift ?? (isInternational ? 'DEUTDEFF500' : undefined),
    });
  }

  static createList(
    count = 2,
    isInternationalOrOverride:
      | boolean
      | Partial<Omit<BankAccountEntity, 'copyWith' | 'isInternational'>> = false,
    override?: Partial<Omit<BankAccountEntity, 'copyWith' | 'isInternational'>>
  ): BankAccountEntity[] {
    const isInternational =
      typeof isInternationalOrOverride === 'boolean'
        ? isInternationalOrOverride
        : false;
    const resolvedOverride =
      typeof isInternationalOrOverride === 'boolean'
        ? override
        : isInternationalOrOverride;

    return Array.from({ length: count }, (_, index) =>
      this.create({
        contaSelecionada: index === 0,
        ...resolvedOverride,
      }, isInternational && faker.datatype.boolean())
    );
  }
}
