import { BuscarBrokerResponseEntity } from 'src/app/features/brokers/domain/entities/response/buscar_broker_response.entity';
import { faker } from '@faker-js/faker';
import { RegistrationDataEntityFactory } from 'tests/app/shared/factories/registration_data_entity.factory';
import { BankAccountEntityFactory } from 'tests/app/shared/factories/bank_account_entity.factory';

export class BuscarBrokerResponseEntityFactory {
  static create(
    override?: Partial<Omit<BuscarBrokerResponseEntity, 'copyWith'>>
  ): BuscarBrokerResponseEntity {
    return new BuscarBrokerResponseEntity({
      codigoTipoPersona: override?.codigoTipoPersona ?? 'Broker',
      idCliente: override?.idCliente ?? faker.string.uuid(),
      idDbResseguro:
        override?.idDbResseguro ??
        faker.number.int({ min: 1, max: 999 }).toString(),
      situacaoCadastral:
        override?.situacaoCadastral ??
        faker.helpers.arrayElement(['Ativo', 'Inativo']),
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
      dadosConta:
        override?.dadosConta ?? BankAccountEntityFactory.createList(1),
    });
  }

  static createList(
    count = 3,
    override?: Partial<Omit<BuscarBrokerResponseEntity, 'copyWith'>>
  ): BuscarBrokerResponseEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}
