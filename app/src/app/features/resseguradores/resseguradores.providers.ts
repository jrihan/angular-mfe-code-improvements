import { Provider } from '@angular/core';
import { ResseguradoresDatasource } from './data/datasources/resseguradores.datasource';
// import { ResseguradoresDatasourceImpl } from './data/datasources/resseguradores.datasource.impl';
import { ResseguradoresRepository } from './domain/repositories/resseguradores.repository';
import { ResseguradoresRepositoryImpl } from './data/repositories/resseguradores.repository.impl';
import { BuscarResseguradorUseCase } from './domain/usecases/buscar_ressegurador.usecase';
import { BuscarResseguradorUseCaseImpl } from './application/usecases/buscar_ressegurador.app.usecase.impl';
import { ListarResseguradoresUseCase } from './domain/usecases/listar_resseguradores.usecase';
import { ListarResseguradoresUseCaseImpl } from './application/usecases/listar_resseguradores.app.usecase.impl';
import { CadastrarResseguradorUseCase } from './domain/usecases/cadastrar_ressegurador.usecase';
import { CadastrarResseguradorUseCaseImpl } from './application/usecases/cadastrar_ressegurador.app.usecase.impl';
import { AtualizarResseguradorUseCase } from './domain/usecases/atualizar_ressegurador.usecase';
import { AtualizarResseguradorUseCaseImpl } from './application/usecases/atualizar_ressegurador.app.usecase.impl';
import { BuscarDadosCadastraisUseCase } from './domain/usecases/buscar_dados_cadastrias.usecase';
import { BuscarDadosCadastraisUseCaseImpl } from './application/usecases/buscar_dados_cadastrais.app.usecase.impl';
// import { ResseguradoresDatasourceImpl } from './data/datasources/resseguradores.datasource.impl';
import { BuscarInstituicoesFinanceirasUseCase } from './domain/usecases/buscar_instituicoes_financeiras.usecase';
import { BuscarInstituicoesFinanceirasAppUsecaseImpl } from './application/usecases/buscar_instituicoes_financeiras.app.usecase.impl';
import { ResseguradoresDatasourceImpl } from './data/datasources/resseguradores.datasource.impl';

export const RESSEGURADORES_PROVIDERS: Provider[] = [
  // -----------------------------
  // DataSource
  // -----------------------------
  {
    provide: ResseguradoresDatasource,
    useClass: ResseguradoresDatasourceImpl,
  },
  // -----------------------------
  // Repository
  // -----------------------------
  {
    provide: ResseguradoresRepository,
    useClass: ResseguradoresRepositoryImpl,
  },

  // -----------------------------
  // UseCases
  // -----------------------------
  {
    provide: BuscarResseguradorUseCase,
    useClass: BuscarResseguradorUseCaseImpl,
  },
  {
    provide: ListarResseguradoresUseCase,
    useClass: ListarResseguradoresUseCaseImpl,
  },
  {
    provide: CadastrarResseguradorUseCase,
    useClass: CadastrarResseguradorUseCaseImpl,
  },
  {
    provide: AtualizarResseguradorUseCase,
    useClass: AtualizarResseguradorUseCaseImpl,
  },
  {
    provide: BuscarDadosCadastraisUseCase,
    useClass: BuscarDadosCadastraisUseCaseImpl,
  },
  {
    provide: BuscarInstituicoesFinanceirasUseCase,
    useClass: BuscarInstituicoesFinanceirasAppUsecaseImpl,
  },
];
