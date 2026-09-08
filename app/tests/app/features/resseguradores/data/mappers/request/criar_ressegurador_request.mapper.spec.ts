import { CriarResseguradorRequestMapper } from '../../../../../../../src/app/features/resseguradores/data/mappers/request/criar_ressegurador_request.mapper';
import {
  CriarResseguradorRequestEntity,
  ReinsuranceEntity,
} from '../../../../../../../src/app/features/resseguradores/domain/entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorRequestDto } from '../../../../../../../src/app/features/resseguradores/data/dtos/request/criar_ressegurador_request.dto';
import { BankAccountEntity } from '../../../../../../../src/app/shared/domain/entities/bank_account.entity';
import { AddressEntity } from '../../../../../../../src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from '../../../../../../../src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from '../../../../../../../src/app/shared/domain/entities/email.entity';
import { PersonTypeEnum } from '../../../../../../../src/app/shared/domain/enum/person_type.enum';
import { DocumentTypeEnum } from '../../../../../../../src/app/shared/domain/enum/document_type.enum';
import { BankAccountTypeEnum } from '../../../../../../../src/app/shared/domain/enum/bank_account_type.enum';
import { AddressTypeEnum } from '../../../../../../../src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from '../../../../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../../../../src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from '../../../../../../../src/app/shared/domain/enum/mail_purpose.enum';

