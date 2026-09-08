import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { ListarResseguradoresResponseEntity } from '../entities/response/listar_resseguradores_response.entity';

export abstract class ListarResseguradoresUseCase {
  abstract execute(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseEntity | null>;
}
