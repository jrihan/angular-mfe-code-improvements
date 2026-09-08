import { Injectable } from '@angular/core';
import { AtualizarBrokerUseCase } from '../../domain/usecases/atualizar_broker.usecase';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { AtualizarBrokerRequestEntity } from '../../domain/entities/request/atualizar_broker_request.entity';

@Injectable()
export class AtualizarBrokerUseCaseImpl implements AtualizarBrokerUseCase {
  constructor(private readonly repository: BrokersRepository) {}

  execute(payload: AtualizarBrokerRequestEntity): Promise<null> {
    return this.repository.atualizarBroker(payload);
  }
}
