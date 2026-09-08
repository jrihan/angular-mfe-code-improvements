import { BuscarBrokerResponseEntity } from '../entities/response/buscar_broker_response.entity';

export abstract class BuscarBrokerUseCase {
  abstract execute(id: string): Promise<BuscarBrokerResponseEntity | null>;
}
