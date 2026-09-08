import { Injectable } from '@angular/core';
import { CadastrarResseguradorUseCase } from '../../domain/usecases/cadastrar_ressegurador.usecase';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';
import { CriarResseguradorRequestEntity } from '../../domain/entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorResponseEntity } from '../../domain/entities/response/criar_ressegurador_response.entity';

@Injectable()
export class CadastrarResseguradorUseCaseImpl
  implements CadastrarResseguradorUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}

  execute(
    payload: CriarResseguradorRequestEntity
  ): Promise<CriarResseguradorResponseEntity | null> {
    return this.repository.cadastrarRessegurador(payload);
  }
}
