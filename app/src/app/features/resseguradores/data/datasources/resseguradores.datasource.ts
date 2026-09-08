import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { ListarResseguradoresResponseDto } from '../dtos/response/listar_resseguradores_response.dto';
import { BuscarResseguradorResponseDto } from '../dtos/response/buscar_ressegurador_response.dto';
import { CriarResseguradorRequestDto } from '../dtos/request/criar_ressegurador_request.dto';
import { CriarResseguradorResponseDto } from '../dtos/response/criar_ressegurador_response.dto';
import { AtualizarResseguradorRequestDto } from '../dtos/request/atualizar_ressegurador_request.dto';
import { BuscarDadosCadastraisResponseDto } from 'src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarInstituicoesFinanceirasResponseDto } from 'src/app/shared/data/dtos/response/buscar_instituicoes_financeiras.response.dto';

export abstract class ResseguradoresDatasource {
  abstract buscarRessegurador(
    id: string
  ): Promise<BuscarResseguradorResponseDto | null>;
  abstract listarResseguradores(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseDto | null>;
  abstract cadastrarRessegurador(
    payload: CriarResseguradorRequestDto
  ): Promise<CriarResseguradorResponseDto | null>;
  abstract atualizarRessegurador(
    payload: AtualizarResseguradorRequestDto
  ): Promise<null>;
  abstract buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseDto | null>;
  abstract buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseDto | null>;
}
