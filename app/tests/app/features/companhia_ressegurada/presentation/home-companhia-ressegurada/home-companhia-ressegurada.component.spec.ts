import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeCompanhiaResseguradaComponent } from '../../../../../../src/app/features/companhia_ressegurada/presentation/home-companhia-ressegurada/home-companhia-ressegurada.component';
import { NavigationService } from '../../../../../../src/app/shared/navigation.service';
import { NavigationRoute } from '../../../../../../src/app/shared/navigation-routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { COMPANHIA_RESSEGURADA_USECASES } from '../../../../../../src/app/core/tokens/companhia_ressegurada.tokens';

describe('HomeCompanhiaResseguradaComponent', () => {
  let component: HomeCompanhiaResseguradaComponent;
  let fixture: ComponentFixture<HomeCompanhiaResseguradaComponent>;
  let navigationService: NavigationService;
  let mockListarCompanhias: any;

  beforeEach(waitForAsync(() => {
    mockListarCompanhias = {
      execute: jest.fn().mockResolvedValue({
        content: [
          {
            codigo_tipo_persona: 'J',
            id_cliente: 'cliente-1',
            id_dbresseguro: 'db-1',
            situacao_cadastral: 'ATIVO',
            codigo_susep: 1234,
            codigo_companhia_ressegurada: 1,
            codigo_centro_custo: 1,
            dados_cadastrais: {
              nome_completo: 'Companhia Teste SA',
              nome_fantasia: 'Companhia Teste',
              tipo_documento: 'CNPJ',
              numero_documento: '12345678000199',
              pais: 'BR',
            },
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      }),
    };

    TestBed.configureTestingModule({
      imports: [HomeCompanhiaResseguradaComponent],
      providers: [
        {
          provide: NavigationService,
          useValue: { navigate: jest.fn() },
        },
        {
          provide:
            COMPANHIA_RESSEGURADA_USECASES.LISTAR_COMPANHIAS_RESSEGURADAS,
          useValue: mockListarCompanhias,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCompanhiaResseguradaComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar e carregar companhias', async () => {
    const spy = jest.spyOn(component, 'loadCompanhias');
    await component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('deve carregar companhias e atualizar dados de paginação', async () => {
    await component.loadCompanhias();

    expect(component.data1).toHaveLength(1);
    expect(component.data1[0].id_cliente).toBe('cliente-1');
    expect(component.total).toBe(1);
    expect(component.currentPage).toBe(1);
    expect(component.currentPageSize).toBe(10);
    expect(component.isLoading).toBe(false);
  });

  it('deve navegar para cadastro ao chamar goTo', () => {
    component.goTo('companhia-ressegurada-cadastro');
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.CompanhiaResseguradaCadastro
    );
  });

  it('deve navegar para home ao chamar goBack', () => {
    component.goBack();
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.Home
    );
  });
});
