import { AtualizarResseguradorRequestEntity } from '../../../domain/entities/request/atualizar_ressegurador_request.entity';
import { AtualizarResseguradorRequestDto } from '../../dtos/request/atualizar_ressegurador_request.dto';
import { CriarResseguradorRequestMapper } from './criar_ressegurador_request.mapper';

export class AtualizarResseguradorRequestMapper {
  static toDto(
    entity: AtualizarResseguradorRequestEntity
  ): AtualizarResseguradorRequestDto {
    return CriarResseguradorRequestMapper.toDto(entity);
  }
}
