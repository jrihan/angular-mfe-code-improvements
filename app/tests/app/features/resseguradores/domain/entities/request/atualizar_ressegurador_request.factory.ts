import { AtualizarResseguradorRequestEntity } from 'src/app/features/resseguradores/domain/entities/request/atualizar_ressegurador_request.entity';
import { CriarResseguradorRequestFactory } from './criar_ressegurador_request.factory';

export class AtualizarResseguradorRequestFactory {
  static create(
    override?: Partial<Omit<AtualizarResseguradorRequestEntity, 'copyWith'>>
  ): AtualizarResseguradorRequestEntity {
    return new AtualizarResseguradorRequestEntity(
      CriarResseguradorRequestFactory.create(override)
    );
  }
}