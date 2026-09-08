import { Provider } from '@angular/core';
import {
  COMPANHIA_RESSEGURADA_DATASOURCE,
  COMPANHIA_RESSEGURADA_REPOSITORY,
  COMPANHIA_RESSEGURADA_USECASES,
} from 'src/app/core/tokens/companhia_ressegurada.tokens';
import { CompanhiaResseguradaRepositoryImpl } from './data/repositories/companhia-ressegurada.repository.impl';
import { BuscarCompanhiaPorCnpjUseCaseImpl } from './application/usecases/buscar-dados-cadastrais.app.usecase.impl';
import { ListarCompanhiasResseguradasUseCaseImpl } from './application/usecases/listar-companhias-resseguradas.app.usecase.impl';
import { EnviarCadastroCompanhiaUseCaseImpl } from './application/usecases/enviar-cadastro-companhia.app.usecase.impl';
import { ListagemInstituicoesFinanceirasUseCaseImpl } from './application/usecases/buscar-bancos.app.usecase.impl';
import { CompanhiaResseguradaDatasourceImpl } from './data/datasources/companhia-ressegurada.datasource.impl';

export const COMPANHIA_RESSEGURADA_PROVIDERS: Provider[] = [
  // -----------------------------
  // DataSource
  // -----------------------------
  {
    provide: COMPANHIA_RESSEGURADA_DATASOURCE,
    useClass: CompanhiaResseguradaDatasourceImpl,
  },
  // -----------------------------
  // Repository
  // -----------------------------
  {
    provide: COMPANHIA_RESSEGURADA_REPOSITORY,
    useClass: CompanhiaResseguradaRepositoryImpl,
  },

  // -----------------------------
  // UseCases
  // -----------------------------
  {
    provide: COMPANHIA_RESSEGURADA_USECASES.BUSCAR_COMPANHIA_POR_CNPJ,
    useClass: BuscarCompanhiaPorCnpjUseCaseImpl,
  },

  {
    provide: COMPANHIA_RESSEGURADA_USECASES.LISTAR_COMPANHIAS_RESSEGURADAS,
    useClass: ListarCompanhiasResseguradasUseCaseImpl,
  },

  {
    provide: COMPANHIA_RESSEGURADA_USECASES.ENVIAR_CADASTRO_COMPANHIA,
    useClass: EnviarCadastroCompanhiaUseCaseImpl,
  },

  {
    provide: COMPANHIA_RESSEGURADA_USECASES.BUSCAR_BANCOS,
    useClass: ListagemInstituicoesFinanceirasUseCaseImpl,
  },
];
