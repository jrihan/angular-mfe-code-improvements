import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  IdsCheckboxModule,
  IdsFormFieldModule,
  IdsIconModule,
  IdsInputSearchModule,
  IdsLoadingModule,
  IdsMainButtonModule,
  IdsSelectModule,
  IdsTableModule,
  IdsPaginationModule,
} from '@ids/angular';
import { ListagemInstituicoesFinanceirasEntity } from '../../domain/entities/instituicoes-financeiras.entity';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { SnackbarComponent } from 'src/app/shared/components/snackbar/snackbar.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { NavigationService } from 'src/app/shared/navigation.service';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { BuscarDadosCadastraisResponseEntity } from '../../domain/entities/buscar-dados-cadastrais.entity';
import { ListagemInstituicoesFinanceirasUseCase } from '../../domain/usecases/listagem-instituicoes-financeiras.usecase';
import { BuscarCompanhiaPorCnpjUseCase } from '../../domain/usecases/buscar-dados-cadastrais.usecase';
import { EnviarCadastroCompanhiaUseCase } from '../../domain/usecases/enviar-cadastro-companhia.usecase';
import { COMPANHIA_RESSEGURADA_USECASES } from 'src/app/core/tokens/companhia_ressegurada.tokens';

export interface ContaBancaria {
  selected?: boolean;
  codigo_banco: string;
  codigo_agencia: string;
  tipo_conta: string;
  codigo_conta: string;
  dac: string;
}

export interface CustomSelectOption {
  optLabel: string;
  optValue: string;
}

@Component({
  selector: 'cadastro-companhia-ressegurada',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cadastro-companhia-ressegurada.component.html',
  styleUrls: ['./cadastro-companhia-ressegurada.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerBaseComponent,
    SnackbarComponent,
    IdsIconModule,
    IdsInputSearchModule,
    IdsMainButtonModule,
    IdsFormFieldModule,
    IdsCheckboxModule,
    IdsTableModule,
    IdsLoadingModule,
    IdsSelectModule,
    IdsPaginationModule,
  ],
})
export class CadastroCompanhiaResseguradaComponent {
  readonly displayedColumns = [
    'selected',
    'codigo_banco',
    'codigo_agencia',
    'tipo_conta',
    'codigo_conta',
    'dac',
  ];

  instituicoes_financeiras: ListagemInstituicoesFinanceirasEntity | null = null;

  readonly tiposConta = [
    { nome: 'Conta Corrente', codigo: 'CC' },
    { nome: 'Conta Poupança', codigo: 'CP' },
    { nome: 'Conta Salário', codigo: 'CS' },
    { nome: 'Conta Investimento', codigo: 'CI' },
  ];

  cnpjForm = this.fb.group({
    cnpj: [''],
  });

  susepForm = this.fb.group({
    susep: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    codigoCompanhiaRessegurada: [
      '',
      [Validators.required, Validators.pattern(/^\d+$/)],
    ],
    codigoCentroCusto: ['', [Validators.pattern(/^\d+$/)]],
  });

  contaForm = this.fb.group({
    banco: ['', Validators.required],
    agencia: ['', Validators.required],
    conta: ['', Validators.required],
    dac: ['', Validators.required],
    tipo: ['', Validators.required],
  });

  optional = new FormControl('');
  filtroBanco = new FormControl('');
  filtroAgencia = new FormControl('');
  filtroTipo = new FormControl('');
  filtroDac = new FormControl('');
  filtroContaExata = new FormControl('');

