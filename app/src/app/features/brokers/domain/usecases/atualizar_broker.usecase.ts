import { AtualizarBrokerRequestEntity } from '../entities/request/atualizar_broker_request.entity';

export abstract class AtualizarBrokerUseCase {
  abstract execute(payload: AtualizarBrokerRequestEntity): Promise<null>;
}
