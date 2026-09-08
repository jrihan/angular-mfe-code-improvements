import {
  ReinsuranceEntityFactory,
  CriarResseguradorRequestEntityFactory,
} from './criar_ressegurador_request_entity.factory';
import {
  CriarResseguradorRequestEntity,
  ReinsuranceEntity,
} from '../../../../src/app/features/resseguradores/domain/entities/request/criar_ressegurador_request.entity';
import { PersonTypeEnum } from '../../../../src/app/shared/domain/enum/person_type.enum';
import { DocumentTypeEnum } from '../../../../src/app/shared/domain/enum/document_type.enum';
import { BankAccountEntityFactory } from './bank_account_entity.factory';
import { RegistrationDataEntityFactory } from './registration_data_entity.factory';

describe('ReinsuranceEntityFactory', () => {
  it('deve gerar uma entidade com tipoPerfil aleatório sem override', () => {
    const entity = ReinsuranceEntityFactory.create();

    expect(entity).toBeInstanceOf(ReinsuranceEntity);
    expect([PersonTypeEnum.F, PersonTypeEnum.J]).toContain(entity.tipoPerfil);
  });

  it('deve respeitar o override', () => {
    const entity = ReinsuranceEntityFactory.create({
      tipoPerfil: PersonTypeEnum.F,
    });

    expect(entity.tipoPerfil).toBe(PersonTypeEnum.F);
  });
});

describe('CriarResseguradorRequestEntityFactory', () => {
  it('deve gerar uma entidade com valores aleatórios sem override', () => {
    const entity = CriarResseguradorRequestEntityFactory.create();

    expect(entity).toBeInstanceOf(CriarResseguradorRequestEntity);
    expect([PersonTypeEnum.F, PersonTypeEnum.J]).toContain(
      entity.codigoTipoPersona
    );
    expect(entity.tipoDocumento).toBe(DocumentTypeEnum.CNPJ);
    expect(entity.numeroDocumento).toMatch(/^\d{14}$/);
    expect(entity.pais).toBe('BR');
    expect(entity.codigoSusep).toBeGreaterThanOrEqual(10000);
    expect(entity.codigoSusep).toBeLessThanOrEqual(99999);
    expect(entity.ressegurador).toBeInstanceOf(ReinsuranceEntity);
    expect(entity.dadosConta).toBeDefined();
    expect(entity.dadosCadastrais).toBeDefined();
  });

  it('deve respeitar todos os valores do override', () => {
    const ressegurador = ReinsuranceEntityFactory.create({
      tipoPerfil: PersonTypeEnum.J,
    });
    const dadosConta = BankAccountEntityFactory.create();
    const dadosCadastrais = RegistrationDataEntityFactory.create() as any;

    const entity = CriarResseguradorRequestEntityFactory.create({
      codigoTipoPersona: PersonTypeEnum.F,
      tipoDocumento: DocumentTypeEnum.NIF,
      numeroDocumento: '99999999999999',
      pais: 'Uruguai',
      codigoSusep: 54321,
      ressegurador,
      dadosConta,
      dadosCadastrais,
    });

    expect(entity.codigoTipoPersona).toBe(PersonTypeEnum.F);
    expect(entity.tipoDocumento).toBe(DocumentTypeEnum.NIF);
    expect(entity.numeroDocumento).toBe('99999999999999');
    expect(entity.pais).toBe('Uruguai');
    expect(entity.codigoSusep).toBe(54321);
    expect(entity.ressegurador).toBe(ressegurador);
    expect(entity.dadosConta).toBe(dadosConta);
    expect(entity.dadosCadastrais).toBe(dadosCadastrais);
  });
});
