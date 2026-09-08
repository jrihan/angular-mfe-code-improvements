import { faker } from '@faker-js/faker';
import { CriarBrokerResponseEntity } from 'src/app/features/brokers/domain/entities/response/criar_broker_response.entity';
import { ReinsuranceAccountEntity } from 'src/app/shared/domain/entities/reinsurance_account.entity';

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

export class CriarBrokerResponseEntityFactory {
  static create(
    override?: Partial<Omit<CriarBrokerResponseEntity, 'copyWith'>>
  ): CriarBrokerResponseEntity {
    return new CriarBrokerResponseEntity({
      codigoBroker:
        override?.codigoBroker ?? faker.number.int({ min: 1000, max: 9999 }),
      codigoIdentificacaoPessoa:
        override?.codigoIdentificacaoPessoa ??
        `cli_${faker.string.alphanumeric(9)}`,
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      informacaoContaResseguro:
        override?.informacaoContaResseguro ??
        ReinsuranceAccountEntityFactory.create(),
    });
  }
}
