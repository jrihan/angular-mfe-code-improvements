import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IdsCheckboxModule,
  IdsFormFieldModule,
  IdsIconModule,
  IdsInputModule,
  IdsLoadingModule,
  IdsMainButtonModule,
  IdsOption,
  IdsPaginationModule,
  IdsSelectModule,
  IdsTableModule,
} from '@ids/angular';
import { BuscarBrokerResponseEntity } from 'src/app/features/brokers/domain/entities/response/buscar_broker_response.entity';
import { CriarBrokerRequestEntity } from 'src/app/features/brokers/domain/entities/request/criar_broker_request.entity';
import { AtualizarBrokerRequestEntity } from 'src/app/features/brokers/domain/entities/request/atualizar_broker_request.entity';
import { BuscarBrokerUseCase } from 'src/app/features/brokers/domain/usecases/buscar_broker.usecase';
import { BuscarDadosCadastraisUseCase } from 'src/app/features/brokers/domain/usecases/buscar_dados_cadastrais.usecase';
import { AtualizarBrokerUseCase } from 'src/app/features/brokers/domain/usecases/atualizar_broker.usecase';
import { CadastrarBrokerUseCase } from 'src/app/features/brokers/domain/usecases/cadastrar_broker.usecase';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { RetryStateComponent } from 'src/app/shared/components/retry_state/retry_state.component';
import { BankAccountEntity } from 'src/app/shared/domain/entities/bank_account.entity';
import { AddressEntity } from 'src/app/shared/domain/entities/address.entity';
import { EmailEntity } from 'src/app/shared/domain/entities/email.entity';
import { PhoneEntity } from 'src/app/shared/domain/entities/phone.entity';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { AddressTypeEnum } from 'src/app/shared/domain/enum/address_type.enum';
import { BankAccountTypeEnum } from 'src/app/shared/domain/enum/bank_account_type.enum';
import {
  CountryCodeEnum,
  COUNTRY_CODE_LABELS,
} from 'src/app/shared/domain/enum/country_code.enum';
import { DocumentTypeEnum } from 'src/app/shared/domain/enum/document_type.enum';
import { MailPurposeEnum } from 'src/app/shared/domain/enum/mail_purpose.enum';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';
import { PhonePurposeEnum } from 'src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from 'src/app/shared/domain/enum/phone_type.enum';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { NavigationService } from 'src/app/shared/navigation.service';
import { CNPJ } from 'src/app/shared/presentation/validators/cnpj.validator';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { BuscarInstituicoesFinanceirasUseCase } from 'src/app/features/brokers/domain/usecases/buscar_instituicoes_financeiras.usecase';

export type ScreenMode = 'create' | 'edit' | 'visualize';
type DetailLoadState = 'content' | 'not-found' | 'error';

@Component({
  selector: 'detalhe-broker',
  templateUrl: './detalhe_broker.component.html',
  styleUrls: ['./detalhe_broker.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IdsMainButtonModule,
    IdsIconModule,
    IdsInputModule,
    ContainerBaseComponent,
    RetryStateComponent,
    IdsFormFieldModule,
    IdsSelectModule,
    IdsTableModule,
    IdsCheckboxModule,
    IdsPaginationModule,
    IdsLoadingModule,
  ],
})
export class DetalheBrokerComponent implements OnInit {
  public mode: ScreenMode = 'visualize';
  public brokerId?: string;
  public form!: FormGroup;
  public searchForm!: FormGroup;
  public contaForm!: FormGroup;
  public isLoading = false;
  public isBuscaRealizada = false;
  public brokerData: BuscarBrokerResponseEntity | null = null;
  public instituicoes_financeiras: BuscarInstituicoesFinanceirasResponseEntity | null =
    null;
  public dadosConta: BankAccountEntity[] = [];
  public showContaForm = false;
  public editingContaIndex: number | null = null;
  public currentPage = 1;
  public pageSize = 10;
  public readonly pageSizes = [10, 20, 50];
  public loadState: DetailLoadState = 'content';
  private loadedEnderecosCount = 0;
  private loadedTelefonesCount = 0;
  private loadedEmailsCount = 0;
  private initialEditState: string | null = null;

  public readonly tipoDocumentoOptions: IdsOption[] = [
    { optLabel: 'CNPJ', optValue: DocumentTypeEnum.CNPJ },
    { optLabel: 'NIF', optValue: DocumentTypeEnum.NIF },
    { optLabel: 'CGI', optValue: DocumentTypeEnum.CGI },
  ];

  public readonly countryOptions: IdsOption[] = Object.values(
    CountryCodeEnum
  ).map((countryCode) => ({
    optLabel: `${countryCode} - ${COUNTRY_CODE_LABELS[countryCode]}`,
    optValue: countryCode,
  }));

