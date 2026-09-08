import { ResseguradorMapper } from '../../../../../../src/app/features/resseguradores/data/mappers/response/buscar_ressegurador_response.mapper';
import { ResseguradorDto } from '../../../../../../src/app/features/resseguradores/data/dtos/response/buscar_ressegurador_response.dto';
import { ListarResseguradoresResponseDto } from '../../../../../../src/app/features/resseguradores/data/dtos/response/listar_resseguradores_response.dto';

describe('ResseguradorMapper', () => {
  const mockDto: ResseguradorDto = {
    codigo_tipo_persona: 'PF',
    id_cliente: 'CLI-001',
    id_dbresseguro: 'DB-001',
    situacao_cadastral: 'ATIVO',
    codigo_susep: 12345,
    tipo_perfil: 'LOCAL',
    dados_conta: [
      {
        conta_selecionada: true,
        codigo_banco: '341',
        codigo_agencia: '1234',
        codigo_tipo_conta: 'C',
        codigo_conta: '98765',
        dac: '3',
      },
    ],
    dados_cadastrais: {
      nome_completo: 'Ressegurador S.A.',
      nome_fantasia: 'Ressegurador',
      tipo_documento: 'CNPJ',
      numero_documento: '12345678000199',
      pais: 'BR',
      enderecos: [
        {
          proposito_endereco: 'PRINCIPAL',
          logradouro: 'Av Paulista',
          numero: '1000',
          complemento: 'Andar 10',
          bairro: 'Bela Vista',
          cep: '01310-100',
          cidade: 'São Paulo',
          uf: 'SP',
          pais: 'BR',
          regiao: 'SE',
          codigo_area_postal: '01310',
        },
      ],
      telefones: [
        {
          proposito_telefone: 'COMERCIAL',
          tipo_telefone: 'CELULAR',
          ddi: 55,
          ddd: 11,
          numero: 999999999,
          nome_contato: 'Contato',
        },
      ],
      emails: [
        {
          proposito_email: 'PRINCIPAL',
          email: 'contato@ressegurador.com',
          nome_contato: 'João',
        },
      ],
    },
  };

  describe('toEntity', () => {
    it('deve converter ResseguradorDto para BuscarResseguradorResponseEntity convertendo snake_case para camelCase', () => {
      const entity = ResseguradorMapper.toEntity(mockDto);

      expect(entity.codigoTipoPersona).toBe(mockDto.codigo_tipo_persona);
      expect(entity.idCliente).toBe(mockDto.id_cliente);
      expect(entity.idDbResseguro).toBe(mockDto.id_dbresseguro);
      expect(entity.situacaoCadastral).toBe(mockDto.situacao_cadastral);
      expect(entity.codigoSusep).toBe(mockDto.codigo_susep);

      expect(entity.dadosConta[0].codigoConta).toBe(
        mockDto.dados_conta[0].codigo_conta
      );
      expect(entity.dadosConta[0].contaSelecionada).toBe(
        mockDto.dados_conta[0].conta_selecionada
      );

      expect(entity.dadosCadastrais.nomeCompleto).toBe(
        mockDto.dados_cadastrais.nome_completo
      );
      expect(entity.dadosCadastrais.enderecos![0].propositoEndereco).toBe(
        mockDto.dados_cadastrais.enderecos![0].proposito_endereco
      );
      expect(entity.dadosCadastrais.telefones![0].propositoTelefone).toBe(
        mockDto.dados_cadastrais.telefones![0].proposito_telefone
      );
      expect(entity.dadosCadastrais.emails![0].propositoEmail).toBe(
        mockDto.dados_cadastrais.emails![0].proposito_email
      );
    });
  });

  describe('toListagemEntity', () => {
    it('deve converter ResseguradorDto para ListagemBuscarResseguradorResponseEntity omitindo os campos de enderecos, telefones e emails', () => {
      const entity = ResseguradorMapper.toListagemEntity(mockDto);

      expect(entity.codigoTipoPersona).toBe(mockDto.codigo_tipo_persona);
      expect(entity.idCliente).toBe(mockDto.id_cliente);
      expect(entity.dadosCadastrais.nomeCompleto).toBe(
        mockDto.dados_cadastrais.nome_completo
      );

      // Garante que os campos de endereços, telefones e emails estão vazios na listagem
      expect((entity.dadosCadastrais as any).enderecos).toEqual([]);
      expect((entity.dadosCadastrais as any).telefones).toEqual([]);
      expect((entity.dadosCadastrais as any).emails).toEqual([]);
    });
  });

  describe('toListarResseguradoresResponseEntity', () => {
    it('deve converter ListarResseguradoresResponseDto para ListarResseguradoresResponseEntity', () => {
      const responseDto: ListarResseguradoresResponseDto = {
        content: [mockDto],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      };

      const entityResponse =
        ResseguradorMapper.toListarResseguradoresResponseEntity(responseDto);

      expect(entityResponse.content.length).toBe(1);
      expect(entityResponse.content[0].idCliente).toBe(mockDto.id_cliente);
      expect(entityResponse.page.size).toBe(10);
      expect(entityResponse.page.number).toBe(0);
      expect(entityResponse.page.totalElements).toBe(1);
      expect(entityResponse.page.totalPages).toBe(1);
    });
  });
});
