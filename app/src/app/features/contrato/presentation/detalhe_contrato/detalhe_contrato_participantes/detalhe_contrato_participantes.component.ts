import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  IdsCheckboxModule,
  IdsFormFieldModule,
  IdsFormSelectionModule,
  IdsIconModule,
  IdsInputModule,
  IdsMaskModule,
  IdsSelectModule,
  IdsSwitchModule,
} from '@ids/angular';
import { IdsOption } from '@ids/tools';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';

function minLengthArrayValidator(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const length = control instanceof FormArray ? control.length : 0;
    return length >= min ? null : { minLengthArray: { min, actual: length } };
  };
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContainerBaseComponent,
    IdsFormFieldModule,
    IdsInputModule,
    IdsSelectModule,
    IdsCheckboxModule,
    IdsFormSelectionModule,
    IdsSwitchModule,
    IdsMaskModule,
    IdsIconModule,
  ],
  selector: 'detalhe-contrato-participantes',
  templateUrl: 'detalhe_contrato_participantes.component.html',
  styleUrls: ['detalhe_contrato_participantes.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheContratoParticipantesComponent implements OnInit {
  brokersDisponiveis: IdsOption[] = [
    { optLabel: 'BMS Brasil Corretora', optValue: 'bms-brasil-corretora' },
    { optLabel: 'AON Brasil Corretora de Seguros', optValue: 'aon-brasil' },
    { optLabel: 'Marsh Corretora de Seguros', optValue: 'marsh' },
    { optLabel: 'Willis Towers Watson', optValue: 'willis-towers-watson' },
  ] as IdsOption[];

  resseguradorasDisponiveis: IdsOption[] = [
    {
      optLabel: 'Mapfre Re do Brasil Companhia de Resseguros',
      optValue: 'mapfre-re',
    },
    { optLabel: 'IRB Brasil Resseguros S.A', optValue: 'irb-brasil' },
    { optLabel: 'Swiss Re Brasil Resseguros S.A', optValue: 'swiss-re' },
    { optLabel: 'Munich Re Resseguradora Brasil S.A', optValue: 'munich-re' },
  ] as IdsOption[];

  percentConfig = {
    allowNegative: false,
    decimal: ',',
    precision: 2,
    thousands: '',
    prefix: '% ',
  };

  percentPreciseConfig = {
    allowNegative: false,
    decimal: ',',
    precision: 4,
    thousands: '',
    prefix: '% ',
  };

  currencyConfig = {
    allowNegative: false,
    decimal: ',',
    precision: 2,
    thousands: '.',
    prefix: 'R$ ',
  };

  brokerForm!: FormGroup;
  resseguradoresForm!: FormArray;

  constructor(private readonly fb: FormBuilder) {
    this.brokerForm = this.fb.group({
      temBroker: [true],
      broker: [null, Validators.required],
    });

    this.resseguradoresForm = this.fb.array([], minLengthArrayValidator(1));
  }

  ngOnInit() {}

  get resseguradores(): FormGroup[] {
    return this.resseguradoresForm.controls as FormGroup[];
  }

  get formularioValido(): boolean {
    return (
      !!this.brokerForm.value.broker &&
      this.resseguradoresForm.length > 0 &&
      this.resseguradores.every(
        (ressegurador) => !!ressegurador.value.ressegurador
      )
    );
  }

  onTemBrokerToggle(temBroker: boolean) {
    this.brokerForm.get('temBroker')!.setValue(temBroker);

    const brokerControl = this.brokerForm.get('broker')!;
    if (temBroker) {
      brokerControl.setValidators(Validators.required);
    } else {
      brokerControl.clearValidators();
    }
    brokerControl.updateValueAndValidity();
  }

  adicionarRessegurador() {
    this.resseguradoresForm.push(this.criarResseguradorGroup());
  }

  removerRessegurador(index: number) {
    this.resseguradoresForm.removeAt(index);
  }

  toggleExpandRessegurador(index: number) {
    const control = this.resseguradores[index].get('expanded')!;
    control.setValue(!control.value);
  }

  onLiderChange(index: number, checked: boolean) {
    const grupo = this.resseguradores[index];
    grupo.get('ressegurLider')!.setValue(checked);

    if (checked) {
      grupo.get('ressegurCoLider')!.setValue(false);

      this.resseguradores.forEach((outro, outroIndex) => {
        if (outroIndex !== index) {
          outro.get('ressegurLider')!.setValue(false);
        }
      });
    }
  }

  onCoLiderChange(index: number, checked: boolean) {
    const grupo = this.resseguradores[index];
    grupo.get('ressegurCoLider')!.setValue(checked);

    if (checked) {
      grupo.get('ressegurLider')!.setValue(false);

      this.resseguradores.forEach((outro, outroIndex) => {
        if (outroIndex !== index) {
          outro.get('ressegurCoLider')!.setValue(false);
        }
      });
    }
  }

  porRisco(index: number): FormGroup[] {
    return (
      this.resseguradores[index].get('condicoesPremio.porRisco') as FormArray
    ).controls as FormGroup[];
  }

  porEvento(index: number): FormGroup[] {
    return (
      this.resseguradores[index].get('condicoesPremio.porEvento') as FormArray
    ).controls as FormGroup[];
  }

  calcularTotal(faixa: AbstractControl): number {
    const valorPmd = faixa.get('valorPmd')?.value ?? 0;
    const taxaAjuste = faixa.get('taxaAjuste')?.value ?? 0;
    return valorPmd * (taxaAjuste / 100);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  nomeRessegurador(optValue: string): string {
    return (
      this.resseguradorasDisponiveis.find(
        (option) => option.optValue === optValue
      )?.optLabel ?? 'Novo Ressegurador'
    );
  }

  private criarFaixaGroup(): FormGroup {
    return this.fb.group({
      valorPmd: [null, [Validators.required, Validators.min(0.01)]],
      taxaAjuste: [null, [Validators.required, Validators.min(0.0001)]],
    });
  }

  private criarResseguradorGroup(
    preset: Partial<{
      ressegurador: string;
      ressegurLider: boolean;
      ressegurCoLider: boolean;
      acordoBitributacao: boolean;
    }> = {}
  ): FormGroup {
    return this.fb.group({
      ressegurador: [preset.ressegurador ?? null, Validators.required],
      participacao: [null, [Validators.required, Validators.min(0.01)]],
      pmd: [null, [Validators.required, Validators.min(0.01)]],
      taxaCorretagemBroker: [null, [Validators.required, Validators.min(0)]],
      rebate: [null, [Validators.required, Validators.min(0)]],
      acordoBitributacao: [preset.acordoBitributacao ?? false],
      ressegurLider: [preset.ressegurLider ?? false],
      ressegurCoLider: [preset.ressegurCoLider ?? false],
      expanded: [true],
      condicoesPremio: this.fb.group({
        porRisco: this.fb.array([
          this.criarFaixaGroup(),
          this.criarFaixaGroup(),
        ]),
        porEvento: this.fb.array([this.criarFaixaGroup()]),
      }),
    });
  }
}
