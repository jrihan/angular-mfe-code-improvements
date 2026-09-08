import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DetalheBrokerComponent } from '../../../../../../../src/app/features/brokers/presentation/pages/detalhe_broker/detalhe_broker.component';
import { NavigationService } from '../../../../../../../src/app/shared/navigation.service';
import { BuscarBrokerUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/buscar_broker.usecase';
import { BuscarDadosCadastraisUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/buscar_dados_cadastrais.usecase';
import { BuscarInstituicoesFinanceirasUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/buscar_instituicoes_financeiras.usecase';
import { AtualizarBrokerUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/atualizar_broker.usecase';
import { CadastrarBrokerUseCase } from '../../../../../../../src/app/features/brokers/domain/usecases/cadastrar_broker.usecase';
import { CriarBrokerRequestMapper } from '../../../../../../../src/app/features/brokers/data/mappers/request/criar_broker_request.mapper';
import { BuscarBrokerResponseEntity } from '../../../../../../../src/app/features/brokers/domain/entities/response/buscar_broker_response.entity';
import { AddressEntity } from '../../../../../../../src/app/shared/domain/entities/address.entity';
import { BankAccountEntity } from '../../../../../../../src/app/shared/domain/entities/bank_account.entity';
import { EmailEntity } from '../../../../../../../src/app/shared/domain/entities/email.entity';
import { PhoneEntity } from '../../../../../../../src/app/shared/domain/entities/phone.entity';
import { RegistrationDataEntity } from '../../../../../../../src/app/shared/domain/entities/registration_data.entity';
import { AddressTypeEnum } from '../../../../../../../src/app/shared/domain/enum/address_type.enum';
import { BankAccountTypeEnum } from '../../../../../../../src/app/shared/domain/enum/bank_account_type.enum';
import { CountryCodeEnum } from '../../../../../../../src/app/shared/domain/enum/country_code.enum';
import { DocumentTypeEnum } from '../../../../../../../src/app/shared/domain/enum/document_type.enum';
import { MailPurposeEnum } from '../../../../../../../src/app/shared/domain/enum/mail_purpose.enum';
import { PersonTypeEnum } from '../../../../../../../src/app/shared/domain/enum/person_type.enum';
import { PhonePurposeEnum } from '../../../../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../../../../src/app/shared/domain/enum/phone_type.enum';
import { NavigationRoute } from '../../../../../../../src/app/shared/navigation-routes';
import { SnackbarService } from '../../../../../../../src/app/shared/services/snackbar.service';

describe('DetalheBrokerComponent', () => {
  let component: DetalheBrokerComponent;
  let fixture: ComponentFixture<DetalheBrokerComponent>;
  let mockNavigation: { navigate: jest.Mock; current: { params: any } };
  let mockBuscarBroker: { execute: jest.Mock };
  let mockBuscarDadosCadastrais: { execute: jest.Mock };
  let mockCadastrar: { execute: jest.Mock };
  let mockAtualizar: { execute: jest.Mock };
  let mockListarBancos: { execute: jest.Mock };
  let mockSnackbar: { showSnackbar: jest.Mock };

  const createAddress = (overrides: Partial<AddressEntity> = {}) =>
    new AddressEntity({
      propositoEndereco: AddressTypeEnum.PRINCIPAL,
      logradouro: 'Rua A',
      numero: '10',
      complemento: 'Sala 1',
      bairro: 'Centro',
      cep: '12345678',
      cidade: 'Sao Paulo',
      uf: 'sp',
      pais: 'br',
      regiao: '',
      codigoAreaPostal: '',
      ...overrides,
    });

  const createPhone = (overrides: Partial<PhoneEntity> = {}) =>
    new PhoneEntity({
      propositoTelefone: PhonePurposeEnum.PRINCIPAL,
      tipoTelefone: PhoneTypeEnum.MOVEL,
      ddi: 55,
      ddd: 11,
      numero: 987654321,
      nomeContato: '',
      ...overrides,
    });

  const createEmail = (overrides: Partial<EmailEntity> = {}) =>
    new EmailEntity({
      propositoEmail: MailPurposeEnum.PRINCIPAL,
      email: 'teste@broker.com',
      nomeContato: 'Contato',
      ...overrides,
    });

  const createConta = (overrides: Partial<BankAccountEntity> = {}) =>
    new BankAccountEntity({
      contaSelecionada: false,
      codigoBanco: '341',
      codigoAgencia: '1234',
      codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
      codigoConta: '123456',
      dac: '7',
      ...overrides,
    });

  const createBrokerResponse = (
    overrides: Partial<BuscarBrokerResponseEntity> = {}
  ) =>
    new BuscarBrokerResponseEntity({
      codigoTipoPersona: PersonTypeEnum.J,
      idCliente: 'cli-1',
      idDbResseguro: 'broker-1',
      situacaoCadastral: 'ATIVO',
      codigoSusep: 12345,
      dadosCadastrais: new RegistrationDataEntity({
        nomeCompleto: 'Broker Teste',
        nomeFantasia: 'Broker',
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11222333000181',
        pais: 'BR',
        enderecos: [createAddress()],
        telefones: [createPhone()],
        emails: [createEmail()],
      }),
      dadosConta: [
        createConta(),
        createConta({ codigoConta: '999999', contaSelecionada: false }),
      ],
      ...overrides,
    });

  beforeEach(waitForAsync(() => {
    mockNavigation = { navigate: jest.fn(), current: { params: null } };
    mockBuscarBroker = { execute: jest.fn() };
    mockBuscarDadosCadastrais = { execute: jest.fn() };
    mockCadastrar = { execute: jest.fn().mockResolvedValue({}) };
    mockAtualizar = { execute: jest.fn().mockResolvedValue(null) };
    mockListarBancos = { execute: jest.fn().mockResolvedValue({ data: [] }) };
    mockSnackbar = { showSnackbar: jest.fn() };

    TestBed.configureTestingModule({
      imports: [DetalheBrokerComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: NavigationService, useValue: mockNavigation },
        { provide: BuscarBrokerUseCase, useValue: mockBuscarBroker },
        {
          provide: BuscarDadosCadastraisUseCase,
          useValue: mockBuscarDadosCadastrais,
        },
        { provide: CadastrarBrokerUseCase, useValue: mockCadastrar },
        { provide: AtualizarBrokerUseCase, useValue: mockAtualizar },
        {
          provide: BuscarInstituicoesFinanceirasUseCase,
          useValue: mockListarBancos,
        },
        { provide: SnackbarService, useValue: mockSnackbar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DetalheBrokerComponent, {
        set: { template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheBrokerComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente com bancos carregados', async () => {
    await Promise.resolve();

    expect(component).toBeTruthy();
    expect(mockListarBancos.execute).toHaveBeenCalled();
    expect(component.instituicoes_financeiras).toEqual({ data: [] });
  });

  it('deve configurar o modo create no ngOnInit', async () => {
    mockNavigation.current.params = { mode: 'create' };

    await component.ngOnInit();

    expect(component.mode).toBe('create');
    expect(component.brokerId).toBeUndefined();
    expect(component.form.enabled).toBe(true);
  });

  it('deve carregar broker e desabilitar formulario no modo visualize', async () => {
    const response = createBrokerResponse();
    component.mode = 'visualize';
    component.brokerId = 'broker-1';
    mockBuscarBroker.execute.mockResolvedValue(response);

    await component['configurarTelaPorModo']();

    expect(mockBuscarBroker.execute).toHaveBeenCalledWith('broker-1');
    expect(component.form.disabled).toBe(true);
    expect(component.form.get('numeroDocumento')?.value).toBe(
      '11.222.333/0001-81'
    );
    expect(component.enderecosFormArray.length).toBe(1);
    expect(component.telefonesFormArray.length).toBe(1);
    expect(component.emailsFormArray.length).toBe(1);
    expect(component.dadosConta[0].contaSelecionada).toBe(true);
  });

  it('deve habilitar formulario no modo edit e lidar com erro ao carregar broker', async () => {
    component.mode = 'edit';
    component.brokerId = 'broker-2';
    mockBuscarBroker.execute.mockRejectedValue(new Error('falha'));

    await component['configurarTelaPorModo']();

    expect(component.form.enabled).toBe(true);
    expect(component.isLoading).toBe(false);
    expect(component.brokerData).toBeNull();
    expect(component.loadState).toBe('error');
    expect(component.showRetryState).toBe(true);
  });

  it('deve exibir estado de nao encontrado quando a busca retornar null', async () => {
    component.mode = 'edit';
    component.brokerId = 'broker-404';
    mockBuscarBroker.execute.mockResolvedValueOnce(null);

    await component['configurarTelaPorModo']();

    expect(component.brokerData).toBeNull();
    expect(component.loadState).toBe('not-found');
    expect(component.showRetryState).toBe(false);
    expect(component.shouldShowLoadState).toBe(true);
  });

  it('deve manter retry oculto em erro no modo create', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.mode = 'create';
    component.brokerId = 'broker-1';
    mockBuscarBroker.execute.mockRejectedValueOnce(new Error('falha'));

    await component['loadBrokerData']();

    expect(component.loadState).toBe('content');
    expect(component.showRetryState).toBe(false);
    consoleSpy.mockRestore();
  });

  it('deve reaplicar bloqueios ao tentar novamente com sucesso em modo edit', async () => {
    const response = createBrokerResponse();
    component.mode = 'edit';
    component.brokerId = 'broker-1';
    component.loadState = 'error';
    mockBuscarBroker.execute.mockResolvedValueOnce(response);

    await component.retryLoadBrokerData();

    expect(component.loadState).toBe('content');
    expect(component.showRetryState).toBe(false);
    expect(component.form.enabled).toBe(true);
    expect(component.enderecosFormArray.at(0).disabled).toBe(true);
    expect(component.telefonesFormArray.at(0).disabled).toBe(true);
    expect(component.emailsFormArray.at(0).disabled).toBe(true);
  });

  it('deve bloquear dados carregados do backend no modo edit e permitir adicionar novos dados', async () => {
    const response = createBrokerResponse();
    component.mode = 'edit';
    component.brokerId = 'broker-1';
    mockBuscarBroker.execute.mockResolvedValue(response);

    await component['configurarTelaPorModo']();

    expect(component.enderecosFormArray.at(0).disabled).toBe(true);
    expect(component.telefonesFormArray.at(0).disabled).toBe(true);
    expect(component.emailsFormArray.at(0).disabled).toBe(true);
    expect(component.canAddEndereco).toBe(true);
    expect(component.canAddTelefone).toBe(true);
    expect(component.canAddEmail).toBe(true);

    component.removerEndereco(0);
    component.removerTelefone(0);
    component.removerEmail(0);

    expect(component.enderecosFormArray.length).toBe(1);
    expect(component.telefonesFormArray.length).toBe(1);
    expect(component.emailsFormArray.length).toBe(1);

    component.adicionarEndereco();

    expect(component.enderecosFormArray.length).toBe(2);
    expect(component.enderecosFormArray.at(1).enabled).toBe(true);

    component.adicionarTelefone();
    component.adicionarEmail();

    expect(component.telefonesFormArray.length).toBe(2);
    expect(component.telefonesFormArray.at(1).enabled).toBe(true);
    expect(component.emailsFormArray.length).toBe(2);
    expect(component.emailsFormArray.at(1).enabled).toBe(true);
  });

  it('deve expor getters de colunas, pagina, selecao e titulo', () => {
    component.mode = 'visualize';
    component.dadosConta = [
      createConta({ codigoConta: '1' }),
      createConta({ codigoConta: '2', contaSelecionada: true }),
    ];
    component.currentPage = 2;
    component.pageSize = 1;

    expect(component.displayedColumnsContas).toEqual([
      'conta_principal',
      'codigo_banco',
      'codigo_agencia',
      'tipo_conta',
      'codigo_conta',
      'dac',
    ]);
    expect(component.dadosContaPaginada).toEqual([component.dadosConta[1]]);
    expect(component.contaSelecionada).toEqual(component.dadosConta[1]);
    expect(component.title).toBe('Visualizar Broker');

    component.mode = 'edit';
    expect(component.displayedColumnsContas).toContain('acao');
    expect(component.title).toBe('Editar Broker');

    component.mode = 'create';
    expect(component.title).toBe('Novo Broker');
  });

  it('deve calcular os indicadores de completude e habilitacao de salvar', () => {
    expect(component.isInformacoesBasicasCompletas).toBe(false);
    expect(component.isEnderecoCompleto).toBe(false);
    expect(component.isTelefoneCompleto).toBe(false);
    expect(component.isEmailCompleto).toBe(false);
    expect(component.isContaCompleta).toBe(false);
    expect(component.isSalvarHabilitado).toBe(false);

    component.mode = 'create';
    component.isBuscaRealizada = true;
    component.form.patchValue({
      nomeCompleto: 'Broker Teste',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });
    component.adicionarEndereco();
    component.enderecosFormArray.at(0).patchValue({
      propositoEndereco: AddressTypeEnum.PRINCIPAL,
      pais: 'BR',
      uf: 'SP',
      cidade: 'Sao Paulo',
      cep: '12345-678',
      logradouro: 'Rua A',
      numero: '10',
      bairro: 'Centro',
    });
    component.adicionarTelefone();
    component.telefonesFormArray.at(0).patchValue({
      propositoTelefone: PhonePurposeEnum.PRINCIPAL,
      tipoTelefone: PhoneTypeEnum.MOVEL,
      ddi: '+55',
      ddd: '11',
      numero: '99999-9999',
    });
    component.adicionarEmail();
    component.emailsFormArray.at(0).patchValue({
      propositoEmail: MailPurposeEnum.PRINCIPAL,
      email: 'teste@teste.com',
    });
    component.dadosConta = [createConta({ contaSelecionada: true })];

    expect(component.isInformacoesBasicasCompletas).toBe(true);
    expect(component.isEnderecoCompleto).toBe(true);
    expect(component.isTelefoneCompleto).toBe(true);
    expect(component.isEmailCompleto).toBe(true);
    expect(component.isContaCompleta).toBe(true);
    expect(component.isSalvarHabilitado).toBe(true);
  });

  it('deve invalidar o formulario de busca com CNPJ invalido', () => {
    component.searchForm.patchValue({
      tipoDocumento: DocumentTypeEnum.CNPJ,
      numeroDocumento: '12.345.678/0001-91',
      pais: 'BR',
    });

    expect(component.searchForm.errors).toEqual(
      expect.objectContaining({ cnpj: true })
    );
  });

  it('deve permitir documento nao CNPJ sem aplicar a regra de CNPJ', () => {
    component.searchForm.patchValue({
      tipoDocumento: DocumentTypeEnum.NIF,
      numeroDocumento: 'AB123456789',
      pais: 'BR',
    });

    expect(component.searchForm.errors).toBeNull();
  });

  it('deve enviar null para nomeContato vazio e nao enviar departamento', async () => {
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
    component.mode = 'create';
    component.isBuscaRealizada = true;

    component.form.patchValue({
      nomeCompleto: 'Broker Teste',
      nomeFantasia: 'Broker',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });

    component.adicionarEmail();
    component.emailsFormArray.at(0).patchValue({
      propositoEmail: MailPurposeEnum.PRINCIPAL,
      email: 'teste@teste.com',
      nomeContato: '',
    });

    await component.salvar();

    const payload = mockCadastrar.execute.mock.calls[0][0];
    expect(payload.dadosCadastrais.emails[0]).not.toHaveProperty(
      'departamento'
    );
    expect(payload.dadosCadastrais.emails[0].nomeContato).toBeNull();
  });

  it('deve habilitar salvar sem endereco, telefone ou email', () => {
    component.mode = 'create';
    component.isBuscaRealizada = true;
    component.form.patchValue({
      nomeCompleto: 'Broker Teste',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });
    component.dadosConta = [createConta({ contaSelecionada: true })];

    expect(component.enderecosFormArray.length).toBe(0);
    expect(component.telefonesFormArray.length).toBe(0);
    expect(component.emailsFormArray.length).toBe(0);
    expect(component.isSalvarHabilitado).toBe(true);
  });

  it('deve omitir enderecos, telefones e emails vazios do payload', async () => {
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
    component.form.patchValue({
      nomeCompleto: 'Broker Teste',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });
    component.dadosConta = [createConta({ contaSelecionada: true })];

    await component.salvar();

    const payload = mockCadastrar.execute.mock.calls[0][0];
    const dto = CriarBrokerRequestMapper.toDto(payload);
    expect(dto.dados_cadastrais).not.toHaveProperty('enderecos');
    expect(dto.dados_cadastrais).not.toHaveProperty('telefones');
    expect(dto.dados_cadastrais).not.toHaveProperty('emails');
  });

  it('deve usar atualizar broker em modo edit e enviar apenas novos dados cadastrais', async () => {
    const response = createBrokerResponse();
    component.mode = 'edit';
    component.brokerId = 'broker-1';
    mockBuscarBroker.execute.mockResolvedValue(response);

    await component['configurarTelaPorModo']();

    component.adicionarEndereco();
    component.enderecosFormArray.at(1).patchValue({
      propositoEndereco: AddressTypeEnum.COMERCIAL,
      pais: 'US',
      uf: '',
      cidade: 'New York',
      cep: '',
      logradouro: '5th Avenue',
      numero: '20',
      bairro: 'Manhattan',
      regiao: 'NY',
      codigoAreaPostal: '10001',
    });

    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);

    await component.salvar();

    expect(mockAtualizar.execute).toHaveBeenCalledTimes(1);
    expect(mockCadastrar.execute).not.toHaveBeenCalled();

    const payload = mockAtualizar.execute.mock.calls[0][0];

    expect(payload.dadosCadastrais.enderecos).toHaveLength(1);
    expect(payload.dadosCadastrais.enderecos[0].logradouro).toBe('5th Avenue');
    expect(payload.dadosCadastrais.telefones).toBeNull();
    expect(payload.dadosCadastrais.emails).toBeNull();
  });

  it('deve buscar dados cadastrais e preencher o formulario com sucesso', async () => {
    const result = createBrokerResponse({
      dadosCadastrais: new RegistrationDataEntity({
        nomeCompleto: 'Broker Busca',
        nomeFantasia: 'Busca',
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '12345678000195',
        pais: 'BR',
        enderecos: [createAddress({ bairro: 'Busca' })],
        telefones: [
          createPhone({ tipoTelefone: PhoneTypeEnum.FIXO, numero: 12345678 }),
        ],
        emails: [createEmail({ email: 'busca@broker.com' })],
      }),
      dadosConta: [
        createConta({ codigoConta: '321', contaSelecionada: false }),
      ],
    });
    mockBuscarDadosCadastrais.execute.mockResolvedValue(result);
    component.searchForm.patchValue({
      numeroDocumento: '12.345.678/0001-95',
      tipoDocumento: DocumentTypeEnum.CNPJ,
      pais: CountryCodeEnum.BR,
    });

    await component.buscarDadosCadastrais();

    expect(mockBuscarDadosCadastrais.execute).toHaveBeenCalledWith({
      documentNumber: '12.345.678/0001-95',
      documentType: DocumentTypeEnum.CNPJ,
      countryCode: CountryCodeEnum.BR,
    });
    expect(component.isBuscaRealizada).toBe(true);
    expect(component.form.get('nomeCompleto')?.value).toBe('Broker Busca');
    expect(component.form.get('numeroDocumento')?.value).toBe(
      '12.345.678/0001-95'
    );
    expect(component.dadosConta[0].contaSelecionada).toBe(true);
  });

  it('deve permitir preenchimento manual quando a busca nao retorna dados', async () => {
    mockBuscarDadosCadastrais.execute.mockResolvedValue(null);
    component.searchForm.patchValue({
      numeroDocumento: 'AB-123',
      tipoDocumento: DocumentTypeEnum.NIF,
      pais: CountryCodeEnum.BR,
    });

    await component.buscarDadosCadastrais();

    expect(component.form.get('numeroDocumento')?.value).toBe('AB123');
    expect(component.form.get('nomeCompleto')?.value).toBe('');
    expect(component.dadosConta).toEqual([]);
    expect(mockSnackbar.showSnackbar).toHaveBeenCalled();
  });

  it('deve tratar erro na busca de dados cadastrais', async () => {
    mockBuscarDadosCadastrais.execute.mockRejectedValue(new Error('falha'));
    component.searchForm.patchValue({
      numeroDocumento: '12.345.678/0001-95',
      tipoDocumento: DocumentTypeEnum.CNPJ,
      pais: CountryCodeEnum.BR,
    });

    await component.buscarDadosCadastrais();

    expect(component.isBuscaRealizada).toBe(true);
    expect(component.form.get('numeroDocumento')?.value).toBe(
      '12.345.678/0001-95'
    );
    expect(component.dadosConta).toEqual([]);
    expect(component.isLoading).toBe(false);
  });

  it('deve nao buscar dados cadastrais quando o formulario de busca for invalido', async () => {
    component.searchForm.patchValue({ numeroDocumento: '' });

    await component.buscarDadosCadastrais();

    expect(mockBuscarDadosCadastrais.execute).not.toHaveBeenCalled();
  });

  it('deve formatar entradas de documento, susep e campos de endereco e telefone', () => {
    component.mode = 'create';
    component.adicionarEndereco();
    component.adicionarTelefone();

    component.form.get('tipoDocumento')?.setValue(DocumentTypeEnum.CNPJ);
    component.onSusepInput({
      target: { value: '12a3456' },
    } as unknown as Event);
    component.onDocumentoInput({
      target: { value: '11222333000181' },
    } as unknown as Event);
    component.form.get('tipoDocumento')?.setValue(DocumentTypeEnum.NIF);
    component.onDocumentoInput({
      target: { value: 'AB-123' },
    } as unknown as Event);

    component.searchForm.get('tipoDocumento')?.setValue(DocumentTypeEnum.CNPJ);
    component.onSearchDocumentoInput({
      target: { value: '12345678000195' },
    } as unknown as Event);
    component.searchForm.get('tipoDocumento')?.setValue(DocumentTypeEnum.NIF);
    component.onSearchDocumentoInput({
      target: { value: 'AA-99' },
    } as unknown as Event);

    component.onUfInput({ target: { value: 's$p123' } } as unknown as Event, 0);
    component.onCepInput(
      { target: { value: '12345678' } } as unknown as Event,
      0
    );
    component.onDdiInput(
      { target: { value: '00551234' } } as unknown as Event,
      0
    );
    component.onDddInput({ target: { value: '1199' } } as unknown as Event, 0);
    component.telefonesFormArray
      .at(0)
      .get('tipoTelefone')
      ?.setValue(PhoneTypeEnum.MOVEL);
    component.onTelefoneNumeroInput(
      { target: { value: '999999999' } } as unknown as Event,
      0
    );
    component.telefonesFormArray
      .at(0)
      .get('tipoTelefone')
      ?.setValue(PhoneTypeEnum.FIXO);
    component.onTelefoneNumeroInput(
      { target: { value: '12345678' } } as unknown as Event,
      0
    );

    expect(component.form.get('codigoSusep')?.value).toBe('12345');
    expect(component.form.get('numeroDocumento')?.value).toBe('AB123');
    expect(component.searchForm.get('numeroDocumento')?.value).toBe('AA99');
    expect(component.enderecosFormArray.at(0).get('uf')?.value).toBe('SP');
    expect(component.enderecosFormArray.at(0).get('cep')?.value).toBe(
      '12345-678'
    );
    expect(component.telefonesFormArray.at(0).get('ddi')?.value).toBe('+0055');
    expect(component.telefonesFormArray.at(0).get('ddd')?.value).toBe('11');
    expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
      '1234-5678'
    );
  });

  it('deve formatar entradas da conta e paginacao', () => {
    component.onAgenciaInput({
      target: { value: '12a34' },
    } as unknown as Event);
    component.onContaInput({
      target: { value: '1234567890123' },
    } as unknown as Event);
    component.onDacInput({ target: { value: '9a8' } } as unknown as Event);
    component.onPaginate({ detail: { currentPage: 2, pageSize: 20 } });
    component.onPaginate({ currentPage: 3, pageSize: 50 });

    expect(component.contaForm.get('agencia')?.value).toBe('1234');
    expect(component.contaForm.get('conta')?.value).toBe('12345678901');
    expect(component.contaForm.get('dac')?.value).toBe('98');
    expect(component.currentPage).toBe(3);
    expect(component.pageSize).toBe(50);
  });

  it('deve selecionar linha e resolver nomes de tipos de conta', () => {
    component.dadosConta = [
      createConta({ codigoConta: '1', contaSelecionada: true }),
      createConta({
        codigoConta: '2',
        contaSelecionada: false,
        codigoTipoConta: BankAccountTypeEnum.CONTA_POUPANCA,
      }),
    ];

    component.checkRow(component.dadosConta[1]);

    expect(component.dadosConta[0].contaSelecionada).toBe(false);
    expect(component.dadosConta[1].contaSelecionada).toBe(true);
    expect(component.obterNomeTipoConta('')).toBe('');
    expect(
      component.obterNomeTipoConta(BankAccountTypeEnum.CONTA_CORRENTE)
    ).toBe('Conta Corrente');
    expect(component.obterNomeTipoConta('CONTA_POUPANCA')).toBe(
      'Conta Poupança'
    );
    expect(component.obterNomeTipoConta('S')).toBe('Conta Salário');
    expect(component.obterNomeTipoConta('D')).toBe('Conta Desativada');
    expect(component.obterNomeTipoConta('N')).toBe('Conta Não Correntista');
    expect(component.obterNomeTipoConta('G')).toBe('Conta Pagamento');
    expect(component.obterNomeTipoConta('F')).toBe('Conta Financeira');
    expect(component.obterNomeTipoConta('V')).toBe('Conta Virtual');
    expect(component.obterNomeTipoConta('XYZ')).toBe('XYZ');
  });

  it('deve adicionar e remover itens dos arrays dinamicos', () => {
    component.mode = 'create';
    component.adicionarEndereco();
    component.adicionarTelefone();
    component.adicionarEmail();

    expect(component.enderecosFormArray.length).toBe(1);
    expect(component.telefonesFormArray.length).toBe(1);
    expect(component.emailsFormArray.length).toBe(1);

    component.removerEndereco(0);
    component.removerTelefone(0);
    component.removerEmail(0);

    expect(component.enderecosFormArray.length).toBe(0);
    expect(component.telefonesFormArray.length).toBe(0);
    expect(component.emailsFormArray.length).toBe(0);
  });

  it('deve adicionar, editar, remover, salvar e cancelar edicao de conta', () => {
    component.adicionarConta();

    expect(component.showContaForm).toBe(true);
    expect(component.editingContaIndex).toBeNull();

    component.contaForm.patchValue({
      banco: '341',
      agencia: '1234',
      conta: '456789',
      dac: '1',
      tipo: BankAccountTypeEnum.CONTA_CORRENTE,
    });
    component.salvarConta();

    expect(component.dadosConta.length).toBe(1);
    expect(component.dadosConta[0].contaSelecionada).toBe(true);
    expect(component.showContaForm).toBe(false);

    component.editarConta(0);
    component.contaForm.patchValue({
      banco: '001',
      agencia: '9999',
      conta: '999999',
      dac: '2',
      tipo: BankAccountTypeEnum.CONTA_POUPANCA,
    });
    component.salvarConta();

    expect(component.dadosConta[0].codigoBanco).toBe('001');
    expect(component.dadosConta[0].contaSelecionada).toBe(true);

    component.editarConta(0);
    component.cancelarEdicaoConta();
    expect(component.showContaForm).toBe(false);
    expect(component.editingContaIndex).toBeNull();

    component.removerConta(0);
    expect(component.dadosConta).toEqual([]);
  });

  it('deve ignorar salvamento de conta invalida', () => {
    component.contaForm.patchValue({ banco: '' });

    component.salvarConta();

    expect(component.dadosConta).toEqual([]);
  });

  it('deve salvar broker com payload sanitizado e navegar ao voltar', async () => {
    component.mode = 'edit';
    component.isBuscaRealizada = true;
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
    component.brokerData = createBrokerResponse({
      codigoTipoPersona: PersonTypeEnum.J,
      dadosCadastrais: new RegistrationDataEntity({
        nomeCompleto: 'Broker Base',
        nomeFantasia: 'Base',
        tipoDocumento: DocumentTypeEnum.NIF,
        numeroDocumento: 'AA11',
        pais: 'US',
        enderecos: [],
        telefones: [],
        emails: [],
      }),
      dadosConta: [],
    });
    component.form.patchValue({
      nomeCompleto: 'Broker Teste',
      nomeFantasia: 'Broker',
      numeroDocumento: 'AB-123',
      codigoSusep: '54321',
      tipoDocumento: DocumentTypeEnum.NIF,
      pais: 'US',
    });
    component.adicionarEndereco();
    component.enderecosFormArray.at(0).patchValue({
      propositoEndereco: AddressTypeEnum.COMERCIAL,
      pais: 'us',
      uf: 'ny',
      cidade: 'New York',
      cep: '10001-123',
      logradouro: '5th Avenue',
      numero: '1',
      complemento: '',
      bairro: 'Manhattan',
    });
    component.adicionarTelefone();
    component.telefonesFormArray.at(0).patchValue({
      propositoTelefone: PhonePurposeEnum.COMERCIAL,
      tipoTelefone: PhoneTypeEnum.FIXO,
      ddi: '+1',
      ddd: '21',
      numero: '1234-5678',
    });
    component.adicionarEmail();
    component.emailsFormArray.at(0).patchValue({
      propositoEmail: MailPurposeEnum.OUTROS,
      email: 'outro@teste.com',
      nomeContato: 'Alex',
    });
    component.dadosConta = [
      createConta({
        contaSelecionada: true,
        codigoTipoConta: BankAccountTypeEnum.CONTA_FINANCEIRA,
      }),
    ];

    await component.salvar();

    const lastCall =
      mockAtualizar.execute.mock.calls[
        mockAtualizar.execute.mock.calls.length - 1
      ];
    const payload = lastCall?.[0];
    expect(payload.numeroDocumento).toBe('AB123');
    expect(payload.pais).toBe('US');
    expect(payload.codigoSusep).toBe(54321);
    // Endereço estrangeiro (US): CEP e UF omitidos do payload serializado.
    const dto = CriarBrokerRequestMapper.toDto(payload);
    expect(dto.dados_cadastrais.enderecos![0]).not.toHaveProperty('cep');
    expect(dto.dados_cadastrais.enderecos![0]).not.toHaveProperty('uf');
    expect(dto.dados_cadastrais.enderecos![0].pais).toBe('US');
    expect(payload.dadosCadastrais.telefones[0].ddi).toBe(1);
    expect(payload.dadosCadastrais.telefones[0].ddd).toBe(21);
    expect(payload.dadosCadastrais.telefones[0].numero).toBe(12345678);
    expect(payload.dadosConta.codigoTipoConta).toBe(
      BankAccountTypeEnum.CONTA_FINANCEIRA
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NavigationRoute.BrokersHome
    );
  });

  it('deve usar primeira conta e persona padrao ao salvar quando brokerData nao existir', async () => {
    jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
    component.form.patchValue({
      nomeCompleto: 'Broker',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });
    component.dadosConta = [createConta({ contaSelecionada: false })];

    await component.salvar();

    const lastCall =
      mockCadastrar.execute.mock.calls[
        mockCadastrar.execute.mock.calls.length - 1
      ];
    const payload = lastCall?.[0];
    expect(payload.codigoTipoPersona).toBe(PersonTypeEnum.J);
    expect(payload.pais).toBe('BR');
    expect(payload.dadosConta.codigoBanco).toBe('341');
  });

  it('deve interromper o salvar quando desabilitado e tratar erro do cadastro', async () => {
    const enabledSpy = jest.spyOn(component, 'isSalvarHabilitado', 'get');
    enabledSpy.mockReturnValueOnce(false).mockReturnValue(true);
    mockCadastrar.execute.mockRejectedValueOnce(new Error('falha'));

    await component.salvar();

    expect(mockCadastrar.execute).not.toHaveBeenCalled();

    component.form.patchValue({
      nomeCompleto: 'Broker',
      numeroDocumento: '11.222.333/0001-81',
      codigoSusep: '12345',
      tipoDocumento: DocumentTypeEnum.CNPJ,
    });
    component.dadosConta = [createConta({ contaSelecionada: true })];

    await component.salvar();

    expect(component.isLoading).toBe(false);
  });

  it('deve tratar erro ao carregar bancos', async () => {
    mockListarBancos.execute.mockRejectedValueOnce(new Error('falha'));

    await component.carregarBancos();

    expect(component.instituicoes_financeiras).toEqual({ data: [] });
  });

  it('deve cobrir helpers privados de criacao e formatacao', () => {
    const enderecoGroup = component['criarEnderecoFormGroup'](createAddress());
    const telefoneMovelGroup = component['criarTelefoneFormGroup'](
      createPhone()
    );
    const telefoneFixoGroup = component['criarTelefoneFormGroup'](
      createPhone({ tipoTelefone: PhoneTypeEnum.FIXO, numero: 12345678 })
    );
    const emailGroup = component['criarEmailFormGroup'](createEmail());

    expect(enderecoGroup.get('cep')?.value).toBe('12345-678');
    expect(telefoneMovelGroup.get('ddi')?.value).toBe('+55');
    expect(telefoneMovelGroup.get('numero')?.value).toBe('98765-4321');
    expect(telefoneFixoGroup.get('numero')?.value).toBe('1234-5678');
    expect(emailGroup.get('email')?.value).toBe('teste@broker.com');
    expect(
      component['formatarDocumentoInicial'](
        '11222333000181',
        DocumentTypeEnum.CNPJ
      )
    ).toBe('11.222.333/0001-81');
    expect(
      component['formatarDocumentoInicial']('AB-123', DocumentTypeEnum.NIF)
    ).toBe('AB123');
    expect(component['nullIfBlank']('   ')).toBeNull();
    expect(component['nullIfBlank']('valor')).toBe('valor');
  });

  it('deve voltar para a listagem', () => {
    component.goBack();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      NavigationRoute.BrokersHome
    );
  });
});
