import { BuscarDadosCadastraisResponseEntity } from '../entities/buscar-dados-cadastrais.entity';
import { CadastroCompanhiaResseguradaEntity } from '../entities/cadastro-companhia-ressegurada.entity';
import { ListagemInstituicoesFinanceirasEntity } from '../entities/instituicoes-financeiras.entity';

export abstract class CompanhiaResseguradaRepository {
  abstract buscarDadosCadastrais(
    cnpj: string
  ): Promise<BuscarDadosCadastraisResponseEntity | null>;
  abstract enviarCadastro(
    payload: CadastroCompanhiaResseguradaEntity
  ): Promise<any>;
  abstract listarCompanhias(): Promise<any>;
  abstract buscarBancos(): Promise<ListagemInstituicoesFinanceirasEntity>;
}
