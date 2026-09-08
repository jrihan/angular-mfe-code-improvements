import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CadastroCompanhiaResseguradaComponent } from '../../../../../../src/app/features/companhia_ressegurada/presentation/cadastro-companhia-ressegurada/cadastro-companhia-ressegurada.component';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { NavigationService } from '../../../../../../src/app/shared/navigation.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationRoute } from '../../../../../../src/app/shared/navigation-routes';
import { COMPANHIA_RESSEGURADA_USECASES } from '../../../../../../src/app/core/tokens/companhia_ressegurada.tokens';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockBuscarCompanhiaPorCnpj = {
  execute: jest.fn().mockResolvedValue({
    dados_cadastrais: {
      nome_completo: 'Teste',
      nome_fantasia: 'Fantasia',
      enderecos: [],
      telefones: [],
      emails: [],
    },
    dados_conta: [],
  }),
};

const mockEnviarCadastroCompanhia = {
  execute: jest.fn().mockResolvedValue({}),
};

const mockBuscarBancos = {
  execute: jest.fn().mockResolvedValue([]),
};

describe('CadastroCompanhiaResseguradaComponent', () => {
  let component: CadastroCompanhiaResseguradaComponent;
  let fixture: ComponentFixture<CadastroCompanhiaResseguradaComponent>;
  let snackbarService: SnackbarService;
  let navigationService: NavigationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CadastroCompanhiaResseguradaComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: SnackbarService, useValue: { showSnackbar: jest.fn() } },
        { provide: NavigationService, useValue: { navigate: jest.fn() } },
        {
          provide: COMPANHIA_RESSEGURADA_USECASES.BUSCAR_COMPANHIA_POR_CNPJ,
          useValue: mockBuscarCompanhiaPorCnpj,
        },
        {
          provide: COMPANHIA_RESSEGURADA_USECASES.ENVIAR_CADASTRO_COMPANHIA,
          useValue: mockEnviarCadastroCompanhia,
        },
        {
          provide: COMPANHIA_RESSEGURADA_USECASES.BUSCAR_BANCOS,
          useValue: mockBuscarBancos,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroCompanhiaResseguradaComponent);
    component = fixture.componentInstance;
    snackbarService = TestBed.inject(SnackbarService);
    navigationService = TestBed.inject(NavigationService);

    // Reset mocks
    mockBuscarCompanhiaPorCnpj.execute.mockClear();
    mockEnviarCadastroCompanhia.execute.mockClear();
    mockBuscarBancos.execute.mockClear();

    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar bancos ao inicializar', async () => {
    const spy = jest.spyOn(component, 'carregarBancos');
    await component.carregarBancos();
    expect(spy).toHaveBeenCalled();
  });

  it('deve buscar por CNPJ e preencher dados', async () => {
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    await component.buscarDadosCadastrais();
    expect(component.dadosCadastrais).toBeTruthy();
  });

  it('deve mostrar erro ao buscar por CNPJ com exceção', async () => {
    mockBuscarCompanhiaPorCnpj.execute.mockRejectedValueOnce(new Error('erro'));
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    await component.buscarDadosCadastrais();
    expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Erro ao buscar companhia ressegurada',
      'error'
    );
  });

  it('deve validar isCnpjCompleto corretamente', () => {
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    expect(component.isCnpjCompleto).toBe(true);
    component.cnpjForm.get('cnpj')?.setValue('12.345');
    expect(component.isCnpjCompleto).toBe(false);
  });

  it('deve validar getSusepErrorMessage', () => {
    const control = component.susepForm.get('susep');
    control?.markAsTouched();
    control?.setValue('');
    expect(component.getSusepErrorMessage()).toBe('Obrigatório');
    control?.setValue('123');
    expect(component.getSusepErrorMessage()).toBe(
      'Deve conter 5 dígitos numéricos'
    );
    control?.setValue('12345');
    expect(component.getSusepErrorMessage()).toBe('');
  });

  it('deve validar getCodigoCompanhiaErrorMessage', () => {
    const control = component.susepForm.get('codigoCompanhiaRessegurada');
    expect(component.getCodigoCompanhiaErrorMessage()).toBe('');
    control?.markAsTouched();
    control?.setValue('');
    expect(component.getCodigoCompanhiaErrorMessage()).toBe('Obrigatório');
    control?.setValue('abc');
    expect(component.getCodigoCompanhiaErrorMessage()).toBe('Somente números');
    control?.setValue('10');
    expect(component.getCodigoCompanhiaErrorMessage()).toBe('');
  });

  it('deve validar getCodigoCentroCustoErrorMessage', () => {
    const control = component.susepForm.get('codigoCentroCusto');
    expect(component.getCodigoCentroCustoErrorMessage()).toBe('');
    control?.markAsTouched();
    control?.setValue('abc');
    expect(component.getCodigoCentroCustoErrorMessage()).toBe(
      'Somente números'
    );
    control?.setValue('');
    expect(component.getCodigoCentroCustoErrorMessage()).toBe('');
  });

  it('deve aceitar somente números nos códigos de companhia e centro de custo', () => {
    component.onCodigoNumericoInput(
      { target: { value: '1a2b3' } } as any,
      'codigoCompanhiaRessegurada'
    );
    component.onCodigoNumericoInput(
      { target: { value: 'x99' } } as any,
      'codigoCentroCusto'
    );
    expect(component.susepForm.get('codigoCompanhiaRessegurada')?.value).toBe(
      '123'
    );
    expect(component.susepForm.get('codigoCentroCusto')?.value).toBe('99');
  });

  it('não deve habilitar salvar sem codigo_companhia_ressegurada', () => {
    component.dadosConta = [];
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '',
    });
    component.contaForm.patchValue({
      banco: '001',
      agencia: '1234',
      conta: '56789',
      dac: '0',
      tipo: 'CC',
    });
    expect(component.susepForm.valid).toBe(false);
    expect(component.isSalvarHabilitado).toBe(false);
  });

  it('deve chamar salvarCadastro e navegar em sucesso', async () => {
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.contaForm.get('banco')?.setValue('001');
    component.contaForm.get('agencia')?.setValue('1234');
    component.contaForm.get('conta')?.setValue('56789');
    component.contaForm.get('dac')?.setValue('0');
    component.contaForm.get('tipo')?.setValue('CC');
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Cadastro enviado com sucesso!',
      'success'
    );
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.CompanhiaResseguradaHome
    );
  });

  it('deve omitir codigo_centro_custo do payload quando não preenchido', async () => {
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
      codigoCentroCusto: '',
    });
    component.contaForm.patchValue({
      banco: '001',
      agencia: '1234',
      conta: '56789',
      dac: '0',
      tipo: 'CC',
    });
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(mockEnviarCadastroCompanhia.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        companhia_ressegurada: { codigo_companhia_ressegurada: 10 },
      })
    );
  });

  it('deve enviar codigo_centro_custo no payload quando preenchido', async () => {
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
      codigoCentroCusto: '55',
    });
    component.contaForm.patchValue({
      banco: '001',
      agencia: '1234',
      conta: '56789',
      dac: '0',
      tipo: 'CC',
    });
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(mockEnviarCadastroCompanhia.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        companhia_ressegurada: {
          codigo_companhia_ressegurada: 10,
          codigo_centro_custo: 55,
        },
      })
    );
  });

  it('deve enviar dados_cadastrais consultados no payload do cadastro', async () => {
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-99');
    await component.buscarDadosCadastrais();
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.contaForm.get('banco')?.setValue('001');
    component.contaForm.get('agencia')?.setValue('1234');
    component.contaForm.get('conta')?.setValue('56789');
    component.contaForm.get('dac')?.setValue('0');
    component.contaForm.get('tipo')?.setValue('CC');
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(mockEnviarCadastroCompanhia.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        dados_cadastrais: {
          nome_completo: 'Teste',
          nome_fantasia: 'Fantasia',
        },
      })
    );
  });

  it('deve enviar dados_cadastrais vazios se não houver consulta prévia', async () => {
    component.dadosCadastrais = null;
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.contaForm.get('banco')?.setValue('001');
    component.contaForm.get('agencia')?.setValue('1234');
    component.contaForm.get('conta')?.setValue('56789');
    component.contaForm.get('dac')?.setValue('0');
    component.contaForm.get('tipo')?.setValue('CC');
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(mockEnviarCadastroCompanhia.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        dados_cadastrais: {
          nome_completo: '',
          nome_fantasia: '',
        },
      })
    );
  });

  it('deve mostrar erro ao salvar cadastro com exceção', async () => {
    mockEnviarCadastroCompanhia.execute.mockRejectedValueOnce(
      new Error('erro')
    );
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.contaForm.get('banco')?.setValue('001');
    component.contaForm.get('agencia')?.setValue('1234');
    component.contaForm.get('conta')?.setValue('56789');
    component.contaForm.get('dac')?.setValue('0');
    component.contaForm.get('tipo')?.setValue('CC');
    component.dadosConta = [];
    await component.salvarCadastro();
    expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Erro ao enviar cadastro',
      'error'
    );
  });

  it('deve formatar corretamente o CNPJ ao digitar', () => {
    const event = { target: { value: '12345678000190' } } as any;
    component.onCnpjInput(event);
    expect(component.cnpjForm.get('cnpj')?.value).toBe('12.345.678/0001-90');
  });

  it('deve formatar corretamente o SUSEP ao digitar', () => {
    const event = { target: { value: '123456' } } as any;
    component.onSusepInput(event);
    expect(component.susepForm.get('susep')?.value).toBe('12345');
  });

  it('deve marcar uma linha como selecionada ao chamar checkRow', () => {
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: false,
      },
      {
        codigo_banco: '5',
        codigo_agencia: '6',
        tipo_conta: 'CP',
        codigo_conta: '7',
        dac: '8',
        selected: false,
      },
    ];
    const row = component.dadosConta[1];
    component.checkRow(row);
    expect(row.selected).toBe(true);
    expect(component.dadosConta[0].selected).toBe(false);
  });

  it('deve desmarcar todas as linhas ao chamar checkAll', () => {
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: true,
      },
      {
        codigo_banco: '5',
        codigo_agencia: '6',
        tipo_conta: 'CP',
        codigo_conta: '7',
        dac: '8',
        selected: true,
      },
    ];
    component.checkAll(true);
    expect(component.dadosConta.every((c) => !c.selected)).toBe(true);
  });

  it('deve marcar todos os forms como touched ao chamar markContaFormTouched', () => {
    const spy1 = jest.spyOn(component.contaForm, 'markAllAsTouched');
    const spy2 = jest.spyOn(component.susepForm, 'markAllAsTouched');
    component.markContaFormTouched();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('deve retornar contaSelecionada corretamente', () => {
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: false,
      },
      {
        codigo_banco: '5',
        codigo_agencia: '6',
        tipo_conta: 'CP',
        codigo_conta: '7',
        dac: '8',
        selected: true,
      },
    ];
    expect(component.contaSelecionada).toEqual(component.dadosConta[1]);
  });

  it('deve validar isSalvarHabilitado sem contas', () => {
    component.dadosConta = [];
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.contaForm.get('banco')?.setValue('001');
    component.contaForm.get('agencia')?.setValue('1234');
    component.contaForm.get('conta')?.setValue('56789');
    component.contaForm.get('dac')?.setValue('0');
    component.contaForm.get('tipo')?.setValue('CC');
    expect(component.isSalvarHabilitado).toBe(true);
  });

  it('deve validar isSalvarHabilitado com contas e conta selecionada', () => {
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: true,
      },
    ];
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    expect(component.isSalvarHabilitado).toBe(true);
  });

  it('deve retornar false em isSalvarHabilitado se susepForm inválido', () => {
    component.dadosConta = [];
    component.susepForm.get('susep')?.setValue('');
    expect(component.isSalvarHabilitado).toBe(false);
  });

  it('deve retornar undefined em contaSelecionada se nenhuma selecionada', () => {
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: false,
      },
    ];
    expect(component.contaSelecionada).toBeUndefined();
  });

  it('não deve salvar cadastro se não habilitado', async () => {
    component.dadosConta = [];
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(false);
    const result = await component.salvarCadastro();
    expect(result).toBeUndefined();
  });

  it('deve chamar salvarCadastro com conta selecionada', async () => {
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: true,
      },
    ];
    await component.salvarCadastro();
    expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Cadastro enviado com sucesso!',
      'success'
    );
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.CompanhiaResseguradaHome
    );
  });

  it('deve carregar bancos e chamar detectChanges', async () => {
    const cdr = (component as any).cdr;
    const spy = jest.spyOn(cdr, 'detectChanges');
    await component.carregarBancos();
    expect(spy).toHaveBeenCalled();
  });

  it('deve buscarDadosCadastrais preencher dadosConta', async () => {
    mockBuscarCompanhiaPorCnpj.execute.mockResolvedValueOnce({
      dados_cadastrais: {
        nome_completo: 'Teste',
        nome_fantasia: 'Fantasia',
        enderecos: [],
        telefones: [],
        emails: [],
      },
      dados_conta: [
        {
          codigo_banco: '1',
          codigo_agencia: '2',
          codigo_tipo_conta: 'CC',
          codigo_conta: '3',
          dac: '4',
        },
      ],
    });
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    await component.buscarDadosCadastrais();
    expect(component.dadosConta.length).toBe(1);
  });

  it('deve navegar ao chamar goBack', () => {
    component.goBack();
    expect(navigationService.navigate).toHaveBeenCalledWith(
      NavigationRoute.CompanhiaResseguradaHome
    );
  });

  it('deve paginar dadosConta obtendo subconjunto correto', () => {
    component.dadosConta = Array.from({ length: 15 }, (_, i) => ({
      codigo_banco: `${i + 1}`,
      codigo_agencia: '0001',
      tipo_conta: 'CC',
      codigo_conta: `1234${i}`,
      dac: '0',
    }));
    component.currentPage = 1;
    component.pageSize = 10;
    expect(component.dadosContaPaginada.length).toBe(10);
    expect(component.dadosContaPaginada[0].codigo_banco).toBe('1');
    expect(component.dadosContaPaginada[9].codigo_banco).toBe('10');

    component.currentPage = 2;
    expect(component.dadosContaPaginada.length).toBe(5);
    expect(component.dadosContaPaginada[0].codigo_banco).toBe('11');
    expect(component.dadosContaPaginada[4].codigo_banco).toBe('15');
  });

  it('deve atualizar currentPage e pageSize no evento de paginar', () => {
    const cdr = (component as any).cdr;
    const spy = jest.spyOn(cdr, 'detectChanges');

    component.onPaginate({ currentPage: 3, pageSize: 20 });
    expect(component.currentPage).toBe(3);
    expect(component.pageSize).toBe(20);
    expect(spy).toHaveBeenCalled();
  });

  it('deve gerar opcoes dinâmicas únicas a partir de dadosConta', () => {
    component.dadosConta = [
      {
        codigo_banco: '341',
        codigo_agencia: '0300',
        tipo_conta: 'CC',
        codigo_conta: '12345',
        dac: '9',
      },
      {
        codigo_banco: '341',
        codigo_agencia: '0400',
        tipo_conta: 'CP',
        codigo_conta: '67890',
        dac: '1',
      },
      {
        codigo_banco: '001',
        codigo_agencia: '0300',
        tipo_conta: 'CC',
        codigo_conta: '11111',
        dac: '9',
      },
    ];

    expect(component.opcoesFiltroBanco).toEqual([
      { optLabel: '001', optValue: '001' },
      { optLabel: '341', optValue: '341' },
    ]);

    expect(component.opcoesFiltroAgencia).toEqual([
      { optLabel: '0300', optValue: '0300' },
      { optLabel: '0400', optValue: '0400' },
    ]);

    expect(component.opcoesFiltroTipo).toEqual([
      { optLabel: 'Conta Corrente', optValue: 'CC' },
      { optLabel: 'Conta Poupança', optValue: 'CP' },
    ]);

    expect(component.opcoesFiltroDac).toEqual([
      { optLabel: '1', optValue: '1' },
      { optLabel: '9', optValue: '9' },
    ]);
  });

  it('deve filtrar as contas corretamente usando os múltiplos filtros especializados e resetar página no onFiltroInput', () => {
    component.dadosConta = [
      {
        codigo_banco: '341',
        codigo_agencia: '0300',
        tipo_conta: 'CC',
        codigo_conta: '12345',
        dac: '9',
      },
      {
        codigo_banco: '001',
        codigo_agencia: '0400',
        tipo_conta: 'CP',
        codigo_conta: '67890',
        dac: '1',
      },
    ];

    // Filtro de banco
    component.filtroBanco.setValue('341');
    expect(component.dadosContaFiltrados.length).toBe(1);
    expect(component.dadosContaFiltrados[0].codigo_banco).toBe('341');
    component.filtroBanco.setValue('');

    // Filtro de tipo
    component.filtroTipo.setValue('CP');
    expect(component.dadosContaFiltrados.length).toBe(1);
    expect(component.dadosContaFiltrados[0].tipo_conta).toBe('CP');
    component.filtroTipo.setValue('');

    // Filtro de agência
    component.filtroAgencia.setValue('0400');
    expect(component.dadosContaFiltrados.length).toBe(1);
    expect(component.dadosContaFiltrados[0].codigo_agencia).toBe('0400');
    component.filtroAgencia.setValue('');

    // Filtro de dac
    component.filtroDac.setValue('9');
    expect(component.dadosContaFiltrados.length).toBe(1);
    expect(component.dadosContaFiltrados[0].dac).toBe('9');
    component.filtroDac.setValue('');

    // Filtro de Código Conta (busca parcial)
    component.filtroContaExata.setValue('34');
    expect(component.dadosContaFiltrados.length).toBe(1);
    expect(component.dadosContaFiltrados[0].codigo_conta).toBe('12345');
    component.filtroContaExata.setValue('');

    expect(component.dadosContaFiltrados.length).toBe(2);

    const cdr = (component as any).cdr;
    const spy = jest.spyOn(cdr, 'detectChanges');
    component.currentPage = 2;
    component.onFiltroInput();
    expect(component.currentPage).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('deve retornar string vazia em getSusepErrorMessage se o controle não for touched', () => {
    const control = component.susepForm.get('susep');
    control?.markAsUntouched();
    control?.setValue('');
    expect(component.getSusepErrorMessage()).toBe('');
  });

  it('deve lidar com resposta null/undefined da API no buscarDadosCadastrais exibindo info do snackbar', async () => {
    mockBuscarCompanhiaPorCnpj.execute.mockResolvedValueOnce(null);
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    await component.buscarDadosCadastrais();
    expect(component.dadosCadastrais).toBeNull();
    expect(snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Cliente não cadastrado.',
      'info',
      5000
    );
  });

  it('não deve salvar cadastro se houver contas mas nenhuma estiver selecionada (contaSelecionada undefined)', async () => {
    component.susepForm.patchValue({
      susep: '12345',
      codigoCompanhiaRessegurada: '10',
    });
    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: false,
      },
    ];
    const spy = jest.spyOn(navigationService, 'navigate');
    await component.salvarCadastro();
    expect(spy).not.toHaveBeenCalled();
  });

  it('deve retornar tipo de conta original em opcoesFiltroTipo se o tipo não estiver em tiposConta (Linha 136)', () => {
    component.dadosConta = [
      {
        codigo_banco: '341',
        codigo_agencia: '0300',
        tipo_conta: 'XX', // Tipo de conta que não existe em tiposConta
        codigo_conta: '12345',
        dac: '9',
      },
    ];
    expect(component.opcoesFiltroTipo).toEqual([
      { optLabel: 'XX', optValue: 'XX' },
    ]);
  });

  it('deve lidar com filtros e campos de contas nulos ou indefinidos (Linhas 182-186, 190)', () => {
    // 1. Configurar contas com campos nulos/indefinidos
    component.dadosConta = [
      {
        codigo_banco: null as any,
        codigo_agencia: null as any,
        tipo_conta: null as any,
        codigo_conta: null as any,
        dac: null as any,
      },
    ];

    // 2. Definir valores dos controles do formulário de filtro como null
    component.filtroBanco.setValue(null);
    component.filtroAgencia.setValue(null);
    component.filtroTipo.setValue(null);
    component.filtroDac.setValue(null);
    component.filtroContaExata.setValue(null);

    // Deve bater todos por conta do nullish coalescing do filtro coincidir com ''
    expect(component.dadosContaFiltrados.length).toBe(1);

    // Agora, se os filtros tiverem termos não-vazios, eles não devem bater pois o valor do campo é null (que vira '')
    component.filtroBanco.setValue('341');
    expect(component.dadosContaFiltrados.length).toBe(0);
  });

  it('deve validar isCnpjCompleto quando o controle cnpj for null (Linha 224)', () => {
    jest.spyOn(component.cnpjForm, 'get').mockReturnValueOnce(null);
    expect(component.isCnpjCompleto).toBe(false);
  });

  it('deve usar string vazia no buscarDadosCadastrais se o controle cnpj for null (Linha 289)', async () => {
    jest.spyOn(component.cnpjForm, 'get').mockReturnValueOnce(null);
    mockBuscarCompanhiaPorCnpj.execute.mockResolvedValueOnce(null);
    await component.buscarDadosCadastrais();
    expect(mockBuscarCompanhiaPorCnpj.execute).toHaveBeenCalledWith('');
  });

  it('deve inicializar dadosConta como array vazio se response.dados_conta for null ou undefined (Linha 304)', async () => {
    mockBuscarCompanhiaPorCnpj.execute.mockResolvedValueOnce({
      dados_cadastrais: {
        nome_completo: 'Teste',
        nome_fantasia: 'Fantasia',
        enderecos: [],
        telefones: [],
        emails: [],
      },
      dados_conta: null as any,
    });
    component.cnpjForm.get('cnpj')?.setValue('12.345.678/0001-90');
    await component.buscarDadosCadastrais();
    expect(component.dadosConta).toEqual([]);
  });

  it('deve retornar do salvarCadastro se contaSelecionada for indefinido mesmo se isSalvarHabilitado for forçado a true (Linha 357)', async () => {
    // Forçar isSalvarHabilitado para true
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);

    component.dadosConta = [
      {
        codigo_banco: '1',
        codigo_agencia: '2',
        tipo_conta: 'CC',
        codigo_conta: '3',
        dac: '4',
        selected: false, // Nenhuma selecionada -> contaSelecionada será undefined
      },
    ];

    const spyExec = jest.spyOn(mockEnviarCadastroCompanhia, 'execute');
    await component.salvarCadastro();
    expect(spyExec).not.toHaveBeenCalled();
  });
});
