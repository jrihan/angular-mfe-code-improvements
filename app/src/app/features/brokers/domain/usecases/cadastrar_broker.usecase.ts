import { CriarBrokerRequestEntity } from '../entities/request/criar_broker_request.entity';
import { CriarBrokerResponseEntity } from '../entities/response/criar_broker_response.entity';

export abstract class CadastrarBrokerUseCase {
  abstract execute(
    payload: CriarBrokerRequestEntity
  ): Promise<CriarBrokerResponseEntity | null>;
}
