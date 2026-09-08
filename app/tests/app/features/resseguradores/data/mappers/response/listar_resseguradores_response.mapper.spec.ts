import { ListarResseguradoresResponseMapper } from '../../../../../../../src/app/features/resseguradores/data/mappers/response/listar_resseguradores_response.mapper';
import { ListarResseguradoresResponseEntity } from '../../../../../../../src/app/features/resseguradores/domain/entities/response/listar_resseguradores_response.entity';
import { ListarResseguradoresResponseDto } from '../../../../../../../src/app/features/resseguradores/data/dtos/response/listar_resseguradores_response.dto';

describe('ListarResseguradoresResponseMapper', () => {
  describe('toEntity', () => {
    it('deve lançar erro quando o DTO for inválido', () => {
      expect(() =>
        ListarResseguradoresResponseMapper.toEntity(null as any)
      ).toThrow('DTO inválido para mapeamento.');
    });

    it('deve converter um DTO completo em entidade', () => {
      const dto: ListarResseguradoresResponseDto = {
        content: [
          {
            codigo_tipo_persona: 'PJ',
            id_cliente: 'CLI-1',
            id_dbresseguro: 'DB-1',
            situacao_cadastral: 'ATIVO',
            codigo_susep: 12345,
            tipo_perfil: 'LOCAL',
            dados_cadastrais: {
              nome_completo: 'Empresa Teste',
              nome_fantasia: 'Fantasia',
              tipo_documento: 'CNPJ',
              numero_documento: '12345678000190',
              pais: 'Brasil',
            },
          },
        ],
        page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
      };

      const entity = ListarResseguradoresResponseMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(ListarResseguradoresResponseEntity);
      expect(entity.content).toHaveLength(1);
      expect(entity.content[0].idCliente).toBe('CLI-1');
      expect(entity.content[0].dadosCadastrais.nomeCompleto).toBe(
        'Empresa Teste'
      );
      expect(entity.page.size).toBe(10);
      expect(entity.page.totalElements).toBe(1);
    });

    it('deve usar listas e página padrão quando content e page estiverem ausentes', () => {
      const entity = ListarResseguradoresResponseMapper.toEntity(
        {} as ListarResseguradoresResponseDto
      );

      expect(entity.content).toEqual([]);
      expect(entity.page).toEqual({
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });

    it('deve usar strings vazias quando dados_cadastrais do item estiver ausente', () => {
      const dto = {
        content: [
          {
            codigo_tipo_persona: 'PJ',
            id_cliente: 'CLI-2',
            id_dbresseguro: 'DB-2',
            situacao_cadastral: 'ATIVO',
            codigo_susep: 1,
            tipo_perfil: 'EVENTUAL',
            dados_cadastrais: undefined,
          },
        ],
        page: { size: 5, number: 1, totalElements: 6, totalPages: 2 },
      } as unknown as ListarResseguradoresResponseDto;

      const entity = ListarResseguradoresResponseMapper.toEntity(dto);

      expect(entity.content[0].dadosCadastrais.nomeCompleto).toBe('');
      expect(entity.content[0].dadosCadastrais.nomeFantasia).toBe('');
      expect(entity.content[0].dadosCadastrais.tipoDocumento).toBe('');
      expect(entity.content[0].dadosCadastrais.numeroDocumento).toBe('');
      expect(entity.content[0].dadosCadastrais.pais).toBe('');
    });
  });

  describe('toDto', () => {
    it('deve lançar erro quando a entidade for inválida', () => {
      expect(() =>
        ListarResseguradoresResponseMapper.toDto(null as any)
      ).toThrow('Entidade inválida para mapeamento.');
    });

    it('deve converter uma entidade completa em DTO', () => {
      const entity = new ListarResseguradoresResponseEntity(
        [
          {
            codigoTipoPersona: 'PJ',
            idCliente: 'CLI-1',
            idDbResseguro: 'DB-1',
            situacaoCadastral: 'ATIVO',
            codigoSusep: 12345,
            tipoPerfil: 'Local',
            dadosCadastrais: {
              nomeCompleto: 'Empresa Teste',
              nomeFantasia: 'Fantasia',
              tipoDocumento: 'CNPJ',
              numeroDocumento: '12345678000190',
              pais: 'Brasil',
            },
          } as any,
        ],
        { size: 10, number: 0, totalElements: 1, totalPages: 1 }
      );

      const dto = ListarResseguradoresResponseMapper.toDto(entity);

      expect(dto.content).toHaveLength(1);
      expect(dto.content[0].id_cliente).toBe('CLI-1');
      expect(dto.content[0].dados_cadastrais.nome_completo).toBe(
        'Empresa Teste'
      );
      expect(dto.page.size).toBe(10);
      expect(dto.page.totalElements).toBe(1);
    });

    it('deve usar listas e página padrão quando content e page estiverem ausentes', () => {
      const entity = new ListarResseguradoresResponseEntity(
        undefined as any,
        undefined as any
      );

      const dto = ListarResseguradoresResponseMapper.toDto(entity);

      expect(dto.content).toEqual([]);
      expect(dto.page).toEqual({
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