describe('CriarResseguradorRequestMapper', () => {
  describe('toEntity', () => {
    it('deve lançar erro quando o DTO for inválido', () => {
      expect(() =>
        CriarResseguradorRequestMapper.toEntity(null as any)
      ).toThrow('DTO inválido para mapeamento.');
    });

    it('deve converter um DTO completo em entidade', () => {
      const dto: CriarResseguradorRequestDto = {
        tipo_pessoa: 'J',
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000190',
        pais: 'Brasil',
        codigo_susep: 12345,
        ressegurador: { tipo_perfil: 'J' },
        dados_conta: {
          conta_selecionada: true,
          codigo_banco: '341',
          codigo_agencia: '0001',
          codigo_tipo_conta: 'C',
          codigo_conta: '12345',
          dac: '9',
        },
        dados_cadastrais: {
          nome_completo: 'Empresa Teste',
          nome_fantasia: 'Fantasia',
          pais: 'Brasil',
          enderecos: [
            {
              proposito_endereco: 'PRINCIPAL',
              logradouro: 'Rua A',
              numero: '100',
              complemento: '',
              bairro: 'Centro',
              cep: '01001000',
              cidade: 'São Paulo',
              uf: 'SP',
              pais: 'Brasil',
              regiao: '',
              codigo_area_postal: '',
            },
          ],
          telefones: [
            {
              proposito_telefone: 'PRINCIPAL',
              tipo_telefone: 'MOVEL',
              ddi: 55,
              ddd: 11,
              numero: 999999999,
            },
          ],
          emails: [
            {
              proposito_email: 'PRINCIPAL',
              email: 'teste@teste.com',
              nome_contato: 'Maria',
            },
          ],
        } as any,
      };

      const entity = CriarResseguradorRequestMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(CriarResseguradorRequestEntity);
      expect(entity.codigoTipoPersona).toBe('J');
      expect(entity.tipoDocumento).toBe('CNPJ');
      expect(entity.numeroDocumento).toBe('12345678000190');
      expect(entity.pais).toBe('Brasil');
      expect(entity.codigoSusep).toBe(12345);
      expect(entity.ressegurador.tipoPerfil).toBe('J');
      expect(entity.dadosConta.codigoBanco).toBe('341');
      expect(entity.dadosCadastrais.nomeCompleto).toBe('Empresa Teste');
      expect(entity.dadosCadastrais.enderecos).toHaveLength(1);
      expect(entity.dadosCadastrais.telefones).toHaveLength(1);
      expect(entity.dadosCadastrais.emails).toHaveLength(1);
    });

    it('deve usar valores padrão quando os campos e listas estiverem ausentes', () => {
      const dto = {
        codigo_tipo_persona: 'J',
        tipo_documento: 'CNPJ',
        dados_conta: {},
        dados_cadastrais: {},
      } as unknown as CriarResseguradorRequestDto;

      const entity = CriarResseguradorRequestMapper.toEntity(dto);

      expect(entity.numeroDocumento).toBe('');
      expect(entity.pais).toBe('');
      expect(entity.codigoSusep).toBe(0);
      expect(entity.ressegurador.tipoPerfil).toBeUndefined();
      expect(entity.dadosCadastrais.nomeCompleto).toBe('');
      expect(entity.dadosCadastrais.nomeFantasia).toBe('');
      expect(entity.dadosCadastrais.pais).toBe('');
      expect(entity.dadosCadastrais.enderecos).toEqual([]);
      expect(entity.dadosCadastrais.telefones).toEqual([]);
      expect(entity.dadosCadastrais.emails).toEqual([]);
    });

    it('deve ignorar itens nulos nas coleções de dados cadastrais', () => {
      const entity = CriarResseguradorRequestMapper.toEntity({
        tipo_pessoa: 'J',
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000190',
        pais: 'Brasil',
        codigo_susep: 12345,
        ressegurador: { tipo_perfil: 'J' },
        dados_conta: {
          codigo_banco: '341',
          codigo_agencia: '0001',
          codigo_tipo_conta: 'C',
          codigo_conta: '12345',
          dac: '9',
        },
        dados_cadastrais: {
          nome_completo: 'Empresa Teste',
          nome_fantasia: 'Fantasia',
          pais: 'Brasil',
          enderecos: [null as any],
          telefones: [undefined as any],
          emails: [null as any],
        } as any,
      });

      expect(entity.dadosCadastrais.enderecos).toEqual([]);
      expect(entity.dadosCadastrais.telefones).toEqual([]);
      expect(entity.dadosCadastrais.emails).toEqual([]);
    });
  });

  describe('toDto', () => {
    const buildEntity = (
      dadosCadastrais?: any
    ): CriarResseguradorRequestEntity =>
      new CriarResseguradorRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000190',
        pais: 'Brasil',
        codigoSusep: 12345,
        ressegurador: new ReinsuranceEntity({ tipoPerfil: PersonTypeEnum.J }),
        dadosConta: new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
        dadosCadastrais:
          dadosCadastrais ??
          ({
            nomeCompleto: 'Empresa Teste',
            nomeFantasia: 'Fantasia',
            pais: 'Brasil',
            enderecos: [
              new AddressEntity({
                propositoEndereco: AddressTypeEnum.PRINCIPAL,
                logradouro: 'Rua A',
                numero: '100',
                complemento: '',
                bairro: 'Centro',
                cep: '01001000',
                cidade: 'São Paulo',
                uf: 'SP',
                pais: 'Brasil',
                regiao: '',
                codigoAreaPostal: '',
              }),
            ],
            telefones: [
              new PhoneEntity({
                propositoTelefone: PhonePurposeEnum.PRINCIPAL,
                tipoTelefone: PhoneTypeEnum.MOVEL,
                ddi: 55,
                ddd: 11,
                numero: 999999999,
              }),
            ],
            emails: [
              new EmailEntity({
                propositoEmail: MailPurposeEnum.PRINCIPAL,
                email: 'teste@teste.com',
                nomeContato: 'Maria',
              }),
            ],
          } as any),
      });

    it('deve converter uma entidade completa em DTO', () => {
      const dto = CriarResseguradorRequestMapper.toDto(buildEntity());

      expect(dto.tipo_pessoa).toBe(PersonTypeEnum.J);
      expect(dto.tipo_documento).toBe(DocumentTypeEnum.CNPJ);
      expect(dto.numero_documento).toBe('12345678000190');
      expect(dto.pais).toBe('Brasil');
      expect(dto.codigo_susep).toBe(12345);
      expect(dto.ressegurador.tipo_perfil).toBe(PersonTypeEnum.J);
      expect(dto.dados_conta.codigo_banco).toBe('341');
      expect(dto.dados_cadastrais.enderecos).toHaveLength(1);
      expect(dto.dados_cadastrais.telefones).toHaveLength(1);
      expect(dto.dados_cadastrais.emails).toHaveLength(1);
    });

    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() => CriarResseguradorRequestMapper.toDto(null as any)).toThrow(
        'Entidade inválida para mapeamento.'
      );
    });

    it('deve omitir enderecos, telefones e emails quando indefinidos', () => {
      const dto = CriarResseguradorRequestMapper.toDto(
        buildEntity({
          nomeCompleto: 'Sem Listas',
          nomeFantasia: 'NF',
          pais: 'Brasil',
          enderecos: undefined,
          telefones: undefined,
          emails: undefined,
        })
      );

      expect(dto.dados_cadastrais).not.toHaveProperty('enderecos');
      expect(dto.dados_cadastrais).not.toHaveProperty('telefones');
      expect(dto.dados_cadastrais).not.toHaveProperty('emails');
    });

    it('deve ignorar itens nulos nas coleções da entidade', () => {
      const dto = CriarResseguradorRequestMapper.toDto(
        buildEntity({
          nomeCompleto: 'Sem Itens Nulos',
          nomeFantasia: 'NF',
          pais: 'Brasil',
          enderecos: [null as any],
          telefones: [undefined as any],
          emails: [null as any],
        })
      );

      expect(dto.dados_cadastrais.enderecos).toEqual([]);
      expect(dto.dados_cadastrais.telefones).toEqual([]);
      expect(dto.dados_cadastrais.emails).toEqual([]);
    });

    it('deve preencher dados cadastrais com valores padrao quando vierem ausentes', () => {
      const dto = CriarResseguradorRequestMapper.toDto(
        new CriarResseguradorRequestEntity({
          codigoTipoPersona: PersonTypeEnum.J,
          tipoDocumento: DocumentTypeEnum.CNPJ,
          numeroDocumento: '12345678000190',
          pais: 'Brasil',
          codigoSusep: 12345,
          ressegurador: new ReinsuranceEntity({ tipoPerfil: PersonTypeEnum.J }),
          dadosConta: new BankAccountEntity({
            contaSelecionada: true,
            codigoBanco: '341',
            codigoAgencia: '0001',
            codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
            codigoConta: '12345',
            dac: '9',
          }),
          dadosCadastrais: null as any,
        })
      );

      expect(dto.dados_cadastrais.nome_completo).toBe('');
      expect(dto.dados_cadastrais.nome_fantasia).toBe('');
      expect(dto.dados_cadastrais.pais).toBe('');
      expect(dto.dados_cadastrais).not.toHaveProperty('enderecos');
      expect(dto.dados_cadastrais).not.toHaveProperty('telefones');
      expect(dto.dados_cadastrais).not.toHaveProperty('emails');
    });
  });
});
