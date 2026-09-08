import { Inject, Injectable } from '@angular/core';
import { ListagemInstituicoesFinanceirasEntity } from '../../domain/entities/instituicoes-financeiras.entity';
import { CompanhiaResseguradaRepository } from '../../domain/repositories/companhia-ressegurada.repository';
import { ListagemInstituicoesFinanceirasUseCase } from '../../domain/usecases/listagem-instituicoes-financeiras.usecase';
import { COMPANHIA_RESSEGURADA_REPOSITORY } from 'src/app/core/tokens/companhia_ressegurada.tokens';

@Injectable()
export class ListagemInstituicoesFinanceirasUseCaseImpl
  implements ListagemInstituicoesFinanceirasUseCase
{
  constructor(
    @Inject(COMPANHIA_RESSEGURADA_REPOSITORY)
    private repository: CompanhiaResseguradaRepository
  ) {}

  execute(): Promise<ListagemInstituicoesFinanceirasEntity> {
    return this.repository.buscarBancos();
  }
}
