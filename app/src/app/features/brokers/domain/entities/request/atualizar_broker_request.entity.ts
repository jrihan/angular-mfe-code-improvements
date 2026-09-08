import { CriarBrokerRequestEntity } from './criar_broker_request.entity';

export class AtualizarBrokerRequestEntity extends CriarBrokerRequestEntity {
  constructor(props: Omit<AtualizarBrokerRequestEntity, 'copyWith'>) {
    super(props);
  }
}
