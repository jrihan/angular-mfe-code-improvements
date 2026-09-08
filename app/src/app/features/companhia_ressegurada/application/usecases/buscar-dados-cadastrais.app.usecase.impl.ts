import { Inject, Injectable } from '@angular/core';
import { COMPANHIA_RESSEGURADA_REPOSITORY } from 'src/app/core/tokens/companhia_ressegurada.tokens';
import { BuscarDadosCadastraisResponseEntity } from '../../domain/entities/buscar-dados-cadastrais.entity';
import { CompanhiaResseguradaRepository } from '../../domain/repositories/companhia-ressegurada.repository';
import { BuscarCompanhiaPorCnpjUseCase } from '../../domain/usecases/buscar-dados-cadastrais.usecase';

@Injectable()
export class BuscarCompanhiaPorCnpjUseCaseImpl
  implements BuscarCompanhiaPorCnpjUseCase
{
  constructor(
    @Inject(COMPANHIA_RESSEGURADA_REPOSITORY)
    private repository: CompanhiaResseguradaRepository
  ) {}

  execute(cnpj: string): Promise<BuscarDadosCadastraisResponseEntity | null> {
    return this.repository.buscarDadosCadastrais(cnpj);
  }
}
