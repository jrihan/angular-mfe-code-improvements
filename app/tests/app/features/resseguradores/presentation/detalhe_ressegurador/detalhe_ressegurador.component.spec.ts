import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DetalheResseguradorComponent } from '../../../../../../src/app/features/resseguradores/presentation/detalhe_ressegurador/detalhe_ressegurador.component';
import { NavigationService } from '../../../../../../src/app/shared/navigation.service';
import { NavigationRoute } from '../../../../../../src/app/shared/navigation-routes';
import { BuscarResseguradorUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/buscar_ressegurador.usecase';
import { CadastrarResseguradorUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/cadastrar_ressegurador.usecase';
import { AtualizarResseguradorUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/atualizar_ressegurador.usecase';
import { CriarResseguradorRequestMapper } from '../../../../../../src/app/features/resseguradores/data/mappers/request/criar_ressegurador_request.mapper';
import { BuscarDadosCadastraisUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/buscar_dados_cadastrias.usecase';
import { BuscarResseguradorResponseEntity } from '../../../../../../src/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.entity';
import { RegistrationDataEntity } from '../../../../../../src/app/shared/domain/entities/registration_data.entity';
import { AddressEntity } from '../../../../../../src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from '../../../../../../src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from '../../../../../../src/app/shared/domain/entities/email.entity';
import { BankAccountEntity } from '../../../../../../src/app/shared/domain/entities/bank_account.entity';
import { ResseguradorProfileTypeEnum } from '../../../../../../src/app/features/resseguradores/domain/enums/ressegurador_profile_type.enum';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { AddressTypeEnum } from '../../../../../../src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from '../../../../../../src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from '../../../../../../src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from '../../../../../../src/app/shared/domain/enum/mail_purpose.enum';
import { BankAccountTypeEnum } from '../../../../../../src/app/shared/domain/enum/bank_account_type.enum';
import { SnackbarService } from '../../../../../../src/app/shared/services/snackbar.service';
import { BuscarDadosCadastraisResponseEntity } from '../../../../../../src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarInstituicoesFinanceirasUseCase } from '../../../../../../src/app/features/resseguradores/domain/usecases/buscar_instituicoes_financeiras.usecase';

const inputEvent = (value: string): Event =>
  ({ target: { value } } as unknown as Event);

const buildResponseEntity = (
  over?: Partial<Omit<BuscarResseguradorResponseEntity, 'copyWith'>>
): BuscarResseguradorResponseEntity =>
  new BuscarResseguradorResponseEntity({
    codigoTipoPersona: 'J',
    idCliente: 'cli-1',
    idDbResseguro: 'db-1',
    situacaoCadastral: 'ATIVO',
    codigoSusep: 12345,
    tipoPerfil: ResseguradorProfileTypeEnum.LOCAL,
    dadosCadastrais: new RegistrationDataEntity({
      nomeCompleto: 'Empresa Teste',
      nomeFantasia: 'Fantasia Teste',
      tipoDocumento: DocumentTypeEnum.CNPJ,
      numeroDocumento: '11222333000181',
      pais: 'Brasil',
      enderecos: [
        new AddressEntity({
          propositoEndereco: AddressTypeEnum.PRINCIPAL,
          logradouro: 'Rua A',
          numero: '100',
          complemento: 'apto',
          bairro: 'Centro',
          cep: '12345678',
          cidade: 'São Paulo',
          uf: 'sp',
          pais: 'BR',
          regiao: '',
          codigoAreaPostal: '',
        }),
        new AddressEntity({
          propositoEndereco: AddressTypeEnum.COMERCIAL,
          logradouro: 'Rua B',
          numero: '200',
          complemento: '',
          bairro: 'Bairro',
          cep: '123',
          cidade: 'Rio',
          uf: '',
          pais: 'BR',
          regiao: '',
          codigoAreaPostal: '',
        }),
        new AddressEntity({
          propositoEndereco: AddressTypeEnum.OUTROS,
          logradouro: 'Rua C',
          numero: '300',
          complemento: '',
          bairro: 'Bairro',
          cep: '',
          cidade: 'BH',
          uf: 'mg',
          pais: 'BR',
          regiao: '',
          codigoAreaPostal: '',
        }),
      ],
      telefones: [
        new PhoneEntity({
          propositoTelefone: PhonePurposeEnum.PRINCIPAL,
          tipoTelefone: PhoneTypeEnum.MOVEL,
          ddi: 55,
          ddd: 11,
          numero: 912345678,
        }),
        new PhoneEntity({
          propositoTelefone: PhonePurposeEnum.COMERCIAL,
          tipoTelefone: PhoneTypeEnum.MOVEL,
          ddi: 0,
          ddd: 0,
          numero: 123,
        }),
        new PhoneEntity({
          propositoTelefone: PhonePurposeEnum.OUTROS,
          tipoTelefone: PhoneTypeEnum.FIXO,
          ddi: 55,
          ddd: 11,
          numero: 12345678,
        }),
        new PhoneEntity({
          propositoTelefone: PhonePurposeEnum.OUTROS,
          tipoTelefone: PhoneTypeEnum.FIXO,
          ddi: 55,
          ddd: 11,
          numero: 123,
        }),
        new PhoneEntity({
          propositoTelefone: PhonePurposeEnum.OUTROS,
          tipoTelefone: PhoneTypeEnum.MOVEL,
          ddi: 55,
          ddd: 11,
          numero: 0,
        }),
      ],
      emails: [
        new EmailEntity({
          propositoEmail: MailPurposeEnum.PRINCIPAL,
          email: 'teste@teste.com',
          nomeContato: 'Fulano',
        }),
      ],
    }),
    dadosConta: [
      new BankAccountEntity({
        contaSelecionada: false,
        codigoBanco: '341',
        codigoAgencia: '0001',
        codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
        codigoConta: '12345',
        dac: '9',
      }),
      new BankAccountEntity({
        contaSelecionada: undefined,
        codigoBanco: '001',
        codigoAgencia: '0002',
        codigoTipoConta: BankAccountTypeEnum.CONTA_POUPANCA,
        codigoConta: '67890',
        dac: '1',
      }),
    ],
    ...over,
  });

describe('DetalheResseguradorComponent', () => {
  let component: DetalheResseguradorComponent;
  let fixture: ComponentFixture<DetalheResseguradorComponent>;
  let navigationMock: { navigate: jest.Mock; current: any };
  let mockBuscar: { execute: jest.Mock };
  let mockCadastrar: { execute: jest.Mock };
  let mockAtualizar: { execute: jest.Mock };
  let mockBuscarDadosCadastrais: { execute: jest.Mock };
  let mockBancos: { execute: jest.Mock };
  let snackbarMock: { showSnackbar: jest.Mock; hideSnackbar: jest.Mock };

  const preencherFormCompleto = () => {
    component.form.enable();
    component.form.patchValue({
      nomeCompleto: 'Empresa Teste',
      nomeFantasia: 'Fantasia Teste',
      codigoSusep: '12345',
      perfilRessegurador: ResseguradorProfileTypeEnum.LOCAL,
      tipoDocumento: DocumentTypeEnum.CNPJ,
      numeroDocumento: '11.222.333/0001-81',
      pais: 'BR',
    });
    component.adicionarEndereco();
    component.enderecosFormArray.at(0).patchValue({
      propositoEndereco: AddressTypeEnum.PRINCIPAL,
      pais: 'BR',
      uf: 'SP',
      cidade: 'São Paulo',
      cep: '12345-678',
      logradouro: 'Rua A',
      numero: '100',
      complemento: '',
      bairro: 'Centro',
    });
    component.adicionarTelefone();
    component.telefonesFormArray.at(0).patchValue({
      propositoTelefone: PhonePurposeEnum.PRINCIPAL,
      tipoTelefone: PhoneTypeEnum.MOVEL,
      ddi: '+55',
      ddd: '11',
      numero: '91234-5678',
    });
    component.adicionarEmail();
    component.emailsFormArray.at(0).patchValue({
      propositoEmail: MailPurposeEnum.PRINCIPAL,
      email: 'teste@teste.com',
      nomeContato: 'Fulano',
    });
    component.dadosConta = [
      new BankAccountEntity({
        contaSelecionada: true,
        codigoBanco: '341',
        codigoAgencia: '0001',
        codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
        codigoConta: '12345',
        dac: '9',
      }),
    ];
  };

  beforeEach(waitForAsync(() => {
    navigationMock = {
      navigate: jest.fn(),
      current: { rota: NavigationRoute.ResseguradoresDetalhe, params: null },
    };
    mockBuscar = {
      execute: jest.fn().mockResolvedValue(buildResponseEntity()),
    };
    mockCadastrar = { execute: jest.fn().mockResolvedValue({}) };
    mockAtualizar = { execute: jest.fn().mockResolvedValue(null) };
    mockBuscarDadosCadastrais = { execute: jest.fn().mockResolvedValue(null) };
    mockBancos = {
      execute: jest.fn().mockResolvedValue({
        data: [{ codigo: '341', nome: 'Itaú' }],
      }),
    };
    snackbarMock = {
      showSnackbar: jest.fn(),
      hideSnackbar: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DetalheResseguradorComponent, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: NavigationService, useValue: navigationMock },
        { provide: BuscarResseguradorUseCase, useValue: mockBuscar },
        { provide: CadastrarResseguradorUseCase, useValue: mockCadastrar },
        { provide: AtualizarResseguradorUseCase, useValue: mockAtualizar },
        {
          provide: BuscarDadosCadastraisUseCase,
          useValue: mockBuscarDadosCadastrais,
        },
        { provide: SnackbarService, useValue: snackbarMock },
        {
          provide: BuscarInstituicoesFinanceirasUseCase,
          useValue: mockBancos,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DetalheResseguradorComponent, {
        set: { template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheResseguradorComponent);
    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.contaForm).toBeTruthy();
  });

  describe('ngOnInit / configurarTelaPorModo', () => {
    it('deve configurar modo criar e habilitar o formulário', async () => {
      navigationMock.current = { params: { mode: 'criar' } };
      component.ngOnInit();
      await Promise.resolve();
      expect(component.mode).toBe('criar');
      expect(component.form.enabled).toBe(true);
    });

    it('deve usar modo visualizar padrão quando não houver params', async () => {
      navigationMock.current = { params: null };
      component.ngOnInit();
      await Promise.resolve();
      expect(component.mode).toBe('visualizar');
      expect(component.form.disabled).toBe(true);
    });

    it('deve usar modo visualizar quando params existir sem mode', async () => {
      navigationMock.current = { params: {} };
      component.ngOnInit();
      await Promise.resolve();
      expect(component.mode).toBe('visualizar');
      expect(component.resseguradorId).toBeUndefined();
    });

    it('deve carregar dados e desabilitar formulário em modo visualizar', async () => {
      component.mode = 'visualizar';
      component.resseguradorId = 'cli-1';
      await (component as any).configurarTelaPorModo();
      expect(mockBuscar.execute).toHaveBeenCalledWith('cli-1');
      expect(component.form.disabled).toBe(true);
      expect(component.form.get('nomeCompleto')?.value).toBe('Empresa Teste');
    });

    it('deve carregar dados e habilitar formulário em modo editar', async () => {
      component.mode = 'editar';
      component.resseguradorId = 'cli-1';
      await (component as any).configurarTelaPorModo();
      expect(mockBuscar.execute).toHaveBeenCalledWith('cli-1');
      expect(component.form.enabled).toBe(true);
      expect(component.enderecosFormArray.at(0).disabled).toBe(true);
      expect(component.telefonesFormArray.at(0).disabled).toBe(true);
      expect(component.emailsFormArray.at(0).disabled).toBe(true);
    });

    it('não deve carregar dados quando não houver id em modo editar', async () => {
      component.mode = 'editar';
      component.resseguradorId = undefined;
      await (component as any).configurarTelaPorModo();
      expect(mockBuscar.execute).not.toHaveBeenCalled();
      expect(component.form.enabled).toBe(true);
    });
  });

  describe('loadResseguradorData', () => {
    it('deve preencher formulário, arrays e contas com dados completos', async () => {
      component.resseguradorId = 'cli-1';
      await (component as any).loadResseguradorData();

      expect(component.form.get('numeroDocumento')?.value).toBe(
        '11.222.333/0001-81'
      );
      expect(component.enderecosFormArray.length).toBe(3);
      expect(component.telefonesFormArray.length).toBe(5);
      expect(component.emailsFormArray.length).toBe(1);
      expect(component.dadosConta.length).toBe(2);
      expect(component.dadosConta[0].contaSelecionada).toBe(true);
      expect(component.dadosConta[1].contaSelecionada).toBe(false);
      expect(component.enderecosFormArray.at(0).get('cep')?.value).toBe(
        '12345-678'
      );
      expect(component.enderecosFormArray.at(1).get('cep')?.value).toBe('123');
      expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
        '91234-5678'
      );
      expect(component.telefonesFormArray.at(2).get('numero')?.value).toBe(
        '1234-5678'
      );
      expect(component.telefonesFormArray.at(3).get('numero')?.value).toBe(
        '123'
      );
      expect(component.isLoading).toBe(false);
    });

    it('deve lidar com campos vazios e dadosConta nulo', async () => {
      component.resseguradorId = 'cli-1';
      mockBuscar.execute.mockResolvedValueOnce(
        buildResponseEntity({
          codigoSusep: 0 as any,
          tipoPerfil: '' as any,
          dadosCadastrais: new RegistrationDataEntity({
            nomeCompleto: '',
            nomeFantasia: '',
            tipoDocumento: '' as any,
            numeroDocumento: '',
            pais: 'Brasil',
            enderecos: undefined as any,
            telefones: undefined as any,
            emails: undefined as any,
          }),
          dadosConta: null as any,
        })
      );
      await (component as any).loadResseguradorData();
      expect(component.enderecosFormArray.length).toBe(0);
      expect(component.telefonesFormArray.length).toBe(0);
      expect(component.emailsFormArray.length).toBe(0);
      expect(component.dadosConta.length).toBe(0);
      expect(component.form.get('nomeCompleto')?.value).toBe('');
    });

    it('deve exibir estado de nao encontrado quando a resposta for nula', async () => {
      component.resseguradorId = 'cli-1';
      component.mode = 'editar';
      mockBuscar.execute.mockResolvedValueOnce(null);
      await (component as any).loadResseguradorData();
      expect(component.resseguradorData).toBeNull();
      expect(component.loadState).toBe('not-found');
      expect(component.showRetryState).toBe(false);
      expect(component.isLoading).toBe(false);
    });

    it('não deve chamar a API sem id', async () => {
      component.resseguradorId = undefined;
      await (component as any).loadResseguradorData();
      expect(mockBuscar.execute).not.toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
    });

    it('deve tratar erro ao carregar dados', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      component.mode = 'editar';
      component.resseguradorId = 'cli-1';
      mockBuscar.execute.mockRejectedValueOnce(new Error('falha'));
      await (component as any).loadResseguradorData();
      expect(consoleSpy).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      expect(component.loadState).toBe('error');
      expect(component.showRetryState).toBe(true);
      consoleSpy.mockRestore();
    });

    it('deve manter showRetryState falso em erro no modo criar', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      component.mode = 'criar';
      component.resseguradorId = 'cli-1';
      mockBuscar.execute.mockRejectedValueOnce(new Error('falha'));

      await (component as any).loadResseguradorData();

      expect(component.loadState).toBe('content');
      expect(component.showRetryState).toBe(false);
      consoleSpy.mockRestore();
    });

    it('deve reaplicar bloqueios ao tentar novamente com sucesso em modo editar', async () => {
      component.mode = 'editar';
      component.resseguradorId = 'cli-1';
      component.loadState = 'error';
      mockBuscar.execute.mockResolvedValueOnce(buildResponseEntity());

      await component.retryLoadResseguradorData();

      expect(component.loadState).toBe('content');
      expect(component.showRetryState).toBe(false);
      expect(component.form.enabled).toBe(true);
      expect(component.enderecosFormArray.at(0).disabled).toBe(true);
      expect(component.telefonesFormArray.at(0).disabled).toBe(true);
      expect(component.emailsFormArray.at(0).disabled).toBe(true);
    });
  });

  describe('carregarBancos', () => {
    it('deve carregar instituições financeiras', async () => {
      await component.carregarBancos();
      expect(component.instituicoes_financeiras).toEqual({
        data: [{ codigo: '341', nome: 'Itaú' }],
      });
    });

    it('deve tratar erro ao carregar bancos', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockBancos.execute.mockRejectedValueOnce(new Error('falha'));
      await component.carregarBancos();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getters', () => {
    it('deve retornar título por modo', () => {
      component.mode = 'criar';
      expect(component.title).toBe('Novo Ressegurador');
      component.mode = 'editar';
      expect(component.title).toBe('Editar Ressegurador');
      component.mode = 'visualizar';
      expect(component.title).toBe('Visualizar Ressegurador');
    });

    it('deve retornar colunas de conta conforme o modo', () => {
      component.mode = 'visualizar';
      expect(component.displayedColumnsContas).not.toContain('acao');
      component.mode = 'editar';
      expect(component.displayedColumnsContas).toContain('acao');
    });

    it('deve paginar dadosConta', () => {
      component.dadosConta = Array.from(
        { length: 15 },
        (_, i) =>
          new BankAccountEntity({
            contaSelecionada: false,
            codigoBanco: `${i}`,
            codigoAgencia: '0001',
            codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
            codigoConta: `${i}`,
            dac: '0',
          })
      );
      component.currentPage = 1;
      component.pageSize = 10;
      expect(component.dadosContaPaginada.length).toBe(10);
      component.currentPage = 2;
      expect(component.dadosContaPaginada.length).toBe(5);
    });

    it('deve retornar a conta selecionada', () => {
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: false,
          codigoBanco: '1',
          codigoAgencia: '1',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '1',
          dac: '0',
        }),
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '2',
          codigoAgencia: '2',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '2',
          dac: '0',
        }),
      ];
      expect(component.contaSelecionada?.codigoConta).toBe('2');
    });

    it('deve avaliar indicadores de seção como true quando completo', () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      expect(component.isInformacoesBasicasCompletas).toBe(true);
      expect(component.isEnderecoCompleto).toBe(true);
      expect(component.isTelefoneCompleto).toBe(true);
      expect(component.isEmailCompleto).toBe(true);
      expect(component.isContaCompleta).toBe(true);
    });

    it('deve avaliar indicadores de seção como false quando incompleto', () => {
      component.form.patchValue({
        nomeCompleto: 'Empresa',
        codigoSusep: '',
        perfilRessegurador: '',
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11.222.333/0001-81',
      });

      expect(component.isInformacoesBasicasCompletas).toBe(false);
      expect(component.isEnderecoCompleto).toBe(false);
      expect(component.isTelefoneCompleto).toBe(false);
      expect(component.isEmailCompleto).toBe(false);
      expect(component.isContaCompleta).toBe(false);
    });

    it('deve validar isSalvarHabilitado como true quando completo', () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      expect(component.isSalvarHabilitado).toBe(true);
    });

    it('deve validar isSalvarHabilitado como false quando vazio', () => {
      expect(component.isSalvarHabilitado).toBe(false);
    });

    it('deve retornar false em isSalvarHabilitado sem conta principal', () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      component.dadosConta = [];
      expect(component.isSalvarHabilitado).toBe(false);
    });

    it('deve avaliar codigoSusep vazio em isSalvarHabilitado', () => {
      component.form.patchValue({
        nomeCompleto: 'Empresa',
        nomeFantasia: 'Fantasia',
        codigoSusep: '',
      });
      expect(component.isSalvarHabilitado).toBe(false);
    });
  });

  describe('validacao de cnpj', () => {
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
  });

  describe('adicionar/remover arrays', () => {
    it('deve adicionar e remover endereço', () => {
      component.adicionarEndereco();
      expect(component.enderecosFormArray.length).toBe(1);
      component.removerEndereco(0);
      expect(component.enderecosFormArray.length).toBe(0);
    });

    it('deve adicionar e remover telefone', () => {
      component.mode = 'criar';
      component.adicionarTelefone();
      expect(component.telefonesFormArray.length).toBe(1);
      component.removerTelefone(0);
      expect(component.telefonesFormArray.length).toBe(0);
    });

    it('deve adicionar e remover email', () => {
      component.mode = 'criar';
      component.adicionarEmail();
      expect(component.emailsFormArray.length).toBe(1);
      component.removerEmail(0);
      expect(component.emailsFormArray.length).toBe(0);
    });

    it('deve bloquear remoção de dados carregados e permitir apenas novo endereço em editar', async () => {
      component.mode = 'editar';
      component.resseguradorId = 'cli-1';

      await (component as any).configurarTelaPorModo();

      expect(component.canAddEndereco).toBe(true);
      expect(component.canAddTelefone).toBe(true);
      expect(component.canAddEmail).toBe(true);

      component.removerEndereco(0);
      component.removerTelefone(0);
      component.removerEmail(0);

      expect(component.enderecosFormArray.length).toBe(3);
      expect(component.telefonesFormArray.length).toBe(5);
      expect(component.emailsFormArray.length).toBe(1);

      component.adicionarEndereco();
      component.adicionarTelefone();
      component.adicionarEmail();

      expect(component.enderecosFormArray.length).toBe(4);
      expect(component.enderecosFormArray.at(3).enabled).toBe(true);
      expect(component.telefonesFormArray.length).toBe(6);
      expect(component.telefonesFormArray.at(5).enabled).toBe(true);
      expect(component.emailsFormArray.length).toBe(2);
      expect(component.emailsFormArray.at(1).enabled).toBe(true);
    });
  });

  describe('formatarDocumentoInicial', () => {
    it('deve formatar CNPJ completo', () => {
      const result = (component as any).formatarDocumentoInicial(
        '11222333000181',
        DocumentTypeEnum.CNPJ
      );
      expect(result).toBe('11.222.333/0001-81');
    });

    it('deve formatar CNPJ parcial', () => {
      expect(
        (component as any).formatarDocumentoInicial('12', DocumentTypeEnum.CNPJ)
      ).toBe('12');
      expect(
        (component as any).formatarDocumentoInicial(
          '12345',
          DocumentTypeEnum.CNPJ
        )
      ).toBe('12.345');
    });

    it('deve retornar valor limpo para NIF', () => {
      expect(
        (component as any).formatarDocumentoInicial(
          'AB-12/34',
          DocumentTypeEnum.NIF
        )
      ).toBe('AB1234');
    });
  });

  describe('input handlers', () => {
    it('deve limpar e limitar o código SUSEP', () => {
      component.onSusepInput(inputEvent('12a34567'));
      expect(component.form.get('codigoSusep')?.value).toBe('12345');
    });

    it('deve formatar documento CNPJ', () => {
      component.form.get('tipoDocumento')?.setValue(DocumentTypeEnum.CNPJ);
      component.onDocumentoInput(inputEvent('11222333000181'));
      expect(component.form.get('numeroDocumento')?.value).toBe(
        '11.222.333/0001-81'
      );
    });

    it('deve formatar documento CNPJ parcial', () => {
      component.form.get('tipoDocumento')?.setValue(DocumentTypeEnum.CNPJ);
      component.onDocumentoInput(inputEvent('12'));
      expect(component.form.get('numeroDocumento')?.value).toBe('12');
    });

    it('deve limpar documento não-CNPJ', () => {
      component.form.get('tipoDocumento')?.setValue(DocumentTypeEnum.NIF);
      component.onDocumentoInput(inputEvent('ab-12/34'));
      expect(component.form.get('numeroDocumento')?.value).toBe('ab1234');
    });

    it('deve tratar UF em maiúsculo', () => {
      component.adicionarEndereco();
      component.onUfInput(inputEvent('s1p2extra'), 0);
      expect(component.enderecosFormArray.at(0).get('uf')?.value).toBe('SP');
    });

    it('deve formatar CEP com e sem hífen', () => {
      component.adicionarEndereco();
      component.onCepInput(inputEvent('12345678'), 0);
      expect(component.enderecosFormArray.at(0).get('cep')?.value).toBe(
        '12345-678'
      );
      component.onCepInput(inputEvent('123'), 0);
      expect(component.enderecosFormArray.at(0).get('cep')?.value).toBe('123');
    });

    it('deve formatar DDI', () => {
      component.mode = 'criar';
      component.adicionarTelefone();
      component.onDdiInput(inputEvent('55'), 0);
      expect(component.telefonesFormArray.at(0).get('ddi')?.value).toBe('+55');
      component.onDdiInput(inputEvent(''), 0);
      expect(component.telefonesFormArray.at(0).get('ddi')?.value).toBe('');
    });

    it('deve formatar DDD', () => {
      component.mode = 'criar';
      component.adicionarTelefone();
      component.onDddInput(inputEvent('119'), 0);
      expect(component.telefonesFormArray.at(0).get('ddd')?.value).toBe('11');
    });

    it('deve formatar número móvel', () => {
      component.mode = 'criar';
      component.adicionarTelefone();
      component.telefonesFormArray
        .at(0)
        .get('tipoTelefone')
        ?.setValue(PhoneTypeEnum.MOVEL);
      component.onTelefoneNumeroInput(inputEvent('912345678'), 0);
      expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
        '91234-5678'
      );
      component.onTelefoneNumeroInput(inputEvent('123'), 0);
      expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
        '123'
      );
    });

    it('deve formatar número fixo', () => {
      component.mode = 'criar';
      component.adicionarTelefone();
      component.telefonesFormArray
        .at(0)
        .get('tipoTelefone')
        ?.setValue(PhoneTypeEnum.FIXO);
      component.onTelefoneNumeroInput(inputEvent('12345678'), 0);
      expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
        '1234-5678'
      );
      component.onTelefoneNumeroInput(inputEvent('123'), 0);
      expect(component.telefonesFormArray.at(0).get('numero')?.value).toBe(
        '123'
      );
    });

    it('deve limpar agência, conta e dac', () => {
      component.onAgenciaInput(inputEvent('12a3456'));
      expect(component.contaForm.get('agencia')?.value).toBe('1234');
      component.onContaInput(inputEvent('123456789012a'));
      expect(component.contaForm.get('conta')?.value).toBe('12345678901');
      component.onDacInput(inputEvent('9a8'));
      expect(component.contaForm.get('dac')?.value).toBe('98');
    });
  });

  describe('paginação e seleção', () => {
    it('deve atualizar página no onPaginate com detail', () => {
      component.onPaginate({ detail: { currentPage: 2, pageSize: 20 } });
      expect(component.currentPage).toBe(2);
      expect(component.pageSize).toBe(20);
    });

    it('deve atualizar página no onPaginate sem detail', () => {
      component.onPaginate({ currentPage: 3, pageSize: 50 });
      expect(component.currentPage).toBe(3);
      expect(component.pageSize).toBe(50);
    });

    it('deve marcar linha selecionada em checkRow', () => {
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '1',
          codigoAgencia: '1',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: 'A',
          dac: '0',
        }),
        new BankAccountEntity({
          contaSelecionada: false,
          codigoBanco: '2',
          codigoAgencia: '2',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: 'B',
          dac: '0',
        }),
      ];
      component.checkRow(component.dadosConta[1]);
      expect(component.dadosConta[0].contaSelecionada).toBe(false);
      expect(component.dadosConta[1].contaSelecionada).toBe(true);
    });
  });

  describe('obterNomeTipoConta', () => {
    it('deve retornar vazio para código vazio', () => {
      expect(component.obterNomeTipoConta('')).toBe('');
    });

    it('deve mapear códigos conhecidos', () => {
      expect(component.obterNomeTipoConta('C')).toBe('Conta Corrente');
      expect(component.obterNomeTipoConta('P')).toBe('Conta Poupança');
      expect(component.obterNomeTipoConta('S')).toBe('Conta Salário');
      expect(component.obterNomeTipoConta('I')).toBe('Conta Investimento');
      expect(component.obterNomeTipoConta('D')).toBe('Conta Desativada');
      expect(component.obterNomeTipoConta('N')).toBe('Conta Não Correntista');
      expect(component.obterNomeTipoConta('G')).toBe('Conta Pagamento');
      expect(component.obterNomeTipoConta('F')).toBe('Conta Financeira');
      expect(component.obterNomeTipoConta('V')).toBe('Conta Virtual');
    });

    it('deve retornar o código original quando desconhecido', () => {
      expect(component.obterNomeTipoConta('XYZ')).toBe('XYZ');
    });
  });

  describe('gestão de contas', () => {
    it('deve abrir formulário de nova conta', () => {
      component.adicionarConta();
      expect(component.showContaForm).toBe(true);
      expect(component.editingContaIndex).toBeNull();
    });

    it('deve abrir formulário de edição de conta', () => {
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ];
      component.editarConta(0);
      expect(component.editingContaIndex).toBe(0);
      expect(component.showContaForm).toBe(true);
      expect(component.contaForm.get('banco')?.value).toBe('341');
    });

    it('deve remover conta', () => {
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ];
      component.removerConta(0);
      expect(component.dadosConta.length).toBe(0);
      expect(component.showContaForm).toBe(false);
    });

    it('não deve salvar conta inválida', () => {
      component.contaForm.reset();
      component.salvarConta();
      expect(component.dadosConta.length).toBe(0);
    });

    const preencherContaForm = () => {
      component.contaForm.patchValue({
        banco: '341',
        agencia: '0001',
        conta: '12345',
        dac: '9',
        tipo: BankAccountTypeEnum.CONTA_CORRENTE,
      });
    };

    it('deve salvar nova conta selecionando a primeira', () => {
      preencherContaForm();
      component.dadosConta = [];
      component.salvarConta();
      expect(component.dadosConta.length).toBe(1);
      expect(component.dadosConta[0].contaSelecionada).toBe(true);
      expect(component.showContaForm).toBe(false);
    });

    it('deve salvar nova conta não selecionada quando já houver contas', () => {
      preencherContaForm();
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '001',
          codigoAgencia: '0002',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '999',
          dac: '0',
        }),
      ];
      component.salvarConta();
      expect(component.dadosConta.length).toBe(2);
      expect(component.dadosConta[1].contaSelecionada).toBe(false);
    });

    it('deve salvar edição de conta existente mantendo seleção', () => {
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '001',
          codigoAgencia: '0002',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '999',
          dac: '0',
        }),
      ];
      component.editingContaIndex = 0;
      preencherContaForm();
      component.salvarConta();
      expect(component.dadosConta.length).toBe(1);
      expect(component.dadosConta[0].codigoBanco).toBe('341');
      expect(component.dadosConta[0].contaSelecionada).toBe(true);
    });

    it('deve cancelar edição de conta', () => {
      component.showContaForm = true;
      component.editingContaIndex = 2;
      component.cancelarEdicaoConta();
      expect(component.showContaForm).toBe(false);
      expect(component.editingContaIndex).toBeNull();
    });
  });

  describe('salvar', () => {
    it('não deve salvar quando não habilitado', async () => {
      const result = await component.salvar();
      expect(result).toBeUndefined();
      expect(mockCadastrar.execute).not.toHaveBeenCalled();
    });

    it('deve cadastrar e navegar no modo criar', async () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      await component.salvar();
      expect(mockCadastrar.execute).toHaveBeenCalled();
      expect(navigationMock.navigate).toHaveBeenCalledWith(
        NavigationRoute.ResseguradoresHome
      );
      expect(component.isLoading).toBe(false);
    });

    it('deve atualizar no modo editar sem reenviar dados carregados', async () => {
      component.mode = 'editar';
      component.resseguradorData = buildResponseEntity();
      component.resseguradorId = 'cli-1';

      await (component as any).configurarTelaPorModo();

      component.adicionarEndereco();
      component.enderecosFormArray.at(3).patchValue({
        propositoEndereco: AddressTypeEnum.OUTROS,
        pais: 'BR',
        uf: 'RJ',
        cidade: 'Rio de Janeiro',
        cep: '20000-000',
        logradouro: 'Rua Nova',
        numero: '10',
        complemento: '',
        bairro: 'Centro',
      });

      component.form.patchValue({
        codigoSusep: '54321',
        perfilRessegurador: ResseguradorProfileTypeEnum.LOCAL,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11.222.333/0001-81',
        pais: 'BR',
      });

      await component.salvar();

      expect(mockCadastrar.execute).not.toHaveBeenCalled();
      expect(mockAtualizar.execute).toHaveBeenCalled();

      const payload = mockAtualizar.execute.mock.calls[0][0];
      expect(payload.dadosCadastrais.enderecos).toHaveLength(1);
      expect(payload.dadosCadastrais.enderecos[0].logradouro).toBe('Rua Nova');
      expect(payload.dadosCadastrais.telefones).toBeNull();
      expect(payload.dadosCadastrais.emails).toBeNull();

      expect(navigationMock.navigate).toHaveBeenCalledWith(
        NavigationRoute.ResseguradoresHome
      );
    });

    it('deve tratar erro ao cadastrar', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      mockCadastrar.execute.mockRejectedValueOnce(new Error('falha'));
      await component.salvar();
      expect(consoleSpy).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      consoleSpy.mockRestore();
    });

    it('deve usar valores padrão quando dadosConta estiver vazio', async () => {
      jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
      component.mode = 'criar';
      component.dadosConta = [];
      await component.salvar();
      expect(mockCadastrar.execute).toHaveBeenCalled();
    });

    it('deve usar a primeira conta quando nenhuma estiver selecionada', async () => {
      jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
      component.mode = 'criar';
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: false,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ];
      await component.salvar();
      expect(mockCadastrar.execute).toHaveBeenCalled();
    });

    it('deve mapear arrays com valores vazios usando padrões', async () => {
      jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
      component.mode = 'criar';
      component.form.reset();
      component.adicionarEndereco();
      component.adicionarTelefone();
      component.adicionarEmail();
      component.dadosConta = [];
      await component.salvar();
      expect(mockCadastrar.execute).toHaveBeenCalled();
    });

    it('deve enviar null para nomeContato vazio e nao enviar departamento', async () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      component.emailsFormArray.at(0).patchValue({
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
      component.form.enable();
      component.form.patchValue({
        nomeCompleto: 'Empresa Teste',
        nomeFantasia: 'Fantasia Teste',
        codigoSusep: '12345',
        perfilRessegurador: ResseguradorProfileTypeEnum.LOCAL,
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11.222.333/0001-81',
        pais: 'BR',
      });
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ];

      expect(component.enderecosFormArray.length).toBe(0);
      expect(component.telefonesFormArray.length).toBe(0);
      expect(component.emailsFormArray.length).toBe(0);
      expect(component.isSalvarHabilitado).toBe(true);
    });

    it('deve omitir enderecos, telefones e emails vazios do payload', async () => {
      jest.spyOn(component, 'isSalvarHabilitado', 'get').mockReturnValue(true);
      component.mode = 'criar';
      component.form.patchValue({
        nomeCompleto: 'Empresa Teste',
        codigoSusep: '12345',
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11.222.333/0001-81',
        pais: 'BR',
      });
      component.dadosConta = [
        new BankAccountEntity({
          contaSelecionada: true,
          codigoBanco: '341',
          codigoAgencia: '0001',
          codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
          codigoConta: '12345',
          dac: '9',
        }),
      ];

      await component.salvar();

      const payload = mockCadastrar.execute.mock.calls[0][0];
      const dto = CriarResseguradorRequestMapper.toDto(payload);
      expect(dto.dados_cadastrais).not.toHaveProperty('enderecos');
      expect(dto.dados_cadastrais).not.toHaveProperty('telefones');
      expect(dto.dados_cadastrais).not.toHaveProperty('emails');
    });
  });

  it('deve alterar para modo edição', () => {
    component.mode = 'visualizar';
    component.resseguradorData = buildResponseEntity();
    component.enderecosFormArray.push(
      (component as any).criarEnderecoFormGroup(
        component.resseguradorData.dadosCadastrais?.enderecos?.[0]
      )
    );
    (component as any).loadedEnderecosCount = 1;
    component.form.disable();
    component.alterarParaModoEdicao();
    expect(component.mode).toBe('editar');
    expect(component.form.enabled).toBe(true);
    expect(component.enderecosFormArray.at(0).disabled).toBe(true);
  });

  it('deve navegar para a home ao voltar', () => {
    component.goBack();
    expect(navigationMock.navigate).toHaveBeenCalledWith(
      NavigationRoute.ResseguradoresHome
    );
  });

  describe('onSearchDocumentoInput', () => {
    it('deve formatar CNPJ completo no searchForm', () => {
      component.searchForm
        .get('tipoDocumento')
        ?.setValue(DocumentTypeEnum.CNPJ);
      component.onSearchDocumentoInput(inputEvent('12345678000190'));
      expect(component.searchForm.get('numeroDocumento')?.value).toBe(
        '12.345.678/0001-90'
      );
    });

    it('deve formatar CNPJ parcial no searchForm', () => {
      component.searchForm
        .get('tipoDocumento')
        ?.setValue(DocumentTypeEnum.CNPJ);
      component.onSearchDocumentoInput(inputEvent('12345'));
      expect(component.searchForm.get('numeroDocumento')?.value).toBe('12.345');
    });

    it('deve limpar documento não-CNPJ no searchForm', () => {
      component.searchForm.get('tipoDocumento')?.setValue(DocumentTypeEnum.NIF);
      component.onSearchDocumentoInput(inputEvent('ab-12/34'));
      expect(component.searchForm.get('numeroDocumento')?.value).toBe('ab1234');
    });
  });

  describe('obterNomeTipoConta variantes string', () => {
    it('deve mapear strings CONTA_*', () => {
      expect(component.obterNomeTipoConta('CONTA_CORRENTE')).toBe(
        'Conta Corrente'
      );
      expect(component.obterNomeTipoConta('CONTA_POUPANCA')).toBe(
        'Conta Poupança'
      );
      expect(component.obterNomeTipoConta('CONTA_SALARIO')).toBe(
        'Conta Salário'
      );
      expect(component.obterNomeTipoConta('CONTA_INVESTIMENTO')).toBe(
        'Conta Investimento'
      );
      expect(component.obterNomeTipoConta('CONTA_DESATIVADA')).toBe(
        'Conta Desativada'
      );
      expect(component.obterNomeTipoConta('CONTA_NAO_CORRENTISTA')).toBe(
        'Conta Não Correntista'
      );
      expect(component.obterNomeTipoConta('CONTA_PAGAMENTO')).toBe(
        'Conta de Pagamento'
      );
      expect(component.obterNomeTipoConta('CONTA_FINANCEIRA')).toBe(
        'Conta Financeira'
      );
      expect(component.obterNomeTipoConta('CONTA_VIRTUAL')).toBe(
        'Conta Virtual'
      );
    });
  });

  describe('isSalvarHabilitado no modo criar sem busca', () => {
    it('deve retornar false quando mode=criar e isBuscaRealizada=false', () => {
      component.mode = 'criar';
      component.isBuscaRealizada = false;
      preencherFormCompleto();
      expect(component.isSalvarHabilitado).toBe(false);
    });

    it('deve retornar true quando mode=criar e isBuscaRealizada=true', () => {
      component.mode = 'criar';
      component.isBuscaRealizada = true;
      preencherFormCompleto();
      expect(component.isSalvarHabilitado).toBe(true);
    });

    it('deve retornar false no modo visualizar quando o form não estiver completo', () => {
      component.mode = 'visualizar';
      component.isBuscaRealizada = false;
      expect(component.isSalvarHabilitado).toBe(false);
    });
  });

  describe('buscarDadosCadastrais', () => {
    const buildDadosResponse = (
      over?: Partial<BuscarDadosCadastraisResponseEntity>
    ): BuscarDadosCadastraisResponseEntity =>
      new BuscarDadosCadastraisResponseEntity({
        idCliente: 'cli-1',
        situacaoCadastral: 'ATIVO',
        dadosCadastrais: new RegistrationDataEntity({
          nomeCompleto: 'Empresa Busca',
          nomeFantasia: 'Fantasia Busca',
          tipoDocumento: DocumentTypeEnum.CNPJ,
          numeroDocumento: '12345678000190',
          pais: 'Brasil',
          enderecos: [
            new AddressEntity({
              propositoEndereco: AddressTypeEnum.PRINCIPAL,
              logradouro: 'Rua X',
              numero: '1',
              complemento: '',
              bairro: 'Bairro',
              cep: '12345678',
              cidade: 'São Paulo',
              uf: 'SP',
              pais: 'Brasil',
              regiao: '',
              codigoAreaPostal: '',
            }),
          ],
          telefones: [
            new PhoneEntity({
              propositoTelefone: PhonePurposeEnum.PRINCIPAL,
              tipoTelefone: PhoneTypeEnum.MOVEL,
              ddi: 55,
              ddd: 11,
              numero: 912345678,
            }),
          ],
          emails: [
            new EmailEntity({
              propositoEmail: MailPurposeEnum.PRINCIPAL,
              email: 'busca@teste.com',
              nomeContato: 'Contato',
            }),
          ],
        }),
        dadosConta: [
          new BankAccountEntity({
            contaSelecionada: false,
            codigoBanco: '341',
            codigoAgencia: '0001',
            codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
            codigoConta: '12345',
            dac: '9',
          }),
        ],
        ...over,
      });

    const preencherSearchForm = () => {
      component.searchForm.patchValue({
        tipoDocumento: DocumentTypeEnum.CNPJ,
        numeroDocumento: '11.222.333/0001-81',
        pais: 'BR',
      });
    };

    it('não deve buscar quando o searchForm for inválido', async () => {
      component.searchForm.reset();
      await component.buscarDadosCadastrais();
      expect(mockBuscarDadosCadastrais.execute).not.toHaveBeenCalled();
    });

    it('deve preencher o formulário quando a resposta tiver dados completos', async () => {
      preencherSearchForm();
      mockBuscarDadosCadastrais.execute.mockResolvedValueOnce(
        buildDadosResponse()
      );

      await component.buscarDadosCadastrais();

      expect(component.isBuscaRealizada).toBe(true);
      expect(component.form.get('nomeCompleto')?.value).toBe('Empresa Busca');
      expect(component.form.get('nomeFantasia')?.value).toBe('Fantasia Busca');
      expect(component.form.get('numeroDocumento')?.value).toBe(
        '12.345.678/0001-90'
      );
      expect(component.enderecosFormArray.length).toBe(1);
      expect(component.telefonesFormArray.length).toBe(1);
      expect(component.emailsFormArray.length).toBe(1);
      expect(component.dadosConta.length).toBe(1);
      expect(component.dadosConta[0].contaSelecionada).toBe(true);
      expect(component.isLoading).toBe(false);
    });

    it('deve lidar com dadosCadastrais com campos vazios e dadosConta nulo', async () => {
      preencherSearchForm();
      mockBuscarDadosCadastrais.execute.mockResolvedValueOnce(
        buildDadosResponse({
          dadosCadastrais: new RegistrationDataEntity({
            nomeCompleto: '',
            nomeFantasia: '',
            tipoDocumento: '' as any,
            numeroDocumento: '',
            pais: '',
            enderecos: undefined as any,
            telefones: undefined as any,
            emails: undefined as any,
          }),
          dadosConta: undefined as any,
        })
      );

      await component.buscarDadosCadastrais();

      expect(component.isBuscaRealizada).toBe(true);
      expect(component.form.get('nomeCompleto')?.value).toBe('');
      expect(component.enderecosFormArray.length).toBe(0);
      expect(component.telefonesFormArray.length).toBe(0);
      expect(component.emailsFormArray.length).toBe(0);
      expect(component.dadosConta.length).toBe(0);
    });

    it('deve lidar com contas existentes mantendo seleção para não-primeiras', async () => {
      preencherSearchForm();
      mockBuscarDadosCadastrais.execute.mockResolvedValueOnce(
        buildDadosResponse({
          dadosConta: [
            new BankAccountEntity({
              contaSelecionada: false,
              codigoBanco: '341',
              codigoAgencia: '0001',
              codigoTipoConta: BankAccountTypeEnum.CONTA_CORRENTE,
              codigoConta: '12345',
              dac: '9',
            }),
            new BankAccountEntity({
              contaSelecionada: true,
              codigoBanco: '001',
              codigoAgencia: '0002',
              codigoTipoConta: BankAccountTypeEnum.CONTA_POUPANCA,
              codigoConta: '67890',
              dac: '1',
            }),
          ],
        })
      );

      await component.buscarDadosCadastrais();

      expect(component.dadosConta.length).toBe(2);
      expect(component.dadosConta[0].contaSelecionada).toBe(true);
      expect(component.dadosConta[1].contaSelecionada).toBe(true);
    });

    it('deve mostrar snackbar e pré-preencher documento quando resposta for nula', async () => {
      preencherSearchForm();
      mockBuscarDadosCadastrais.execute.mockResolvedValueOnce(null);

      await component.buscarDadosCadastrais();

      expect(component.isBuscaRealizada).toBe(true);
      expect(component.form.get('nomeCompleto')?.value).toBe('');
      expect(component.form.get('numeroDocumento')?.value).toBe(
        '11.222.333/0001-81'
      );
      expect(component.form.get('tipoDocumento')?.value).toBe(
        DocumentTypeEnum.CNPJ
      );
      expect(snackbarMock.showSnackbar).toHaveBeenCalledWith(
        expect.any(String),
        'warning'
      );
      expect(component.isLoading).toBe(false);
    });

    it('deve tratar erro e permitir preenchimento manual', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      preencherSearchForm();
      mockBuscarDadosCadastrais.execute.mockRejectedValueOnce(
        new Error('falha')
      );

      await component.buscarDadosCadastrais();

      expect(component.isBuscaRealizada).toBe(true);
      expect(component.form.get('nomeCompleto')?.value).toBe('');
      expect(component.form.get('numeroDocumento')?.value).toBe(
        '11.222.333/0001-81'
      );
      expect(consoleSpy).toHaveBeenCalled();
      expect(component.isLoading).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
