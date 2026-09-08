import { BankAccountMapper } from '../../../../../src/app/shared/data/mappers/bank_account.mapper';
import { BankAccountEntity } from '../../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../../src/app/shared/domain/enum/bank_account_type.enum';
import { BankAccountDto } from '../../../../../src/app/shared/data/dtos/bank_account.dto';

describe('BankAccountMapper', () => {
  describe('toEntity', () => {
    it('deve tolerar DTO nulo', () => {
      const entity = BankAccountMapper.toEntity(null as any);

      expect(entity.codigoBanco).toBe('');
      expect(entity.codigoAgencia).toBe('');
      expect(entity.codigoConta).toBe('');
      expect(entity.dac).toBe('');
      expect(entity.codigoTipoConta).toBe(BankAccountTypeEnum.CONTA_CORRENTE);
    });

    it('deve converter um DTO completo em entidade', () => {
      const dto: BankAccountDto = {
        conta_selecionada: true,
        codigo_banco: '341',
        codigo_agencia: '0001',
        codigo_tipo_conta: 'C',
        codigo_conta: '12345',
        dac: '9',
      };

      const entity = BankAccountMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(BankAccountEntity);
      expect(entity.contaSelecionada).toBe(true);
      expect(entity.codigoBanco).toBe('341');
      expect(entity.codigoAgencia).toBe('0001');
      expect(entity.codigoTipoConta).toBe(BankAccountTypeEnum.CONTA_CORRENTE);
      expect(entity.codigoConta).toBe('12345');
      expect(entity.dac).toBe('9');
    });

    it('deve usar valores padrão quando os campos estiverem ausentes', () => {
      const dto = {} as BankAccountDto;

      const entity = BankAccountMapper.toEntity(dto);

      expect(entity.codigoBanco).toBe('');
      expect(entity.codigoAgencia).toBe('');
      expect(entity.codigoConta).toBe('');
      expect(entity.dac).toBe('');
      expect(entity.codigoTipoConta).toBe(BankAccountTypeEnum.CONTA_CORRENTE);
    });

    it('deve usar tipo_conta como fallback de codigo_tipo_conta', () => {
      const dto: BankAccountDto = {
        codigo_banco: '341',
        codigo_agencia: '0001',
        tipo_conta: 'Conta Poupança',
        codigo_conta: '12345',
        dac: '9',
      };

      const entity = BankAccountMapper.toEntity(dto);

      expect(entity.codigoTipoConta).toBe(BankAccountTypeEnum.CONTA_POUPANCA);
    });
  });

  describe('parseCodigoTipoConta (via toEntity)', () => {
    const build = (tipo: string | undefined): BankAccountEntity =>
      BankAccountMapper.toEntity({
        codigo_banco: '1',
        codigo_agencia: '1',
        codigo_tipo_conta: tipo,
        codigo_conta: '1',
        dac: '1',
      } as BankAccountDto);

    it('deve retornar CONTA_CORRENTE quando o tipo estiver vazio', () => {
      expect(build('').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_CORRENTE
      );
    });

    it.each(['C', 'D', 'N', 'G', 'P', 'I', 'F', 'V'])(
      'deve retornar o código curto válido "%s"',
      (codigo) => {
        expect(build(codigo).codigoTipoConta).toBe(codigo);
      }
    );

    it('deve reconhecer o código curto em minúsculo', () => {
      expect(build('c').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_CORRENTE
      );
    });

    it('deve mapear as descrições textuais', () => {
      expect(build('Conta Corrente').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_CORRENTE
      );
      expect(build('Conta Desativada').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_DESATIVADA
      );
      expect(build('Conta Não Correntista').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_NAO_CORRENTISTA
      );
      expect(build('Conta Nao Correntista').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_NAO_CORRENTISTA
      );
      expect(build('Conta de Pagamento').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_PAGAMENTO
      );
      expect(build('Conta Poupança').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_POUPANCA
      );
      expect(build('Conta Poupanca').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_POUPANCA
      );
      expect(build('Conta Investimento').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_INVESTIMENTO
      );
      expect(build('Conta Financeira').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_FINANCEIRA
      );
      expect(build('Conta Virtual').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_VIRTUAL
      );
    });

    it('deve retornar CONTA_CORRENTE para descrição desconhecida', () => {
      expect(build('Tipo Desconhecido').codigoTipoConta).toBe(
        BankAccountTypeEnum.CONTA_CORRENTE
      );
    });
  });

  describe('toDto', () => {
    it('deve tolerar entidade indefinida', () => {
      const dto = BankAccountMapper.toDto(undefined as any);

      expect(dto).toEqual({
        conta_selecionada: undefined,
        codigo_banco: '',
        codigo_agencia: '',
        codigo_tipo_conta: BankAccountTypeEnum.CONTA_CORRENTE,
        codigo_conta: '',
        dac: '',
      });
    });

    it('deve converter a entidade em DTO', () => {
      const entity = new BankAccountEntity({
        contaSelecionada: true,
        codigoBanco: '341',
        codigoAgencia: '0001',
        codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
        codigoConta: '12345',
        dac: '9',
      });

      const dto = BankAccountMapper.toDto(entity);

      expect(dto).toEqual({
        conta_selecionada: true,
        codigo_banco: '341',
        codigo_agencia: '0001',
        codigo_tipo_conta: BankAccountTypeEnum.CONTA_CORRENTE,
        codigo_conta: '12345',
        dac: '9',
      });
    });
  });
});
