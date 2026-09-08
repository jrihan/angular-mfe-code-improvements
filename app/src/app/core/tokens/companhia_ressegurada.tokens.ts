import { InjectionToken } from '@angular/core';

import { CompanhiaResseguradaDatasource } from 'src/app/features/companhia_ressegurada/data/datasources/companhia-ressegurada.datasource';
import { CompanhiaResseguradaRepository } from 'src/app/features/companhia_ressegurada/domain/repositories/companhia-ressegurada.repository';
import { ListagemInstituicoesFinanceirasUseCase } from 'src/app/features/companhia_ressegurada/domain/usecases/listagem-instituicoes-financeiras.usecase';
import { BuscarCompanhiaPorCnpjUseCase } from 'src/app/features/companhia_ressegurada/domain/usecases/buscar-dados-cadastrais.usecase';
import { EnviarCadastroCompanhiaUseCase } from 'src/app/features/companhia_ressegurada/domain/usecases/enviar-cadastro-companhia.usecase';
import { ListarCompanhiasResseguradasUseCase } from 'src/app/features/companhia_ressegurada/domain/usecases/listar-companhias-resseguradas.usecase';

export const COMPANHIA_RESSEGURADA_DATASOURCE =
  new InjectionToken<CompanhiaResseguradaDatasource>(
    'COMPANHIA_RESSEGURADA_DATASOURCE'
  );

export const COMPANHIA_RESSEGURADA_REPOSITORY =
  new InjectionToken<CompanhiaResseguradaRepository>(
    'COMPANHIA_RESSEGURADA_REPOSITORY'
  );

export const COMPANHIA_RESSEGURADA_USECASES = {
  BUSCAR_COMPANHIA_POR_CNPJ: new InjectionToken<BuscarCompanhiaPorCnpjUseCase>(
    'BUSCAR_COMPANHIA_POR_CNPJ'
  ),
  LISTAR_COMPANHIAS_RESSEGURADAS:
    new InjectionToken<ListarCompanhiasResseguradasUseCase>(
      'LISTAR_COMPANHIAS_RESSEGURADAS'
    ),
  ENVIAR_CADASTRO_COMPANHIA: new InjectionToken<EnviarCadastroCompanhiaUseCase>(
    'ENVIAR_CADASTRO_COMPANHIA'
  ),
  BUSCAR_BANCOS: new InjectionToken<ListagemInstituicoesFinanceirasUseCase>(
    'BUSCAR_BANCOS'
  ),
};
