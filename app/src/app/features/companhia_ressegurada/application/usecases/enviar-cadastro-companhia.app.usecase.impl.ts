import { Inject, Injectable } from '@angular/core';
import { CadastroCompanhiaResseguradaEntity } from '../../domain/entities/cadastro-companhia-ressegurada.entity';
import { CompanhiaResseguradaRepository } from '../../domain/repositories/companhia-ressegurada.repository';
import { EnviarCadastroCompanhiaUseCase } from '../../domain/usecases/enviar-cadastro-companhia.usecase';
import { COMPANHIA_RESSEGURADA_REPOSITORY } from 'src/app/core/tokens/companhia_ressegurada.tokens';

@Injectable()
export class EnviarCadastroCompanhiaUseCaseImpl
  implements EnviarCadastroCompanhiaUseCase
{
  constructor(
    @Inject(COMPANHIA_RESSEGURADA_REPOSITORY)
    private repository: CompanhiaResseguradaRepository
  ) {}

  execute(payload: CadastroCompanhiaResseguradaEntity): Promise<any> {
    return this.repository.enviarCadastro(payload);
  }
}
