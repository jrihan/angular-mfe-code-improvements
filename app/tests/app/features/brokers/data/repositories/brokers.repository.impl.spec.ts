import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BrokersRepositoryImpl } from '../../../../../../src/app/features/brokers/data/repositories/brokers.repository.impl';
import { BrokersDatasource } from '../../../../../../src/app/features/brokers/data/datasources/brokers.datasource';
import { BuscarBrokerResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/buscar_broker_response.mapper';
import { CriarBrokerRequestMapper } from '../../../../../../src/app/features/brokers/data/mappers/request/criar_broker_request.mapper';
import { CriarBrokerResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/criar_broker_response.mapper';
import { ListarBrokersResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/listar_brokers_response.mapper';
import { BuscarDadosCadastraisResponseMapper } from '../../../../../../src/app/shared/data/mappers/response/buscar_dados_cadastrais.response.mapper';
import { PaginationParams } from '../../../../../../src/app/shared/interfaces/pagination-params.interface';
import { BuscarDadosCadastraisRequestInterface } from '../../../../../../src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { ListarBrokersResponseDto } from '../../../../../../src/app/features/brokers/data/dtos/response/listar_brokers_response.dto';
import { BuscarBrokerResponseEntityFactory } from '../../domain/factories/response/buscar_broker_response.factory';
import { ListarBrokersResponseEntityFactory } from '../../domain/factories/response/listar_broker_response.factory';
import { CriarBrokerRequestFactory } from '../../domain/factories/request/criar_broker_request.factory';
import { CriarBrokerResponseEntityFactory } from '../../domain/factories/response/criar_broker_response.factory';
import { BuscarDadosCadastraisResponseEntityFactory } from 'tests/app/shared/factories/response/buscar_dados_cadastrais_response_entity.factory';
import { AtualizarBrokerRequestEntity } from '../../../../../../src/app/features/brokers/domain/entities/request/atualizar_broker_request.entity';
import { AtualizarBrokerRequestMapper } from '../../../../../../src/app/features/brokers/data/mappers/request/atualizar_broker_request.mapper';
import { BuscarInstituicoesFinanceirasResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { BankAccountEntityFactory } from '../../../../shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from '../../../../shared/factories/registration_data_entity.factory';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from '../../../../../../src/app/shared/domain/enum/person_type.enum';

const toListarBrokersResponseDto = (): ListarBrokersResponseDto => {
  const entity = ListarBrokersResponseEntityFactory.create({
    content: ListarBrokersResponseEntityFactory.create({
      page: {
        size: 1,
        number: 0,
        totalElements: 1,
        totalPages: 1,
      },
    }).content,
    page: {
      size: 1,
      number: 0,
      totalElements: 1,
      totalPages: 1,
    },
  });

  return {
    content: entity.content.map((item) => ({
      codigo_tipo_persona: item.codigoTipoPersona,
      id_cliente: item.idCliente,
      id_dbresseguro: item.idDbResseguro,
      situacao_cadastral: item.situacaoCadastral,
      codigo_susep: item.codigoSusep,
      dados_cadastrais: {
        nome_completo: item.dadosCadastrais.nomeCompleto,
        nome_fantasia: item.dadosCadastrais.nomeFantasia,
        tipo_documento: item.dadosCadastrais.tipoDocumento,
        numero_documento: item.dadosCadastrais.numeroDocumento,
        pais: item.dadosCadastrais.pais,
      },
    })),
    page: entity.page,
  };
};

describe('BrokersRepositoryImpl', () => {
  let repository: BrokersRepositoryImpl;
  let datasourceMock: jest.Mocked<BrokersDatasource>;

  beforeEach(() => {
    datasourceMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
      atualizarBroker: jest.fn(),
    } as any;

    repository = new BrokersRepositoryImpl(datasourceMock);
  });

  describe('buscarBroker', () => {
    it('deve chamar o datasource e mapear o DTO para entity', async () => {
      const entity = BuscarBrokerResponseEntityFactory.create({
        idCliente: 'CLI-123',
      });
      const dto = BuscarBrokerResponseMapper.toDto(entity);

      datasourceMock.buscarBroker.mockResolvedValue(dto);

      const result = await repository.buscarBroker('CLI-123');

      expect(datasourceMock.buscarBroker).toHaveBeenCalledWith('CLI-123');
      expect(result).toEqual(entity);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.buscarBroker.mockResolvedValue(null);

      const result = await repository.buscarBroker('CLI-123');

      expect(result).toBeNull();
    });
  });

  describe('listarBrokers', () => {
    it('deve chamar o datasource com os parâmetros e mapear a listagem', async () => {
      const params: PaginationParams = { page: 0, size: 10 };
      const dto = toListarBrokersResponseDto();
      const expected = ListarBrokersResponseMapper.toEntity(dto);

      datasourceMock.listarBrokers.mockResolvedValue(dto);

      const result = await repository.listarBrokers(params);

      expect(datasourceMock.listarBrokers).toHaveBeenCalledWith(params);
      expect(result).toEqual(expected);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.listarBrokers.mockResolvedValue(null);

      const result = await repository.listarBrokers();

      expect(result).toBeNull();
    });
  });

  describe('cadastrarBroker', () => {
    it('deve converter o payload para DTO, chamar o datasource e mapear a resposta', async () => {
      const payload = CriarBrokerRequestFactory.create();
      const payloadDto = CriarBrokerRequestMapper.toDto(payload);
      const responseEntity = CriarBrokerResponseEntityFactory.create();
      const responseDto = CriarBrokerResponseMapper.toDto(responseEntity);

      datasourceMock.cadastrarBroker.mockResolvedValue(responseDto);

      const result = await repository.cadastrarBroker(payload);

      expect(datasourceMock.cadastrarBroker).toHaveBeenCalledWith(payloadDto);
      expect(result).toEqual(responseEntity);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.cadastrarBroker.mockResolvedValue(null);

      const result = await repository.cadastrarBroker(
        CriarBrokerRequestFactory.create()
      );

      expect(result).toBeNull();
    });
  });

  describe('buscarDadosCadastrais', () => {
    it('deve chamar o datasource com os parâmetros e mapear a resposta', async () => {
      const params: BuscarDadosCadastraisRequestInterface = {
        documentNumber: '12345678000199',
        documentType: 'CNPJ',
        countryCode: 'BR',
      };
      const entity = BuscarDadosCadastraisResponseEntityFactory.create({
        idCliente: 'CLI-999',
      });
      const dto = BuscarDadosCadastraisResponseMapper.toDto(entity);

      datasourceMock.buscarDadosCadastrais.mockResolvedValue(dto);

      const result = await repository.buscarDadosCadastrais(params);

      expect(datasourceMock.buscarDadosCadastrais).toHaveBeenCalledWith(params);
      expect(result).toEqual(entity);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      const params: BuscarDadosCadastraisRequestInterface = {
        documentNumber: '12345678000199',
        documentType: 'CNPJ',
        countryCode: 'BR',
      };

      datasourceMock.buscarDadosCadastrais.mockResolvedValue(null);

      const result = await repository.buscarDadosCadastrais(params);

      expect(result).toBeNull();
    });
  });

  describe('buscarInstituicoesFinanceiras', () => {
    it('deve chamar o datasource e mapear a resposta', async () => {
      const dto = {
        data: [{ codigo: '341', nome: 'Banco Itaú' }],
      };
      const expected = new BuscarInstituicoesFinanceirasResponseEntity({
        data: [{ codigo: '341', nome: 'Banco Itaú' }],
      });

      datasourceMock.buscarInstituicoesFinanceiras.mockResolvedValue(
        dto as any
      );

      const result = await repository.buscarInstituicoesFinanceiras();

      expect(datasourceMock.buscarInstituicoesFinanceiras).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('deve retornar null quando o datasource retornar null', async () => {
      datasourceMock.buscarInstituicoesFinanceiras.mockResolvedValue(null);

      const result = await repository.buscarInstituicoesFinanceiras();

      expect(result).toBeNull();
    });
  });

  describe('atualizarBroker', () => {
    it('deve converter o payload para DTO e chamar o datasource', async () => {
      const payload = new AtualizarBrokerRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: RegistrationDataEntityFactory.create(),
      });
      const payloadDto = AtualizarBrokerRequestMapper.toDto(payload);

      datasourceMock.atualizarBroker.mockResolvedValue(null);

      const result = await repository.atualizarBroker(payload);

      expect(datasourceMock.atualizarBroker).toHaveBeenCalledWith(payloadDto);
      expect(result).toBeNull();
    });
  });
});
