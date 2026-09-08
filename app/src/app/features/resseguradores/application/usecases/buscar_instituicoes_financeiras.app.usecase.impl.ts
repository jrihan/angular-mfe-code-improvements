import { Injectable } from '@angular/core';
import { BuscarInstituicoesFinanceirasUseCase } from '../../domain/usecases/buscar_instituicoes_financeiras.usecase';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';

@Injectable()
export class BuscarInstituicoesFinanceirasAppUsecaseImpl
  implements BuscarInstituicoesFinanceirasUseCase
{
  constructor(private readonly repository: ResseguradoresRepository) {}
  execute(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null> {
    return this.repository.buscarInstituicoesFinanceiras();
  }
}