  public readonly addressTypeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: AddressTypeEnum.PRINCIPAL },
    { optLabel: 'Comercial', optValue: AddressTypeEnum.COMERCIAL },
    { optLabel: 'Outros', optValue: AddressTypeEnum.OUTROS },
  ];

  public readonly phonePurposeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: PhonePurposeEnum.PRINCIPAL },
    { optLabel: 'Comercial', optValue: PhonePurposeEnum.COMERCIAL },
    { optLabel: 'Outros', optValue: PhonePurposeEnum.OUTROS },
  ];

  public readonly phoneTypeOptions: IdsOption[] = [
    { optLabel: 'Móvel', optValue: PhoneTypeEnum.MOVEL },
    { optLabel: 'Fixo', optValue: PhoneTypeEnum.FIXO },
  ];

  public readonly mailPurposeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: MailPurposeEnum.PRINCIPAL },
    { optLabel: 'Outros', optValue: MailPurposeEnum.OUTROS },
  ];

  public readonly tiposConta = [
    { nome: 'Conta Corrente', codigo: BankAccountTypeEnum.CONTA_CORRENTE },
    {
      nome: 'Conta Não Correntista',
      codigo: BankAccountTypeEnum.CONTA_NAO_CORRENTISTA,
    },
    { nome: 'Conta Pagamento', codigo: BankAccountTypeEnum.CONTA_PAGAMENTO },
    { nome: 'Conta Poupança', codigo: BankAccountTypeEnum.CONTA_POUPANCA },
    {
      nome: 'Conta Investimento',
      codigo: BankAccountTypeEnum.CONTA_INVESTIMENTO,
    },
    { nome: 'Conta Financeira', codigo: BankAccountTypeEnum.CONTA_FINANCEIRA },
    { nome: 'Conta Virtual', codigo: BankAccountTypeEnum.CONTA_VIRTUAL },
  ];

  constructor(
    private readonly navigation: NavigationService,
    private readonly fb: FormBuilder,
    private readonly buscarBrokerUseCase: BuscarBrokerUseCase,
    private readonly buscarDadosCadastraisUseCase: BuscarDadosCadastraisUseCase,
    private readonly cadastrarBrokerUseCase: CadastrarBrokerUseCase,
    private readonly atualizarBrokerUseCase: AtualizarBrokerUseCase,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackbar: SnackbarService,
    private readonly listarInstituicoesFinanceirasUseCase: BuscarInstituicoesFinanceirasUseCase
  ) {
    this.inicializarFormulario();
    this.carregarBancos();
  }

  ngOnInit(): void {
    const params = this.navigation.current.params;

    if (params) {
      this.mode = params.mode || 'visualize';
      this.brokerId = params.id;
    }

    this.configurarTelaPorModo();
  }

  get enderecosFormArray(): FormArray {
    return this.form.get('enderecos') as FormArray;
  }

  get telefonesFormArray(): FormArray {
    return this.form.get('telefones') as FormArray;
  }

  get emailsFormArray(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  get displayedColumnsContas(): string[] {
    if (this.mode === 'visualize') {
      return [
        'conta_principal',
        'codigo_banco',
        'codigo_agencia',
        'tipo_conta',
        'codigo_conta',
        'dac',
      ];
    }

    return [
      'conta_principal',
      'codigo_banco',
      'codigo_agencia',
      'tipo_conta',
      'codigo_conta',
      'dac',
      'acao',
    ];
  }

  get dadosContaPaginada(): BankAccountEntity[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.dadosConta.slice(start, start + this.pageSize);
  }

  get contaSelecionada(): BankAccountEntity | undefined {
    return this.dadosConta.find((conta) => conta.contaSelecionada);
  }

  get isInformacoesBasicasCompletas(): boolean {
    const rawValue = this.form.getRawValue();
    return (
      !!rawValue.nomeCompleto?.trim() &&
      !!String(rawValue.codigoSusep || '').trim() &&
      !!rawValue.tipoDocumento &&
      !!rawValue.numeroDocumento?.trim() &&
      !!rawValue.pais?.trim()
    );
  }

  get isEnderecoCompleto(): boolean {
    return this.enderecosFormArray.length >= 1 && this.enderecosFormArray.valid;
  }

  get isTelefoneCompleto(): boolean {
    return this.telefonesFormArray.length >= 1 && this.telefonesFormArray.valid;
  }

  get isEmailCompleto(): boolean {
    return this.emailsFormArray.length >= 1 && this.emailsFormArray.valid;
  }

  get isContaCompleta(): boolean {
    return !!this.contaSelecionada && this.dadosConta.length >= 1;
  }

  get canAddEndereco(): boolean {
    return this.mode === 'create' || this.mode === 'edit';
  }

  get canAddTelefone(): boolean {
    return this.mode === 'create' || this.mode === 'edit';
  }

  get canAddEmail(): boolean {
    return this.mode === 'create' || this.mode === 'edit';
  }

  get isSalvarHabilitado(): boolean {
    if (this.mode === 'create' && !this.isBuscaRealizada) {
      return false;
    }

    if (this.mode === 'edit' && !this.hasEditChanges) {
      return false;
    }

    // Endereços, telefones e emails deixam de ser obrigatórios; quando existirem,
    // o próprio form.valid garante a validação de cada item.
    return (
      this.isInformacoesBasicasCompletas &&
      this.form.valid &&
      this.isContaCompleta
    );
  }

  get title(): string {
    const titulos = {
      create: 'Novo Broker',
      edit: 'Editar Broker',
      visualize: 'Visualizar Broker',
    };
    return titulos[this.mode];
  }

  get showRetryState(): boolean {
    return this.loadState === 'error';
  }

  get shouldShowLoadState(): boolean {
    return this.loadState !== 'content';
  }

  get errorStateTitle(): string {
    if (this.loadState === 'not-found') {
      return 'Broker não encontrado';
    }

    return 'Não foi possível carregar os dados do broker';
  }

  get errorStateDescription(): string {
    if (this.loadState === 'not-found') {
      return 'Não encontramos um broker com o identificador informado. Volte para a listagem para continuar.';
    }

    return 'Tente novamente para recarregar os dados do broker ou volte para a listagem.';
  }

  goBack() {
    this.navigation.navigate(NavigationRoute.BrokersHome);
  }

  isEnderecoBloqueado(index: number): boolean {
    return this.mode === 'edit' && index < this.loadedEnderecosCount;
  }

  isTelefoneBloqueado(index: number): boolean {
    return this.mode === 'edit' && index < this.loadedTelefonesCount;
  }

  isEmailBloqueado(index: number): boolean {
    return this.mode === 'edit' && index < this.loadedEmailsCount;
  }

  private get hasEditChanges(): boolean {
    return (
      this.initialEditState !== null &&
      this.initialEditState !== this.serializeCurrentEditState()
    );
  }

  private async loadBrokerData() {
    this.isLoading = true;
    this.loadState = 'content';
    this.brokerData = null;
    try {
      if (this.brokerId) {
        this.brokerData = await this.buscarBrokerUseCase.execute(this.brokerId);
      }

      if (!this.brokerData && this.mode !== 'create') {
        this.loadState = 'not-found';
        return;
      }

      if (this.brokerData) {
        this.resetLoadedRegistrationCounts();
        const rawDoc = this.brokerData.dadosCadastrais?.numeroDocumento || '';
        const tipoDoc = this.brokerData.dadosCadastrais?.tipoDocumento || '';
        const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

        this.form.patchValue({
          nomeCompleto: this.brokerData.dadosCadastrais?.nomeCompleto || '',
          nomeFantasia: this.brokerData.dadosCadastrais?.nomeFantasia || '',
          numeroDocumento: maskedDoc,
          codigoSusep: this.brokerData.codigoSusep || '',
          tipoDocumento: tipoDoc,
          pais: this.brokerData.dadosCadastrais?.pais || CountryCodeEnum.BR,
        });

        this.enderecosFormArray.clear();
        const enderecos = this.brokerData.dadosCadastrais?.enderecos || [];
        enderecos.forEach((endereco) => {
          this.enderecosFormArray.push(this.criarEnderecoFormGroup(endereco));
        });
        this.loadedEnderecosCount = enderecos.length;

        this.telefonesFormArray.clear();
        const telefones = this.brokerData.dadosCadastrais?.telefones || [];
        telefones.forEach((telefone) => {
          this.telefonesFormArray.push(this.criarTelefoneFormGroup(telefone));
        });
        this.loadedTelefonesCount = telefones.length;

        this.emailsFormArray.clear();
        const emails = this.brokerData.dadosCadastrais?.emails || [];
        emails.forEach((email) => {
          this.emailsFormArray.push(this.criarEmailFormGroup(email));
        });
        this.loadedEmailsCount = emails.length;

        this.dadosConta = [];
        if (Array.isArray(this.brokerData.dadosConta)) {
          this.brokerData.dadosConta.forEach((conta, index) => {
            this.dadosConta.push(
              conta.copyWith({
                contaSelecionada:
                  index === 0 ? true : conta.contaSelecionada ?? false,
              })
            );
          });
        }

        if (this.mode === 'edit') {
          this.captureInitialEditState();
        }

        this.cdr.detectChanges();
      }
    } catch (error) {
      if (this.mode !== 'create') {
        this.loadState = 'error';
      }
      console.error('Erro ao carregar dados do broker:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async retryLoadBrokerData(): Promise<void> {
    await this.loadBrokerData();

    if (this.loadState === 'content' && this.mode === 'edit') {
      this.form.enable();
      this.bloquearDadosCadastraisCarregados();
      this.captureInitialEditState();
      this.cdr.detectChanges();
    }
  }

  async buscarDadosCadastrais(): Promise<void> {
    if (this.searchForm.invalid) return;

    this.isLoading = true;
    this.isBuscaRealizada = false;
    this.cdr.detectChanges();

    try {
      const formValue = this.searchForm.value;
      const result = await this.buscarDadosCadastraisUseCase.execute({
        documentNumber: formValue.numeroDocumento,
        documentType: formValue.tipoDocumento || DocumentTypeEnum.CNPJ,
        countryCode: formValue.pais || CountryCodeEnum.BR,
      });

      this.isBuscaRealizada = true;

      if (result) {
        const rawDoc = result.dadosCadastrais?.numeroDocumento || '';
        const tipoDoc = result.dadosCadastrais?.tipoDocumento || '';
        const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

        this.form.patchValue({
          nomeCompleto: result.dadosCadastrais?.nomeCompleto || '',
          nomeFantasia: result.dadosCadastrais?.nomeFantasia || '',
          numeroDocumento: maskedDoc,
          tipoDocumento: tipoDoc || formValue.tipoDocumento,
          pais: result.dadosCadastrais?.pais || formValue.pais,
        });

        this.enderecosFormArray.clear();
        const enderecos = result.dadosCadastrais?.enderecos || [];
        enderecos.forEach((endereco) => {
          this.enderecosFormArray.push(this.criarEnderecoFormGroup(endereco));
        });

        this.telefonesFormArray.clear();
        const telefones = result.dadosCadastrais?.telefones || [];
        telefones.forEach((telefone) => {
          this.telefonesFormArray.push(this.criarTelefoneFormGroup(telefone));
        });

        this.emailsFormArray.clear();
        const emails = result.dadosCadastrais?.emails || [];
        emails.forEach((email) => {
          this.emailsFormArray.push(this.criarEmailFormGroup(email));
        });

        this.dadosConta = [];
        if (Array.isArray(result.dadosConta)) {
          result.dadosConta.forEach((conta, index) => {
            this.dadosConta.push(
              conta.copyWith({
                contaSelecionada:
                  index === 0 ? true : conta.contaSelecionada ?? false,
              })
            );
          });
        }
      } else {
        const rawDoc = formValue.numeroDocumento || '';
        const tipoDoc = formValue.tipoDocumento || DocumentTypeEnum.CNPJ;
        const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

        this.form.patchValue({
          nomeCompleto: '',
          nomeFantasia: '',
          numeroDocumento: maskedDoc,
          tipoDocumento: tipoDoc,
          codigoSusep: '',
          pais: formValue.pais || CountryCodeEnum.BR,
        });

        this.enderecosFormArray.clear();
        this.telefonesFormArray.clear();
        this.emailsFormArray.clear();
        this.dadosConta = [];
        this.snackbar.showSnackbar(
          'Nenhum dado cadastral encontrado para o documento informado. Você pode preencher os campos manualmente.',
          'warning'
        );
      }
    } catch (error) {
      console.error('Erro ao buscar dados cadastrais do broker:', error);
      this.isBuscaRealizada = true;

      const formValue = this.searchForm.value;
      const rawDoc = formValue.numeroDocumento || '';
      const tipoDoc = formValue.tipoDocumento || DocumentTypeEnum.CNPJ;
      const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

      this.form.patchValue({
        nomeCompleto: '',
        nomeFantasia: '',
        numeroDocumento: maskedDoc,
        tipoDocumento: tipoDoc,
        codigoSusep: '',
        pais: formValue.pais || CountryCodeEnum.BR,
      });

      this.enderecosFormArray.clear();
      this.telefonesFormArray.clear();
      this.emailsFormArray.clear();
      this.dadosConta = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onSusepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 5);
    this.form.get('codigoSusep')?.setValue(value, { emitEvent: false });
  }

  onDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const tipo = this.form.get('tipoDocumento')?.value;
    let raw = input.value.replace(/[^A-Za-z0-9]/g, '');

    if (tipo === DocumentTypeEnum.CNPJ) {
      raw = raw.slice(0, 14);
      const p1 = raw.slice(0, 2);
      const p2 = raw.slice(2, 5);
      const p3 = raw.slice(5, 8);
      const p4 = raw.slice(8, 12);
      const p5 = raw.slice(12, 14);

      let value = p1;
      if (p2) value += '.' + p2;
      if (p3) value += '.' + p3;
      if (p4) value += '/' + p4;
      if (p5) value += '-' + p5;

      this.form.get('numeroDocumento')?.setValue(value, { emitEvent: false });
      return;
    }

    this.form.get('numeroDocumento')?.setValue(raw, { emitEvent: false });
  }

  onSearchDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const tipo = this.searchForm.get('tipoDocumento')?.value;
    let raw = input.value.replace(/[^A-Za-z0-9]/g, '');

    if (tipo === DocumentTypeEnum.CNPJ) {
      raw = raw.slice(0, 14);
      const p1 = raw.slice(0, 2);
      const p2 = raw.slice(2, 5);
      const p3 = raw.slice(5, 8);
      const p4 = raw.slice(8, 12);
      const p5 = raw.slice(12, 14);

      let value = p1;
      if (p2) value += '.' + p2;
      if (p3) value += '.' + p3;
      if (p4) value += '/' + p4;
      if (p5) value += '-' + p5;

      this.searchForm
        .get('numeroDocumento')
        ?.setValue(value, { emitEvent: false });
      return;
    }

    this.searchForm.get('numeroDocumento')?.setValue(raw, { emitEvent: false });
  }

  onUfInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 2)
      .toUpperCase();

    this.enderecosFormArray
      .at(index)
      .get('uf')
      ?.setValue(clean, { emitEvent: false });
  }

  onCepInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const rawVal = input.value.replace(/\D/g, '').slice(0, 8);
    const cepValue =
      rawVal.length > 5 ? `${rawVal.slice(0, 5)}-${rawVal.slice(5)}` : rawVal;

    this.enderecosFormArray
      .at(index)
      .get('cep')
      ?.setValue(cepValue, { emitEvent: false });
  }

  onDdiInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const rawVal = input.value.replace(/\D/g, '').slice(0, 4);
    const ddiValue = rawVal ? `+${rawVal}` : '';

    this.telefonesFormArray
      .at(index)
      .get('ddi')
      ?.setValue(ddiValue, { emitEvent: false });
  }

  onDddInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const rawVal = input.value.replace(/\D/g, '').slice(0, 2);

    this.telefonesFormArray
      .at(index)
      .get('ddd')
      ?.setValue(rawVal, { emitEvent: false });
  }

  onTelefoneNumeroInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const rawVal = input.value.replace(/\D/g, '');
    const clean = rawVal.slice(0, 9);
    const isMovel =
      this.telefonesFormArray.at(index).get('tipoTelefone')?.value ===
      PhoneTypeEnum.MOVEL;

    let value = '';
    if (isMovel) {
      value =
        clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean;
    } else {
      const maxFixo = clean.slice(0, 8);
      value =
        maxFixo.length > 4
          ? `${maxFixo.slice(0, 4)}-${maxFixo.slice(4)}`
          : maxFixo;
    }

    this.telefonesFormArray
      .at(index)
      .get('numero')
      ?.setValue(value, { emitEvent: false });
  }

  onAgenciaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 4);
    this.contaForm.get('agencia')?.setValue(clean, { emitEvent: false });
  }

  onContaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 11);
    this.contaForm.get('conta')?.setValue(clean, { emitEvent: false });
  }

  onDacInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 2);
    this.contaForm.get('dac')?.setValue(clean, { emitEvent: false });
  }

  onPaginate(event: any): void {
    const detail = event.detail || event;
    this.currentPage = detail.currentPage;
    this.pageSize = detail.pageSize;
    this.cdr.detectChanges();
  }

  checkRow(row: BankAccountEntity): void {
    this.dadosConta = this.dadosConta.map((conta) => {
      const isSelected = conta.codigoConta === row.codigoConta;
      return conta.copyWith({ contaSelecionada: isSelected });
    });
    this.cdr.detectChanges();
  }

  obterNomeTipoConta(codigo: string): string {
    if (!codigo) return '';

    const clean = codigo.trim().toUpperCase();
    const tipo = this.tiposConta.find(
      (item) => item.codigo.toUpperCase() === clean
    );
    if (tipo) return tipo.nome;

    if (clean === 'C' || clean === 'CONTA_CORRENTE') return 'Conta Corrente';
    if (clean === 'P' || clean === 'CONTA_POUPANCA') return 'Conta Poupança';
    if (clean === 'S' || clean === 'CONTA_SALARIO') return 'Conta Salário';
    if (clean === 'I' || clean === 'CONTA_INVESTIMENTO') {
      return 'Conta Investimento';
    }
    if (clean === 'D' || clean === 'CONTA_DESATIVADA') {
      return 'Conta Desativada';
    }
    if (clean === 'N' || clean === 'CONTA_NAO_CORRENTISTA') {
      return 'Conta Não Correntista';
    }
    if (clean === 'G' || clean === 'CONTA_PAGAMENTO') {
      return 'Conta de Pagamento';
    }
    if (clean === 'F' || clean === 'CONTA_FINANCEIRA') {
      return 'Conta Financeira';
    }
    if (clean === 'V' || clean === 'CONTA_VIRTUAL') return 'Conta Virtual';

    return codigo;
  }

  adicionarEndereco(): void {
    this.enderecosFormArray.push(this.criarEnderecoFormGroup());
  }

  removerEndereco(index: number): void {
    if (this.isEnderecoBloqueado(index)) {
      return;
    }

    this.enderecosFormArray.removeAt(index);
  }

  adicionarTelefone(): void {
    if (!this.canAddTelefone) {
      return;
    }

    this.telefonesFormArray.push(this.criarTelefoneFormGroup());
  }

  removerTelefone(index: number): void {
    if (this.isTelefoneBloqueado(index)) {
      return;
    }

    this.telefonesFormArray.removeAt(index);
  }

  adicionarEmail(): void {
    if (!this.canAddEmail) {
      return;
    }

    this.emailsFormArray.push(this.criarEmailFormGroup());
  }

  removerEmail(index: number): void {
    if (this.isEmailBloqueado(index)) {
      return;
    }

    this.emailsFormArray.removeAt(index);
  }

  adicionarConta(): void {
    this.editingContaIndex = null;
    this.contaForm.reset();
    this.showContaForm = true;
    this.cdr.detectChanges();
  }

  editarConta(index: number): void {
    this.editingContaIndex = index;
    const conta = this.dadosConta[index];
    this.contaForm.patchValue({
      banco: conta.codigoBanco,
      agencia: conta.codigoAgencia,
      conta: conta.codigoConta,
      dac: conta.dac,
      tipo: conta.codigoTipoConta,
    });
    this.showContaForm = true;
    this.cdr.detectChanges();
  }

  removerConta(index: number): void {
    this.dadosConta.splice(index, 1);
    this.showContaForm = false;
    this.editingContaIndex = null;
    this.cdr.detectChanges();
  }

  salvarConta(): void {
    if (this.contaForm.invalid) return;

    const formValue = this.contaForm.value;
    const conta = new BankAccountEntity({
      contaSelecionada:
        this.editingContaIndex !== null
          ? this.dadosConta[this.editingContaIndex].contaSelecionada
          : this.dadosConta.length === 0,
      codigoBanco: formValue.banco,
      codigoAgencia: formValue.agencia,
      codigoConta: formValue.conta,
      dac: formValue.dac,
      codigoTipoConta: formValue.tipo,
    });

    if (this.editingContaIndex !== null) {
      this.dadosConta[this.editingContaIndex] = conta;
    } else {
      this.dadosConta.push(conta);
    }

    this.showContaForm = false;
    this.editingContaIndex = null;
    this.contaForm.reset();
    this.cdr.detectChanges();
  }

  cancelarEdicaoConta(): void {
    this.showContaForm = false;
    this.editingContaIndex = null;
    this.contaForm.reset();
    this.cdr.detectChanges();
  }

  async carregarBancos(): Promise<void> {
    try {
      this.instituicoes_financeiras =
        await this.listarInstituicoesFinanceirasUseCase.execute();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  }

  async salvar(): Promise<void> {
    if (!this.isSalvarHabilitado) return;

    this.isLoading = true;
    try {
      const formValue = this.form.getRawValue();
      const enderecosEntity = this.getEnderecosParaEnvio().map((control) => {
        const value = control.value;
        const paisUpper = (value.pais || '').toUpperCase();
        const isBrasil = this.isPaisBrasil(paisUpper);
        const cleanCep = String(value.cep || '').replace(/\D/g, '');
        return new AddressEntity({
          propositoEndereco: value.propositoEndereco as AddressTypeEnum,
          logradouro: value.logradouro || '',
          numero: value.numero || '',
          complemento: this.nullIfBlank(value.complemento),
          bairro: value.bairro || '',
          // CEP apenas para endereço nacional; estrangeiro envia null.
          cep: isBrasil ? cleanCep : null,
          cidade: value.cidade || '',
          uf: String(value.uf || '').toUpperCase(),
          pais: paisUpper,
          regiao: isBrasil ? undefined : value.regiao || '',
          codigoAreaPostal: isBrasil ? undefined : value.codigoAreaPostal || '',
        });
      });

      const telefonesEntity = this.getTelefonesParaEnvio().map((control) => {
        const value = control.value;
        const cleanDdi = String(value.ddi || '').replace(/\D/g, '');
        const cleanDdd = String(value.ddd || '').replace(/\D/g, '');
        const cleanNumero = String(value.numero || '').replace(/\D/g, '');
        return new PhoneEntity({
          propositoTelefone: value.propositoTelefone as PhonePurposeEnum,
          tipoTelefone: value.tipoTelefone as PhoneTypeEnum,
          ddi: Number(cleanDdi || 0),
          ddd: Number(cleanDdd || 0),
          numero: Number(cleanNumero || 0),
          nomeContato: '',
        });
      });

      const emailsEntity = this.getEmailsParaEnvio().map((control) => {
        const value = control.value;
        return new EmailEntity({
          propositoEmail: value.propositoEmail as MailPurposeEnum,
          email: value.email || '',
          nomeContato: this.nullIfBlank(value.nomeContato),
        });
      });

      const dadosCadastrais = new RegistrationDataEntity({
        nomeCompleto: formValue.nomeCompleto || '',
        nomeFantasia: formValue.nomeFantasia || '',
        tipoDocumento: '',
        numeroDocumento: '',
        pais:
          formValue.pais ||
          this.brokerData?.dadosCadastrais?.pais ||
          CountryCodeEnum.BR,
        // Blocos ausentes viram null no payload em vez de array vazio.
        enderecos: enderecosEntity.length ? enderecosEntity : null,
        telefones: telefonesEntity.length ? telefonesEntity : null,
        emails: emailsEntity.length ? emailsEntity : null,
      });

      const selecionada =
        this.dadosConta.find((conta) => conta.contaSelecionada) ||
        this.dadosConta[0];
      const dadosConta = new BankAccountEntity({
        contaSelecionada: selecionada?.contaSelecionada ?? true,
        codigoBanco: selecionada?.codigoBanco || '',
        codigoAgencia: selecionada?.codigoAgencia || '',
        codigoTipoConta:
          selecionada?.codigoTipoConta || BankAccountTypeEnum.CONTA_CORRENTE,
        codigoConta: selecionada?.codigoConta || '',
        dac: selecionada?.dac || '',
      });

      const cleanNumeroDocumento = String(
        formValue.numeroDocumento || ''
      ).replace(/[^A-Za-z0-9]/g, '');

      const payloadData = {
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: formValue.tipoDocumento || DocumentTypeEnum.CNPJ,
        numeroDocumento: cleanNumeroDocumento,
        pais:
          formValue.pais ||
          this.brokerData?.dadosCadastrais?.pais ||
          CountryCodeEnum.BR,
        codigoSusep: Number(formValue.codigoSusep || 0),
        dadosConta,
        dadosCadastrais,
      };

      if (this.mode === 'edit') {
        await this.atualizarBrokerUseCase.execute(
          new AtualizarBrokerRequestEntity(payloadData)
        );
      } else {
        await this.cadastrarBrokerUseCase.execute(
          new CriarBrokerRequestEntity(payloadData)
        );
      }
      this.goBack();
    } catch (error) {
      console.error('Erro ao salvar broker:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private inicializarFormulario(): void {
    this.searchForm = this.fb.group(
      {
        tipoDocumento: [DocumentTypeEnum.CNPJ, Validators.required],
        numeroDocumento: ['', Validators.required],
        pais: [CountryCodeEnum.BR, Validators.required],
      },
      {
        validators: CNPJ.formGroupValidator(
          'tipoDocumento',
          'numeroDocumento',
          DocumentTypeEnum.CNPJ
        ),
      }
    );

    this.form = this.fb.group(
      {
        nomeCompleto: ['', [Validators.required]],
        nomeFantasia: [''],
        numeroDocumento: ['', [Validators.required]],
        codigoSusep: ['', [Validators.required, Validators.minLength(5)]],
        tipoDocumento: ['', Validators.required],
        enderecos: this.fb.array([]),
        telefones: this.fb.array([]),
        emails: this.fb.array([]),
        pais: [CountryCodeEnum.BR, Validators.required],
      },
      {
        validators: CNPJ.formGroupValidator(
          'tipoDocumento',
          'numeroDocumento',
          DocumentTypeEnum.CNPJ
        ),
      }
    );

    this.contaForm = this.fb.group({
      banco: ['', Validators.required],
      agencia: ['', [Validators.required, Validators.maxLength(4)]],
      conta: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(11),
        ],
      ],
      dac: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
      tipo: ['', Validators.required],
    });
  }

  private criarEnderecoFormGroup(endereco?: AddressEntity): FormGroup {
    let cepValue = '';
    if (endereco?.cep) {
      const raw = String(endereco.cep).replace(/\D/g, '').slice(0, 8);
      cepValue = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
    }

    const group = this.fb.group({
      propositoEndereco: [
        endereco?.propositoEndereco || '',
        [Validators.required],
      ],
      pais: [endereco?.pais || '', [Validators.required]],
      uf: [
        (endereco?.uf || '').toUpperCase(),
        [Validators.required, Validators.maxLength(2)],
      ],
      cidade: [endereco?.cidade || '', [Validators.required]],
      cep: [cepValue],
      logradouro: [endereco?.logradouro || '', [Validators.required]],
      numero: [endereco?.numero || '', [Validators.required]],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || '', [Validators.required]],
      regiao: [endereco?.regiao || ''],
      codigoAreaPostal: [endereco?.codigoAreaPostal || ''],
    });

    group.get('pais')?.valueChanges.subscribe((pais) => {
      this.onPaisEnderecoChange(group, pais);
    });
    this.onPaisEnderecoChange(group, group.get('pais')?.value);

    return group;
  }

  isPaisBrasil(pais: string | null | undefined): boolean {
    return (pais || '').trim().toUpperCase() === CountryCodeEnum.BR;
  }

  private onPaisEnderecoChange(
    group: FormGroup,
    pais: string | null | undefined
  ): void {
    // Ignora eventos programáticos de enable/disable do form (não são input do usuário).
    if (group.get('pais')?.disabled) {
      return;
    }

    const cepControl = group.get('cep');
    const ufControl = group.get('uf');
    if (this.isPaisBrasil(pais)) {
      // Endereço nacional: regiao e codigo_area_postal não se aplicam;
      // UF e CEP passam a ser obrigatórios e exibidos.
      group.get('regiao')?.setValue('', { emitEvent: false, onlySelf: true });
      group
        .get('codigoAreaPostal')
        ?.setValue('', { emitEvent: false, onlySelf: true });
      cepControl?.setValidators([Validators.required]);
      ufControl?.setValidators([Validators.required, Validators.maxLength(2)]);
    } else {
      // Endereço estrangeiro: UF e CEP não se aplicam — limpos e sem validação.
      cepControl?.setValue('', { emitEvent: false, onlySelf: true });
      cepControl?.clearValidators();
      ufControl?.setValue('', { emitEvent: false, onlySelf: true });
      ufControl?.clearValidators();
    }
    cepControl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    ufControl?.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  private criarTelefoneFormGroup(telefone?: PhoneEntity): FormGroup {
    const ddiValue = telefone?.ddi ? `+${telefone.ddi}` : '';
    const dddValue = telefone?.ddd ? String(telefone.ddd) : '';

    let numeroValue = '';
    if (telefone?.numero) {
      const numero = String(telefone.numero);
      const isMovel = telefone.tipoTelefone === PhoneTypeEnum.MOVEL;
      if (isMovel) {
        numeroValue =
          numero.length > 5
            ? `${numero.slice(0, 5)}-${numero.slice(5)}`
            : numero;
      } else {
        numeroValue =
          numero.length > 4
            ? `${numero.slice(0, 4)}-${numero.slice(4)}`
            : numero;
      }
    }

    return this.fb.group({
      propositoTelefone: [
        telefone?.propositoTelefone || '',
        [Validators.required],
      ],
      tipoTelefone: [telefone?.tipoTelefone || '', [Validators.required]],
      ddi: [ddiValue, [Validators.required]],
      ddd: [dddValue, [Validators.required]],
      numero: [
        numeroValue,
        [Validators.required, Validators.pattern(/^\d{4,5}-\d{4}$/)],
      ],
    });
  }

  private criarEmailFormGroup(email?: EmailEntity): FormGroup {
    return this.fb.group({
      propositoEmail: [email?.propositoEmail || '', [Validators.required]],
      email: [email?.email || '', [Validators.required, Validators.email]],
      nomeContato: [email?.nomeContato || '', []],
    });
  }

  private formatarDocumentoInicial(rawDoc: string, tipoDoc: string): string {
    const rawVal = rawDoc.replace(/[^A-Za-z0-9]/g, '');
    if (tipoDoc === DocumentTypeEnum.CNPJ) {
      const p1 = rawVal.slice(0, 2);
      const p2 = rawVal.slice(2, 5);
      const p3 = rawVal.slice(5, 8);
      const p4 = rawVal.slice(8, 12);
      const p5 = rawVal.slice(12, 14);

      let result = p1;
      if (p2) result += '.' + p2;
      if (p3) result += '.' + p3;
      if (p4) result += '/' + p4;
      if (p5) result += '-' + p5;
      return result;
    }

    return rawVal;
  }

  private nullIfBlank(value: unknown): string | null {
    const normalized = String(value ?? '').trim();
    return normalized ? normalized : null;
  }

  private captureInitialEditState(): void {
    this.initialEditState = this.serializeCurrentEditState();
  }

  private serializeCurrentEditState(): string {
    return JSON.stringify({
      form: this.form.getRawValue(),
      dadosConta: this.dadosConta.map((conta) => ({
        contaSelecionada: !!conta.contaSelecionada,
        codigoBanco: conta.codigoBanco || '',
        codigoAgencia: conta.codigoAgencia || '',
        codigoConta: conta.codigoConta || '',
        dac: conta.dac || '',
        codigoTipoConta: conta.codigoTipoConta || '',
      })),
    });
  }

  private getEnderecosParaEnvio(): FormGroup[] {
    return this.enderecosFormArray.controls.filter(
      (_, index) => !this.isEnderecoBloqueado(index)
    ) as FormGroup[];
  }

  private getTelefonesParaEnvio(): FormGroup[] {
    return this.telefonesFormArray.controls.filter(
      (_, index) => !this.isTelefoneBloqueado(index)
    ) as FormGroup[];
  }

  private getEmailsParaEnvio(): FormGroup[] {
    return this.emailsFormArray.controls.filter(
      (_, index) => !this.isEmailBloqueado(index)
    ) as FormGroup[];
  }

  private resetLoadedRegistrationCounts(): void {
    this.loadedEnderecosCount = 0;
    this.loadedTelefonesCount = 0;
    this.loadedEmailsCount = 0;
  }

  private bloquearControleDoFormulario(controlName: string): void {
    const control = this.form.get(controlName);

    if (!(control instanceof FormControl)) {
      return;
    }

    this.form.setControl(
      controlName,
      new FormControl(
        { value: control.value ?? '', disabled: true },
        {
          validators: control.validator,
          asyncValidators: control.asyncValidator,
          updateOn: control.updateOn,
        }
      )
    );
  }

  private bloquearDadosCadastraisCarregados(): void {
    this.bloquearControleDoFormulario('tipoDocumento');
    this.bloquearControleDoFormulario('numeroDocumento');
    this.bloquearControleDoFormulario('pais');

    this.enderecosFormArray.controls.forEach((control, index) => {
      if (index < this.loadedEnderecosCount) {
        control.disable({ emitEvent: false });
      }
    });

    this.telefonesFormArray.controls.forEach((control, index) => {
      if (index < this.loadedTelefonesCount) {
        control.disable({ emitEvent: false });
      }
    });

    this.emailsFormArray.controls.forEach((control, index) => {
      if (index < this.loadedEmailsCount) {
        control.disable({ emitEvent: false });
      }
    });
  }

  private async configurarTelaPorModo() {
    if (this.mode === 'create') {
      this.loadState = 'content';
      this.initialEditState = null;
      this.resetLoadedRegistrationCounts();
      this.form.reset();
      this.form.enable();
      return;
    }

    if (this.brokerId) {
      await this.loadBrokerData();
    }

    if (this.loadState !== 'content') {
      return;
    }

    if (this.mode === 'visualize') {
      this.form.disable();
    } else if (this.mode === 'edit') {
      this.form.enable();
      this.bloquearDadosCadastraisCarregados();
      this.captureInitialEditState();
    }
  }
}
