import { Injectable } from '@angular/core';

import { ListarBrokersUseCase } from '../../domain/usecases/listar_brokers.usecase';
import { ListarBrokersResponseEntity } from '../../domain/entities/response/listar_brokers_response.entity';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';

@Injectable()
export class ListarBrokersUseCaseImpl implements ListarBrokersUseCase {
  constructor(private readonly repository: BrokersRepository) {}

  execute(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseEntity | null> {
    return this.repository.listarBrokers(params);
  }
}
