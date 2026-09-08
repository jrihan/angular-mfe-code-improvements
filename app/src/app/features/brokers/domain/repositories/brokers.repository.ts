import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { BuscarBrokerResponseEntity } from '../entities/response/buscar_broker_response.entity';
import { ListarBrokersResponseEntity } from '../entities/response/listar_brokers_response.entity';
import { CriarBrokerRequestEntity } from '../entities/request/criar_broker_request.entity';
import { CriarBrokerResponseEntity } from '../entities/response/criar_broker_response.entity';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { AtualizarBrokerRequestEntity } from '../entities/request/atualizar_broker_request.entity';

export abstract class BrokersRepository {
  abstract buscarBroker(id: string): Promise<BuscarBrokerResponseEntity | null>;
  abstract listarBrokers(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseEntity | null>;
  abstract cadastrarBroker(
    payload: CriarBrokerRequestEntity
  ): Promise<CriarBrokerResponseEntity | null>;
  abstract buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null>;
  abstract buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null>;
  abstract atualizarBroker(
    payload: AtualizarBrokerRequestEntity
  ): Promise<null>;
}
