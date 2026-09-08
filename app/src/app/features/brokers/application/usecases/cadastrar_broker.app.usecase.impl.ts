import { Injectable } from '@angular/core';
import { CadastrarBrokerUseCase } from '../../domain/usecases/cadastrar_broker.usecase';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { CriarBrokerRequestEntity } from '../../domain/entities/request/criar_broker_request.entity';
import { CriarBrokerResponseEntity } from '../../domain/entities/response/criar_broker_response.entity';

@Injectable()
export class CadastrarBrokerUseCaseImpl implements CadastrarBrokerUseCase {
  constructor(private readonly repository: BrokersRepository) {}

  execute(
    payload: CriarBrokerRequestEntity
  ): Promise<CriarBrokerResponseEntity | null> {
    return this.repository.cadastrarBroker(payload);
  }
}
