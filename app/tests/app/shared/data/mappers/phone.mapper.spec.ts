import { PhoneMapper } from '../../../../../src/app/shared/data/mappers/phone.mapper';
import { PhoneEntity } from '../../../../../src/app/shared/domain/entities/phone.entity';
import { PhonePurposeEnum } from '../../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../../src/app/shared/domain/enum/phone_type.enum';
import { PhoneDto } from '../../../../../src/app/shared/data/dtos/phone.dto';

describe('PhoneMapper', () => {
  const baseDto: PhoneDto = {
    proposito_telefone: 'PRINCIPAL',
    tipo_telefone: 'MOVEL',
    ddi: 55,
    ddd: 11,
    numero: 999999999,
    nome_contato: 'João',
  };

  describe('toEntity', () => {
    it('deve mapear proposito PRINCIPAL e tipo MOVEL', () => {
      const entity = PhoneMapper.toEntity(baseDto);
      expect(entity).toBeInstanceOf(PhoneEntity);
      expect(entity.propositoTelefone).toBe(PhonePurposeEnum.PRINCIPAL);
      expect(entity.tipoTelefone).toBe(PhoneTypeEnum.MOVEL);
      expect(entity.ddi).toBe(55);
      expect(entity.ddd).toBe(11);
      expect(entity.numero).toBe(999999999);
      expect(entity.nomeContato).toBe('João');
    });

    it('deve mapear proposito COMERCIAL e tipo FIXO', () => {
      const entity = PhoneMapper.toEntity({
        ...baseDto,
        proposito_telefone: 'comercial',
        tipo_telefone: 'FIXO',
      });
      expect(entity.propositoTelefone).toBe(PhonePurposeEnum.COMERCIAL);
      expect(entity.tipoTelefone).toBe(PhoneTypeEnum.FIXO);
    });

    it('deve mapear proposito desconhecido para OUTROS e variação MÓVEL', () => {
      const entity = PhoneMapper.toEntity({
        ...baseDto,
        proposito_telefone: 'QUALQUER',
        tipo_telefone: 'MÓVEL',
      });
      expect(entity.propositoTelefone).toBe(PhonePurposeEnum.OUTROS);
      expect(entity.tipoTelefone).toBe(PhoneTypeEnum.MOVEL);
    });

    it('deve manter MOVEL como padrão para tipo desconhecido', () => {
      const entity = PhoneMapper.toEntity({
        ...baseDto,
        tipo_telefone: 'CELULAR',
      });
      expect(entity.tipoTelefone).toBe(PhoneTypeEnum.MOVEL);
    });

    it('deve usar padrões (OUTROS/MOVEL) quando proposito e tipo estiverem ausentes', () => {
      const entity = PhoneMapper.toEntity({
        ddi: 55,
        ddd: 11,
        numero: 999999999,
      } as PhoneDto);
      expect(entity.propositoTelefone).toBe(PhonePurposeEnum.OUTROS);
      expect(entity.tipoTelefone).toBe(PhoneTypeEnum.MOVEL);
    });
  });

  describe('toDto', () => {
    it('deve converter a entidade em DTO', () => {
      const entity = new PhoneEntity({
        propositoTelefone: PhonePurposeEnum.PRINCIPAL,
        tipoTelefone: PhoneTypeEnum.MOVEL,
        ddi: 55,
        ddd: 11,
        numero: 999999999,
        nomeContato: 'João',
      });

      const dto = PhoneMapper.toDto(entity);

      expect(dto).toEqual({
        proposito_telefone: PhonePurposeEnum.PRINCIPAL,
        tipo_telefone: PhoneTypeEnum.MOVEL,
        ddi: 55,
        ddd: 11,
        numero: 999999999,
        nome_contato: 'João',
      });
    });
  });
});
