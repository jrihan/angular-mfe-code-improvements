import { Injectable } from '@angular/core';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';
import { AtualizarResseguradorUseCase } from '../../domain/usecases/atualizar_ressegurador.usecase';
import { AtualizarResseguradorRequestEntity } from '../../domain/entities/request/atualizar_ressegurador_request.entity';

@Injectable()
export class AtualizarResseguradorUseCaseImpl
  implements AtualizarResseguradorUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}

  execute(payload: AtualizarResseguradorRequestEntity): Promise<null> {
    return this.repository.atualizarRessegurador(payload);
  }
}
