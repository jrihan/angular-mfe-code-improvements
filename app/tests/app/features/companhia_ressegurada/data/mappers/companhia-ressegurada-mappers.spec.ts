import { CadastroCompanhiaResseguradaMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/cadastro-companhia-ressegurada.mapper';
import { CompanhiaResseguradaMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/listagem-dados-cadastrais.mapper';
import { CompanhiaResseguradaListItemMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/companhia-ressegurada-list-item.mapper';
import { ListagemInstituicoesFinanceirasMapper } from '../../../../../../src/app/features/companhia_ressegurada/data/mappers/instituicoes-financeiras.mapper';

describe('CompanhiaRessegurada Mappers', () => {
  describe('CadastroCompanhiaResseguradaMapper', () => {
    it('deve converter Entity para DTO e normalizar o documento (remover não-dígitos)', () => {
      const entity: any = {
        tipo_documento: 'CNPJ',
        numero_documento: '12.345.678/0001-99',
        companhia_ressegurada: {
          codigo_companhia_ressegurada: 10,
          codigo_centro_custo: 50,
        },
        dados_conta: {
          codigo_banco: '341',
          codigo_agencia: '1234',
          codigo_tipo_conta: 'CC',
          codigo_conta: '98765',
          dac: '1',
        },
        dados_cadastrais: {
          nome_completo: 'Companhia Ressegurada LTDA',
          nome_fantasia: 'Companhia Ressegurada',
        },
      };

      const dto = CadastroCompanhiaResseguradaMapper.toDTO(entity);

      expect(dto.tipo_documento).toBe('CNPJ');
      expect(dto.numero_documento).toBe('12345678000199');
      expect(dto.companhia_ressegurada.codigo_companhia_ressegurada).toBe(10);
      expect(dto.companhia_ressegurada.codigo_centro_custo).toBe(50);
      expect(dto.dados_conta.codigo_banco).toBe('341');
      expect(dto.dados_conta.codigo_agencia).toBe('1234');
      expect(dto.dados_conta.codigo_tipo_conta).toBe('CC');
      expect(dto.dados_conta.codigo_conta).toBe('98765');
      expect(dto.dados_conta.dac).toBe('1');
      expect(dto.dados_cadastrais.nome_completo).toBe(
        'Companhia Ressegurada LTDA'
      );
      expect(dto.dados_cadastrais.nome_fantasia).toBe('Companhia Ressegurada');
    });

    it('deve omitir codigo_centro_custo do DTO quando não informado', () => {
      const entity: any = {
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000199',
        companhia_ressegurada: {
          codigo_companhia_ressegurada: 10,
        },
        dados_conta: {},
        dados_cadastrais: {},
      };

      const dto = CadastroCompanhiaResseguradaMapper.toDTO(entity);

      expect(dto.companhia_ressegurada).toEqual({
        codigo_companhia_ressegurada: 10,
      });
    });

    it('deve converter Entity para DTO com documento em branco se for nulo', () => {
      const entity: any = {
        tipo_documento: 'CNPJ',
        numero_documento: null,
        companhia_ressegurada: {
          codigo_companhia_ressegurada: 1,
          codigo_centro_custo: 2,
        },
        dados_conta: {
          codigo_banco: '341',
        },
        dados_cadastrais: {},
      };

      const dto = CadastroCompanhiaResseguradaMapper.toDTO(entity);
      expect(dto.numero_documento).toBe('');
    });

    it('deve realizar o parse de tipo_pessoa de extenso/incompleto para código unitário F ou J', () => {
      const entityJuridica: any = {
        tipo_pessoa: 'JURIDICA',
        companhia_ressegurada: {},
        dados_conta: {},
        dados_cadastrais: {},
      };
      const entityFisica: any = {
        tipo_pessoa: 'FISICA',
        companhia_ressegurada: {},
        dados_conta: {},
        dados_cadastrais: {},
      };
      const entityJ: any = {
        tipo_pessoa: 'J',
        companhia_ressegurada: {},
        dados_conta: {},
        dados_cadastrais: {},
      };
      const entityF: any = {
        tipo_pessoa: 'F',
        companhia_ressegurada: {},
        dados_conta: {},
        dados_cadastrais: {},
      };

      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(entityJuridica).tipo_pessoa
      ).toBe('J');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(entityFisica).tipo_pessoa
      ).toBe('F');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(entityJ).tipo_pessoa
      ).toBe('J');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(entityF).tipo_pessoa
      ).toBe('F');
    });

    it('deve realizar o parse de dados_conta.codigo_tipo_conta de extenso para o código unitário correto', () => {
      const criarEntityComTipoConta = (tipoConta: string): any => ({
        companhia_ressegurada: {},
        dados_conta: {
          codigo_tipo_conta: tipoConta,
        },
        dados_cadastrais: {},
      });

      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Corrente')
        ).dados_conta.codigo_tipo_conta
      ).toBe('C');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Poupança')
        ).dados_conta.codigo_tipo_conta
      ).toBe('P');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Pagamento')
        ).dados_conta.codigo_tipo_conta
      ).toBe('G');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Investimento')
        ).dados_conta.codigo_tipo_conta
      ).toBe('I');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Virtual')
        ).dados_conta.codigo_tipo_conta
      ).toBe('V');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Desativada')
        ).dados_conta.codigo_tipo_conta
      ).toBe('D');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Não Correntista')
        ).dados_conta.codigo_tipo_conta
      ).toBe('N');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(
          criarEntityComTipoConta('Conta Financeira')
        ).dados_conta.codigo_tipo_conta
      ).toBe('F');
      expect(
        CadastroCompanhiaResseguradaMapper.toDTO(criarEntityComTipoConta('cc'))
          .dados_conta.codigo_tipo_conta
      ).toBe('cc');
    });
  });

  describe('CompanhiaResseguradaMapper', () => {
    const mockEnderecoDto = {
      proposito_endereco: 'Principal',
      uf: 'SP',
      cidade: 'São Paulo',
      complemento: 'Apto 1',
      numero: '100',
      logradouro: 'Av Paulista',
      bairro: 'Bela Vista',
      cep: '01311000',
      pais: 'BRA',
    };

    const mockEnderecoEntity = { ...mockEnderecoDto };

    const mockTelefoneDto: any = {
      tipo_telefone: 'Comercial',
      ddi: 55,
      ddd: '11',
      numero: '999999999',
      proposito_telefone: 'Contato',
    };

    const mockTelefoneEntity: any = { ...mockTelefoneDto };

    const mockEmailDto = {
      proposito_email: 'Contato',
      departamento: 'Financeiro',
      email: 'financeiro@empresa.com',
      nome_contato: 'João',
    };

    const mockEmailEntity = { ...mockEmailDto };

    const mockDadosCadastraisDto = {
      pais: 'BRA',
      nome_completo: 'Empresa Teste S.A.',
      nome_fantasia: 'Empresa Teste',
      enderecos: [mockEnderecoDto],
      telefones: [mockTelefoneDto],
      emails: [mockEmailDto],
      numero_documento: '12345678000199',
      tipo_documento: 'CNPJ',
      tipo_pessoa: 'JURIDICA',
    };

    const mockDadosCadastraisEntity = { ...mockDadosCadastraisDto };

    const mockContaDto = {
      codigo_banco: '341',
      codigo_agencia: '1234',
      tipo_conta: 'CC',
      codigo_conta: '98765',
      dac: '1',
      codigo_empresa: 'Itaú',
      id_conta: '10',
      numero_unico_cliente: '555',
      segmento: 'Empresas',
    };

    const mockContaEntity = { ...mockContaDto };

    it('deve mapear endereço de DTO para Entity e vice-versa', () => {
      expect(
        CompanhiaResseguradaMapper.enderecoToEntity(mockEnderecoDto)
      ).toEqual(mockEnderecoEntity);
      expect(
        CompanhiaResseguradaMapper.enderecoToDTO(mockEnderecoEntity)
      ).toEqual(mockEnderecoDto);
    });

    it('deve mapear telefone de DTO para Entity e vice-versa', () => {
      expect(
        CompanhiaResseguradaMapper.telefoneToEntity(mockTelefoneDto)
      ).toEqual(mockTelefoneEntity);
      expect(
        CompanhiaResseguradaMapper.telefoneToDTO(mockTelefoneEntity)
      ).toEqual(mockTelefoneDto);
    });

    it('deve mapear email de DTO para Entity e vice-versa', () => {
      expect(CompanhiaResseguradaMapper.emailToEntity(mockEmailDto)).toEqual(
        mockEmailEntity
      );
      expect(CompanhiaResseguradaMapper.emailToDTO(mockEmailEntity)).toEqual(
        mockEmailDto
      );
    });

    it('deve mapear dados cadastrais de DTO para Entity e vice-versa', () => {
      expect(
        CompanhiaResseguradaMapper.dadosCadastraisToEntity(
          mockDadosCadastraisDto
        )
      ).toEqual(mockDadosCadastraisEntity);
      expect(
        CompanhiaResseguradaMapper.dadosCadastraisToDTO(
          mockDadosCadastraisEntity
        )
      ).toEqual(mockDadosCadastraisDto);
    });

    it('deve mapear conta de DTO para Entity e vice-versa', () => {
      expect(
        CompanhiaResseguradaMapper.dadosContaToEntity(mockContaDto)
      ).toEqual(mockContaEntity);
      expect(
        CompanhiaResseguradaMapper.dadosContaToDTO(mockContaEntity)
      ).toEqual(mockContaDto);
    });

    it('deve mapear buscarDadosCadastrais de DTO para Entity e vice-versa', () => {
      const mockDto = {
        dados_cadastrais: mockDadosCadastraisDto,
        dados_conta: [mockContaDto],
        id_cliente: '100',
        situacao_cadastral: 'Ativo',
      } as any;

      const mockEntity = {
        dados_cadastrais: mockDadosCadastraisEntity,
        dados_conta: [mockContaEntity],
        id_cliente: '100',
        situacao_cadastral: 'Ativo',
      } as any;

      expect(CompanhiaResseguradaMapper.toEntity(mockDto)).toEqual(mockEntity);
      expect(CompanhiaResseguradaMapper.toDTO(mockEntity)).toEqual(mockDto);
    });

    it('deve usar lista de contas vazia quando dados_conta for nulo em toEntity', () => {
      const dto = {
        dados_cadastrais: mockDadosCadastraisDto,
        dados_conta: undefined,
        id_cliente: '100',
        situacao_cadastral: 'Ativo',
      } as any;

      const entity = CompanhiaResseguradaMapper.toEntity(dto);

      expect(entity).not.toBeNull();
      expect(entity?.dados_conta).toEqual([]);
    });

    it('deve retornar null se DTO for nulo ou sem dados em toEntity', () => {
      expect(CompanhiaResseguradaMapper.toEntity(null)).toBeNull();
      expect(CompanhiaResseguradaMapper.toEntity({} as any)).toBeNull();
    });
  });

  describe('CompanhiaResseguradaListItemMapper', () => {
    it('deve converter DTO de lista para Entity', () => {
      const dto = {
        codigo_tipo_persona: 'J',
        id_cliente: 'cliente-123',
        id_dbresseguro: 'db-456',
        situacao_cadastral: 'ATIVO',
        codigo_susep: 7890,
        codigo_companhia_ressegurada: 1,
        codigo_centro_custo: 5,
        dados_cadastrais: {
          nome_completo: 'Companhia Ressegurada SA',
          nome_fantasia: 'Companhia Teste',
          tipo_documento: 'CNPJ',
          numero_documento: '12345678000199',
          pais: 'BR',
        },
      };

      const entity = CompanhiaResseguradaListItemMapper.toEntity(dto);
      expect(entity).toEqual(dto);
    });
  });

  describe('ListagemInstituicoesFinanceirasMapper', () => {
    it('deve converter DTO de bancos para Entity', () => {
      const dto = {
        data: [
          { codigo: '341', nome: 'Itaú' },
          { codigo: '001', nome: 'BB' },
        ],
      };

      const entity = ListagemInstituicoesFinanceirasMapper.toEntity(dto);
      expect(entity).toEqual(dto);
    });
  });
});
