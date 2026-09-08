import { CriarResseguradorResponseMapper } from '../../../../../../../src/app/features/resseguradores/data/mappers/response/criar_ressegurador_response.mapper';
import { CriarResseguradorResponseEntity } from '../../../../../../../src/app/features/resseguradores/domain/entities/response/criar_ressegurador_response.entity';
import { CriarResseguradorResponseDto } from '../../../../../../../src/app/features/resseguradores/data/dtos/response/criar_ressegurador_response.dto';
import { ReinsuranceAccountEntity } from '../../../../../../../src/app/shared/domain/entities/reinsurance_account.entity';
import { ProfileTypeEnum } from '../../../../../../../src/app/shared/domain/enum/profile_type.enum';

describe('CriarResseguradorResponseMapper', () => {
  describe('toEntity', () => {
    it('deve converter um DTO completo em entidade', () => {
      const dto: CriarResseguradorResponseDto = {
        codigo_ressegurador: 1111,
        codigo_identificacao_pessoa: 'cli_ABC',
        codigo_susep: 22222,
        tipo_perfil: 'Local',
        informacao_conta_resseguro: {
          agencia: '0001',
          banco: '341',
          codigo_tipo_conta: 'C',
          numero_conta_outra_instituicao_financeira: '12345',
          numero_digito_validador_conta_outra_instituicao_financeira: '9',
          numero_unico_conta: '987654321',
        },
      };

      const entity = CriarResseguradorResponseMapper.toEntity(dto);

      expect(entity).toBeInstanceOf(CriarResseguradorResponseEntity);
      expect(entity.codigoRessegurador).toBe(1111);
      expect(entity.codigoIdentificacaoPessoa).toBe('cli_ABC');
      expect(entity.codigoSusep).toBe(22222);
      expect(entity.tipoPerfil).toBe('Local');
      expect(entity.informacaoContaResseguro).toBeInstanceOf(
        ReinsuranceAccountEntity
      );
      expect(entity.informacaoContaResseguro.agencia).toBe('0001');
    });

    it('deve usar valores padrão quando os campos estiverem ausentes', () => {
      const dto = {
        informacao_conta_resseguro: {},
      } as unknown as CriarResseguradorResponseDto;

      const entity = CriarResseguradorResponseMapper.toEntity(dto);

      expect(entity.codigoRessegurador).toBe(0);
      expect(entity.codigoIdentificacaoPessoa).toBe('');
      expect(entity.codigoSusep).toBe(0);
    });
  });

  describe('toDto', () => {
    it('deve converter a entidade em DTO', () => {
      const entity = new CriarResseguradorResponseEntity({
        codigoRessegurador: 1111,
        codigoIdentificacaoPessoa: 'cli_ABC',
        codigoSusep: 22222,
        tipoPerfil: ProfileTypeEnum.LOCAL,
        informacaoContaResseguro: new ReinsuranceAccountEntity({
          agencia: '0001',
          banco: '341',
          codigoTipoConta: 'C',
          numeroContaOutraInstituicaoFinanceira: '12345',
          numeroDigitoValidadorContaOutraInstituicaoFinanceira: '9',
          numeroUnicoConta: '987654321',
        }),
      });

      const dto = CriarResseguradorResponseMapper.toDto(entity);

      expect(dto.codigo_ressegurador).toBe(1111);
      expect(dto.codigo_identificacao_pessoa).toBe('cli_ABC');
      expect(dto.codigo_susep).toBe(22222);
      expect(dto.tipo_perfil).toBe(ProfileTypeEnum.LOCAL);
      expect(dto.informacao_conta_resseguro.agencia).toBe('0001');
    });
  });
});
