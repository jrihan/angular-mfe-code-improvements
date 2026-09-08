import { faker } from '@faker-js/faker';
import { BuscarDadosCadastraisResponseEntity } from '../../../../../src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { RegistrationDataEntityFactory } from '../registration_data_entity.factory';
import { BankAccountEntityFactory } from '../bank_account_entity.factory';

export class BuscarDadosCadastraisResponseEntityFactory {
  static create(
    override?: Partial<Omit<BuscarDadosCadastraisResponseEntity, 'copyWith'>>
  ): BuscarDadosCadastraisResponseEntity {
    return new BuscarDadosCadastraisResponseEntity({
      idCliente: override?.idCliente ?? faker.string.uuid(),
      situacaoCadastral: override?.situacaoCadastral ?? 'ATIVA',
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
      dadosConta:
        override?.dadosConta ?? BankAccountEntityFactory.createList(1),
    });
  }
}
