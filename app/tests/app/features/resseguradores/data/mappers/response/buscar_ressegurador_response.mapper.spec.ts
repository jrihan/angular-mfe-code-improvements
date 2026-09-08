import {
  BuscarResseguradorResponseMapper,
  ResseguradorMapper,
} from '../../../../../../../src/app/features/resseguradores/data/mappers/response/buscar_ressegurador_response.mapper';
import { BuscarResseguradorResponseDto } from '../../../../../../../src/app/features/resseguradores/data/dtos/response/buscar_ressegurador_response.dto';
import { BuscarResseguradorResponseEntity } from '../../../../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { RegistrationDataEntity } from '../../../../../../../src/app/shared/domain/entities/registration_data.entity';
import { BankAccountEntity } from '../../../../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../../../../src/app/shared/domain/enum/bank_account_type.enum';
import { ResseguradorProfileTypeEnum } from '../../../../../../../src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';

const buildDto = (
  over: Partial<BuscarResseguradorResponseDto> = {}
): BuscarResseguradorResponseDto =>
  ({
    codigo_tipo_persona: 'PJ',
    id_cliente: 'CLI-1',
    id_dbresseguro: 'DB-1',
    situacao_cadastral: 'ATIVO',
    codigo_susep: 12345,
    tipo_perfil: 'LOCAL',
    dados_cadastrais: {} as any,
    dados_conta: [
      {
        conta_selecionada: true,
        codigo_banco: '341',
        codigo_agencia: '0001',
        codigo_tipo_conta: 'C',
        codigo_conta: '12345',
        dac: '9',
      },
    ],
    ...over,
  } as BuscarResseguradorResponseDto);

const buildEntity = (
  dadosConta: BankAccountEntity[]
): BuscarResseguradorResponseEntity =>
  new BuscarResseguradorResponseEntity({
    codigoTipoPersona: 'PJ',
    idCliente: 'CLI-1',
    idDbResseguro: 'DB-1',
    situacaoCadastral: 'ATIVO',
    codigoSusep: 12345,
    tipoPerfil: ResseguradorProfileTypeEnum.LOCAL,
    dadosCadastrais: new RegistrationDataEntity({
      nomeCompleto: 'Empresa',
      nomeFantasia: 'Fantasia',
      tipoDocumento: 'CNPJ',
      numeroDocumento: '12345678000190',
      pais: 'Brasil',
      enderecos: [],
      telefones: [],
      emails: [],
    }),
    dadosConta,
  });

describe('BuscarResseguradorResponseMapper', () => {
  describe('toEntity', () => {
    it('deve lançar erro quando o DTO for inválido', () => {
      expect(() =>
        BuscarResseguradorResponseMapper.toEntity(null as any)
      ).toThrow('DTO inválido para mapeamento.');
    });

    it.each([
      ['LOCAL', ResseguradorProfileTypeEnum.LOCAL],
      ['EVENTUAL', ResseguradorProfileTypeEnum.EVENTUAL],
      ['ADMITIDA', ResseguradorProfileTypeEnum.ADMITIDA],
      ['eventual', ResseguradorProfileTypeEnum.EVENTUAL],
    ])('deve mapear tipo_perfil "%s"', (input, expected) => {
      const entity = BuscarResseguradorResponseMapper.toEntity(
        buildDto({ tipo_perfil: input })
      );
      expect(entity.tipoPerfil).toBe(expected);
    });

    it('deve usar LOCAL quando tipo_perfil estiver vazio', () => {
      const entity = BuscarResseguradorResponseMapper.toEntity(
        buildDto({ tipo_perfil: '' })
      );
      expect(entity.tipoPerfil).toBe(ResseguradorProfileTypeEnum.LOCAL);
    });

    it('deve usar LOCAL quando tipo_perfil for desconhecido', () => {
      const entity = BuscarResseguradorResponseMapper.toEntity(
        buildDto({ tipo_perfil: 'XPTO' })
      );
      expect(entity.tipoPerfil).toBe(ResseguradorProfileTypeEnum.LOCAL);
    });

    it('deve mapear dados_conta quando presente', () => {
      const entity = BuscarResseguradorResponseMapper.toEntity(buildDto());
      expect(entity.dadosConta).toHaveLength(1);
    });

    it('deve retornar lista de contas vazia quando dados_conta estiver ausente', () => {
      const entity = BuscarResseguradorResponseMapper.toEntity(
        buildDto({ dados_conta: null as any })
      );
      expect(entity.dadosConta).toEqual([]);
    });
  });

  describe('toDto', () => {
    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() => BuscarResseguradorResponseMapper.toDto(null as any)).toThrow(
        'Entidade inválida para mapeamento.'
      );
    });

    it('deve mapear a primeira conta quando houver contas', () => {
      const entity = buildEntity([
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ]);

      const dto = BuscarResseguradorResponseMapper.toDto(entity);

      expect(dto.dados_conta).not.toBeNull();
      expect(dto.dados_conta[0].codigo_banco).toBe('341');
    });

    it('deve retornar dados_conta nulo quando não houver contas', () => {
      const dto = BuscarResseguradorResponseMapper.toDto(buildEntity([]));
      expect(dto.dados_conta).toEqual([]);
    });

    it('deve retornar lista de contas vazia quando dadosConta for indefinido', () => {
      const dto = BuscarResseguradorResponseMapper.toDto(
        buildEntity(undefined as any)
      );
      expect(dto.dados_conta).toEqual([]);
    });
  });

  describe('ResseguradorMapper (compatibilidade)', () => {
    it('deve delegar toDto para BuscarResseguradorResponseMapper', () => {
      const dto = ResseguradorMapper.toDto(
        buildEntity([
          new BankAccountEntity({
            contaSelecionada: true,
            codigoBanco: '001',
            codigoAgencia: '0002',
            codigoTipoConta: BankAccountTypeEnum.CONTA_POUPANCA,
            codigoConta: '55555',
            dac: '1',
          }),
        ])
      );
      expect(dto.dados_conta[0].codigo_banco).toBe('001');
    });
  });
});
