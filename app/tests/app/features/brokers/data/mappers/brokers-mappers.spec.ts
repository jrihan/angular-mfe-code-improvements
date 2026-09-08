import { CriarBrokerRequestMapper } from '../../../../../../src/app/features/brokers/data/mappers/request/criar_broker_request.mapper';
import { BuscarBrokerResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/buscar_broker_response.mapper';
import { CriarBrokerResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/criar_broker_response.mapper';
import { ListarBrokersResponseMapper } from '../../../../../../src/app/features/brokers/data/mappers/response/listar_brokers_response.mapper';
import { BuscarBrokerResponseDto } from '../../../../../../src/app/features/brokers/data/dtos/response/buscar_broker_response.dto';
import { ListarBrokersResponseDto } from '../../../../../../src/app/features/brokers/data/dtos/response/listar_brokers_response.dto';
import { CriarBrokerRequestFactory } from '../../domain/factories/request/criar_broker_request.factory';
import { BuscarBrokerResponseEntityFactory } from '../../domain/factories/response/buscar_broker_response.factory';
import { CriarBrokerResponseEntityFactory } from '../../domain/factories/response/criar_broker_response.factory';
import { ListarBrokersResponseEntityFactory } from '../../domain/factories/response/listar_broker_response.factory';
import { AtualizarBrokerRequestMapper } from '../../../../../../src/app/features/brokers/data/mappers/request/atualizar_broker_request.mapper';
import { AtualizarBrokerRequestEntity } from '../../../../../../src/app/features/brokers/domain/entities/request/atualizar_broker_request.entity';
import { BuscarBrokerResponseEntity } from '../../../../../../src/app/features/brokers/domain/entities/response/buscar_broker_response.entity';
import { RegistrationDataEntityFactory } from '../../../../shared/factories/registration_data_entity.factory';
import { BankAccountEntityFactory } from '../../../../shared/factories/bank_account_entity.factory';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from '../../../../../../src/app/shared/domain/enum/person_type.enum';

const toBuscarBrokerDto = (
  entity = BuscarBrokerResponseEntityFactory.create()
): BuscarBrokerResponseDto => BuscarBrokerResponseMapper.toDto(entity);

const toListarBrokersResponseDto = (): ListarBrokersResponseDto => {
  const responseEntity = ListarBrokersResponseEntityFactory.create({
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
    content: responseEntity.content.map((item) => ({
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
    page: responseEntity.page,
  };
};

describe('Brokers mappers', () => {
  describe('CriarBrokerRequestMapper', () => {
    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() => CriarBrokerRequestMapper.toDto(null as any)).toThrow(
        'Entidade inválida para mapeamento.'
      );
    });

    it('deve converter request entity para DTO em snake_case', () => {
      const entity = CriarBrokerRequestFactory.create({
        numeroDocumento: '12345678000199',
        pais: 'BR',
      });

      const dto = CriarBrokerRequestMapper.toDto(entity);

      expect(dto.tipo_pessoa).toBe(entity.codigoTipoPersona);
      expect(dto.tipo_documento).toBe(entity.tipoDocumento);
      expect(dto.numero_documento).toBe(entity.numeroDocumento);
      expect(dto.pais).toBe(entity.pais);
      expect(dto.codigo_susep).toBe(entity.codigoSusep);
      expect(dto.dados_conta.codigo_banco).toBe(entity.dadosConta.codigoBanco);
      expect(dto.dados_cadastrais.nome_completo).toBe(
        entity.dadosCadastrais.nomeCompleto
      );
      expect(dto.dados_cadastrais.nome_fantasia).toBe(
        entity.dadosCadastrais.nomeFantasia
      );
      expect((dto.dados_cadastrais as any).tipo_documento).toBeUndefined();
      expect((dto.dados_cadastrais as any).numero_documento).toBeUndefined();
    });

    it('deve preencher dados cadastrais com valores padrao quando vierem ausentes', () => {
      const entity = new AtualizarBrokerRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: null as any,
      });

      const dto = CriarBrokerRequestMapper.toDto(entity);

      expect(dto.dados_cadastrais.nome_completo).toBe('');
      expect(dto.dados_cadastrais.nome_fantasia).toBe('');
      expect((dto.dados_cadastrais as any).enderecos).toBeUndefined();
      expect((dto.dados_cadastrais as any).telefones).toBeUndefined();
      expect((dto.dados_cadastrais as any).emails).toBeUndefined();
    });
  });

  describe('AtualizarBrokerRequestMapper', () => {
    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() => AtualizarBrokerRequestMapper.toDto(null as any)).toThrow(
        'Entidade inválida para mapeamento.'
      );
    });

    it('deve converter request entity para DTO com coleções opcionais preenchidas', () => {
      const registrationData = RegistrationDataEntityFactory.create();
      const entity = new AtualizarBrokerRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: registrationData,
      });

      const dto = AtualizarBrokerRequestMapper.toDto(entity);

      expect(dto.codigo_susep).toBe(entity.codigoSusep);
      expect(dto.tipo_pessoa).toBe(entity.codigoTipoPersona);
      expect(dto.numero_documento).toBe(entity.numeroDocumento);
      expect(dto.dados_cadastrais.enderecos).toHaveLength(
        registrationData.enderecos?.length ?? 0
      );
      expect(dto.dados_cadastrais.telefones).toHaveLength(
        registrationData.telefones?.length ?? 0
      );
      expect(dto.dados_cadastrais.emails).toHaveLength(
        registrationData.emails?.length ?? 0
      );
    });

    it('deve omitir coleções opcionais vazias dos dados cadastrais', () => {
      const registrationData = RegistrationDataEntityFactory.create({
        enderecos: [],
        telefones: [],
        emails: [],
      });
      const entity = new AtualizarBrokerRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: registrationData,
      });

      const dto = AtualizarBrokerRequestMapper.toDto(entity);

      expect(dto.dados_cadastrais.nome_completo).toBe(
        registrationData.nomeCompleto
      );
      expect((dto.dados_cadastrais as any).enderecos).toBeUndefined();
      expect((dto.dados_cadastrais as any).telefones).toBeUndefined();
      expect((dto.dados_cadastrais as any).emails).toBeUndefined();
    });

    it('deve preencher dados cadastrais com valores padrao quando vierem ausentes', () => {
      const entity = new AtualizarBrokerRequestEntity({
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000199',
        pais: 'BR',
        codigoSusep: 12345,
        dadosConta: BankAccountEntityFactory.create(),
        dadosCadastrais: null as any,
      });

      const dto = AtualizarBrokerRequestMapper.toDto(entity);

      expect(dto.dados_cadastrais.nome_completo).toBe('');
      expect(dto.dados_cadastrais.nome_fantasia).toBe('');
      expect((dto.dados_cadastrais as any).enderecos).toBeUndefined();
      expect((dto.dados_cadastrais as any).telefones).toBeUndefined();
      expect((dto.dados_cadastrais as any).emails).toBeUndefined();
    });
  });

  describe('BuscarBrokerResponseMapper', () => {
    it('deve lançar erro quando o DTO for inválido', () => {
      expect(() => BuscarBrokerResponseMapper.toEntity(null as any)).toThrow(
        'DTO inválido para mapeamento.'
      );
    });

    it('deve converter DTO para entity', () => {
      const dto = toBuscarBrokerDto(
        BuscarBrokerResponseEntityFactory.create({ idCliente: 'CLI-001' })
      );

      const entity = BuscarBrokerResponseMapper.toEntity(dto);

      expect(entity.codigoTipoPersona).toBe(dto.codigo_tipo_persona);
      expect(entity.idCliente).toBe(dto.id_cliente);
      expect(entity.idDbResseguro).toBe(dto.id_dbresseguro);
      expect(entity.situacaoCadastral).toBe(dto.situacao_cadastral);
      expect(entity.codigoSusep).toBe(dto.codigo_susep);
      expect(entity.dadosCadastrais.nomeCompleto).toBe(
        dto.dados_cadastrais.nome_completo
      );
      expect(entity.dadosConta[0].codigoConta).toBe(
        dto.dados_conta[0].codigo_conta
      );
    });

    it('deve ignorar itens nulos em dados_conta do DTO', () => {
      const dto = toBuscarBrokerDto();
      dto.dados_conta = [null as any];

      const entity = BuscarBrokerResponseMapper.toEntity(dto);

      expect(entity.dadosConta).toEqual([]);
    });

    it('deve converter entity para DTO', () => {
      const entity = BuscarBrokerResponseEntityFactory.create({
        idCliente: 'CLI-002',
      });

      const dto = BuscarBrokerResponseMapper.toDto(entity);

      expect(dto.codigo_tipo_persona).toBe(entity.codigoTipoPersona);
      expect(dto.id_cliente).toBe(entity.idCliente);
      expect(dto.id_dbresseguro).toBe(entity.idDbResseguro);
      expect(dto.situacao_cadastral).toBe(entity.situacaoCadastral);
      expect(dto.codigo_susep).toBe(entity.codigoSusep);
      expect(dto.dados_cadastrais.nome_completo).toBe(
        entity.dadosCadastrais.nomeCompleto
      );
      expect(dto.dados_conta[0].codigo_conta).toBe(
        entity.dadosConta[0].codigoConta
      );
    });

    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() => BuscarBrokerResponseMapper.toDto(null as any)).toThrow(
        'Entidade inválida para mapeamento.'
      );
    });

    it('deve retornar lista vazia quando dadosConta vier nulo na entidade', () => {
      const dto = BuscarBrokerResponseMapper.toDto(
        new BuscarBrokerResponseEntity({
          codigoTipoPersona: PersonTypeEnum.J,
          idCliente: 'CLI-NULL',
          idDbResseguro: 'DB-NULL',
          situacaoCadastral: 'ATIVO',
          codigoSusep: 12345,
          dadosConta: null as any,
          dadosCadastrais: RegistrationDataEntityFactory.create(),
        })
      );

      expect(dto.dados_conta).toEqual([]);
    });
  });

  describe('CriarBrokerResponseMapper', () => {
    it('deve converter entity para DTO e preservar os dados de conta resseguro', () => {
      const entity = CriarBrokerResponseEntityFactory.create({
        codigoBroker: 1234,
      });

      const dto = CriarBrokerResponseMapper.toDto(entity);

      expect(dto.codigo_broker).toBe(entity.codigoBroker);
      expect(dto.codigo_identificacao_pessoa).toBe(
        entity.codigoIdentificacaoPessoa
      );
      expect(dto.codigo_susep).toBe(entity.codigoSusep);
      expect(dto.informacao_conta_resseguro.agencia).toBe(
        entity.informacaoContaResseguro.agencia
      );
    });

    it('deve converter DTO para entity', () => {
      const entity = CriarBrokerResponseEntityFactory.create({
        codigoBroker: 5678,
      });
      const dto = CriarBrokerResponseMapper.toDto(entity);

      const mappedEntity = CriarBrokerResponseMapper.toEntity(dto);

      expect(mappedEntity).toEqual(entity);
    });
  });

  describe('ListarBrokersResponseMapper', () => {
    it('deve lançar erro quando o DTO for inválido', () => {
      expect(() => ListarBrokersResponseMapper.toEntity(null as any)).toThrow(
        'DTO inválido para mapeamento.'
      );
    });

    it('deve converter DTO de listagem para entity reduzindo dados cadastrais e mantendo paginação', () => {
      const dto = toListarBrokersResponseDto();

      const entity = ListarBrokersResponseMapper.toEntity(dto);

      expect(entity.content.length).toBe(1);
      expect(entity.content[0].codigoTipoPersona).toBe(
        dto.content[0].codigo_tipo_persona
      );
      expect(entity.content[0].dadosCadastrais.nomeCompleto).toBe(
        dto.content[0].dados_cadastrais.nome_completo
      );
      expect((entity.content[0].dadosCadastrais as any).enderecos).toEqual([]);
      expect((entity.content[0].dadosCadastrais as any).telefones).toEqual([]);
      expect((entity.content[0].dadosCadastrais as any).emails).toEqual([]);
      expect(entity.content[0].dadosConta).toEqual([]);
      expect(entity.page).toEqual(dto.page);
    });

    it('deve ignorar itens nulos em content', () => {
      const dto = toListarBrokersResponseDto();
      dto.content = [null as any];

      const entity = ListarBrokersResponseMapper.toEntity(dto);

      expect(entity.content).toEqual([]);
    });

    it('deve preencher defaults quando pagina e dados cadastrais vierem ausentes', () => {
      const dto = toListarBrokersResponseDto();
      dto.content = [
        {
          ...dto.content[0],
          dados_cadastrais: undefined as any,
        },
      ];
      dto.page = undefined as any;

      const entity = ListarBrokersResponseMapper.toEntity(dto);

      expect(entity.content[0].dadosCadastrais.nomeCompleto).toBe('');
      expect(entity.content[0].dadosCadastrais.nomeFantasia).toBe('');
      expect(entity.content[0].dadosCadastrais.tipoDocumento).toBe('');
      expect(entity.content[0].dadosCadastrais.numeroDocumento).toBe('');
      expect(entity.content[0].dadosCadastrais.pais).toBe('');
      expect(entity.page).toEqual({
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
