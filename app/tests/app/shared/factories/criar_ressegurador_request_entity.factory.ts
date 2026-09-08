import { faker } from '@faker-js/faker';
import {
  CriarResseguradorRequestEntity,
  ReinsuranceEntity,
} from '../../../../src/app/features/resseguradores/domain/entities/request/criar_ressegurador_request.entity';
import { PersonTypeEnum } from '../../../../src/app/shared/domain/enum/person_type.enum';
import { DocumentTypeEnum } from '../../../../src/app/shared/domain/enum/document_type.enum';
import { BankAccountEntityFactory } from './bank_account_entity.factory';
import { RegistrationDataEntityFactory } from './registration_data_entity.factory';

export class ReinsuranceEntityFactory {
  static create(
    override?: Partial<Omit<ReinsuranceEntity, 'copyWith'>>
  ): ReinsuranceEntity {
    return new ReinsuranceEntity({
      tipoPerfil:
        override?.tipoPerfil ??
        faker.helpers.arrayElement([PersonTypeEnum.F, PersonTypeEnum.J]),
    });
  }
}

export class CriarResseguradorRequestEntityFactory {
  static create(
    override?: Partial<Omit<CriarResseguradorRequestEntity, 'copyWith'>>
  ): CriarResseguradorRequestEntity {
    const rawRegistrationData = RegistrationDataEntityFactory.create();

    // omit tipoDocumento and numeroDocumento as per the Omit type helper in the Entity
    // keep copyWith by keeping referencing the instance or casting
    const restRegistrationData = rawRegistrationData as any;

    return new CriarResseguradorRequestEntity({
      codigoTipoPersona:
        override?.codigoTipoPersona ??
        faker.helpers.arrayElement([PersonTypeEnum.F, PersonTypeEnum.J]),
      tipoDocumento: override?.tipoDocumento ?? DocumentTypeEnum.CNPJ,
      numeroDocumento: override?.numeroDocumento ?? faker.string.numeric(14),
      pais: override?.pais ?? 'BR',
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      ressegurador: override?.ressegurador ?? ReinsuranceEntityFactory.create(),
      dadosConta: override?.dadosConta ?? BankAccountEntityFactory.create(),
      dadosCadastrais: override?.dadosCadastrais ?? restRegistrationData,
    });
  }
}
