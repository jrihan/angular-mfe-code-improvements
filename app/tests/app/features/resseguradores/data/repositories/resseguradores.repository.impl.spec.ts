import { ResseguradoresRepositoryImpl } from '../../../../../../src/app/features/resseguradores/data/repositories/resseguradores.repository.impl';
import { ResseguradoresDatasource } from '../../../../../../src/app/features/resseguradores/data/datasources/resseguradores.datasource';
import { ResseguradorFactory } from '../../../../shared/factories/ressegurador.factory';
import { CriarResseguradorRequestEntityFactory } from '../../../../shared/factories/criar_ressegurador_request_entity.factory';
import { ResseguradorDto } from '../../../../../../src/app/features/resseguradores/data/dtos/response/buscar_ressegurador_response.dto';
import { ListarResseguradoresResponseDto } from '../../../../../../src/app/features/resseguradores/data/dtos/response/listar_resseguradores_response.dto';
import { AtualizarResseguradorRequestEntity } from '../../../../../../src/app/features/resseguradores/domain/entities/request/atualizar_ressegurador_request.entity';
import { AtualizarResseguradorRequestMapper } from '../../../../../../src/app/features/resseguradores/data/mappers/request/atualizar_ressegurador_request.mapper';
import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { BankAccountEntityFactory } from '../../../../shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from '../../../../shared/factories/registration_data_entity.factory';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from '../../../../../../src/app/shared/domain/enum/person_type.enum';
import { ReinsuranceEntityFactory } from '../../../../shared/factories/criar_ressegurador_request_entity.factory';

