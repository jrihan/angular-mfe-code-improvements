/// <reference types="jest" />

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationEvent } from '@ids/tools';
import { HomeBrokerComponent } from '../../../../../../../src/app/features/brokers/presentation/pages/home_broker/home_broker.component';
import { NavigationService } from '../../../../../../../src/app/shared/navigation.service';
import { NavigationRoute } from '../../../../../../../src/app/shared/navigation-routes';
import { ListarBrokersUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/listar_brokers.usecase';

describe('HomeBrokerComponent', () => {
  let component: HomeBrokerComponent;
  let fixture: ComponentFixture<HomeBrokerComponent>;
  let mockNavigation: { navigate: jest.Mock };
  let mockListarBrokers: { execute: any };

  const createBroker = (overrides: Record<string, unknown> = {}) => ({
    idDbResseguro: 'broker-1',
    codigoSusep: 12345,
    situacaoCadastral: 'ATIVO',
    dadosCadastrais: {
      nomeCompleto: 'Broker Alpha',
      tipoDocumento: 'CNPJ',
      numeroDocumento: '12345678000199',
    },
    ...overrides,
  });

  beforeEach(waitForAsync(() => {
    mockNavigation = { navigate: jest.fn() };
    mockListarBrokers = { execute: jest.fn() };

    TestBed.configureTestingModule({
      imports: [HomeBrokerComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: NavigationService, useValue: mockNavigation },
        { provide: ListarBrokersUseCase, useValue: mockListarBrokers },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(HomeBrokerComponent, {
        set: { template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBrokerComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar loadBrokers no ngOnInit', () => {
    const spy = jest.spyOn(component, 'loadBrokers').mockResolvedValue();

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('deve carregar brokers com sucesso e aplicar filtros locais', async () => {
    const response = {
      content: [
        createBroker(),
        createBroker({
          idDbResseguro: 'broker-2',
          codigoSusep: 98765,
          situacaoCadastral: 'INATIVO',
          dadosCadastrais: {
            nomeCompleto: 'Broker Beta',
            tipoDocumento: 'NIF',
            numeroDocumento: 'AB123456',
          },
        }),
      ],
      page: { totalElements: 2 },
    };
    mockListarBrokers.execute.mockResolvedValue(response);
    component.filterForm.patchValue({
      nomeCompleto: 'alpha',
      codigoSusep: '123',
      situacaoCadastral: 'ativo',
      tipoDocumento: 'cnpj',
      numeroDocumento: '12345678',
    });

    await component.loadBrokers();

    expect(mockListarBrokers.execute).toHaveBeenCalledWith({
      page: 0,
      size: 10,
    });
    expect(component.allBrokers).toEqual(response.content);
    expect(component.total).toBe(2);
    expect(component.brokersList).toEqual({
      content: [response.content[0]],
      page: response.page,
    });
    expect(component.isLoading).toBe(false);
  });

  it('deve zerar a listagem quando a resposta nao trouxer content', async () => {
    mockListarBrokers.execute.mockResolvedValue({ page: { totalElements: 0 } });

    await component.loadBrokers();

    expect(component.brokersList).toBeNull();
    expect(component.allBrokers).toEqual([]);
    expect(component.total).toBe(0);
  });

  it('deve tratar erro ao carregar brokers', async () => {
    mockListarBrokers.execute.mockRejectedValue(new Error('falha'));

    await component.loadBrokers();

    expect(component.brokersList).toBeNull();
    expect(component.allBrokers).toEqual([]);
    expect(component.total).toBe(0);
    expect(component.isLoading).toBe(false);
  });

  it('deve excluir registros que nao atendem aos filtros locais', () => {
    component.allBrokers = [
      createBroker(),
      createBroker({
        idDbResseguro: 'broker-2',
        codigoSusep: 54321,
        situacaoCadastral: 'INATIVO',
        dadosCadastrais: {
          nomeCompleto: 'Outro Broker',
          tipoDocumento: 'CGI',
          numeroDocumento: 'ZZ999',
        },
      }),
    ];
    component.filterForm.patchValue({
      nomeCompleto: 'nao existe',
      codigoSusep: '999',
      situacaoCadastral: 'ATIVO',
      tipoDocumento: 'CNPJ',
      numeroDocumento: '0000',
    });

    component.aplicarFiltroLocal({ page: { totalElements: 2 } });

    expect(component.brokersList).toEqual({
      content: [],
      page: { totalElements: 2 },
    });
  });

  it('deve atualizar pagina e recarregar ao paginar', () => {
    const spy = jest.spyOn(component, 'loadBrokers').mockResolvedValue();
    const event = { currentPage: 3, pageSize: 20 } as PaginationEvent;

    component.paginationChange(event);

    expect(component.currentPage).toBe(3);
    expect(component.pageSize).toBe(20);
    expect(spy).toHaveBeenCalled();
  });

  it('deve abrir e fechar o side sheet de filtros', () => {
    component.abrirFiltros();
    expect(component.isSideSheetOpen).toBe(true);

    component.fecharFiltros();
    expect(component.isSideSheetOpen).toBe(false);
  });

  it('deve aplicar filtros reiniciando a pagina e fechando o painel', () => {
    const loadSpy = jest.spyOn(component, 'loadBrokers').mockResolvedValue();
    const closeSpy = jest.spyOn(component, 'fecharFiltros');
    component.currentPage = 5;

    component.aplicarFiltros();

    expect(component.currentPage).toBe(1);
    expect(loadSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('deve limpar filtros, reiniciar pagina e fechar o painel', () => {
    const loadSpy = jest.spyOn(component, 'loadBrokers').mockResolvedValue();
    const closeSpy = jest.spyOn(component, 'fecharFiltros');
    component.filterForm.patchValue({
      nomeCompleto: 'Teste',
      codigoSusep: '123',
      situacaoCadastral: 'ATIVO',
      tipoDocumento: 'CNPJ',
      numeroDocumento: '11',
    });

    component.limparFiltros();

    expect(component.filterForm.value).toEqual({
      nomeCompleto: '',
      codigoSusep: '',
      situacaoCadastral: '',
      tipoDocumento: '',
      numeroDocumento: '',
    });
    expect(component.currentPage).toBe(1);
    expect(loadSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('deve informar quando ha filtros ativos', () => {
    expect(component.isFiltroAtivo).toBe(false);

    component.filterForm.patchValue({ nomeCompleto: 'Broker' });

    expect(component.isFiltroAtivo).toBe(true);
  });

  it('deve navegar para detalhes, edicao, criacao e home', () => {
    component.goToDetails('abc');
    component.goToEdit('def');
    component.goToCreate();
    component.goBack();

    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(
      1,
      NavigationRoute.BrokersDetalhe,
      { mode: 'visualize', id: 'abc' }
    );
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(
      2,
      NavigationRoute.BrokersDetalhe,
      { mode: 'edit', id: 'def' }
    );
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(
      3,
      NavigationRoute.BrokersDetalhe,
      { mode: 'create' }
    );
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(
      4,
      NavigationRoute.Home
    );
  });
});
