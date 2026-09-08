import { BuscarResseguradorResponseEntityFactory } from './buscar_ressegurador_response_entity.factory';
import { BuscarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { ResseguradorProfileTypeEnum } from '../../../../src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';
import { RegistrationDataEntityFactory } from './registration_data_entity.factory';
import { BankAccountEntityFactory } from './bank_account_entity.factory';

describe('BuscarResseguradorResponseEntityFactory', () => {
  describe('create', () => {
    it('deve gerar uma entidade com valores aleatórios sem override', () => {
      const entity = BuscarResseguradorResponseEntityFactory.create();

      expect(entity).toBeInstanceOf(BuscarResseguradorResponseEntity);
      expect(['PF', 'PJ']).toContain(entity.codigoTipoPersona);
      expect(entity.idCliente).toMatch(/^cli_\d{9}$/);
      expect(entity.idDbResseguro).toBeTruthy();
      expect(['ATIVO', 'INATIVO']).toContain(entity.situacaoCadastral);
      expect(entity.codigoSusep).toBeGreaterThanOrEqual(10000);
      expect(entity.codigoSusep).toBeLessThanOrEqual(99999);
      expect([
        ResseguradorProfileTypeEnum.LOCAL,
        ResseguradorProfileTypeEnum.EVENTUAL,
        ResseguradorProfileTypeEnum.ADMITIDA,
      ]).toContain(entity.tipoPerfil);
      expect(entity.dadosCadastrais).toBeDefined();
      expect(entity.dadosConta).toHaveLength(1);
    });

    it('deve respeitar todos os valores do override', () => {
      const dadosCadastrais = RegistrationDataEntityFactory.create();
      const dadosConta = BankAccountEntityFactory.createList(2);

      const entity = BuscarResseguradorResponseEntityFactory.create({
        codigoTipoPersona: 'PJ',
        idCliente: 'cli_000000001',
        idDbResseguro: 'db-1',
        situacaoCadastral: 'ATIVO',
        codigoSusep: 12345,
        tipoPerfil: ResseguradorProfileTypeEnum.EVENTUAL,
        dadosCadastrais,
        dadosConta,
      });

      expect(entity.codigoTipoPersona).toBe('PJ');
      expect(entity.idCliente).toBe('cli_000000001');
      expect(entity.idDbResseguro).toBe('db-1');
      expect(entity.situacaoCadastral).toBe('ATIVO');
      expect(entity.codigoSusep).toBe(12345);
      expect(entity.tipoPerfil).toBe(ResseguradorProfileTypeEnum.EVENTUAL);
      expect(entity.dadosCadastrais).toBe(dadosCadastrais);
      expect(entity.dadosConta).toBe(dadosConta);
    });
  });

  describe('createList', () => {
    it('deve gerar a lista padrão de 3 entidades', () => {
      expect(BuscarResseguradorResponseEntityFactory.createList()).toHaveLength(
        3
      );
    });

    it('deve gerar a quantidade informada aplicando o override', () => {
      const list = BuscarResseguradorResponseEntityFactory.createList(2, {
        situacaoCadastral: 'INATIVO',
      });

      expect(list).toHaveLength(2);
      list.forEach((item) => expect(item.situacaoCadastral).toBe('INATIVO'));
    });
  });
});
