import { BuscarDadosCadastraisResponseMapper } from '../../../../../../src/app/shared/data/mappers/response/buscar_dados_cadastrais.response.mapper';
import { BuscarDadosCadastraisResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarDadosCadastraisResponseDto } from '../../../../../../src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { RegistrationDataEntity } from '../../../../../../src/app/shared/domain/entities/registration_data.entity';
import { BankAccountEntity } from '../../../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../../../src/app/shared/domain/enum/bank_account_type.enum';

describe('BuscarDadosCadastraisResponseMapper', () => {
  const dadosCadastraisDto = {
    nome_completo: 'Empresa Teste',
    nome_fantasia: 'Fantasia',
    tipo_documento: 'CNPJ',
    numero_documento: '12345678000190',
    pais: 'Brasil',
    enderecos: [],
    telefones: [],
    emails: [],
  };

  describe('toEntity', () => {
    it('deve converter um DTO completo em entidade', () => {
      const dto: BuscarDadosCadastraisResponseDto = {
        id_cliente: 'CLI-1',
        situacao_cadastral: 'ATIVO',
        dados_cadastrais: dadosCadastraisDto,
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
      };

      const entity = BuscarDadosCadastraisResponseMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(BuscarDadosCadastraisResponseEntity);
      expect(entity.idCliente).toBe('CLI-1');
      expect(entity.situacaoCadastral).toBe('ATIVO');
      expect(entity.dadosCadastrais.nomeCompleto).toBe('Empresa Teste');
      expect(entity.dadosConta).toHaveLength(1);
      expect(entity.dadosConta[0].codigoBanco).toBe('341');
    });

    it('deve usar valores padrão quando id_cliente, situacao e dados_conta estiverem ausentes', () => {
      const dto = {
        dados_cadastrais: dadosCadastraisDto,
      } as unknown as BuscarDadosCadastraisResponseDto;

      const entity = BuscarDadosCadastraisResponseMapper.toEntity(dto);

      expect(entity.idCliente).toBe('');
      expect(entity.situacaoCadastral).toBe('');
      expect(entity.dadosConta).toEqual([]);
    });
  });

  describe('toDto', () => {
    const buildEntity = (
      dadosConta: BankAccountEntity[] | undefined
    ): BuscarDadosCadastraisResponseEntity =>
      new BuscarDadosCadastraisResponseEntity({
        idCliente: 'CLI-1',
        situacaoCadastral: 'ATIVO',
        dadosCadastrais: new RegistrationDataEntity({
          nomeCompleto: 'Empresa Teste',
          nomeFantasia: 'Fantasia',
          tipoDocumento: 'CNPJ',
          numeroDocumento: '12345678000190',
          pais: 'Brasil',
          enderecos: [],
          telefones: [],
          emails: [],
        }),
        dadosConta: dadosConta as any,
      });

    it('deve converter a entidade em DTO', () => {
      const dto = BuscarDadosCadastraisResponseMapper.toDto(
        buildEntity([
          new BankAccountEntity({
            contaSelecionada: true,
            codigoBanco: '341',
            codigoAgencia: '0001',
            codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
            codigoConta: '12345',
            dac: '9',
          }),
        ])
      );

      expect(dto.id_cliente).toBe('CLI-1');
      expect(dto.situacao_cadastral).toBe('ATIVO');
      expect(dto.dados_cadastrais.nome_completo).toBe('Empresa Teste');
      expect(dto.dados_conta).toHaveLength(1);
      expect(dto.dados_conta[0].codigo_banco).toBe('341');
    });

    it('deve usar lista de contas vazia quando dadosConta for indefinido', () => {
      const dto = BuscarDadosCadastraisResponseMapper.toDto(
        buildEntity(undefined)
      );

      expect(dto.dados_conta).toEqual([]);
    });
  });
});
