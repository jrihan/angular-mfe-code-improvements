import { BuscarResseguradorResponseEntity } from '../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { BuscarResseguradorResponseEntityFactory } from './buscar_ressegurador_response_entity.factory';

export * from './bank_account_entity.factory';
export * from './registration_data_entity.factory';
export * from './buscar_ressegurador_response_entity.factory';
export * from './criar_ressegurador_request_entity.factory';
export * from './criar_ressegurador_response_entity.factory';
export * from './listar_resseguradores_response_entity.factory';

export class ResseguradorFactory {
  static create(
    override?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
  ): BuscarResseguradorResponseEntity {
    return BuscarResseguradorResponseEntityFactory.create(override);
  }

  static createList(count = 3): BuscarResseguradorResponseEntity[] {
    return BuscarResseguradorResponseEntityFactory.createList(count);
  }
}
