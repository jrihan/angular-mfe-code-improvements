import { Injectable } from '@angular/core';
import { BuscarResseguradorUseCase } from '../../domain/usecases/buscar_ressegurador.usecase';
import { BuscarResseguradorResponseEntity } from '../../domain/entities/response/buscar_ressegurador_response.entity';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';

@Injectable()
export class BuscarResseguradorUseCaseImpl
  implements BuscarResseguradorUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}

  execute(id: string): Promise<BuscarResseguradorResponseEntity | null> {
    return this.repository.buscarRessegurador(id);
  }
}
