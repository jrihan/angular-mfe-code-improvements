import { AtualizarResseguradorRequestEntity } from '../entities/request/atualizar_ressegurador_request.entity';

export abstract class AtualizarResseguradorUseCase {
  abstract execute(payload: AtualizarResseguradorRequestEntity): Promise<null>;
}
