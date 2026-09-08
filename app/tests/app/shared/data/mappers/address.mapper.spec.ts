import { AddressMapper } from '../../../../../src/app/shared/data/mappers/address.mapper';
import { AddressEntity } from '../../../../../src/app/shared/domain/entities/address.entity';
import { AddressTypeEnum } from '../../../../../src/app/shared/domain/enum/address_type.enum';
import { AddressDto } from '../../../../../src/app/shared/data/dtos/address.dto';

describe('AddressMapper', () => {
  const baseDto: AddressDto = {
    proposito_endereco: 'PRINCIPAL',
    logradouro: 'Rua A',
    numero: '100',
    complemento: 'Sala 1',
    bairro: 'Centro',
    cep: '01001000',
    cidade: 'São Paulo',
    uf: 'SP',
    pais: 'Brasil',
    regiao: 'Sudeste',
    codigo_area_postal: '01',
  };

  describe('toEntity', () => {
    it('deve mapear proposito PRINCIPAL', () => {
      const entity = AddressMapper.toEntity(baseDto);
      expect(entity).toBeInstanceOf(AddressEntity);
      expect(entity.propositoEndereco).toBe(AddressTypeEnum.PRINCIPAL);
      expect(entity.logradouro).toBe('Rua A');
      expect(entity.codigoAreaPostal).toBe('01');
    });

    it('deve mapear proposito COMERCIAL (com espaços/minúsculo)', () => {
      const entity = AddressMapper.toEntity({
        ...baseDto,
        proposito_endereco: '  comercial ',
      });
      expect(entity.propositoEndereco).toBe(AddressTypeEnum.COMERCIAL);
    });

    it('deve usar OUTROS para proposito desconhecido', () => {
      const entity = AddressMapper.toEntity({
        ...baseDto,
        proposito_endereco: 'QUALQUER',
      });
      expect(entity.propositoEndereco).toBe(AddressTypeEnum.OUTROS);
    });

    it('deve usar OUTROS e valores padrão quando os campos estiverem ausentes', () => {
      const entity = AddressMapper.toEntity({} as AddressDto);
      expect(entity.propositoEndereco).toBe(AddressTypeEnum.OUTROS);
      expect(entity.logradouro).toBe('');
      expect(entity.numero).toBe('');
      expect(entity.complemento).toBe('');
      expect(entity.bairro).toBe('');
      expect(entity.cep).toBe('');
      expect(entity.cidade).toBe('');
      expect(entity.uf).toBe('');
      expect(entity.pais).toBe('');
      expect(entity.regiao).toBeUndefined();
      expect(entity.codigoAreaPostal).toBeUndefined();
    });
  });

  describe('toDto', () => {
    it('deve converter endereço estrangeiro em DTO com regiao e codigo_area_postal', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.COMERCIAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: 'Sala 1',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'Buenos Aires',
        uf: 'BA',
        pais: 'AR',
        regiao: 'Sudeste',
        codigoAreaPostal: '01',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto.proposito_endereco).toBe(AddressTypeEnum.COMERCIAL);
      expect(dto.logradouro).toBe('Rua A');
      expect(dto.regiao).toBe('Sudeste');
      expect(dto.codigo_area_postal).toBe('01');
    });

    it('não deve enviar regiao nem codigo_area_postal para endereço BR', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.PRINCIPAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: 'Sala 1',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'BR',
        regiao: 'Sudeste',
        codigoAreaPostal: '01',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto.pais).toBe('BR');
      expect(dto).not.toHaveProperty('regiao');
      expect(dto).not.toHaveProperty('codigo_area_postal');
    });

    it('deve preservar CEP para endereço BR', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.PRINCIPAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: 'Sala 1',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'BR',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto.cep).toBe('01001000');
    });

    it('deve omitir CEP e UF para endereço estrangeiro', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.COMERCIAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: 'Sala 1',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'Buenos Aires',
        uf: 'BA',
        pais: 'AR',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto).not.toHaveProperty('cep');
      expect(dto).not.toHaveProperty('uf');
    });

    it('deve omitir complemento quando em branco', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.PRINCIPAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: '   ',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'BR',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto).not.toHaveProperty('complemento');
    });

    it('deve enviar complemento quando preenchido', () => {
      const entity = new AddressEntity({
        propositoEndereco: AddressTypeEnum.PRINCIPAL,
        logradouro: 'Rua A',
        numero: '100',
        complemento: '  Sala 2  ',
        bairro: 'Centro',
        cep: '01001000',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'BR',
      });

      const dto = AddressMapper.toDto(entity);

      expect(dto.complemento).toBe('Sala 2');
    });
  });
});
