import { faker } from '@faker-js/faker';
import { CriarResseguradorRequestEntity, ReinsuranceEntity } from 'src/app/features/resseguradores/domain/entities/request/criar_ressegurador_request.entity';
import { DocumentTypeEnum } from 'src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';
import { BankAccountEntityFactory } from 'tests/app/shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from 'tests/app/shared/factories/registration_data_entity.factory';

export class ReinsuranceEntityFactory {
  static create(
    override?: Partial<Omit<ReinsuranceEntity, 'copyWith'>>
  ): ReinsuranceEntity {
    return new ReinsuranceEntity({
      tipoPerfil: override?.tipoPerfil ?? PersonTypeEnum.J,
    });
  }
}

export class CriarResseguradorRequestFactory {
  static create(
    override?: Partial<Omit<CriarResseguradorRequestEntity, 'copyWith'>>
  ): CriarResseguradorRequestEntity {
    return new CriarResseguradorRequestEntity({
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
      ressegurador:
        override?.ressegurador ?? ReinsuranceEntityFactory.create(),
      dadosConta: override?.dadosConta ?? BankAccountEntityFactory.create(),
      dadosCadastrais:
        override?.dadosCadastrais ?? RegistrationDataEntityFactory.create(),
    });
  }
}