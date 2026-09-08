import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { COMPANHIA_RESSEGURADA_PROVIDERS } from 'src/app/features/companhia_ressegurada/companhia_ressegurada.providers';
import { ContextService } from 'src/app/shared/services/context.service';
import {
  COMPANHIA_RESSEGURADA_DATASOURCE,
  COMPANHIA_RESSEGURADA_REPOSITORY,
  COMPANHIA_RESSEGURADA_USECASES,
} from 'src/app/core/tokens/companhia_ressegurada.tokens';
import { CompanhiaResseguradaDatasourceImpl } from 'src/app/features/companhia_ressegurada/data/datasources/companhia-ressegurada.datasource.impl';
import { CompanhiaResseguradaRepositoryImpl } from 'src/app/features/companhia_ressegurada/data/repositories/companhia-ressegurada.repository.impl';
import { BuscarCompanhiaPorCnpjUseCaseImpl } from 'src/app/features/companhia_ressegurada/application/usecases/buscar-dados-cadastrais.app.usecase.impl';
import { ListarCompanhiasResseguradasUseCaseImpl } from 'src/app/features/companhia_ressegurada/application/usecases/listar-companhias-resseguradas.app.usecase.impl';
import { EnviarCadastroCompanhiaUseCaseImpl } from 'src/app/features/companhia_ressegurada/application/usecases/enviar-cadastro-companhia.app.usecase.impl';
import { ListagemInstituicoesFinanceirasUseCaseImpl } from 'src/app/features/companhia_ressegurada/application/usecases/buscar-bancos.app.usecase.impl';

declare const expect: jest.Expect;

describe('COMPANHIA_RESSEGURADA_PROVIDERS', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ContextService,
          useValue: {
            getContext: jest.fn(),
            getBearerToken: jest.fn().mockReturnValue('mock-token'),
          },
        },
        ...COMPANHIA_RESSEGURADA_PROVIDERS,
      ],
    });
  });

  it('deve exportar uma lista de provedores válida', () => {
    expect(COMPANHIA_RESSEGURADA_PROVIDERS).toBeDefined();
    expect(Array.isArray(COMPANHIA_RESSEGURADA_PROVIDERS)).toBe(true);
    expect(COMPANHIA_RESSEGURADA_PROVIDERS.length).toBeGreaterThan(0);
  });

  it('deve prover COMPANHIA_RESSEGURADA_DATASOURCE como CompanhiaResseguradaDatasourceImpl ou CompanhiaResseguradaMockDatasourceImpl', () => {
    const datasource = TestBed.inject(COMPANHIA_RESSEGURADA_DATASOURCE);
    const isValid = datasource instanceof CompanhiaResseguradaDatasourceImpl;
    expect(isValid).toBe(true);
  });

  it('deve prover COMPANHIA_RESSEGURADA_REPOSITORY como CompanhiaResseguradaRepositoryImpl', () => {
    const repository = TestBed.inject(COMPANHIA_RESSEGURADA_REPOSITORY);
    expect(repository).toBeInstanceOf(CompanhiaResseguradaRepositoryImpl);
  });

  it('deve prover as usecases corretas', () => {
    const buscarCnpj = TestBed.inject(
      COMPANHIA_RESSEGURADA_USECASES.BUSCAR_COMPANHIA_POR_CNPJ
    );
    const listarCompanhias = TestBed.inject(
      COMPANHIA_RESSEGURADA_USECASES.LISTAR_COMPANHIAS_RESSEGURADAS
    );
    const enviarCadastro = TestBed.inject(
      COMPANHIA_RESSEGURADA_USECASES.ENVIAR_CADASTRO_COMPANHIA
    );
    const buscarBancos = TestBed.inject(
      COMPANHIA_RESSEGURADA_USECASES.BUSCAR_BANCOS
    );

    expect(buscarCnpj).toBeInstanceOf(BuscarCompanhiaPorCnpjUseCaseImpl);
    expect(listarCompanhias).toBeInstanceOf(
      ListarCompanhiasResseguradasUseCaseImpl
    );
    expect(enviarCadastro).toBeInstanceOf(EnviarCadastroCompanhiaUseCaseImpl);
    expect(buscarBancos).toBeInstanceOf(
      ListagemInstituicoesFinanceirasUseCaseImpl
    );
  });
});
