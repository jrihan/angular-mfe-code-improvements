import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeResseguradorComponent } from '../../../../../../src/app/features/resseguradores/presentation/home_ressegurador/home_ressegurador.component';
import { NavigationService } from '../../../../../../src/app/shared/navigation.service';
import { NavigationRoute } from '../../../../../../src/app/shared/navigation-routes';
import { ListarResseguradoresUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/listar_resseguradores.usecase';

const buildRow = (over: any = {}) => ({
  idCliente: over.idCliente ?? '1',
  codigoSusep: over.codigoSusep ?? 12345,
  situacaoCadastral: over.situacaoCadastral ?? 'ATIVO',
  dadosCadastrais: {
    nomeCompleto: over.nomeCompleto ?? 'Alpha Seguros',
    tipoDocumento: over.tipoDocumento ?? 'CNPJ',
    numeroDocumento: over.numeroDocumento ?? '12345678000190',
  },
});

const buildResponse = () => ({
  content: [
    buildRow({ idCliente: '1' }),
    buildRow({
      idCliente: '2',
      codigoSusep: 67890,
      situacaoCadastral: 'INATIVO',
      nomeCompleto: 'Beta Resseguros',
      tipoDocumento: 'NIF',
      numeroDocumento: '99988877766',
    }),
  ],
  page: { size: 10, number: 0, totalElements: 2, totalPages: 1 },
});

describe('HomeResseguradorComponent', () => {
  let component: HomeResseguradorComponent;
  let fixture: ComponentFixture<HomeResseguradorComponent>;
  let navigationService: NavigationService;
  let mockListar: { execute: jest.Mock };

  beforeEach(waitForAsync(() => {
    mockListar = {
      execute: jest.fn().mockResolvedValue(buildResponse()),
    };

    TestBed.configureTestingModule({
      imports: [HomeResseguradorComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: NavigationService, useValue: { navigate: jest.fn() } },
        { provide: ListarResseguradoresUseCase, useValue: mockListar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(HomeResseguradorComponent, {
        set: { template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeResseguradorComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    mockListar.execute.mockClear();
    mockListar.execute.mockResolvedValue(buildResponse());
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar loadResseguradores no ngOnInit', () => {
    const spy = jest.spyOn(component, 'loadResseguradores');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('deve carregar resseguradores com sucesso', async () => {
    await component.loadResseguradores();
    expect(mockListar.execute).toHaveBeenCalledWith({ page: 0, size: 10 });
    expect(component.allResseguradores.length).toBe(2);
    expect(component.total).toBe(2);
    expect(component.resseguradoresList?.content.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it('deve tratar totalElements ausente usando zero', async () => {
    mockListar.execute.mockResolvedValueOnce({
      content: [buildRow()],
      page: undefined,
    });
    await component.loadResseguradores();
    expect(component.total).toBe(0);
  });

  it('deve resetar quando a resposta não possui content', async () => {
    mockListar.execute.mockResolvedValueOnce({ content: null });
    await component.loadResseguradores();
    expect(component.resseguradoresList).toBeNull();
    expect(component.allResseguradores).toEqual([]);
    expect(component.total).toBe(0);
    expect(component.isLoading).toBe(false);
  });

  it('deve resetar quando a resposta é nula', async () => {
    mockListar.execute.mockResolvedValueOnce(null);
    await component.loadResseguradores();
    expect(component.resseguradoresList).toBeNull();
    expect(component.allResseguradores).toEqual([]);
    expect(component.total).toBe(0);
  });

  it('deve tratar erro ao carregar resseguradores', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockListar.execute.mockRejectedValueOnce(new Error('falha'));
    await component.loadResseguradores();
    expect(component.resseguradoresList).toBeNull();
    expect(component.allResseguradores).toEqual([]);
    expect(component.total).toBe(0);
    expect(component.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  describe('aplicarFiltroLocal', () => {
    const response = { page: { size: 10, number: 0, totalElements: 2, totalPages: 1 } };

    beforeEach(() => {
      component.allResseguradores = buildResponse().content;
    });

    it('deve retornar todos quando não houver filtros', () => {
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(2);
      expect(component.resseguradoresList?.page).toBe(response.page);
    });

    it('deve filtrar por nomeCompleto', () => {
      component.filterForm.get('nomeCompleto')?.setValue('beta');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(1);
      expect(component.resseguradoresList?.content[0].dadosCadastrais.nomeCompleto).toBe(
        'Beta Resseguros'
      );
    });

    it('deve remover linhas sem nomeCompleto ao filtrar por nome', () => {
      component.allResseguradores = [buildRow({ nomeCompleto: '' })];
      (component.allResseguradores[0] as any).dadosCadastrais.nomeCompleto = undefined;
      component.filterForm.get('nomeCompleto')?.setValue('alpha');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(0);
    });

    it('deve filtrar por codigoSusep', () => {
      component.filterForm.get('codigoSusep')?.setValue('67890');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(1);
      expect(component.resseguradoresList?.content[0].codigoSusep).toBe(67890);
    });

    it('deve remover linha sem codigoSusep ao filtrar', () => {
      const row = buildRow();
      (row as any).codigoSusep = undefined;
      component.allResseguradores = [row];
      component.filterForm.get('codigoSusep')?.setValue('123');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(0);
    });

    it('deve filtrar por situacaoCadastral', () => {
      component.filterForm.get('situacaoCadastral')?.setValue('inativo');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(1);
      expect(component.resseguradoresList?.content[0].situacaoCadastral).toBe('INATIVO');
    });

    it('deve remover linha sem situacaoCadastral ao filtrar', () => {
      component.allResseguradores = [buildRow({ situacaoCadastral: '' })];
      component.filterForm.get('situacaoCadastral')?.setValue('ativo');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(0);
    });

    it('deve filtrar por tipoDocumento', () => {
      component.filterForm.get('tipoDocumento')?.setValue('nif');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(1);
      expect(component.resseguradoresList?.content[0].dadosCadastrais.tipoDocumento).toBe(
        'NIF'
      );
    });

    it('deve remover linha sem tipoDocumento ao filtrar', () => {
      const row = buildRow();
      (row.dadosCadastrais as any).tipoDocumento = undefined;
      component.allResseguradores = [row];
      component.filterForm.get('tipoDocumento')?.setValue('CNPJ');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(0);
    });

    it('deve filtrar por numeroDocumento ignorando máscara', () => {
      component.filterForm.get('numeroDocumento')?.setValue('12.345.678/0001-90');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(1);
      expect(component.resseguradoresList?.content[0].dadosCadastrais.numeroDocumento).toBe(
        '12345678000190'
      );
    });

    it('deve remover linha sem numeroDocumento ao filtrar', () => {
      const row = buildRow();
      (row.dadosCadastrais as any).numeroDocumento = undefined;
      component.allResseguradores = [row];
      component.filterForm.get('numeroDocumento')?.setValue('123');
      component.aplicarFiltroLocal(response);
      expect(component.resseguradoresList?.content.length).toBe(0);
    });
  });

  it('deve atualizar página e recarregar em paginationChange', () => {
    const spy = jest.spyOn(component, 'loadResseguradores').mockResolvedValue();
    component.paginationChange({ currentPage: 3, pageSize: 20 } as any);
    expect(component.currentPage).toBe(3);
    expect(component.pageSize).toBe(20);
    expect(spy).toHaveBeenCalled();
  });

  it('deve abrir e fechar filtros', () => {
    component.abrirFiltros();
    expect(component.isSideSheetOpen).toBe(true);
    component.fecharFiltros();
    expect(component.isSideSheetOpen).toBe(false);
  });

  it('deve aplicar filtros resetando a página', () => {
    const spy = jest.spyOn(component, 'loadResseguradores').mockResolvedValue();
    component.currentPage = 5;
    component.isSideSheetOpen = true;
    component.aplicarFiltros();
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalled();
    expect(component.isSideSheetOpen).toBe(false);
  });

  it('deve limpar filtros e recarregar', () => {
    const spy = jest.spyOn(component, 'loadResseguradores').mockResolvedValue();
    component.filterForm.get('nomeCompleto')?.setValue('algo');
    component.currentPage = 4;
    component.isSideSheetOpen = true;
    component.limparFiltros();
    expect(component.filterForm.get('nomeCompleto')?.value).toBe('');
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalled();
    expect(component.isSideSheetOpen).toBe(false);
  });

  it('deve indicar filtro ativo quando algum campo estiver preenchido', () => {
    expect(component.isFiltroAtivo).toBe(false);
    component.filterForm.get('codigoSusep')?.setValue('123');
    expect(component.isFiltroAtivo).toBe(true);
  });

  it('deve navegar para detalhes em visualizar', () => {
    component.goToDetails('abc');
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.ResseguradoresDetalhe,
      { mode: 'visualizar', id: 'abc' }
    );
  });

  it('deve navegar para edição', () => {
    component.goToEdit('abc');
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.ResseguradoresDetalhe,
      { mode: 'editar', id: 'abc' }
    );
  });

  it('deve navegar para criação', () => {
    component.goToCreate();
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.ResseguradoresDetalhe,
      { mode: 'criar' }
    );
  });

  it('deve navegar para home ao voltar', () => {
    component.goBack();
    expect(navigationService.navigate).toHaveBeenCalledWith(NavigationRoute.Home);
  });
});
