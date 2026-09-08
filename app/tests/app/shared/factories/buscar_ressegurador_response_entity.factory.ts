import { faker } from '@faker-js/faker';
import { BuscarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { ResseguradorProfileTypeEnum } from '../../../../src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';
import { BankAccountEntityFactory } from './bank_account_entity.factory';
import { RegistrationDataEntityFactory } from './registration_data_entity.factory';

export class BuscarResseguradorResponseEntityFactory {
  static create(
    override?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
  ): BuscarResseguradorResponseEntity {
    return new BuscarResseguradorResponseEntity({
      codigoTipoPersona:
        override?.codigoTipoPersona ?? faker.helpers.arrayElement(['PF', 'PJ']),
      idCliente: override?.idCliente ?? `cli_${faker.string.numeric(9)}`,
      idDbResseguro: override?.idDbResseguro ?? faker.string.uuid(),
      situacaoCadastral:
        override?.situacaoCadastral ??
        faker.helpers.arrayElement(['ATIVO', 'INATIVO']),
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      tipoPerfil:
        override?.tipoPerfil ??
        faker.helpers.arrayElement([
          ResseguradorProfileTypeEnum.LOCAL,
          ResseguradorProfileTypeEnum.EVENTUAL,
          ResseguradorProfileTypeEnum.ADMITIDA,
        ]),
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
      dadosConta:
        override?.dadosConta ?? BankAccountEntityFactory.createList(1),
    });
  }

  static createList(
    count = 3,
    override?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
  ): BuscarResseguradorResponseEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}
