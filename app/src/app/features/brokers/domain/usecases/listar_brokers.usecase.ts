import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { ListarBrokersResponseEntity } from '../entities/response/listar_brokers_response.entity';

export abstract class ListarBrokersUseCase {
  abstract execute(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseEntity | null>;
}
