import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';

export abstract class BuscarDadosCadastraisUseCase {
  abstract execute(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null>;
}
