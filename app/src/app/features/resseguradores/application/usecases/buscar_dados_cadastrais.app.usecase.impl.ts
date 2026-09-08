import { Injectable } from '@angular/core';

import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';
import { BuscarDadosCadastraisUseCase } from '../../domain/usecases/buscar_dados_cadastrias.usecase';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';

@Injectable()
export class BuscarDadosCadastraisUseCaseImpl
  implements BuscarDadosCadastraisUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}

  execute(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null> {
    return this.repository.buscarDadosCadastrais(params);
  }
}
