import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  IdsSelectModule,
  IdsFormFieldModule,
  IdsInputModule,
  IdsCheckboxModule,
  IdsFormSelectionModule,
  IdsDatepickerModule,
  IdsMaskModule,
} from '@ids/angular';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { CurrencyEnum } from '../../../domain/enums/currency.enum';
import { TerritorialCoverageEnum } from '../../../domain/enums/territorial_coverage.enum';
import { ContractTypeEnum } from '../../../domain/enums/contract_type.enum';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { enumToOptions } from 'src/app/shared/helpers/enum-to-options.helper';
import { ContractModalityEnum } from '../../../domain/enums/contract_modality.enum';
import { ContractSubModalityEnum } from '../../../domain/enums/contract_submodality.enum';
import { CoverageBaseEnum } from '../../../domain/enums/coverage_base.enum';
import { IdsOption } from '@ids/tools';
import {
  MultiselectComponent,
  MultiSelectOption,
} from 'src/app/shared/components/multiselect/multiselect.component';
import { MultiselectOptionComponent } from 'src/app/shared/components/multiselect/multiselect-option.component';
import { MultiselectSummaryComponent } from 'src/app/shared/components/multi-select-summary/multiselect-summary.component';

function minSelectedValidator(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const length = Array.isArray(control.value) ? control.value.length : 0;
    return length >= min ? null : { minSelected: { min, actual: length } };
  };
}

function atLeastOneCheckedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = Object.values(control.value ?? {});
    const hasChecked = values.some((value) => value === true);
    return hasChecked ? null : { atLeastOneChecked: true };
  };
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IdsSelectModule,
    IdsFormFieldModule,
    ContainerBaseComponent,
    IdsInputModule,
    ReactiveFormsModule,
    IdsCheckboxModule,
    IdsFormSelectionModule,
    IdsDatepickerModule,
    IdsMaskModule,
    MultiselectComponent,
    MultiselectOptionComponent,
    MultiselectSummaryComponent,
  ],
  selector: 'detalhe-contrato-cadastro',
  styleUrls: ['./detalhe_contrato_cadastro.component.scss'],
  templateUrl: './detalhe_contrato_cadastro.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheContratoCadastroComponent implements OnInit {
  public basicInformationForm!: FormGroup;
  public clausesForm!: FormGroup;
  public limiteAutomaticoSubscricao!: FormGroup;
  public ramosForm!: FormGroup;
  public garantiasForm!: FormGroup;

  currency = enumToOptions(CurrencyEnum);
  territorialCoverage = enumToOptions(TerritorialCoverageEnum);
  contractType = enumToOptions(ContractTypeEnum);

  contractModalities = enumToOptions(ContractModalityEnum);
  contractSubModalities = enumToOptions(ContractSubModalityEnum);
  baseDeCobertura = enumToOptions(CoverageBaseEnum);

  config = {
    allowNegative: true,
    decimal: '.',
    precision: 2,
    thousands: ',',
    prefix: 'R$ ',
  };

  defaultOption = [
    {
      optLabel: 'A',
      optValue: 'A',
    },
    {
      optLabel: 'B',
      optValue: 'B',
    },
    {
      optLabel: 'C',
      optValue: 'C',
    },
  ] as IdsOption[];

  ramosDisponiveis: MultiSelectOption[] = [
    { value: '91', label: '91 - Vida Individual' },
    { value: '81', label: '81 - Acidentes Pessoais Individual' },
    { value: '77', label: '77 - Prestamista' },
    { value: '82', label: '82 - Acidentes Pessoais Coletivos' },
    { value: '93', label: '93 - Vida em Grupo/Capital Global' },
    { value: '77-pj', label: '77 - Prestamista PJ' },
    { value: 'previdencia-pf', label: 'Previdência PF' },
    { value: 'previdencia-pj', label: 'Previdência PJ' },
    { value: '69', label: '69 - Viagem Individual' },
  ];

  garantiasDisponiveis: MultiSelectOption[] = [
    { value: 'mip', label: 'MIP' },
    { value: 'morte-acidental', label: 'Morte Acidental' },
    { value: 'invalidez-por-acidente', label: 'Invalidez por Acidente' },
    { value: 'auxilio-funeral', label: 'Auxílio Funeral' },
    { value: 'incendio', label: 'Incêndio' },
    { value: 'vendaval', label: 'Vendaval' },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.basicInformationForm = this.fb.group({
      contract_name: ['', Validators.required],
      vigencia: ['', Validators.required],
      moeda: [[], minSelectedValidator(1)],
      abrangenciaTerritorial: ['', Validators.required],
      tipoDeContrato: ['', Validators.required],
      modalidadeDeContrato: ['', Validators.required],
      submodalidade: [[], minSelectedValidator(1)],
      baseDeCobertura: ['', Validators.required],
      companhia: [[], minSelectedValidator(1)],
      grupo: [[], minSelectedValidator(1)],
    });

    this.clausesForm = this.fb.group(
      {
        arbitragem: new FormControl(false),
        seguirASorte: new FormControl(false),
        exclusao: new FormControl(false),
        intermediacao: new FormControl(false),
      },
      { validators: atLeastOneCheckedValidator() }
    );

    this.limiteAutomaticoSubscricao = this.fb.group({
      vidaCpf: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      previdenciaPessoaFisica: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      previdenciaPessoaJuridica: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      prestamistaPessoaJuridicaApolice: new FormControl(null, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });

    this.ramosForm = this.fb.group({
      ramoRealPorRisco: [[], minSelectedValidator(1)],
      ramoRegedorPorRisco: [[], minSelectedValidator(1)],
      ramoRealPorEvento: [[], minSelectedValidator(1)],
      ramoRegedorPorEvento: [[], minSelectedValidator(1)],
    });

    this.garantiasForm = this.fb.group({
      garantiasSelecionadas: [[], minSelectedValidator(1)],
    });
  }

  ngOnInit() {}

  get formularioValido(): boolean {
    return (
      this.basicInformationForm.valid &&
      this.clausesForm.valid &&
      this.limiteAutomaticoSubscricao.valid &&
      this.ramosForm.valid &&
      this.garantiasForm.valid
    );
  }

  get ramoRealPorRisco(): MultiSelectOption[] {
    return this.ramosForm.get('ramoRealPorRisco')!.value;
  }

  set ramoRealPorRisco(value: MultiSelectOption[]) {
    this.ramosForm.get('ramoRealPorRisco')!.setValue(value);
  }

  get ramoRegedorPorRisco(): MultiSelectOption[] {
    return this.ramosForm.get('ramoRegedorPorRisco')!.value;
  }

  set ramoRegedorPorRisco(value: MultiSelectOption[]) {
    this.ramosForm.get('ramoRegedorPorRisco')!.setValue(value);
  }

  get ramoRealPorEvento(): MultiSelectOption[] {
    return this.ramosForm.get('ramoRealPorEvento')!.value;
  }

  set ramoRealPorEvento(value: MultiSelectOption[]) {
    this.ramosForm.get('ramoRealPorEvento')!.setValue(value);
  }

  get ramoRegedorPorEvento(): MultiSelectOption[] {
    return this.ramosForm.get('ramoRegedorPorEvento')!.value;
  }

  set ramoRegedorPorEvento(value: MultiSelectOption[]) {
    this.ramosForm.get('ramoRegedorPorEvento')!.setValue(value);
  }

  get garantiasSelecionadas(): MultiSelectOption[] {
    return this.garantiasForm.get('garantiasSelecionadas')!.value;
  }

  set garantiasSelecionadas(value: MultiSelectOption[]) {
    this.garantiasForm.get('garantiasSelecionadas')!.setValue(value);
  }

  removeRamoRealPorRisco(option: MultiSelectOption) {
    this.ramoRealPorRisco = this.ramoRealPorRisco.filter(
      (ramo) => ramo.value !== option.value
    );
  }

  removeRamoRegedorPorRisco(option: MultiSelectOption) {
    this.ramoRegedorPorRisco = this.ramoRegedorPorRisco.filter(
      (ramo) => ramo.value !== option.value
    );
  }

  removeRamoRealPorEvento(option: MultiSelectOption) {
    this.ramoRealPorEvento = this.ramoRealPorEvento.filter(
      (ramo) => ramo.value !== option.value
    );
  }

  removeRamoRegedorPorEvento(option: MultiSelectOption) {
    this.ramoRegedorPorEvento = this.ramoRegedorPorEvento.filter(
      (ramo) => ramo.value !== option.value
    );
  }

  removeGarantia(option: MultiSelectOption) {
    this.garantiasSelecionadas = this.garantiasSelecionadas.filter(
      (garantia) => garantia.value !== option.value
    );
  }
}
