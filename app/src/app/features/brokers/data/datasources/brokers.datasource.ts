import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { BuscarBrokerResponseDto } from '../dtos/response/buscar_broker_response.dto';
import { ListarBrokersResponseDto } from '../dtos/response/listar_brokers_response.dto';
import { CriarBrokerRequestDto } from '../dtos/request/criar_broker_request.dto';
import { CriarBrokerResponseDto } from '../dtos/response/criar_broker_response.dto';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseDto } from 'src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { BuscarInstituicoesFinanceirasResponseDto } from 'src/app/shared/data/dtos/response/buscar_instituicoes_financeiras.response.dto';
import { AtualizarBrokerRequestDto } from '../dtos/request/atualizar_broker_request.dto';

export abstract class BrokersDatasource {
  abstract buscarBroker(id: string): Promise<BuscarBrokerResponseDto | null>;
  abstract listarBrokers(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseDto | null>;
  abstract cadastrarBroker(
    payload: CriarBrokerRequestDto
  ): Promise<CriarBrokerResponseDto | null>;
  abstract buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseDto | null>;
  abstract buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseDto | null>;
  abstract atualizarBroker(payload: AtualizarBrokerRequestDto): Promise<null>;
}
