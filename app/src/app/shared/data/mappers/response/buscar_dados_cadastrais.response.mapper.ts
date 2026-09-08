import { BuscarDadosCadastraisResponseEntity } from '../../../domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarDadosCadastraisResponseDto } from '../../dtos/response/buscar_dados_cadastrais.response.dto';
import { BankAccountMapper } from '../bank_account.mapper';
import { RegistrationDataMapper } from '../registration_data.mapper';

export class BuscarDadosCadastraisResponseMapper {
  static toEntity(
    dto: BuscarDadosCadastraisResponseDto
  ): BuscarDadosCadastraisResponseEntity {
    return new BuscarDadosCadastraisResponseEntity({
      idCliente: dto.id_cliente || '',
      situacaoCadastral: dto.situacao_cadastral || '',
      dadosCadastrais: RegistrationDataMapper.toEntity(dto.dados_cadastrais),
      dadosConta: (dto.dados_conta || []).map((conta) =>
        BankAccountMapper.toEntity(conta)
      ),
    });
  }

  static toDto(
    entity: BuscarDadosCadastraisResponseEntity
  ): BuscarDadosCadastraisResponseDto {
    return {
      id_cliente: entity.idCliente,
      situacao_cadastral: entity.situacaoCadastral,
      dados_cadastrais: RegistrationDataMapper.toDto(entity.dadosCadastrais),
      dados_conta: (entity.dadosConta || []).map((conta) =>
        BankAccountMapper.toDto(conta)
      ),
    };
  }
}
