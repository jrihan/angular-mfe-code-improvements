import {
  AddressEntityFactory,
  PhoneEntityFactory,
  EmailEntityFactory,
  RegistrationDataEntityFactory,
} from './registration_data_entity.factory';
import { AddressEntity } from '../../../../src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from '../../../../src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from '../../../../src/app/shared/domain/entities/email.entity';
import { RegistrationDataEntity } from '../../../../src/app/shared/domain/entities/registration_data.entity';
import { AddressTypeEnum } from '../../../../src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from '../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from '../../../../src/app/shared/domain/enum/mail_purpose.enum';
import { DocumentTypeEnum } from '../../../../src/app/shared/domain/enum/document_type.enum';

describe('AddressEntityFactory', () => {
  it('deve gerar um endereço aleatório sem override', () => {
    const entity = AddressEntityFactory.create();

    expect(entity).toBeInstanceOf(AddressEntity);
    expect([
      AddressTypeEnum.PRINCIPAL,
      AddressTypeEnum.COMERCIAL,
      AddressTypeEnum.OUTROS,
    ]).toContain(entity.propositoEndereco);
    expect(entity.logradouro).toBeTruthy();
    expect(entity.numero).toMatch(/^\d{3}$/);
    expect(entity.complemento).toBeTruthy();
    expect(entity.bairro).toBeTruthy();
    expect(entity.cep).toMatch(/^\d{8}$/);
    expect(entity.cidade).toBeTruthy();
    expect(entity.uf).toBeTruthy();
    expect(entity.pais).toBe('BR');
    expect(entity.regiao).toBeUndefined();
    expect(entity.codigoAreaPostal).toBeUndefined();
  });

  it('deve respeitar o override', () => {
    const entity = AddressEntityFactory.create({
      propositoEndereco: AddressTypeEnum.COMERCIAL,
      logradouro: 'Rua A',
      numero: '10',
      complemento: 'Sala 1',
      bairro: 'Centro',
      cep: '01001000',
      cidade: 'São Paulo',
      uf: 'SP',
      pais: 'Argentina',
      regiao: 'Sudeste',
      codigoAreaPostal: '123',
    });

    expect(entity.propositoEndereco).toBe(AddressTypeEnum.COMERCIAL);
    expect(entity.logradouro).toBe('Rua A');
    expect(entity.numero).toBe('10');
    expect(entity.complemento).toBe('Sala 1');
    expect(entity.bairro).toBe('Centro');
    expect(entity.cep).toBe('01001000');
    expect(entity.cidade).toBe('São Paulo');
    expect(entity.uf).toBe('SP');
    expect(entity.pais).toBe('Argentina');
    expect(entity.regiao).toBe('Sudeste');
    expect(entity.codigoAreaPostal).toBe('123');
  });

  it('deve gerar uma lista de endereços', () => {
    const list = AddressEntityFactory.createList(2, { cidade: 'Rio' });

    expect(list).toHaveLength(2);
    list.forEach((item) => expect(item.cidade).toBe('Rio'));
  });

  it('deve gerar a lista padrão de 1 endereço', () => {
    expect(AddressEntityFactory.createList()).toHaveLength(1);
  });
});

describe('PhoneEntityFactory', () => {
  it('deve gerar um telefone aleatório sem override', () => {
    const entity = PhoneEntityFactory.create();

    expect(entity).toBeInstanceOf(PhoneEntity);
    expect([
      PhonePurposeEnum.COMERCIAL,
      PhonePurposeEnum.PRINCIPAL,
      PhonePurposeEnum.OUTROS,
    ]).toContain(entity.propositoTelefone);
    expect([PhoneTypeEnum.FIXO, PhoneTypeEnum.MOVEL]).toContain(
      entity.tipoTelefone
    );
    expect(entity.ddi).toBe(55);
    expect(entity.ddd).toBeGreaterThanOrEqual(11);
    expect(entity.ddd).toBeLessThanOrEqual(99);
    expect(entity.numero).toBeGreaterThanOrEqual(900000000);
    expect(entity.nomeContato).toBeTruthy();
  });

  it('deve respeitar o override', () => {
    const entity = PhoneEntityFactory.create({
      propositoTelefone: PhonePurposeEnum.PRINCIPAL,
      tipoTelefone: PhoneTypeEnum.MOVEL,
      ddi: 1,
      ddd: 21,
      numero: 999999999,
      nomeContato: 'João',
    });

    expect(entity.propositoTelefone).toBe(PhonePurposeEnum.PRINCIPAL);
    expect(entity.tipoTelefone).toBe(PhoneTypeEnum.MOVEL);
    expect(entity.ddi).toBe(1);
    expect(entity.ddd).toBe(21);
    expect(entity.numero).toBe(999999999);
    expect(entity.nomeContato).toBe('João');
  });

  it('deve gerar uma lista de telefones', () => {
    const list = PhoneEntityFactory.createList(3, { ddd: 31 });

    expect(list).toHaveLength(3);
    list.forEach((item) => expect(item.ddd).toBe(31));
  });

  it('deve gerar a lista padrão de 1 telefone', () => {
    expect(PhoneEntityFactory.createList()).toHaveLength(1);
  });
});

