import {
  ReinsuranceAccountEntityFactory,
  CriarResseguradorResponseEntityFactory,
} from './criar_ressegurador_response_entity.factory';
import { ReinsuranceAccountEntity } from '../../../../src/app/shared/domain/entities/reinsurance_account.entity';
import { CriarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/criar_ressegurador_response.entity';
import { ProfileTypeEnum } from '../../../../src/app/shared/domain/enum/profile_type.enum';

describe('ReinsuranceAccountEntityFactory', () => {
  it('deve gerar valores aleatórios sem override (numeroUnicoConta gerado)', () => {
    const entity = ReinsuranceAccountEntityFactory.create();

    expect(entity).toBeInstanceOf(ReinsuranceAccountEntity);
    expect(entity.agencia).toMatch(/^\d{4}$/);
    expect(['341', '001', '033']).toContain(entity.banco);
    expect(entity.codigoTipoConta).toBe('C');
    expect(entity.numeroContaOutraInstituicaoFinanceira).toBeTruthy();
    expect(entity.numeroDigitoValidadorContaOutraInstituicaoFinanceira).toMatch(
      /^\d$/
    );
    expect(entity.numeroUnicoConta).toMatch(/^\d{9}$/);
  });

  it('deve respeitar todos os valores do override', () => {
    const entity = ReinsuranceAccountEntityFactory.create({
      agencia: '4321',
      banco: '104',
      codigoTipoConta: 'CP',
      numeroContaOutraInstituicaoFinanceira: '12345',
      numeroDigitoValidadorContaOutraInstituicaoFinanceira: '2',
      numeroUnicoConta: '987654321',
    });

    expect(entity.agencia).toBe('4321');
    expect(entity.banco).toBe('104');
    expect(entity.codigoTipoConta).toBe('CP');
    expect(entity.numeroContaOutraInstituicaoFinanceira).toBe('12345');
    expect(entity.numeroDigitoValidadorContaOutraInstituicaoFinanceira).toBe(
      '2'
    );
    expect(entity.numeroUnicoConta).toBe('987654321');
  });

  it('deve permitir numeroUnicoConta nulo explicitamente no override', () => {
    const entity = ReinsuranceAccountEntityFactory.create({
      numeroUnicoConta: null,
    });

    expect(entity.numeroUnicoConta).toBeNull();
  });

  it('deve gerar numeroUnicoConta aleatório quando o override não possui a propriedade', () => {
    const entity = ReinsuranceAccountEntityFactory.create({ banco: '341' });

    expect(entity.banco).toBe('341');
    expect(entity.numeroUnicoConta).toMatch(/^\d{9}$/);
  });
});

describe('CriarResseguradorResponseEntityFactory', () => {
  it('deve gerar valores aleatórios sem override', () => {
    const entity = CriarResseguradorResponseEntityFactory.create();

    expect(entity).toBeInstanceOf(CriarResseguradorResponseEntity);
    expect(entity.codigoRessegurador).toBeGreaterThanOrEqual(1000);
    expect(entity.codigoRessegurador).toBeLessThanOrEqual(9999);
    expect(entity.codigoIdentificacaoPessoa).toMatch(/^cli_[a-zA-Z0-9]{9}$/);
    expect(entity.codigoSusep).toBeGreaterThanOrEqual(10000);
    expect(entity.codigoSusep).toBeLessThanOrEqual(99999);
    expect([
      ProfileTypeEnum.ADMITIDA,
      ProfileTypeEnum.EVENTUAL,
      ProfileTypeEnum.LOCAL,
    ]).toContain(entity.tipoPerfil);
    expect(entity.informacaoContaResseguro).toBeInstanceOf(
      ReinsuranceAccountEntity
    );
  });

  it('deve respeitar todos os valores do override', () => {
    const informacaoContaResseguro = ReinsuranceAccountEntityFactory.create();

    const entity = CriarResseguradorResponseEntityFactory.create({
      codigoRessegurador: 1111,
      codigoIdentificacaoPessoa: 'cli_ABC123456',
      codigoSusep: 22222,
      tipoPerfil: ProfileTypeEnum.LOCAL,
      informacaoContaResseguro,
    });

    expect(entity.codigoRessegurador).toBe(1111);
    expect(entity.codigoIdentificacaoPessoa).toBe('cli_ABC123456');
    expect(entity.codigoSusep).toBe(22222);
    expect(entity.tipoPerfil).toBe(ProfileTypeEnum.LOCAL);
    expect(entity.informacaoContaResseguro).toBe(informacaoContaResseguro);
  });
});
