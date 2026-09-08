import { CriarResseguradorRequestEntity } from '../entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorResponseEntity } from '../entities/response/criar_ressegurador_response.entity';

export abstract class CadastrarResseguradorUseCase {
  abstract execute(
    payload: CriarResseguradorRequestEntity
  ): Promise<CriarResseguradorResponseEntity | null>;
}
