import { Inject, Injectable } from '@angular/core';
import { CompanhiaResseguradaRepository } from '../../domain/repositories/companhia-ressegurada.repository';
import { ListarCompanhiasResseguradasUseCase } from '../../domain/usecases/listar-companhias-resseguradas.usecase';
import { COMPANHIA_RESSEGURADA_REPOSITORY } from 'src/app/core/tokens/companhia_ressegurada.tokens';

@Injectable()
export class ListarCompanhiasResseguradasUseCaseImpl
  implements ListarCompanhiasResseguradasUseCase
{
  constructor(
    @Inject(COMPANHIA_RESSEGURADA_REPOSITORY)
    private repository: CompanhiaResseguradaRepository
  ) {}

  execute(): Promise<any> {
    return this.repository.listarCompanhias();
  }
}
