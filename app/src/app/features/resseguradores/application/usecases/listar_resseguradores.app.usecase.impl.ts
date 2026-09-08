import { Injectable } from '@angular/core';
import { ListarResseguradoresUseCase } from '../../domain/usecases/listar_resseguradores.usecase';
import { ListarResseguradoresResponseEntity } from '../../domain/entities/response/listar_resseguradores_response.entity';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';

@Injectable()
export class ListarResseguradoresUseCaseImpl
  implements ListarResseguradoresUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}

  execute(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseEntity | null> {
    return this.repository.listarResseguradores(params);
  }
}
