import { ReinsuranceAccountMapper } from 'src/app/shared/data/mappers/reinsurance_account.mapper';
import { CriarBrokerResponseEntity } from '../../../domain/entities/response/criar_broker_response.entity';
import { CriarBrokerResponseDto } from '../../dtos/response/criar_broker_response.dto';

export class CriarBrokerResponseMapper {
  static toEntity(dto: CriarBrokerResponseDto): CriarBrokerResponseEntity {
    return new CriarBrokerResponseEntity({
      codigoBroker: dto.codigo_broker,
      codigoIdentificacaoPessoa: dto.codigo_identificacao_pessoa,
      codigoSusep: dto.codigo_susep,
      informacaoContaResseguro: ReinsuranceAccountMapper.toEntity(
        dto.informacao_conta_resseguro
      ),
    });
  }

  static toDto(entity: CriarBrokerResponseEntity): CriarBrokerResponseDto {
    return {
      codigo_broker: entity.codigoBroker,
      codigo_identificacao_pessoa: entity.codigoIdentificacaoPessoa,
      codigo_susep: entity.codigoSusep,
      informacao_conta_resseguro: ReinsuranceAccountMapper.toDto(
        entity.informacaoContaResseguro
      ),
    };
  }
}