describe('ResseguradoresRepositoryImpl', () => {
  let repository: ResseguradoresRepositoryImpl;
  let datasourceMock: jest.Mocked<ResseguradoresDatasource>;

  const mockEntity = ResseguradorFactory.create({ idCliente: 'CLI-123' });

  const mockDto: ResseguradorDto = {
    codigo_tipo_persona: mockEntity.codigoTipoPersona,
    id_cliente: mockEntity.idCliente,
    id_dbresseguro: mockEntity.idDbResseguro,
    situacao_cadastral: mockEntity.situacaoCadastral,
    codigo_susep: mockEntity.codigoSusep,
    tipo_perfil: mockEntity.tipoPerfil,
    dados_conta: [
      {
        conta_selecionada: mockEntity.dadosConta[0]?.contaSelecionada,
        codigo_banco: mockEntity.dadosConta[0]?.codigoBanco || '',
        codigo_agencia: mockEntity.dadosConta[0]?.codigoAgencia || '',
        codigo_tipo_conta: mockEntity.dadosConta[0]?.codigoTipoConta || '',
        codigo_conta: mockEntity.dadosConta[0]?.codigoConta || '',
        dac: mockEntity.dadosConta[0]?.dac || '',
      },
    ],
    dados_cadastrais: {
      nome_completo: mockEntity.dadosCadastrais.nomeCompleto,
      nome_fantasia: mockEntity.dadosCadastrais.nomeFantasia,
      tipo_documento: mockEntity.dadosCadastrais.tipoDocumento,
      numero_documento: mockEntity.dadosCadastrais.numeroDocumento,
      pais: mockEntity.dadosCadastrais.pais,
      enderecos: mockEntity.dadosCadastrais.enderecos!.map((e: any) => ({
        proposito_endereco: e.propositoEndereco,
        logradouro: e.logradouro,
        numero: e.numero,
        complemento: e.complemento,
        bairro: e.bairro,
        cep: e.cep,
        cidade: e.cidade,
        uf: e.uf,
        pais: e.pais,
        regiao: e.regiao || '',
        codigo_area_postal: e.codigoAreaPostal || '',
      })),
      telefones: mockEntity.dadosCadastrais.telefones!.map((t: any) => ({
        proposito_telefone: t.propositoTelefone,
        tipo_telefone: t.tipoTelefone,
        ddi: t.ddi,
        ddd: t.ddd,
        numero: t.numero,
        nome_contato: t.nomeContato || '',
      })),
      emails: mockEntity.dadosCadastrais.emails!.map((em: any) => ({
        proposito_email: em.propositoEmail,
        email: em.email,
        nome_contato: em.nomeContato,
      })),
    },
  };

  beforeEach(() => {
    datasourceMock = {
      buscarRessegurador: jest.fn(),
      listarResseguradores: jest.fn(),
      cadastrarRessegurador: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      atualizarRessegurador: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
    } as any;

    repository = new ResseguradoresRepositoryImpl(datasourceMock);
  });

  describe('buscarRessegurador', () => {
    it('deve retornar a entidade correspondente quando o datasource encontrar o ressegurador', async () => {
      datasourceMock.buscarRessegurador.mockResolvedValue(mockDto);

      const result = await repository.buscarRessegurador('CLI-123');

      expect(datasourceMock.buscarRessegurador).toHaveBeenCalledWith('CLI-123');
      expect(result).not.toBeNull();
      expect(result?.idCliente).toBe(mockDto.id_cliente);
    });

    it('deve retornar null do repository se o datasource retornar null', async () => {
      datasourceMock.buscarRessegurador.mockResolvedValue(null);

      const result = await repository.buscarRessegurador('CLI-123');

      expect(result).toBeNull();
    });
  });

  describe('listarResseguradores', () => {
    it('deve retornar a lista de entidades correspondente', async () => {
      const responseDto: ListarResseguradoresResponseDto = {
        content: [mockDto],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      };
      datasourceMock.listarResseguradores.mockResolvedValue(responseDto);

      const result = await repository.listarResseguradores();

      expect(datasourceMock.listarResseguradores).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.content.length).toBe(1);
      expect(result?.content[0].idCliente).toBe(mockDto.id_cliente);
    });

    it('deve retornar null se o datasource retornar null', async () => {
      datasourceMock.listarResseguradores.mockResolvedValue(null);

      const result = await repository.listarResseguradores();

      expect(result).toBeNull();
    });
  });

  describe('cadastrarRessegurador', () => {
    const payload = CriarResseguradorRequestEntityFactory.create();

    const responseDto = {
      codigo_ressegurador: 1,
      codigo_identificacao_pessoa: 'cli_1',
      codigo_susep: 12345,
      tipo_perfil: 'Local',
      informacao_conta_resseguro: {},
    } as any;

    it('deve mapear e retornar a entidade quando o datasource retornar um DTO', async () => {
      datasourceMock.cadastrarRessegurador.mockResolvedValue(responseDto);

      const result = await repository.cadastrarRessegurador(payload);

      expect(datasourceMock.cadastrarRessegurador).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.codigoRessegurador).toBe(1);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.cadastrarRessegurador.mockResolvedValue(null);

      const result = await repository.cadastrarRessegurador(payload);

      expect(result).toBeNull();
    });
  });

  describe('buscarDadosCadastrais', () => {
    const params = {
      documentNumber: '12345678000190',
      documentType: 'CNPJ',
      countryCode: 'BR',
    };

    const dadosDto = {
      id_cliente: 'CLI-1',
      situacao_cadastral: 'ATIVO',
      dados_cadastrais: {
        nome_completo: 'Empresa',
        nome_fantasia: 'Fantasia',
        tipo_documento: 'CNPJ',
        numero_documento: '12345678000190',
        pais: 'Brasil',
        enderecos: [],
        telefones: [],
        emails: [],
      },
      dados_conta: [],
    } as any;

    it('deve mapear e retornar a entidade quando o datasource retornar um DTO', async () => {
      datasourceMock.buscarDadosCadastrais.mockResolvedValue(dadosDto);

      const result = await repository.buscarDadosCadastrais(params);

      expect(datasourceMock.buscarDadosCadastrais).toHaveBeenCalledWith(params);
      expect(result).not.toBeNull();
      expect(result?.idCliente).toBe('CLI-1');
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.buscarDadosCadastrais.mockResolvedValue(null);

      const result = await repository.buscarDadosCadastrais(params);

      expect(result).toBeNull();
    });
  });

  describe('atualizarRessegurador', () => {
    it('deve converter o payload para DTO e chamar o datasource', async () => {
      const payload = new AtualizarResseguradorRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        ressegurador: ReinsuranceEntityFactory.create(),
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: RegistrationDataEntityFactory.create(),
      });
      const payloadDto = AtualizarResseguradorRequestMapper.toDto(payload);

      datasourceMock.atualizarRessegurador.mockResolvedValue(null);

      const result = await repository.atualizarRessegurador(payload);

      expect(datasourceMock.atualizarRessegurador).toHaveBeenCalledWith(
        payloadDto
      );
      expect(result).toBeNull();
    });
  });

  describe('buscarInstituicoesFinanceiras', () => {
    it('deve chamar o datasource e mapear a resposta', async () => {
      const dto = {
        data: [{ codigo: '341', nome: 'Banco Itaú' }],
      };

      datasourceMock.buscarInstituicoesFinanceiras.mockResolvedValue(
        dto as any
      );

      const result = await repository.buscarInstituicoesFinanceiras();

      expect(datasourceMock.buscarInstituicoesFinanceiras).toHaveBeenCalled();
      expect(result).toEqual(
        new BuscarInstituicoesFinanceirasResponseEntity({
          data: [{ codigo: '341', nome: 'Banco Itaú' }],
        })
      );
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.buscarInstituicoesFinanceiras.mockResolvedValue(null);

      const result = await repository.buscarInstituicoesFinanceiras();

      expect(result).toBeNull();
    });
  });
});
