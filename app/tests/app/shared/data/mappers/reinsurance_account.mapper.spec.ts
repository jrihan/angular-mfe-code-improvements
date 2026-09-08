import { ReinsuranceAccountMapper } from '../../../../../src/app/shared/data/mappers/reinsurance_account.mapper';
import { ReinsuranceAccountEntity } from '../../../../../src/app/shared/domain/entities/reinsurance_account.entity';
import { ReinsuranceAccountDto } from '../../../../../src/app/shared/data/dtos/reinsurance_account.dto';

describe('ReinsuranceAccountMapper', () => {
  describe('toEntity', () => {
    it('deve converter um DTO completo em entidade', () => {
      const dto: ReinsuranceAccountDto = {
        agencia: '0001',
        banco: '341',
        codigo_tipo_conta: 'C',
        numero_conta_outra_instituicao_financeira: '12345',
        numero_digito_validador_conta_outra_instituicao_financeira: '9',
        numero_unico_conta: '987654321',
      };

      const entity = ReinsuranceAccountMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(ReinsuranceAccountEntity);
      expect(entity.agencia).toBe('0001');
      expect(entity.banco).toBe('341');
      expect(entity.codigoTipoConta).toBe('C');
      expect(entity.numeroContaOutraInstituicaoFinanceira).toBe('12345');
      expect(entity.numeroDigitoValidadorContaOutraInstituicaoFinanceira).toBe(
        '9'
      );
      expect(entity.numeroUnicoConta).toBe('987654321');
    });

    it('deve usar valores padrão vazios quando os campos estiverem ausentes/nulos', () => {
      const dto = {
        numero_unico_conta: null,
      } as ReinsuranceAccountDto;

      const entity = ReinsuranceAccountMapper.toEntity(dto);

      expect(entity.agencia).toBe('');
      expect(entity.banco).toBe('');
      expect(entity.codigoTipoConta).toBe('');
      expect(entity.numeroContaOutraInstituicaoFinanceira).toBe('');
      expect(entity.numeroDigitoValidadorContaOutraInstituicaoFinanceira).toBe(
        ''
      );
      expect(entity.numeroUnicoConta).toBe('');
    });
  });

  describe('toDto', () => {
    it('deve converter a entidade em DTO', () => {
      const entity = new ReinsuranceAccountEntity({
        agencia: '0001',
        banco: '341',
        codigoTipoConta: 'C',
        numeroContaOutraInstituicaoFinanceira: '12345',
        numeroDigitoValidadorContaOutraInstituicaoFinanceira: '9',
        numeroUnicoConta: '987654321',
      });

      const dto = ReinsuranceAccountMapper.toDto(entity);

      expect(dto).toEqual({
        agencia: '0001',
        banco: '341',
        codigo_tipo_conta: 'C',
        numero_conta_outra_instituicao_financeira: '12345',
        numero_digito_validador_conta_outra_instituicao_financeira: '9',
        numero_unico_conta: '987654321',
      });
    });
  });
});
