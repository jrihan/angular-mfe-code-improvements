import { BuscarResseguradorResponseEntity } from '../entities/response/buscar_ressegurador_response.entity';

export abstract class BuscarResseguradorUseCase {
  abstract execute(
    id: string
  ): Promise<BuscarResseguradorResponseEntity | null>;
}
