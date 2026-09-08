import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

export abstract class BuscarInstituicoesFinanceirasUseCase {
  abstract execute(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null>;
}
