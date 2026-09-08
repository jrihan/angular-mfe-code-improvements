import { BankAccountEntityFactory } from './bank_account_entity.factory';
import { BankAccountEntity } from '../../../../src/app/shared/domain/entities/bank_account.entity';
import { BankAccountTypeEnum } from '../../../../src/app/shared/domain/enum/bank_account_type.enum';

describe('BankAccountEntityFactory', () => {
  describe('create', () => {
    it('deve gerar uma entidade com valores aleatórios quando não houver override', () => {
      const entity = BankAccountEntityFactory.create();

      expect(entity).toBeInstanceOf(BankAccountEntity);
      expect(typeof entity.contaSelecionada).toBe('boolean');
      expect(['341', '001', '033', '104']).toContain(entity.codigoBanco);
      expect(entity.codigoAgencia).toMatch(/^\d{4}$/);
      expect([
        BankAccountTypeEnum.CONTA_CORRENTE,
        BankAccountTypeEnum.CONTA_POUPANCA,
        BankAccountTypeEnum.CONTA_PAGAMENTO,
        BankAccountTypeEnum.CONTA_INVESTIMENTO,
      ]).toContain(entity.codigoTipoConta);
      expect(entity.codigoConta).toMatch(/^\d{5,10}$/);
      expect(entity.dac).toMatch(/^\d$/);
    });

    it('deve respeitar todos os valores informados no override', () => {
      const entity = BankAccountEntityFactory.create({
        contaSelecionada: false,
        codigoBanco: '999',
        codigoAgencia: '1234',
        codigoTipoConta: BankAccountTypeEnum.CONTA_POUPANCA,
        codigoConta: '55555',
        dac: '7',
      });

      expect(entity.contaSelecionada).toBe(false);
      expect(entity.codigoBanco).toBe('999');
      expect(entity.codigoAgencia).toBe('1234');
      expect(entity.codigoTipoConta).toBe(BankAccountTypeEnum.CONTA_POUPANCA);
      expect(entity.codigoConta).toBe('55555');
      expect(entity.dac).toBe('7');
    });

    it('deve gerar contaSelecionada aleatória quando override não possuir a propriedade', () => {
      const entity = BankAccountEntityFactory.create({ codigoBanco: '341' });

      expect(entity.codigoBanco).toBe('341');
      expect(typeof entity.contaSelecionada).toBe('boolean');
    });
  });

  describe('createList', () => {
    it('deve gerar a lista padrão de 2 contas marcando a primeira como selecionada', () => {
      const list = BankAccountEntityFactory.createList();

      expect(list).toHaveLength(2);
      expect(list[0].contaSelecionada).toBe(true);
      expect(list[1].contaSelecionada).toBe(false);
    });

    it('deve gerar a quantidade informada aplicando o override', () => {
      const list = BankAccountEntityFactory.createList(3, {
        codigoBanco: '888',
      });

      expect(list).toHaveLength(3);
      list.forEach((item) => expect(item.codigoBanco).toBe('888'));
      expect(list[0].contaSelecionada).toBe(true);
      expect(list[1].contaSelecionada).toBe(false);
    });
  });
});
