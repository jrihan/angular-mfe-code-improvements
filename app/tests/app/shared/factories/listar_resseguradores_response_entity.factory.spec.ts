import {
  ListagemBuscarResseguradorResponseEntityFactory,
  ListarResseguradoresResponseEntityFactory,
} from './listar_resseguradores_response_entity.factory';
import { ListarResseguradoresResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/listar_resseguradores_response.entity';
import { ResseguradorProfileTypeEnum } from '../../../../src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';

describe('ListagemBuscarResseguradorResponseEntityFactory', () => {
  describe('create', () => {
    it('deve gerar uma listagem baseada em valores aleatórios sem override', () => {
      const entity = ListagemBuscarResseguradorResponseEntityFactory.create();

      expect(['PF', 'PJ']).toContain(entity.codigoTipoPersona);
      expect(entity.idCliente).toMatch(/^cli_\d{9}$/);
      expect(entity.idDbResseguro).toBeTruthy();
      expect(['ATIVO', 'INATIVO']).toContain(entity.situacaoCadastral);
      expect(entity.codigoSusep).toBeGreaterThanOrEqual(10000);
      expect([
        ResseguradorProfileTypeEnum.LOCAL,
        ResseguradorProfileTypeEnum.EVENTUAL,
        ResseguradorProfileTypeEnum.ADMITIDA,
      ]).toContain(entity.tipoPerfil);
      expect(entity.dadosConta).toBeDefined();
      // dados cadastrais de listagem não possuem endereços/telefones/emails
      expect((entity.dadosCadastrais as any).enderecos).toBeUndefined();
      expect(entity.dadosCadastrais.nomeCompleto).toBeTruthy();
    });

    it('deve respeitar todos os valores do override', () => {
      const dadosCadastrais = {
        nomeCompleto: 'Empresa X',
        nomeFantasia: 'X',
        tipoDocumento: 'CNPJ',
        numeroDocumento: '12345678000190',
        pais: 'Brasil',
      } as any;
      const dadosConta = [] as any;

      const entity = ListagemBuscarResseguradorResponseEntityFactory.create({
        codigoTipoPersona: 'PJ',
        idCliente: 'cli_000000001',
        idDbResseguro: 'db-1',
        situacaoCadastral: 'ATIVO',
        codigoSusep: 12345,
        tipoPerfil: ResseguradorProfileTypeEnum.LOCAL,
        dadosConta,
        dadosCadastrais,
      });

      expect(entity.codigoTipoPersona).toBe('PJ');
      expect(entity.idCliente).toBe('cli_000000001');
      expect(entity.idDbResseguro).toBe('db-1');
      expect(entity.situacaoCadastral).toBe('ATIVO');
      expect(entity.codigoSusep).toBe(12345);
      expect(entity.tipoPerfil).toBe(ResseguradorProfileTypeEnum.LOCAL);
      expect(entity.dadosConta).toBe(dadosConta);
      expect(entity.dadosCadastrais).toBe(dadosCadastrais);
    });
  });

  describe('createList', () => {
    it('deve gerar a lista padrão de 3 itens', () => {
      expect(
        ListagemBuscarResseguradorResponseEntityFactory.createList()
      ).toHaveLength(3);
    });

    it('deve gerar a quantidade informada', () => {
      expect(
        ListagemBuscarResseguradorResponseEntityFactory.createList(5)
      ).toHaveLength(5);
    });
  });
});

describe('ListarResseguradoresResponseEntityFactory', () => {
  it('deve gerar valores padrão sem override', () => {
    const entity = ListarResseguradoresResponseEntityFactory.create();

    expect(entity).toBeInstanceOf(ListarResseguradoresResponseEntity);
    expect(entity.page.size).toBe(10);
    expect(entity.page.number).toBe(0);
    expect(entity.page.totalElements).toBeGreaterThanOrEqual(5);
    expect(entity.page.totalElements).toBeLessThanOrEqual(100);
    expect(entity.page.totalPages).toBe(Math.ceil(entity.page.totalElements / 10));
    expect(entity.content).toHaveLength(10);
  });

  it('deve gerar valores padrão quando o override não possuir page', () => {
    const entity = ListarResseguradoresResponseEntityFactory.create({});

    expect(entity.page.size).toBe(10);
    expect(entity.page.number).toBe(0);
    expect(entity.content).toHaveLength(10);
  });

  it('deve respeitar page e content informados no override', () => {
    const content = [{ idCliente: 'cli_1' }] as any;

    const entity = ListarResseguradoresResponseEntityFactory.create({
      page: { size: 5, number: 2, totalElements: 12, totalPages: 3 },
      content,
    });

    expect(entity.page.size).toBe(5);
    expect(entity.page.number).toBe(2);
    expect(entity.page.totalElements).toBe(12);
    expect(entity.page.totalPages).toBe(3);
    expect(entity.content).toBe(content);
  });
});
