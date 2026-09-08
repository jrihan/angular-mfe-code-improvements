import { Provider } from '@angular/core';
import { BuscarBrokerUseCaseImpl } from './application/usecases/buscar_broker.app.usecase.impl';
import { BuscarDadosCadastraisUseCaseImpl } from './application/usecases/buscar_dados_cadastrais.app.usecase.impl';
import { CadastrarBrokerUseCaseImpl } from './application/usecases/cadastrar_broker.app.usecase.impl';
import { ListarBrokersUseCaseImpl } from './application/usecases/listar_brokers.app.usecase.impl';
import { BrokersDatasource } from './data/datasources/brokers.datasource';
import { BrokersRepositoryImpl } from './data/repositories/brokers.repository.impl';
import { BrokersRepository } from './domain/repositories/brokers.repository';
import { BuscarBrokerUseCase } from './domain/usecases/buscar_broker.usecase';
import { BuscarDadosCadastraisUseCase } from './domain/usecases/buscar_dados_cadastrais.usecase';
import { CadastrarBrokerUseCase } from './domain/usecases/cadastrar_broker.usecase';
import { ListarBrokersUseCase } from './domain/usecases/listar_brokers.usecase';
import { BuscarInstituicoesFinanceirasUseCase } from './domain/usecases/buscar_instituicoes_financeiras.usecase';
import { BuscarInstituicoesFinanceirasAppUsecaseImpl } from './application/usecases/buscar_instituicoes_financeiras.app.usecase.impl';
import { AtualizarBrokerUseCase } from './domain/usecases/atualizar_broker.usecase';
import { AtualizarBrokerUseCaseImpl } from './application/usecases/atualizar_broker.app.usecase.impl';
import { BrokersDatasourceImpl } from './data/datasources/brokers.datasource.impl';

export const BROKERS_PROVIDERS: Provider[] = [
  // -----------------------------
  // DataSource
  // -----------------------------
  {
    provide: BrokersDatasource,
    useClass: BrokersDatasourceImpl,
  },
  // -----------------------------
  // Repository
  // -----------------------------
  {
    provide: BrokersRepository,
    useClass: BrokersRepositoryImpl,
  },

  // -----------------------------
  // UseCases
  // -----------------------------
  {
    provide: BuscarBrokerUseCase,
    useClass: BuscarBrokerUseCaseImpl,
  },
  {
    provide: ListarBrokersUseCase,
    useClass: ListarBrokersUseCaseImpl,
  },
  {
    provide: CadastrarBrokerUseCase,
    useClass: CadastrarBrokerUseCaseImpl,
  },
  {
    provide: BuscarDadosCadastraisUseCase,
    useClass: BuscarDadosCadastraisUseCaseImpl,
  },
  {
    provide: BuscarInstituicoesFinanceirasUseCase,
    useClass: BuscarInstituicoesFinanceirasAppUsecaseImpl,
  },
  {
    provide: AtualizarBrokerUseCase,
    useClass: AtualizarBrokerUseCaseImpl,
  },
];
