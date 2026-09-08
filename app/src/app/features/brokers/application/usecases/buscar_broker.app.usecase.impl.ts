import { Injectable } from '@angular/core';
import { BuscarBrokerUseCase } from '../../domain/usecases/buscar_broker.usecase';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { BuscarBrokerResponseEntity } from '../../domain/entities/response/buscar_broker_response.entity';

@Injectable()
export class BuscarBrokerUseCaseImpl implements BuscarBrokerUseCase {
  constructor(private readonly repository: BrokersRepository) {}

  execute(id: string): Promise<BuscarBrokerResponseEntity | null> {
    return this.repository.buscarBroker(id);
  }
}