describe('EmailEntityFactory', () => {
  it('deve gerar um e-mail aleatório sem override', () => {
    const entity = EmailEntityFactory.create();

    expect(entity).toBeInstanceOf(EmailEntity);
    expect([MailPurposeEnum.PRINCIPAL, MailPurposeEnum.OUTROS]).toContain(
      entity.propositoEmail
    );
    expect(entity.email).toContain('@');
    expect(entity.nomeContato).toBeTruthy();
  });

  it('deve respeitar o override', () => {
    const entity = EmailEntityFactory.create({
      propositoEmail: MailPurposeEnum.OUTROS,
      email: 'teste@teste.com',
      nomeContato: 'Maria',
    });

    expect(entity.propositoEmail).toBe(MailPurposeEnum.OUTROS);
    expect(entity.email).toBe('teste@teste.com');
    expect(entity.nomeContato).toBe('Maria');
  });

  it('deve gerar uma lista de e-mails', () => {
    const list = EmailEntityFactory.createList(2, { nomeContato: 'RH' });

    expect(list).toHaveLength(2);
    list.forEach((item) => expect(item.nomeContato).toBe('RH'));
  });

  it('deve gerar a lista padrão de 1 e-mail', () => {
    expect(EmailEntityFactory.createList()).toHaveLength(1);
  });
});

describe('RegistrationDataEntityFactory', () => {
  it('deve gerar dados cadastrais aleatórios sem override', () => {
    const entity = RegistrationDataEntityFactory.create({
      tipoDocumento: DocumentTypeEnum.CNPJ,
      numeroDocumento: '12345678000199',
    });

    expect(entity).toBeInstanceOf(RegistrationDataEntity);
    expect(entity.nomeCompleto).toBeTruthy();
    expect(entity.nomeFantasia).toBeTruthy();
    expect(entity.tipoDocumento).toBe(DocumentTypeEnum.CNPJ);
    expect(entity.numeroDocumento).toMatch(/^\d{14}$/);
    expect(entity.pais).toHaveLength(2);
    expect(entity.enderecos).toHaveLength(1);
    expect(entity.telefones).toHaveLength(1);
    expect(entity.emails).toHaveLength(1);
  });

  it('deve respeitar o override', () => {
    const endereco = AddressEntityFactory.create();
    const telefone = PhoneEntityFactory.create();
    const email = EmailEntityFactory.create();

    const entity = RegistrationDataEntityFactory.create({
      nomeCompleto: 'Empresa X',
      nomeFantasia: 'X',
      tipoDocumento: DocumentTypeEnum.NIF,
      numeroDocumento: '12345678901234',
      pais: 'Chile',
      enderecos: [endereco],
      telefones: [telefone],
      emails: [email],
    });

    expect(entity.nomeCompleto).toBe('Empresa X');
    expect(entity.nomeFantasia).toBe('X');
    expect(entity.tipoDocumento).toBe(DocumentTypeEnum.NIF);
    expect(entity.numeroDocumento).toBe('12345678901234');
    expect(entity.pais).toBe('Chile');
    expect(entity.enderecos).toEqual([endereco]);
    expect(entity.telefones).toEqual([telefone]);
    expect(entity.emails).toEqual([email]);
  });
});
