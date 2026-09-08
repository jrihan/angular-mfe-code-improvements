import { CriarResseguradorRequestEntity } from './criar_ressegurador_request.entity';

export class AtualizarResseguradorRequestEntity extends CriarResseguradorRequestEntity {
  constructor(props: Omit<AtualizarResseguradorRequestEntity, 'copyWith'>) {
    super(props);
  }
}
