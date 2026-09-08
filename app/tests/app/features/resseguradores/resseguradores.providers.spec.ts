import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RESSEGURADORES_PROVIDERS } from '../../../../src/app/features/resseguradores/resseguradores.providers';
import { ResseguradoresDatasource } from '../../../../src/app/features/resseguradores/data/datasources/resseguradores.datasource';
import { ResseguradoresDatasourceImpl } from '../../../../src/app/features/resseguradores/data/datasources/resseguradores.datasource.impl';
import { ResseguradoresRepository } from '../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { ResseguradoresRepositoryImpl } from '../../../../src/app/features/resseguradores/data/repositories/resseguradores.repository.impl';
import { BuscarResseguradorUseCase } from '../../../../src/app/features/resseguradores/domain/usecases/buscar_ressegurador.usecase';
import { BuscarResseguradorUseCaseImpl } from '../../../../src/app/features/resseguradores/application/usecases/buscar_ressegurador.app.usecase.impl';
import { ListarResseguradoresUseCase } from '../../../../src/app/features/resseguradores/domain/usecases/listar_resseguradores.usecase';
import { ListarResseguradoresUseCaseImpl } from '../../../../src/app/features/resseguradores/application/usecases/listar_resseguradores.app.usecase.impl';
import { CadastrarResseguradorUseCase } from '../../../../src/app/features/resseguradores/domain/usecases/cadastrar_ressegurador.usecase';
import { CadastrarResseguradorUseCaseImpl } from '../../../../src/app/features/resseguradores/application/usecases/cadastrar_ressegurador.app.usecase.impl';

describe('RESSEGURADORES_PROVIDERS', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [...RESSEGURADORES_PROVIDERS],
    });
  });

  it('deve exportar uma lista de provedores válida', () => {
    expect(RESSEGURADORES_PROVIDERS).toBeDefined();
    expect(Array.isArray(RESSEGURADORES_PROVIDERS)).toBe(true);
    expect(RESSEGURADORES_PROVIDERS.length).toBeGreaterThan(0);
  });

  it('deve prover o datasource como ResseguradoresDatasourceImpl', () => {
    const datasource = TestBed.inject(ResseguradoresDatasource);
    expect(datasource).toBeInstanceOf(ResseguradoresDatasourceImpl);
  });

  it('deve prover o repository como ResseguradoresRepositoryImpl', () => {
    const repository = TestBed.inject(ResseguradoresRepository);
    expect(repository).toBeInstanceOf(ResseguradoresRepositoryImpl);
  });

  it('deve prover as usecases corretas', () => {
    expect(TestBed.inject(BuscarResseguradorUseCase)).toBeInstanceOf(
      BuscarResseguradorUseCaseImpl
    );
    expect(TestBed.inject(ListarResseguradoresUseCase)).toBeInstanceOf(
      ListarResseguradoresUseCaseImpl
    );
    expect(TestBed.inject(CadastrarResseguradorUseCase)).toBeInstanceOf(
      CadastrarResseguradorUseCaseImpl
    );
  });
});
