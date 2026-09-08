import { faker } from '@faker-js/faker';
import { CriarBrokerRequestEntity } from 'src/app/features/brokers/domain/entities/request/criar_broker_request.entity';
import { DocumentTypeEnum } from 'src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';
import { BankAccountEntityFactory } from 'tests/app/shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from 'tests/app/shared/factories/registration_data_entity.factory';

export class CriarBrokerRequestFactory {
  static create(
    override?: Partial<Omit<CriarBrokerRequestEntity, 'copyWith'>>
  ) {
    return new CriarBrokerRequestEntity({
      codigoTipoPersona:
        override?.codigoTipoPersona ??
        faker.helpers.arrayElement([PersonTypeEnum.F, PersonTypeEnum.J]),
      tipoDocumento:
        override?.tipoDocumento ??
        faker.helpers.arrayElement([
          DocumentTypeEnum.CNPJ,
          DocumentTypeEnum.CGI,
          DocumentTypeEnum.NIF,
        ]),
      numeroDocumento: override?.numeroDocumento ?? faker.string.numeric(14),
      pais: override?.pais ?? 'BR',
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      dadosConta: override?.dadosConta ?? BankAccountEntityFactory.create(),
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
    });
  }
}
