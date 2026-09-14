import { faker } from '@faker-js/faker';
import { BuscarResseguradorResponseEntity } from 'src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { ResseguradorProfileTypeEnum } from 'src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';
import { BankAccountEntityFactory } from 'tests/app/shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from 'tests/app/shared/factories/registration_data_entity.factory';

export class BuscarResseguradorResponseEntityFactory {
  static create(
    override?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
  ): BuscarResseguradorResponseEntity {
    return new BuscarResseguradorResponseEntity({
      codigoTipoPersona: override?.codigoTipoPersona ?? 'Ressegurador',
      idCliente: override?.idCliente ?? faker.string.uuid(),
      idDbResseguro:
        override?.idDbResseguro ??
        faker.number.int({ min: 1, max: 999 }).toString(),
      situacaoCadastral:
        override?.situacaoCadastral ??
        faker.helpers.arrayElement(['Ativo', 'Inativo']),
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      tipoPerfil:
        override?.tipoPerfil ??
        faker.helpers.enumValue(ResseguradorProfileTypeEnum),
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
      dadosConta:
        override?.dadosConta ?? BankAccountEntityFactory.createList(10, true),
    });
  }

  static createList(
    count = 3,
    override?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
  ): BuscarResseguradorResponseEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}