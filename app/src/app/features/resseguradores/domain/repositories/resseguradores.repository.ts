import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { ListarResseguradoresResponseEntity } from '../entities/response/listar_resseguradores_response.entity';
import { BuscarResseguradorResponseEntity } from '../entities/response/buscar_ressegurador_response.entity';
import { CriarResseguradorRequestEntity } from '../entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorResponseEntity } from '../entities/response/criar_ressegurador_response.entity';
import { AtualizarResseguradorRequestEntity } from '../entities/request/atualizar_ressegurador_request.entity';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';

export abstract class ResseguradoresRepository {
  abstract buscarRessegurador(
    id: string
  ): Promise<BuscarResseguradorResponseEntity | null>;
  abstract listarResseguradores(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseEntity | null>;
  abstract cadastrarRessegurador(
    payload: CriarResseguradorRequestEntity
  ): Promise<CriarResseguradorResponseEntity | null>;
  abstract atualizarRessegurador(
    payload: AtualizarResseguradorRequestEntity
  ): Promise<null>;
  abstract buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null>;
  abstract buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null>;
}
