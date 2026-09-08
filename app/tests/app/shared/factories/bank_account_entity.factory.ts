import { faker } from '@faker-js/faker';
import { BankAccountEntity } from '../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../src/app/shared/domain/enum/bank_account_type.enum';

export class BankAccountEntityFactory {
  static create(
    override?: Partial<Omit<BankAccountEntity, 'copyWith'>>
  ): BankAccountEntity {
    return new BankAccountEntity({
      contaSelecionada: override?.hasOwnProperty('contaSelecionada')
        ? override.contaSelecionada
        : faker.datatype.boolean(),
      codigoBanco:
        override?.codigoBanco ??
        faker.helpers.arrayElement(['341', '001', '033', '104']),
      codigoAgencia: override?.codigoAgencia ?? faker.string.numeric(4),
      codigoTipoConta:
        override?.codigoTipoConta ??
        faker.helpers.arrayElement([
          BankAccountTypeEnum.CONTA_CORRENTE,
          BankAccountTypeEnum.CONTA_POUPANCA,
          BankAccountTypeEnum.CONTA_PAGAMENTO,
          BankAccountTypeEnum.CONTA_INVESTIMENTO,
        ]),
      codigoConta:
        override?.codigoConta ??
        faker.string.numeric({ length: { min: 5, max: 10 } }),
      dac: override?.dac ?? faker.string.numeric(1),
    });
  }

  static createList(
    count = 2,
    override?: Partial<Omit<BankAccountEntity, 'copyWith'>>
  ): BankAccountEntity[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        contaSelecionada: index === 0,
        ...override,
      })
    );
  }
}
