import { ResseguradorFactory } from './ressegurador.factory';
import { BuscarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';

describe('ResseguradorFactory', () => {
  describe('create', () => {
    it('deve gerar uma entidade sem override', () => {
      const entity = ResseguradorFactory.create();

      expect(entity).toBeInstanceOf(BuscarResseguradorResponseEntity);
    });

    it('deve respeitar o override', () => {
      const entity = ResseguradorFactory.create({ idCliente: 'cli-123' });

      expect(entity.idCliente).toBe('cli-123');
    });
  });

  describe('createList', () => {
    it('deve gerar a lista padrão de 3 entidades', () => {
      const list = ResseguradorFactory.createList();

      expect(list).toHaveLength(3);
      list.forEach((item) =>
        expect(item).toBeInstanceOf(BuscarResseguradorResponseEntity)
      );
    });

    it('deve gerar a quantidade informada', () => {
      expect(ResseguradorFactory.createList(5)).toHaveLength(5);
    });
  });
});
