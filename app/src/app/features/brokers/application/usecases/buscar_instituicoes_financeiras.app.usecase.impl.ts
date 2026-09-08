import { Injectable } from '@angular/core';
import { BuscarInstituicoesFinanceirasUseCase } from '../../domain/usecases/buscar_instituicoes_financeiras.usecase';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';

@Injectable()
export class BuscarInstituicoesFinanceirasAppUsecaseImpl
  implements BuscarInstituicoesFinanceirasUseCase
{
  constructor(private readonly repository: BrokersRepository) {}
  execute(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null> {
    return this.repository.buscarInstituicoesFinanceiras();
  }
}