  get opcoesFiltroBanco(): CustomSelectOption[] {
    const bancosUnicos = Array.from(
      new Set(this.dadosConta.map((c) => c.codigo_banco).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return bancosUnicos.map((banco) => ({ optLabel: banco, optValue: banco }));
  }

  get opcoesFiltroAgencia(): CustomSelectOption[] {
    const agenciasUnicas = Array.from(
      new Set(this.dadosConta.map((c) => c.codigo_agencia).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return agenciasUnicas.map((ag) => ({ optLabel: ag, optValue: ag }));
  }

  get opcoesFiltroTipo(): CustomSelectOption[] {
    const tiposUnicos = Array.from(
      new Set(this.dadosConta.map((c) => c.tipo_conta).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return tiposUnicos.map((tipo) => {
      const nomeTipo =
        this.tiposConta.find((t) => t.codigo === tipo)?.nome || tipo;
      return { optLabel: nomeTipo, optValue: tipo };
    });
  }

  get opcoesFiltroDac(): CustomSelectOption[] {
    const dacsUnicos = Array.from(
      new Set(this.dadosConta.map((c) => c.dac).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
    return dacsUnicos.map((dac) => ({ optLabel: dac, optValue: dac }));
  }

  dadosCadastrais:
    | BuscarDadosCadastraisResponseEntity['dados_cadastrais']
    | null = null;
  dadosConta: ContaBancaria[] = [];

  currentPage = 1;
  pageSize = 10;
  readonly pageSizes = [10, 20, 50];

  isLoadingCnpj = false;
  isLoadingSalvar = false;

  constructor(
    private fb: FormBuilder,
    private navigation: NavigationService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef,
    @Inject(COMPANHIA_RESSEGURADA_USECASES.BUSCAR_BANCOS)
    private listarInstituicoesFinanceirasUseCase: ListagemInstituicoesFinanceirasUseCase,
    @Inject(COMPANHIA_RESSEGURADA_USECASES.BUSCAR_COMPANHIA_POR_CNPJ)
    private buscarCompanhiaPorCnpjAppUseCase: BuscarCompanhiaPorCnpjUseCase,
    @Inject(COMPANHIA_RESSEGURADA_USECASES.ENVIAR_CADASTRO_COMPANHIA)
    private enviarCadastroCompanhiaAppUseCase: EnviarCadastroCompanhiaUseCase
  ) {
    this.carregarBancos();
  }

  async carregarBancos(): Promise<void> {
    this.instituicoes_financeiras =
      await this.listarInstituicoesFinanceirasUseCase.execute();
    this.cdr.detectChanges();
  }

  get dadosContaFiltrados(): ContaBancaria[] {
    const termoBanco = (this.filtroBanco.value ?? '').trim().toLowerCase();
    const termoAgencia = (this.filtroAgencia.value ?? '').trim().toLowerCase();
    const termoTipo = (this.filtroTipo.value ?? '').trim().toLowerCase();
    const termoDac = (this.filtroDac.value ?? '').trim().toLowerCase();
    const termoConta = (this.filtroContaExata.value ?? '').trim().toLowerCase();

    return this.dadosConta.filter((conta) => {
      const matchBanco =
        !termoBanco || (conta.codigo_banco ?? '').toLowerCase() === termoBanco;
      const matchAgencia =
        !termoAgencia ||
        (conta.codigo_agencia ?? '').toLowerCase() === termoAgencia;
      const matchTipo =
        !termoTipo || (conta.tipo_conta ?? '').toLowerCase() === termoTipo;
      const matchDac =
        !termoDac || (conta.dac ?? '').toLowerCase() === termoDac;
      const matchConta =
        !termoConta ||
        (conta.codigo_conta ?? '').toLowerCase().includes(termoConta);

      return matchBanco && matchAgencia && matchTipo && matchDac && matchConta;
    });
  }

  get dadosContaPaginada(): ContaBancaria[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.dadosContaFiltrados.slice(start, start + this.pageSize);
  }

  onFiltroInput(): void {
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  onPaginate(event: any): void {
    const detail = event.detail || event;
    this.currentPage = detail.currentPage;
    this.pageSize = detail.pageSize;
    this.cdr.detectChanges();
  }

  get isCnpjCompleto(): boolean {
    return (this.cnpjForm.get('cnpj')?.value ?? '').length === 18;
  }

  get contaSelecionada(): ContaBancaria | undefined {
    return this.dadosConta.find((c) => c.selected);
  }

  get isSalvarHabilitado(): boolean {
    if (!this.dadosConta.length) {
      return this.susepForm.valid && this.contaForm.valid;
    }
    return this.susepForm.valid && !!this.contaSelecionada;
  }

  getSusepErrorMessage(): string {
    const control = this.susepForm.get('susep');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Obrigatório';
    if (control.hasError('pattern')) return 'Deve conter 5 dígitos numéricos';
    return '';
  }

  getCodigoCompanhiaErrorMessage(): string {
    const control = this.susepForm.get('codigoCompanhiaRessegurada');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Obrigatório';
    if (control.hasError('pattern')) return 'Somente números';
    return '';
  }

  getCodigoCentroCustoErrorMessage(): string {
    const control = this.susepForm.get('codigoCentroCusto');
    if (!control?.touched) return '';
    if (control.hasError('pattern')) return 'Somente números';
    return '';
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Limitar tamanho máximo (14 alfanuméricos + 2 numéricos do DV)
    raw = raw.slice(0, 16);

    // Separar partes
    const parteA = raw.slice(0, 2);
    const parteB = raw.slice(2, 5);
    const parteC = raw.slice(5, 8);
    const parteD = raw.slice(8, 12);
    let dv = raw.slice(12, 14).replace(/[^0-9]/g, ''); // DV só numérico

    // Montar valor formatado
    let value = parteA;
    if (parteB) value += '.' + parteB;
    if (parteC) value += '.' + parteC;
    if (parteD) value += '/' + parteD;
    if (dv) value += '-' + dv;

    this.cnpjForm.get('cnpj')?.setValue(value, { emitEvent: false });
  }

  onSusepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 5);
    this.susepForm.get('susep')?.setValue(value);
  }

  onCodigoNumericoInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    this.susepForm.get(controlName)?.setValue(input.value.replace(/\D/g, ''));
  }

  async buscarDadosCadastrais(): Promise<void> {
    this.isLoadingCnpj = true;
    this.dadosCadastrais = null;
    this.dadosConta = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.filtroBanco.setValue('', { emitEvent: false });
    this.filtroAgencia.setValue('', { emitEvent: false });
    this.filtroTipo.setValue('', { emitEvent: false });
    this.filtroDac.setValue('', { emitEvent: false });
    this.filtroContaExata.setValue('', { emitEvent: false });

    try {
      const cnpj = this.cnpjForm.get('cnpj')?.value ?? '';
      const response = await this.buscarCompanhiaPorCnpjAppUseCase.execute(
        cnpj
      );

      if (!response) {
        this.snackbarService.showSnackbar(
          'Cliente não cadastrado.',
          'info',
          5000
        );
        return;
      }

      this.dadosCadastrais = response.dados_cadastrais;
      this.dadosConta = (response.dados_conta ?? []).map((conta) => ({
        selected: false,
        codigo_banco: conta.codigo_banco,
        codigo_agencia: conta.codigo_agencia,
        tipo_conta: conta.tipo_conta,
        codigo_conta: conta.codigo_conta,
        dac: conta.dac,
      }));
    } catch {
      this.snackbarService.showSnackbar(
        'Erro ao buscar companhia ressegurada',
        'error'
      );
    } finally {
      this.isLoadingCnpj = false;
    }
  }

  checkRow(row: ContaBancaria): void {
    this.dadosConta.forEach((c) => (c.selected = false));
    row.selected = true;
    // Marcar o formulário como tocado para validação
    this.susepForm.markAllAsTouched();
    this.cdr.detectChanges();
  }

  checkAll(_event: boolean): void {
    this.dadosConta.forEach((c) => (c.selected = false));
    this.susepForm.markAllAsTouched();
    this.cdr.detectChanges();
  }
  // Ensure forms are marked as touched on manual entry
  markContaFormTouched(): void {
    this.contaForm.markAllAsTouched();
    this.susepForm.markAllAsTouched();
    this.cdr.detectChanges();
  }

  async salvarCadastro(): Promise<void> {
    if (!this.isSalvarHabilitado) return;

    let conta: any;
    if (!this.dadosConta.length) {
      // Monta a conta a partir do form manual
      conta = {
        codigo_banco: this.contaForm.get('banco')?.value,
        codigo_agencia: this.contaForm.get('agencia')?.value,
        codigo_tipo_conta: this.contaForm.get('tipo')?.value,
        codigo_conta: this.contaForm.get('conta')?.value,
        dac: this.contaForm.get('dac')?.value,
      };
    } else {
      conta = this.contaSelecionada;
      if (!conta) return;
    }

    this.isLoadingSalvar = true;

    try {
      await this.enviarCadastroCompanhiaAppUseCase.execute({
        codigo_susep: Number(this.susepForm.get('susep')?.value),
        pais: 'BR',
        tipo_pessoa: 'JURIDICA',
        tipo_documento: 'CNPJ',
        numero_documento: this.cnpjForm.get('cnpj')?.value ?? '',
        companhia_ressegurada: {
          codigo_companhia_ressegurada: Number(
            this.susepForm.get('codigoCompanhiaRessegurada')?.value
          ),
          ...(this.susepForm.get('codigoCentroCusto')?.value
            ? {
                codigo_centro_custo: Number(
                  this.susepForm.get('codigoCentroCusto')?.value
                ),
              }
            : {}),
        },
        dados_conta: {
          codigo_banco: conta.codigo_banco,
          codigo_agencia: conta.codigo_agencia,
          codigo_tipo_conta: conta.codigo_tipo_conta ?? conta.tipo_conta,
          codigo_conta: conta.codigo_conta,
          dac: conta.dac,
        },
        dados_cadastrais: {
          nome_completo: this.dadosCadastrais?.nome_completo ?? '',
          nome_fantasia: this.dadosCadastrais?.nome_fantasia ?? '',
        },
      });

      this.snackbarService.showSnackbar(
        'Cadastro enviado com sucesso!',
        'success'
      );

      this.goBack();
    } catch {
      this.snackbarService.showSnackbar('Erro ao enviar cadastro', 'error');
    } finally {
      this.isLoadingSalvar = false;
    }
  }

  goBack(): void {
    this.navigation.navigate(NavigationRoute.CompanhiaResseguradaHome);
  }
}
