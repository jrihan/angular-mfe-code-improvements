import { BuscarDadosCadastraisResponseDto } from '../dtos/buscar-dados-cadastrais.dto';
import { ListagemInstituicoesFinanceirasDto } from '../dtos/instituicoes-financeiras.dto';
import { CadastroCompanhiaResseguradaDto } from '../dtos/cadastro-companhia-ressegurada.dto';
import { CompanhiaResseguradaListItemDto } from '../dtos/companhia-ressegurada-list-item.dto';

export abstract class CompanhiaResseguradaDatasource {
  abstract buscarDadosCadastrais(
    numeroDocumento: string,
    tipoDocumento?: string,
    paisEmissorDocumento?: string
  ): Promise<BuscarDadosCadastraisResponseDto | null>;
  abstract enviarCadastro(
    payload: CadastroCompanhiaResseguradaDto
  ): Promise<any>;
  abstract listarCompanhias(): Promise<{
    content: CompanhiaResseguradaListItemDto[];
    page: any;
  }>;
  abstract buscarBancos(): Promise<ListagemInstituicoesFinanceirasDto>;
}
