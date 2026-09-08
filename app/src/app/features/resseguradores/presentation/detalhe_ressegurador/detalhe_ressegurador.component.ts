import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IdsIconModule,
  IdsMainButtonModule,
  IdsInputModule,
  IdsFormFieldModule,
  IdsSelectModule,
  IdsTableModule,
  IdsCheckboxModule,
  IdsPaginationModule,
  IdsLoadingModule,
  IdsInputSearchModule,
} from '@ids/angular';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { RetryStateComponent } from 'src/app/shared/components/retry_state/retry_state.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { IdsOption } from '@ids/angular';
import { ResseguradorProfileTypeEnum } from '../../domain/enums/ressegurador_profile_type.enum';
import { DocumentTypeEnum } from '../../../../shared/domain/enum/document_type.enum';
import { AddressTypeEnum } from 'src/app/shared/domain/enum/address_type.enum';
import { PhonePurposeEnum } from 'src/app/shared/domain/enum/phone_purpose.enum';
import { PhoneTypeEnum } from 'src/app/shared/domain/enum/phone_type.enum';
import { MailPurposeEnum } from 'src/app/shared/domain/enum/mail_purpose.enum';
import { BuscarResseguradorUseCase } from '../../domain/usecases/buscar_ressegurador.usecase';
import { CadastrarResseguradorUseCase } from '../../domain/usecases/cadastrar_ressegurador.usecase';
import { AtualizarResseguradorUseCase } from '../../domain/usecases/atualizar_ressegurador.usecase';
import { BuscarDadosCadastraisUseCase } from '../../domain/usecases/buscar_dados_cadastrias.usecase';
import { BuscarResseguradorResponseEntity } from '../../domain/entities/response/buscar_ressegurador_response.entity';
import { ListagemInstituicoesFinanceirasEntity } from 'src/app/features/companhia_ressegurada/domain/entities/instituicoes-financeiras.entity';
import {
  CriarResseguradorRequestEntity,
  ReinsuranceEntity,
} from '../../domain/entities/request/criar_ressegurador_request.entity';
import { AtualizarResseguradorRequestEntity } from '../../domain/entities/request/atualizar_ressegurador_request.entity';
import { BankAccountEntity } from 'src/app/shared/domain/entities/bank_account.entity';
import { RegistrationDataEntity } from 'src/app/shared/domain/entities/registration_data.entity';
import { AddressEntity } from 'src/app/shared/domain/entities/address.entity';
import { PhoneEntity } from 'src/app/shared/domain/entities/phone.entity';
import { EmailEntity } from 'src/app/shared/domain/entities/email.entity';
import { PersonTypeEnum } from 'src/app/shared/domain/enum/person_type.enum';
import { BankAccountTypeEnum } from 'src/app/shared/domain/enum/bank_account_type.enum';
import {
  CountryCodeEnum,
  COUNTRY_CODE_LABELS,
} from 'src/app/shared/domain/enum/country_code.enum';
import { CNPJ } from 'src/app/shared/presentation/validators/cnpj.validator';
import { BuscarInstituicoesFinanceirasUseCase } from 'src/app/features/resseguradores/domain/usecases/buscar_instituicoes_financeiras.usecase';

export type ScreenMode = 'criar' | 'editar' | 'visualizar';
type DetailLoadState = 'content' | 'not-found' | 'error';

@Component({
  selector: 'detalhe-ressegurador',
  templateUrl: './detalhe_ressegurador.component.html',
  styleUrls: ['./detalhe_ressegurador.component.scss'],
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
    IdsInputSearchModule,
  ],
})
export class DetalheResseguradorComponent implements OnInit {
  public mode: ScreenMode = 'visualizar';
  public resseguradorId?: string;
  public form!: FormGroup;

  perfilResseguradorOptions: IdsOption[] = [
    { optLabel: 'Local', optValue: ResseguradorProfileTypeEnum.LOCAL },
    { optLabel: 'Eventual', optValue: ResseguradorProfileTypeEnum.EVENTUAL },
    { optLabel: 'Admitida', optValue: ResseguradorProfileTypeEnum.ADMITIDA },
  ];

  tipoDocumentoOptions: IdsOption[] = [
    { optLabel: 'CNPJ', optValue: DocumentTypeEnum.CNPJ },
    { optLabel: 'NIF', optValue: DocumentTypeEnum.NIF },
    { optLabel: 'CGI', optValue: DocumentTypeEnum.CGI },
  ];

