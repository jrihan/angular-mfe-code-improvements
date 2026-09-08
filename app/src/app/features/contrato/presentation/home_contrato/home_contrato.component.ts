import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ContratoResponseEntity } from 'src/app/features/contrato/domain/entities/contrato_response.entity';
import {
  IdsBreadcrumbItem,
  IdsDatepickerModule,
  IdsFormFieldModule,
  IdsIconModule,
  IdsInputModule,
  IdsInputSearchModule,
  IdsMainButtonModule,
  IdsOption,
  IdsBreadcrumbsModule,
  IdsPaginationModule,
  IdsSelectModule,
  IdsSideSheetModule,
  IdsTableModule,
  IdsTooltipModule,
  IdsIconButtonModule,
  IdsModalModule,
} from '@ids/angular';
import { CardBaseComponent } from 'src/app/shared/components/card_base/card_base.component';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { NavigationService } from 'src/app/shared/navigation.service';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { ContratoResponseEntityFactory } from 'tests/app/features/contratos/domain/entities/contrato_response.factory';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IdsMainButtonModule,
    IdsIconModule,
    CardBaseComponent,
    IdsInputSearchModule,
    ReactiveFormsModule,
    ContainerBaseComponent,
    IdsBreadcrumbsModule,
    IdsTableModule,
    IdsPaginationModule,
    IdsTooltipModule,
    IdsIconButtonModule,
    IdsModalModule,
    IdsSideSheetModule,
    IdsFormFieldModule,
    IdsInputModule,
    IdsSelectModule,
    IdsDatepickerModule,
  ],
  selector: 'home-contrato',
  templateUrl: './home_contrato.component.html',
  styleUrls: ['./home_contrato.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeContratoComponent implements OnInit {
  isLoading = false;
  isOpenDeleteModal = false;
  isSideSheetOpen = false;
  contratoSelecionadoParaExcluir: ContratoResponseEntity | null = null;
  filterForm: FormGroup;
  data: ContratoResponseEntity[] = [];
  allData: ContratoResponseEntity[] = [];
  displayedColumns = [
    'nomeDoContrato',
    'status',
    'vigencia',
    'tipoDeContrato',
    'modalidadeDeContrato',
    'baseDeCobertura',
    'submodalidade',
    'companhia',
    'broker',
    'resseguradoras',
    'acoes',
  ];

  items: IdsBreadcrumbItem[] = [
    { label: 'itaú', type: 'page-link', click: () => console.log('click') },
    {
      label: 'segurança',
      type: 'page-link',
      click: () => console.log('click'),
    },
    { label: 'termos e condições', click: () => console.log('click') },
  ];

  headerNames = [
    'Nome do Contrato',
    'Status',
    'Vigência',
    'Tipo de Contrato',
    'Modalidade de Contrato',
    'Base de Cobertura',
    'Submodalidade',
    'Companhia',
    'Broker',
    'Resseguradoras',
    'Ações',
  ];

  statusOptions: IdsOption[] = [
    { optLabel: 'Ativo', optValue: 'Ativo' },
    { optLabel: 'Em Andamento', optValue: 'Em Andamento' },
    { optLabel: 'Concluido', optValue: 'Concluido' },
  ];

  tipoDeContratoOptions: IdsOption[] = [
    { optLabel: 'Tipo A', optValue: 'Tipo A' },
    { optLabel: 'Tipo B', optValue: 'Tipo B' },
    { optLabel: 'Tipo C', optValue: 'Tipo C' },
  ];

  modalidadeDeContratoOptions: IdsOption[] = [
    { optLabel: 'Proporcional', optValue: 'PROPORCIONAL' },
    { optLabel: 'Não Proporcional', optValue: 'NAOPROPORCIONAL' },
  ];

  submodalidadeOptions: IdsOption[] = [
    { optLabel: 'Evento', optValue: 'EVENTO' },
    { optLabel: 'Risco', optValue: 'RISCO' },
    { optLabel: 'Risco e Evento', optValue: 'RISCO_E_EVENTO' },
  ];

  companhiaOptions: IdsOption[] = [
    { optLabel: 'Itaú Seguros', optValue: 'itau-seguros' },
    { optLabel: 'Itaú Vida e Previdência', optValue: 'itau-vida-previdencia' },
  ];

  brokerOptions: IdsOption[] = [
    { optLabel: 'BMS Brasil Corretora', optValue: 'bms-brasil-corretora' },
    { optLabel: 'AON Brasil Corretora de Seguros', optValue: 'aon-brasil' },
    { optLabel: 'Marsh Corretora de Seguros', optValue: 'marsh' },
    { optLabel: 'Willis Towers Watson', optValue: 'willis-towers-watson' },
  ];

  resseguradorasOptions: IdsOption[] = [
    {
      optLabel: 'Mapfre Re do Brasil Companhia de Resseguros',
      optValue: 'mapfre-re',
    },
    { optLabel: 'IRB Brasil Resseguros S.A', optValue: 'irb-brasil' },
    { optLabel: 'Swiss Re Brasil Resseguros S.A', optValue: 'swiss-re' },
    { optLabel: 'Munich Re Resseguradora Brasil S.A', optValue: 'munich-re' },
  ];

  constructor(private navigation: NavigationService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      vigencia: [''],
      tipoDeContrato: [''],
      modalidadeDeContrato: [''],
      submodalidade: [''],
      companhia: [''],
      broker: [''],
      resseguradoras: [''],
    });

    this.allData = ContratoResponseEntityFactory.createList(10);
    this.data = [...this.allData];
  }

  ngOnInit() {}

  //Navigations

  deleteContrato(contrato: ContratoResponseEntity) {
    this.contratoSelecionadoParaExcluir = contrato;
    this.isOpenDeleteModal = true;
  }

  confirmarDeleteContrato() {
    if (!this.contratoSelecionadoParaExcluir) {
      return;
    }

    this.allData = this.allData.filter(
      (item) => item !== this.contratoSelecionadoParaExcluir
    );
    this.aplicarFiltroLocal();
    this.fecharModalDelete();
  }

  fecharModalDelete() {
    this.isOpenDeleteModal = false;
    this.contratoSelecionadoParaExcluir = null;
  }

  goBack() {
    console.log('Go Back');
    this.navigation.navigate(NavigationRoute.Home);
  }

  goToEdit(idContrato: string) {
    this.navigation.navigate(NavigationRoute.ContratosDetalhe, {
      mode: 'edit',
      id: idContrato,
    });
  }

  goToCreate() {
    this.navigation.navigate(NavigationRoute.ContratosDetalhe, {
      mode: 'create',
    });
  }

  abrirFiltros() {
    this.isSideSheetOpen = true;
  }

  fecharFiltros() {
    this.isSideSheetOpen = false;
  }

  aplicarFiltros() {
    this.aplicarFiltroLocal();
    this.fecharFiltros();
  }

  tagClassePorStatus(status: string): string {
    switch ((status ?? '').toUpperCase()) {
      case 'ATIVO':
        return '-success';
      case 'INATIVO':
        return '-error';
      case 'EM_ANALISE':
      case 'EM ANDAMENTO':
        return '';
      case 'CONCLUIDO':
      case 'CONCLUÍDO':
        return '-information';
      default:
        return '';
    }
  }

  private aplicarFiltroLocal() {
    const rawValue = this.filterForm.value;

    this.data = this.allData.filter((contrato) => {
      if (rawValue.status && contrato.status !== rawValue.status) {
        return false;
      }

      if (
        rawValue.tipoDeContrato &&
        contrato.tipoDeContrato !== rawValue.tipoDeContrato
      ) {
        return false;
      }

      if (
        rawValue.modalidadeDeContrato &&
        contrato.modalidadeDeContrato !== rawValue.modalidadeDeContrato
      ) {
        return false;
      }

      if (
        rawValue.submodalidade &&
        contrato.submodalidade !== rawValue.submodalidade
      ) {
        return false;
      }

      if (rawValue.companhia && contrato.companhia !== rawValue.companhia) {
        return false;
      }

      if (rawValue.broker && contrato.broker !== rawValue.broker) {
        return false;
      }

      if (
        rawValue.resseguradoras &&
        contrato.resseguradoras !== rawValue.resseguradoras
      ) {
        return false;
      }

      return true;
    });
  }
}
