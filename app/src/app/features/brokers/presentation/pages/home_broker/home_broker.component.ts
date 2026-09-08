import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IdsIconButtonModule,
  IdsIconModule,
  IdsInputSearchModule,
  IdsMainButtonModule,
  IdsPaginationModule,
  IdsShimmerModule,
  IdsSideSheetModule,
  IdsTableModule,
  IdsFormFieldModule,
  IdsInputModule,
  IdsSelectModule,
  IdsOption,
  IdsContextualButtonModule,
} from '@ids/angular';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { NavigationService } from 'src/app/shared/navigation.service';
import { ListarBrokersUseCase } from '../../../domain/usecases/listar_brokers.usecase';
import { ListarBrokersResponseEntity } from '../../../domain/entities/response/listar_brokers_response.entity';
import { CommonModule } from '@angular/common';
import { PaginationEvent } from '@ids/tools';

@Component({
  selector: 'home-broker',
  templateUrl: './home_broker.component.html',
  styleUrls: ['./home_broker.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IdsMainButtonModule,
    IdsIconModule,
    ContainerBaseComponent,
    IdsShimmerModule,
    IdsTableModule,
    CommonModule,
    IdsIconButtonModule,
    IdsPaginationModule,
    IdsSideSheetModule,
    IdsInputSearchModule,
    ReactiveFormsModule,
    IdsFormFieldModule,
    IdsInputModule,
    IdsSelectModule,
    IdsContextualButtonModule,
  ],
})
export class HomeBrokerComponent implements OnInit {
  isLoading = false;
  pageSize = 10;
  total = 0;
  currentPage = 1;
  isSideSheetOpen = false;
  filterForm: FormGroup;
  brokersList: ListarBrokersResponseEntity | null = null;
  allBrokers: any[] = [];
  displayedColumns = [
    'nomeCompleto',
    'tipoDocumento',
    'numeroDocumento',
    'codigoSusep',
    'situacaoCadastral',
    'acoes',
  ];

  tipoDocumentoOptions: IdsOption[] = [
    { optLabel: 'CNPJ', optValue: 'CNPJ' },
    { optLabel: 'NIF', optValue: 'NIF' },
    { optLabel: 'CGI', optValue: 'CGI' },
  ];

  situacaoCadastralOptions: IdsOption[] = [
    { optLabel: 'Ativo', optValue: 'ATIVO' },
    { optLabel: 'Inativo', optValue: 'INATIVO' },
  ];

  constructor(
    private navigation: NavigationService,
    private listarBrokersUseCase: ListarBrokersUseCase,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      nomeCompleto: [''],
      codigoSusep: [''],
      situacaoCadastral: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
    });
  }

  ngOnInit(): void {
    this.loadBrokers();
  }

  async loadBrokers(): Promise<void> {
    this.isLoading = true;
    try {
      const params = {
        page: this.currentPage - 1,
        size: this.pageSize,
      };
      const response = await this.listarBrokersUseCase.execute(params);
      if (response && response.content) {
        this.allBrokers = response.content;
        this.total = response.page?.totalElements ?? 0;
        this.aplicarFiltroLocal(response);
      } else {
        this.brokersList = null;
        this.allBrokers = [];
        this.total = 0;
      }
    } catch (error) {
      console.error('Erro ao buscar brokers:', error);
      this.brokersList = null;
      this.allBrokers = [];
      this.total = 0;
    } finally {
      this.isLoading = false;
    }
  }

  aplicarFiltroLocal(response: any) {
    const rawValue = this.filterForm.value;

    const filtered = this.allBrokers.filter((row) => {
      if (rawValue.nomeCompleto) {
        const nome = row.dadosCadastrais?.nomeCompleto || '';
        if (!nome.toLowerCase().includes(rawValue.nomeCompleto.toLowerCase())) {
          return false;
        }
      }
      if (rawValue.codigoSusep) {
        const susep = String(row.codigoSusep || '');
        if (!susep.includes(rawValue.codigoSusep)) {
          return false;
        }
      }
      if (rawValue.situacaoCadastral) {
        const situacao = row.situacaoCadastral || '';
        if (
          situacao.toUpperCase() !== rawValue.situacaoCadastral.toUpperCase()
        ) {
          return false;
        }
      }
      if (rawValue.tipoDocumento) {
        const tipo = row.dadosCadastrais?.tipoDocumento || '';
        if (tipo.toUpperCase() !== rawValue.tipoDocumento.toUpperCase()) {
          return false;
        }
      }
      if (rawValue.numeroDocumento) {
        const doc = String(row.dadosCadastrais?.numeroDocumento || '').replace(
          /\D/g,
          ''
        );
        const filterDoc = String(rawValue.numeroDocumento).replace(/\D/g, '');
        if (!doc.includes(filterDoc)) {
          return false;
        }
      }
      return true;
    });

    this.brokersList = {
      content: filtered,
      page: response.page,
    };
  }

  paginationChange(event: PaginationEvent) {
    this.currentPage = event.currentPage;
    this.pageSize = event.pageSize;
    this.loadBrokers();
  }

  abrirFiltros() {
    this.isSideSheetOpen = true;
  }

  fecharFiltros() {
    this.isSideSheetOpen = false;
  }

  aplicarFiltros() {
    this.currentPage = 1;
    this.loadBrokers();
    this.fecharFiltros();
  }

  limparFiltros() {
    this.filterForm.reset({
      nomeCompleto: '',
      codigoSusep: '',
      situacaoCadastral: '',
      tipoDocumento: '',
      numeroDocumento: '',
    });
    this.currentPage = 1;
    this.loadBrokers();
    this.fecharFiltros();
  }

  get isFiltroAtivo(): boolean {
    const rawValue = this.filterForm.value;
    return !!(
      rawValue.nomeCompleto ||
      rawValue.codigoSusep ||
      rawValue.situacaoCadastral ||
      rawValue.tipoDocumento ||
      rawValue.numeroDocumento
    );
  }

  goToDetails(idBroker: string) {
    this.navigation.navigate(NavigationRoute.BrokersDetalhe, {
      mode: 'visualize',
      id: idBroker,
    });
  }

  goToEdit(idBroker: string) {
    this.navigation.navigate(NavigationRoute.BrokersDetalhe, {
      mode: 'edit',
      id: idBroker,
    });
  }

  goToCreate() {
    this.navigation.navigate(NavigationRoute.BrokersDetalhe, {
      mode: 'create',
    });
  }

  goBack() {
    this.navigation.navigate(NavigationRoute.Home);
  }
}