  countryOptions: IdsOption[] = Object.values(CountryCodeEnum).map(
    (countryCode) => ({
      optLabel: `${countryCode} - ${COUNTRY_CODE_LABELS[countryCode]}`,
      optValue: countryCode,
    })
  );

  addressTypeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: AddressTypeEnum.PRINCIPAL },
    { optLabel: 'Comercial', optValue: AddressTypeEnum.COMERCIAL },
    { optLabel: 'Outros', optValue: AddressTypeEnum.OUTROS },
  ];

  phonePurposeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: PhonePurposeEnum.PRINCIPAL },
    { optLabel: 'Comercial', optValue: PhonePurposeEnum.COMERCIAL },
    { optLabel: 'Outros', optValue: PhonePurposeEnum.OUTROS },
  ];

  phoneTypeOptions: IdsOption[] = [
    { optLabel: 'Móvel', optValue: PhoneTypeEnum.MOVEL },
    { optLabel: 'Fixo', optValue: PhoneTypeEnum.FIXO },
  ];

  mailPurposeOptions: IdsOption[] = [
    { optLabel: 'Principal', optValue: MailPurposeEnum.PRINCIPAL },
    { optLabel: 'Outros', optValue: MailPurposeEnum.OUTROS },
  ];

  readonly tiposConta = [
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

  optional = new FormControl('');
  isLoading = false;
  isBuscaRealizada = false;
  resseguradorData: BuscarResseguradorResponseEntity | null = null;
  instituicoes_financeiras: ListagemInstituicoesFinanceirasEntity | null = null;

  public searchForm!: FormGroup;
  public contaForm!: FormGroup;
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

  constructor(
    private readonly navigation: NavigationService,
    private readonly fb: FormBuilder,
    private readonly buscarResseguradorUseCase: BuscarResseguradorUseCase,
    private readonly cadastrarResseguradorUseCase: CadastrarResseguradorUseCase,
    private readonly atualizarResseguradorUseCase: AtualizarResseguradorUseCase,
    private readonly buscarDadosCadastraisUseCase: BuscarDadosCadastraisUseCase,
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
      this.mode = params.mode || 'visualizar';
      this.resseguradorId = params.id;
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

  get isInformacoesBasicasCompletas(): boolean {
    const rawValue = this.form.getRawValue();
    return (
      !!rawValue.nomeCompleto?.trim() &&
      !!String(rawValue.codigoSusep || '').trim() &&
      !!rawValue.perfilRessegurador &&
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
    return this.mode === 'criar' || this.mode === 'editar';
  }

  get canAddTelefone(): boolean {
    return this.mode === 'criar' || this.mode === 'editar';
  }

  get canAddEmail(): boolean {
    return this.mode === 'criar' || this.mode === 'editar';
  }

  isEnderecoBloqueado(index: number): boolean {
    return this.mode === 'editar' && index < this.loadedEnderecosCount;
  }

  isTelefoneBloqueado(index: number): boolean {
    return this.mode === 'editar' && index < this.loadedTelefonesCount;
  }

  isEmailBloqueado(index: number): boolean {
    return this.mode === 'editar' && index < this.loadedEmailsCount;
  }

  get showRetryState(): boolean {
    return this.loadState === 'error';
  }

  get shouldShowLoadState(): boolean {
    return this.loadState !== 'content';
  }

  get errorStateTitle(): string {
    if (this.loadState === 'not-found') {
      return 'Ressegurador não encontrado';
    }

    return 'Não foi possível carregar os dados do ressegurador';
  }

  get errorStateDescription(): string {
    if (this.loadState === 'not-found') {
      return 'Não encontramos um ressegurador com o identificador informado. Volte para a listagem para continuar.';
    }

    return 'Tente novamente para recarregar os dados do ressegurador ou volte para a listagem.';
  }

  private get hasEditChanges(): boolean {
    return (
      this.initialEditState !== null &&
      this.initialEditState !== this.serializeCurrentEditState()
    );
  }

  private async loadResseguradorData() {
    this.isLoading = true;
    this.loadState = 'content';
    this.resseguradorData = null;
    try {
      if (this.resseguradorId) {
        this.resseguradorData = await this.buscarResseguradorUseCase.execute(
          this.resseguradorId
        );

        if (!this.resseguradorData && this.mode !== 'criar') {
          this.loadState = 'not-found';
          return;
        }

        if (this.resseguradorData) {
          this.resetLoadedRegistrationCounts();
          const rawDoc =
            this.resseguradorData.dadosCadastrais?.numeroDocumento || '';
          const tipoDoc =
            this.resseguradorData.dadosCadastrais?.tipoDocumento || '';
          const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

          this.form.patchValue({
            nomeCompleto:
              this.resseguradorData.dadosCadastrais?.nomeCompleto || '',
            nomeFantasia:
              this.resseguradorData.dadosCadastrais?.nomeFantasia || '',
            numeroDocumento: maskedDoc,
            codigoSusep: this.resseguradorData.codigoSusep || '',
            perfilRessegurador: this.resseguradorData.tipoPerfil || '',
            tipoDocumento: tipoDoc,
            pais:
              this.resseguradorData.dadosCadastrais?.pais || CountryCodeEnum.BR,
          });

          // Preencher Endereços se houver dados
          this.enderecosFormArray.clear();
          const enderecos =
            this.resseguradorData.dadosCadastrais?.enderecos || [];
          enderecos.forEach((end) => {
            this.enderecosFormArray.push(this.criarEnderecoFormGroup(end));
          });
          this.loadedEnderecosCount = enderecos.length;

          // Preencher Telefones se houver dados
          this.telefonesFormArray.clear();
          const telefones =
            this.resseguradorData.dadosCadastrais?.telefones || [];
          telefones.forEach((tel) => {
            this.telefonesFormArray.push(this.criarTelefoneFormGroup(tel));
          });
          this.loadedTelefonesCount = telefones.length;

          // Preencher E-mails se houver dados
          this.emailsFormArray.clear();
          const emails = this.resseguradorData.dadosCadastrais?.emails || [];
          emails.forEach((mail) => {
            this.emailsFormArray.push(this.criarEmailFormGroup(mail));
          });
          this.loadedEmailsCount = emails.length;

          // Preencher Contas se houver dados
          this.dadosConta = [];
          if (
            this.resseguradorData.dadosConta &&
            Array.isArray(this.resseguradorData.dadosConta)
          ) {
            this.resseguradorData.dadosConta.forEach((conta, index) => {
              this.dadosConta.push(
                conta.copyWith({
                  contaSelecionada:
                    index === 0 ? true : conta.contaSelecionada ?? false,
                })
              );
            });
          }

          if (this.mode === 'editar') {
            this.captureInitialEditState();
          }

          this.cdr.detectChanges();
        }
      }
    } catch (error) {
      if (this.mode !== 'criar') {
        this.loadState = 'error';
      }
      console.error('Erro ao carregar dados do ressegurador:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async retryLoadResseguradorData(): Promise<void> {
    await this.loadResseguradorData();

    if (this.loadState === 'content' && this.mode === 'editar') {
      this.form.enable();
      this.bloquearDadosCadastraisCarregados();
      this.captureInitialEditState();
      this.cdr.detectChanges();
    }
  }

  private criarEnderecoFormGroup(endereco?: AddressEntity): FormGroup {
    let cepValue = '';
    if (endereco?.cep) {
      const raw = String(endereco.cep).replace(/\D/g, '').slice(0, 8);
      if (raw.length > 5) {
        cepValue = `${raw.slice(0, 5)}-${raw.slice(5)}`;
      } else {
        cepValue = raw;
      }
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
    let ddiValue = '';
    if (telefone?.ddi) {
      ddiValue = `+${telefone.ddi}`;
    }

    let dddValue = '';
    if (telefone?.ddd) {
      dddValue = String(telefone.ddd);
    }

    let numeroValue = '';
    if (telefone?.numero) {
      const numStr = String(telefone.numero);
      const isMovel = telefone.tipoTelefone === PhoneTypeEnum.MOVEL;
      if (isMovel) {
        if (numStr.length > 5) {
          numeroValue = `${numStr.slice(0, 5)}-${numStr.slice(5)}`;
        } else {
          numeroValue = numStr;
        }
      } else {
        if (numStr.length > 4) {
          numeroValue = `${numStr.slice(0, 4)}-${numStr.slice(4)}`;
        } else {
          numeroValue = numStr;
        }
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

  private formatarDocumentoInicial(rawDoc: string, tipoDoc: string): string {
    const rawVal = rawDoc.replace(/[^A-Za-z0-9]/g, '');
    if (tipoDoc === DocumentTypeEnum.CNPJ) {
      const p1 = rawVal.slice(0, 2);
      const p2 = rawVal.slice(2, 5);
      const p3 = rawVal.slice(5, 8);
      const p4 = rawVal.slice(8, 12);
      const p5 = rawVal.slice(12, 14);
      let res = p1;
      if (p2) res += '.' + p2;
      if (p3) res += '.' + p3;
      if (p4) res += '/' + p4;
      if (p5) res += '-' + p5;
      return res;
    }
    return rawVal; // NIF e CGI originais sem máscara específica, apenas limpos/limitados
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
      // Limitar a 14 caracteres (no CNPJ original) antes de formatar
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
    } else {
      // NIF e CGI - manter apenas alfanuméricos simples
      this.form.get('numeroDocumento')?.setValue(raw, { emitEvent: false });
    }
  }

  onSearchDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const tipo = this.searchForm.get('tipoDocumento')?.value;
    let raw = input.value.replace(/[^A-Za-z0-9]/g, '');

    if (tipo === DocumentTypeEnum.CNPJ) {
      // Limitar a 14 caracteres (no CNPJ original) antes de formatar
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
    } else {
      this.searchForm
        .get('numeroDocumento')
        ?.setValue(raw, { emitEvent: false });
    }
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
    let cepValue = '';
    if (rawVal.length > 5) {
      cepValue = `${rawVal.slice(0, 5)}-${rawVal.slice(5)}`;
    } else {
      cepValue = rawVal;
    }
    this.enderecosFormArray
      .at(index)
      .get('cep')
      ?.setValue(cepValue, { emitEvent: false });
  }

  onDdiInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let rawVal = input.value.replace(/\D/g, '').slice(0, 4);
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
    const maxDigits = 9; // Máximo para móvel no Brasil (9 dígitos: 9XXXX-XXXX)
    const clean = rawVal.slice(0, maxDigits);

    const isMovel =
      this.telefonesFormArray.at(index).get('tipoTelefone')?.value ===
      PhoneTypeEnum.MOVEL;
    let value = '';
    if (isMovel) {
      // Máscara XXXXX-XXXX
      if (clean.length > 5) {
        value = `${clean.slice(0, 5)}-${clean.slice(5)}`;
      } else {
        value = clean;
      }
    } else {
      // Fixo: Máscara XXXX-XXXX (máximo 8 dígitos, mas se passar de 8, aceitamos até 9)
      const maxFixo = clean.slice(0, 8);
      if (maxFixo.length > 4) {
        value = `${maxFixo.slice(0, 4)}-${maxFixo.slice(4)}`;
      } else {
        value = maxFixo;
      }
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

  private inicializarFormulario() {
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
        pais: [CountryCodeEnum.BR, Validators.required],
        perfilRessegurador: ['', Validators.required],
        tipoDocumento: ['', Validators.required],
        enderecos: this.fb.array([]),
        telefones: this.fb.array([]),
        emails: this.fb.array([]),
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

  get displayedColumnsContas(): string[] {
    if (this.mode === 'visualizar') {
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
    return this.dadosConta.find((c) => c.contaSelecionada);
  }

  onPaginate(event: any): void {
    const detail = event.detail || event;
    this.currentPage = detail.currentPage;
    this.pageSize = detail.pageSize;
    this.cdr.detectChanges();
  }

  checkRow(row: BankAccountEntity): void {
    this.dadosConta = this.dadosConta.map((c) => {
      const isSelected = c.codigoConta === row.codigoConta;
      return c.copyWith({ contaSelecionada: isSelected });
    });
    this.cdr.detectChanges();
  }

  obterNomeTipoConta(codigo: string): string {
    if (!codigo) return '';
    const clean = codigo.trim().toUpperCase();

    // Primeiro tenta buscar no tiposConta direto
    const tipo = this.tiposConta.find((t) => t.codigo.toUpperCase() === clean);
    if (tipo) return tipo.nome;

    // Mapeia códigos de BankAccountTypeEnum ou variantes comuns
    if (clean === 'C' || clean === 'CONTA_CORRENTE') return 'Conta Corrente';
    if (clean === 'P' || clean === 'CONTA_POUPANCA') return 'Conta Poupança';
    if (clean === 'S' || clean === 'CONTA_SALARIO') return 'Conta Salário';
    if (clean === 'I' || clean === 'CONTA_INVESTIMENTO')
      return 'Conta Investimento';
    if (clean === 'D' || clean === 'CONTA_DESATIVADA')
      return 'Conta Desativada';
    if (clean === 'N' || clean === 'CONTA_NAO_CORRENTISTA')
      return 'Conta Não Correntista';
    if (clean === 'G' || clean === 'CONTA_PAGAMENTO')
      return 'Conta de Pagamento';
    if (clean === 'F' || clean === 'CONTA_FINANCEIRA')
      return 'Conta Financeira';
    if (clean === 'V' || clean === 'CONTA_VIRTUAL') return 'Conta Virtual';

    return codigo;
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
          : this.dadosConta.length === 0, // seleciona automaticamente se for a primeira
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
    } catch (e) {
      console.error('Erro ao carregar bancos:', e);
    }
  }

  async buscarDadosCadastrais(): Promise<void> {
    if (this.searchForm.invalid) return;

    this.isLoading = true;
    this.isBuscaRealizada = false;
    this.cdr.detectChanges();

    try {
      const formVal = this.searchForm.value;
      const response = await this.buscarDadosCadastraisUseCase.execute({
        documentNumber: formVal.numeroDocumento,
        documentType: formVal.tipoDocumento || DocumentTypeEnum.CNPJ,
        countryCode: formVal.pais || CountryCodeEnum.BR,
      });

      this.isBuscaRealizada = true;

      if (response) {
        const rawDoc = response.dadosCadastrais?.numeroDocumento || '';
        const tipoDoc = response.dadosCadastrais?.tipoDocumento || '';
        const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

        this.form.patchValue({
          nomeCompleto: response.dadosCadastrais?.nomeCompleto || '',
          nomeFantasia: response.dadosCadastrais?.nomeFantasia || '',
          numeroDocumento: maskedDoc,
          tipoDocumento: tipoDoc || formVal.tipoDocumento,
          pais: response.dadosCadastrais?.pais || formVal.pais,
        });

        // Preencher Endereços
        this.enderecosFormArray.clear();
        const enderecos = response.dadosCadastrais?.enderecos || [];
        enderecos.forEach((end) => {
          this.enderecosFormArray.push(this.criarEnderecoFormGroup(end));
        });

        // Preencher Telefones
        this.telefonesFormArray.clear();
        const telefones = response.dadosCadastrais?.telefones || [];
        telefones.forEach((tel) => {
          this.telefonesFormArray.push(this.criarTelefoneFormGroup(tel));
        });

        // Preencher E-mails
        this.emailsFormArray.clear();
        const emails = response.dadosCadastrais?.emails || [];
        emails.forEach((mail) => {
          this.emailsFormArray.push(this.criarEmailFormGroup(mail));
        });

        // Preencher Contas
        this.dadosConta = [];
        if (response.dadosConta && Array.isArray(response.dadosConta)) {
          response.dadosConta.forEach((conta, index) => {
            this.dadosConta.push(
              conta.copyWith({
                contaSelecionada:
                  index === 0 ? true : conta.contaSelecionada ?? false,
              })
            );
          });
        }
      } else {
        // Se não encontrar dados na busca externa, mostramos os campos em branco
        // Porém já pré-preenchemos Tipo do Documento e Número do Documento buscado
        const rawDoc = formVal.numeroDocumento || '';
        const tipoDoc = formVal.tipoDocumento || DocumentTypeEnum.CNPJ;
        const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

        this.form.patchValue({
          nomeCompleto: '',
          nomeFantasia: '',
          numeroDocumento: maskedDoc,
          tipoDocumento: tipoDoc,
          perfilRessegurador: '',
          codigoSusep: '',
          pais: formVal.pais || CountryCodeEnum.BR,
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
    } catch (e) {
      console.error('Erro ao buscar dados cadastrais:', e);
      // No caso de erro, permitimos também o preenchimento manual completo do formulário
      this.isBuscaRealizada = true;
      const formVal = this.searchForm.value;
      const rawDoc = formVal.numeroDocumento || '';
      const tipoDoc = formVal.tipoDocumento || DocumentTypeEnum.CNPJ;
      const maskedDoc = this.formatarDocumentoInicial(rawDoc, tipoDoc);

      this.form.patchValue({
        nomeCompleto: '',
        nomeFantasia: '',
        numeroDocumento: maskedDoc,
        tipoDocumento: tipoDoc,
        perfilRessegurador: '',
        codigoSusep: '',
        pais: formVal.pais || CountryCodeEnum.BR,
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

  private async configurarTelaPorModo() {
    if (this.mode === 'criar') {
      this.loadState = 'content';
      this.initialEditState = null;
      this.resetLoadedRegistrationCounts();
      this.form.reset({
        pais: CountryCodeEnum.BR,
        perfilRessegurador: '',
        tipoDocumento: '',
      });
      this.form.enable();
      return;
    }

    // Se for visualizar ou editar, busca os dados da API primeiro
    if (this.resseguradorId) {
      await this.loadResseguradorData();
    }

    if (this.loadState !== 'content') {
      return;
    }

    if (this.mode === 'visualizar') {
      this.form.disable(); // Desabilita todos os campos do FormGroup automaticamente
    } else if (this.mode === 'editar') {
      this.form.enable();
      this.bloquearDadosCadastraisCarregados();
      this.captureInitialEditState();
    }
  }

  // Getter dinâmico para o Título da Tela
  get title(): string {
    const titulos = {
      criar: 'Novo Ressegurador',
      editar: 'Editar Ressegurador',
      visualizar: 'Visualizar Ressegurador',
    };
    return titulos[this.mode];
  }

  get isSalvarHabilitado(): boolean {
    if (this.mode === 'criar' && !this.isBuscaRealizada) {
      return false;
    }

    if (this.mode === 'editar' && !this.hasEditChanges) {
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

  async salvar() {
    if (!this.isSalvarHabilitado) return;

    this.isLoading = true;
    try {
      const formValue = this.form.getRawValue();

      // Mapeando Endereços
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

      // Mapeando Telefones
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

      // Mapeando Emails
      const emailsEntity = this.getEmailsParaEnvio().map((control) => {
        const value = control.value;
        return new EmailEntity({
          propositoEmail: value.propositoEmail as MailPurposeEnum,
          email: value.email || '',
          nomeContato: this.nullIfBlank(value.nomeContato),
        });
      });

      // Dados Cadastrais (Omit tipoDocumento, numeroDocumento)
      const dadosCadastrais = new RegistrationDataEntity({
        nomeCompleto: formValue.nomeCompleto || '',
        nomeFantasia: formValue.nomeFantasia || '',
        tipoDocumento: '',
        numeroDocumento: '',
        pais:
          formValue.pais ||
          this.resseguradorData?.dadosCadastrais?.pais ||
          CountryCodeEnum.BR,
        // Blocos ausentes viram null no payload em vez de array vazio.
        enderecos: enderecosEntity.length ? enderecosEntity : null,
        telefones: telefonesEntity.length ? telefonesEntity : null,
        emails: emailsEntity.length ? emailsEntity : null,
      });

      const selecionada =
        this.dadosConta.find((c) => c.contaSelecionada) || this.dadosConta[0];
      const dadosConta = new BankAccountEntity({
        contaSelecionada: selecionada?.contaSelecionada ?? true,
        codigoBanco: selecionada?.codigoBanco || '',
        codigoAgencia: selecionada?.codigoAgencia || '',
        codigoTipoConta:
          selecionada?.codigoTipoConta || BankAccountTypeEnum.CONTA_CORRENTE,
        codigoConta: selecionada?.codigoConta || '',
        dac: selecionada?.dac || '',
      });

      // Payload final
      const cleanNumeroDocumento = String(
        formValue.numeroDocumento || ''
      ).replace(/[^A-Za-z0-9]/g, '');

      const payloadData = {
        codigoTipoPersona: PersonTypeEnum.J,
        tipoDocumento: formValue.tipoDocumento || DocumentTypeEnum.CNPJ,
        numeroDocumento: cleanNumeroDocumento,
        pais:
          formValue.pais ||
          this.resseguradorData?.dadosCadastrais?.pais ||
          CountryCodeEnum.BR,
        codigoSusep: Number(formValue.codigoSusep || 0),
        ressegurador: new ReinsuranceEntity({
          tipoPerfil: (formValue.perfilRessegurador ||
            ResseguradorProfileTypeEnum.LOCAL) as any,
        }),
        dadosConta,
        dadosCadastrais,
      };

      if (this.mode === 'criar') {
        await this.cadastrarResseguradorUseCase.execute(
          new CriarResseguradorRequestEntity(payloadData)
        );
      } else {
        await this.atualizarResseguradorUseCase.execute(
          new AtualizarResseguradorRequestEntity(payloadData)
        );
      }

      this.goBack();
    } catch (error) {
      console.error('Erro ao salvar ressegurador:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  alterarParaModoEdicao() {
    this.mode = 'editar';
    this.form.enable();
    this.bloquearDadosCadastraisCarregados();
    this.captureInitialEditState();
  }

  goBack() {
    this.navigation.navigate(NavigationRoute.ResseguradoresHome);
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
}
