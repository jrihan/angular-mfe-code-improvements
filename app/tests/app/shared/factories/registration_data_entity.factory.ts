import { faker } from '@faker-js/faker';
import { RegistrationDataEntity } from '../../../../src/app/shared/domain/entities/registration_data.entity';
import { AddressEntity } from '../../../../src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from '../../../../src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from '../../../../src/app/shared/domain/entities/email.entity';
import { AddressTypeEnum } from '../../../../src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from '../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from '../../../../src/app/shared/domain/enum/mail_purpose.enum';
import { DocumentTypeEnum } from '../../../../src/app/shared/domain/enum/document_type.enum';
import { CountryCodeEnum } from 'src/app/shared/domain/enum/country_code.enum';

export class AddressEntityFactory {
  static create(
    override?: Partial<Omit<AddressEntity, 'copyWith'>>
  ): AddressEntity {
    const pais = override?.pais ?? 'BR';
    // Endereço nacional (BR) não possui regiao/codigoAreaPostal — apenas estrangeiro.
    const isBrasil = pais.trim().toUpperCase() === 'BR';

    return new AddressEntity({
      propositoEndereco:
        override?.propositoEndereco ??
        faker.helpers.arrayElement([
          AddressTypeEnum.PRINCIPAL,
          AddressTypeEnum.COMERCIAL,
          AddressTypeEnum.OUTROS,
        ]),
      logradouro: override?.logradouro ?? faker.location.street(),
      numero: override?.numero ?? faker.string.numeric(3),
      complemento: override?.complemento ?? faker.location.secondaryAddress(),
      bairro: override?.bairro ?? faker.location.county(),
      cep: override?.cep ?? faker.location.zipCode('########'),
      cidade: override?.cidade ?? faker.location.city(),
      uf: override?.uf ?? faker.location.state({ abbreviated: true }),
      pais,
      regiao:
        override?.regiao ?? (isBrasil ? undefined : faker.location.state()),
      codigoAreaPostal:
        override?.codigoAreaPostal ??
        (isBrasil ? undefined : faker.location.zipCode('#####')),
    });
  }

  static createList(
    count = 1,
    override?: Partial<Omit<AddressEntity, 'copyWith'>>
  ): AddressEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}

export class PhoneEntityFactory {
  static create(
    override?: Partial<Omit<PhoneEntity, 'copyWith'>>
  ): PhoneEntity {
    return new PhoneEntity({
      propositoTelefone:
        override?.propositoTelefone ??
        faker.helpers.arrayElement([
          PhonePurposeEnum.COMERCIAL,
          PhonePurposeEnum.PRINCIPAL,
          PhonePurposeEnum.OUTROS,
        ]),
      tipoTelefone:
        override?.tipoTelefone ??
        faker.helpers.arrayElement([PhoneTypeEnum.FIXO, PhoneTypeEnum.MOVEL]),
      ddi: override?.ddi ?? 55,
      ddd: override?.ddd ?? faker.number.int({ min: 11, max: 99 }),
      numero:
        override?.numero ??
        faker.number.int({ min: 900000000, max: 999999999 }),
      nomeContato: override?.nomeContato ?? faker.person.fullName(),
    });
  }

  static createList(
    count = 1,
    override?: Partial<Omit<PhoneEntity, 'copyWith'>>
  ): PhoneEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}

export class EmailEntityFactory {
  static create(
    override?: Partial<Omit<EmailEntity, 'copyWith'>>
  ): EmailEntity {
    return new EmailEntity({
      propositoEmail:
        override?.propositoEmail ??
        faker.helpers.arrayElement([
          MailPurposeEnum.PRINCIPAL,
          MailPurposeEnum.OUTROS,
        ]),
      email: override?.email ?? faker.internet.email(),
      nomeContato: override?.nomeContato ?? faker.person.fullName(),
    });
  }

  static createList(
    count = 1,
    override?: Partial<Omit<EmailEntity, 'copyWith'>>
  ): EmailEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}

export class RegistrationDataEntityFactory {
  static create(
    override?: Partial<Omit<RegistrationDataEntity, 'copyWith'>>
  ): RegistrationDataEntity {
    const randomDocumentType: DocumentTypeEnum = faker.helpers.arrayElement([
      DocumentTypeEnum.CNPJ,
      DocumentTypeEnum.CGI,
      DocumentTypeEnum.NIF,
    ]);
    const documentTypeEnum = override?.tipoDocumento ?? randomDocumentType;

    const documentNumber =
      documentTypeEnum === DocumentTypeEnum.CNPJ
        ? faker.string.numeric(14)
        : faker.string.numeric(9);

    return new RegistrationDataEntity({
      nomeCompleto: override?.nomeCompleto ?? faker.company.name(),
      nomeFantasia: override?.nomeFantasia ?? faker.company.buzzPhrase(),
      tipoDocumento: override?.tipoDocumento ?? documentTypeEnum,
      numeroDocumento: override?.numeroDocumento ?? documentNumber,
      pais:
        override?.pais ??
        faker.helpers.arrayElement(Object.values(CountryCodeEnum)),
      enderecos: override?.enderecos ?? AddressEntityFactory.createList(1),
      telefones: override?.telefones ?? PhoneEntityFactory.createList(1),
      emails: override?.emails ?? EmailEntityFactory.createList(1),
    });
  }
}
