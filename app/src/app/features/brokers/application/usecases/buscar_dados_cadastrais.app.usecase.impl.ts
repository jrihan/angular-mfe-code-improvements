import { Injectable } from '@angular/core';

import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { BuscarDadosCadastraisUseCase } from '../../domain/usecases/buscar_dados_cadastrais.usecase';

@Injectable()
export class BuscarDadosCadastraisUseCaseImpl
  implements BuscarDadosCadastraisUseCase
{
  constructor(private readonly repository: BrokersRepository) {}

  execute(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null> {
    return this.repository.buscarDadosCadastrais(params);
  }
}
