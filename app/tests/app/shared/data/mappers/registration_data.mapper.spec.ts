import { RegistrationDataMapper } from '../../../../../src/app/shared/data/mappers/registration_data.mapper';
import { RegistrationDataEntity } from '../../../../../src/app/shared/domain/entities/registration_data.entity';
import { RegistrationDataDto } from '../../../../../src/app/shared/data/dtos/registration_data.dto';
import { AddressEntity } from '../../../../../src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from '../../../../../src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from '../../../../../src/app/shared/domain/entities/email.entity';
import { AddressTypeEnum } from '../../../../../src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from '../../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../../src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from '../../../../../src/app/shared/domain/enum/mail_purpose.enum';

describe('RegistrationDataMapper', () => {
  describe('toEntity', () => {
    it('deve tolerar DTO nulo', () => {
      const entity = RegistrationDataMapper.toEntity(null as any);

      expect(entity.nomeCompleto).toBe('');
      expect(entity.nomeFantasia).toBe('');
      expect(entity.tipoDocumento).toBe('');
      expect(entity.numeroDocumento).toBe('');
      expect(entity.pais).toBe('');
      expect(entity.enderecos).toEqual([]);
      expect(entity.telefones).toEqual([]);
      expect(entity.emails).toEqual([]);
    });

    it('deve converter um DTO completo em entidade com listas mapeadas', () => {
      const dto: RegistrationDataDto = {
        nome_completo: 'Empresa Teste',
        nome_fantasia: 'Fantasia',
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000190',
        pais: 'Brasil',
        enderecos: [
          {
            proposito_endereco: 'PRINCIPAL',
            logradouro: 'Rua A',
            numero: '100',
            complemento: 'Sala 1',
            bairro: 'Centro',
            cep: '01001000',
            cidade: 'São Paulo',
            uf: 'SP',
            pais: 'Brasil',
            regiao: 'Sudeste',
            codigo_area_postal: '01',
          },
        ],
        telefones: [
          {
            proposito_telefone: 'COMERCIAL',
            tipo_telefone: 'MOVEL',
            ddi: 55,
            ddd: 11,
            numero: 999999999,
            nome_contato: 'João',
          },
        ],
        emails: [
          {
            proposito_email: 'PRINCIPAL',
            email: 'teste@teste.com',
            nome_contato: 'Maria',
          },
        ],
      };

      const entity = RegistrationDataMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(RegistrationDataEntity);
      expect(entity.nomeCompleto).toBe('Empresa Teste');
      expect(entity.nomeFantasia).toBe('Fantasia');
      expect(entity.tipoDocumento).toBe('CNPJ');
      expect(entity.numeroDocumento).toBe('12345678000190');
      expect(entity.pais).toBe('Brasil');

      expect(entity.enderecos).toHaveLength(1);
      expect(entity.enderecos![0]).toBeInstanceOf(AddressEntity);
      expect(entity.enderecos![0].propositoEndereco).toBe(
        AddressTypeEnum.PRINCIPAL
      );
      expect(entity.enderecos![0].logradouro).toBe('Rua A');

      expect(entity.telefones).toHaveLength(1);
      expect(entity.telefones![0]).toBeInstanceOf(PhoneEntity);
      expect(entity.telefones![0].propositoTelefone).toBe(
        PhonePurposeEnum.COMERCIAL
      );
      expect(entity.telefones![0].tipoTelefone).toBe(PhoneTypeEnum.MOVEL);

      expect(entity.emails).toHaveLength(1);
      expect(entity.emails![0]).toBeInstanceOf(EmailEntity);
      expect(entity.emails![0].propositoEmail).toBe(MailPurposeEnum.PRINCIPAL);
      expect(entity.emails![0].email).toBe('teste@teste.com');
    });

    it('deve usar valores padrão quando os campos e listas estiverem ausentes', () => {
      const entity = RegistrationDataMapper.toEntity({} as RegistrationDataDto);

      expect(entity.nomeCompleto).toBe('');
      expect(entity.nomeFantasia).toBe('');
      expect(entity.tipoDocumento).toBe('');
      expect(entity.numeroDocumento).toBe('');
      expect(entity.pais).toBe('');
      expect(entity.enderecos).toEqual([]);
      expect(entity.telefones).toEqual([]);
      expect(entity.emails).toEqual([]);
    });

    it('deve ignorar itens nulos nas listas do DTO', () => {
      const entity = RegistrationDataMapper.toEntity({
        nome_completo: 'Empresa Teste',
        nome_fantasia: 'Fantasia',
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000190',
        pais: 'Brasil',
        enderecos: [null as any],
        telefones: [undefined as any],
        emails: [null as any],
      });

      expect(entity.enderecos).toEqual([]);
      expect(entity.telefones).toEqual([]);
      expect(entity.emails).toEqual([]);
    });
  });

  describe('toDto', () => {
    const buildEntity = (over: Partial<RegistrationDataEntity> = {}) =>
      new RegistrationDataEntity({
        nomeCompleto: 'Empresa Teste',
        nomeFantasia: 'Fantasia',
        tipoDocumento: 'CNPJ',
        numeroDocumento: '12345678000190',
        pais: 'Brasil',
        enderecos: [
          new AddressEntity({
            propositoEndereco: AddressTypeEnum.PRINCIPAL,
            logradouro: 'Rua A',
            numero: '100',
            complemento: 'Sala 1',
            bairro: 'Centro',
            cep: '01001000',
            cidade: 'São Paulo',
            uf: 'SP',
            pais: 'Brasil',
            regiao: 'Sudeste',
            codigoAreaPostal: '01',
          }),
        ],
        telefones: [
          new PhoneEntity({
            propositoTelefone: PhonePurposeEnum.COMERCIAL,
            tipoTelefone: PhoneTypeEnum.MOVEL,
            ddi: 55,
            ddd: 11,
            numero: 999999999,
            nomeContato: 'João',
          }),
        ],
        emails: [
          new EmailEntity({
            propositoEmail: MailPurposeEnum.PRINCIPAL,
            email: 'teste@teste.com',
            nomeContato: 'Maria',
          }),
        ],
        ...over,
      });

    it('deve converter uma entidade completa em DTO com listas mapeadas', () => {
      const dto = RegistrationDataMapper.toDto(buildEntity());

      expect(dto.nome_completo).toBe('Empresa Teste');
      expect(dto.nome_fantasia).toBe('Fantasia');
      expect(dto.tipo_documento).toBe('CNPJ');
      expect(dto.numero_documento).toBe('12345678000190');
      expect(dto.pais).toBe('Brasil');

      expect(dto.enderecos).toHaveLength(1);
      expect(dto.enderecos![0].logradouro).toBe('Rua A');
      expect(dto.enderecos![0].proposito_endereco).toBe(
        AddressTypeEnum.PRINCIPAL
      );

      expect(dto.telefones).toHaveLength(1);
      expect(dto.telefones![0].ddi).toBe(55);

      expect(dto.emails).toHaveLength(1);
      expect(dto.emails![0].email).toBe('teste@teste.com');
    });

    it('deve usar listas vazias quando enderecos, telefones e emails forem indefinidos', () => {
      const entity = buildEntity({
        enderecos: undefined as any,
        telefones: undefined as any,
        emails: undefined as any,
      });

      const dto = RegistrationDataMapper.toDto(entity);

      expect(dto.enderecos).toEqual([]);
      expect(dto.telefones).toEqual([]);
      expect(dto.emails).toEqual([]);
    });

    it('deve tolerar entidade nula', () => {
      const dto = RegistrationDataMapper.toDto(null as any);

      expect(dto.nome_completo).toBe('');
      expect(dto.nome_fantasia).toBe('');
      expect(dto.tipo_documento).toBe('');
      expect(dto.numero_documento).toBe('');
      expect(dto.pais).toBe('');
      expect(dto.enderecos).toEqual([]);
      expect(dto.telefones).toEqual([]);
      expect(dto.emails).toEqual([]);
    });

    it('deve ignorar itens nulos nas listas da entidade', () => {
      const dto = RegistrationDataMapper.toDto(
        buildEntity({
          enderecos: [null as any],
          telefones: [undefined as any],
          emails: [null as any],
        })
      );

      expect(dto.enderecos).toEqual([]);
      expect(dto.telefones).toEqual([]);
      expect(dto.emails).toEqual([]);
    });
  });
});
