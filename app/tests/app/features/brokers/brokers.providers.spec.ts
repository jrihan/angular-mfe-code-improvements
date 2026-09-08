import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BROKERS_PROVIDERS } from '../../../../src/app/features/brokers/brokers.providers';
import { BrokersDatasource } from '../../../../src/app/features/brokers/data/datasources/brokers.datasource';
import { BrokersRepositoryImpl } from '../../../../src/app/features/brokers/data/repositories/brokers.repository.impl';
import { BrokersRepository } from '../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { BuscarBrokerUseCase } from '../../../../src/app/features/brokers/domain/usecases/buscar_broker.usecase';
import { BuscarDadosCadastraisUseCase } from '../../../../src/app/features/brokers/domain/usecases/buscar_dados_cadastrais.usecase';
import { CadastrarBrokerUseCase } from '../../../../src/app/features/brokers/domain/usecases/cadastrar_broker.usecase';
import { ListarBrokersUseCase } from '../../../../src/app/features/brokers/domain/usecases/listar_brokers.usecase';
import { BuscarBrokerUseCaseImpl } from '../../../../src/app/features/brokers/application/usecases/buscar_broker.app.usecase.impl';
import { BuscarDadosCadastraisUseCaseImpl } from '../../../../src/app/features/brokers/application/usecases/buscar_dados_cadastrais.app.usecase.impl';
import { CadastrarBrokerUseCaseImpl } from '../../../../src/app/features/brokers/application/usecases/cadastrar_broker.app.usecase.impl';
import { ListarBrokersUseCaseImpl } from '../../../../src/app/features/brokers/application/usecases/listar_brokers.app.usecase.impl';
import { LogService } from '../../../../src/app/shared/services/log/log.service';
import { BrokersDatasourceImpl } from 'src/app/features/brokers/data/datasources/brokers.datasource.impl';

describe('BROKERS_PROVIDERS', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LogService,
          useValue: {
            debug: jest.fn(),
            info: jest.fn(),
            notice: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            critical: jest.fn(),
            alert: jest.fn(),
            emergency: jest.fn(),
            ok: jest.fn(),
          },
        },
        ...BROKERS_PROVIDERS,
      ],
    });
  });

  it('deve exportar uma lista de provedores válida', () => {
    expect(BROKERS_PROVIDERS).toBeDefined();
    expect(Array.isArray(BROKERS_PROVIDERS)).toBe(true);
    expect(BROKERS_PROVIDERS.length).toBeGreaterThan(0);
  });

  it('deve prover o datasource como BrokersMockDatasourceImpl', () => {
    const datasource = TestBed.inject(BrokersDatasource);

    expect(datasource).toBeInstanceOf(BrokersDatasourceImpl);
  });

  it('deve prover o repository como BrokersRepositoryImpl', () => {
    const repository = TestBed.inject(BrokersRepository);

    expect(repository).toBeInstanceOf(BrokersRepositoryImpl);
  });

  it('deve prover as usecases corretas', () => {
    expect(TestBed.inject(BuscarBrokerUseCase)).toBeInstanceOf(
      BuscarBrokerUseCaseImpl
    );
    expect(TestBed.inject(ListarBrokersUseCase)).toBeInstanceOf(
      ListarBrokersUseCaseImpl
    );
    expect(TestBed.inject(CadastrarBrokerUseCase)).toBeInstanceOf(
      CadastrarBrokerUseCaseImpl
    );
    expect(TestBed.inject(BuscarDadosCadastraisUseCase)).toBeInstanceOf(
      BuscarDadosCadastraisUseCaseImpl
    );
  });
});
