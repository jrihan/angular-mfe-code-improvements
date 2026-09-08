import { ListagemInstituicoesFinanceirasEntity } from '../entities/instituicoes-financeiras.entity';

export abstract class ListagemInstituicoesFinanceirasUseCase {
  abstract execute(): Promise<ListagemInstituicoesFinanceirasEntity>;
}
