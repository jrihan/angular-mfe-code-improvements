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
import { ListarResseguradoresUseCase } from '../../domain/usecases/listar_resseguradores.usecase';
import { ListarResseguradoresResponseEntity } from '../../domain/entities/response/listar_resseguradores_response.entity';
import { CommonModule } from '@angular/common';
import { PaginationEvent } from '@ids/tools';

@Component({
  selector: 'home-ressegurador',
  templateUrl: './home_ressegurador.component.html',
  styleUrls: ['./home_ressegurador.component.scss'],
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
export class HomeResseguradorComponent implements OnInit {
  isLoading = false;

  displayedColumns = [
    'nomeCompleto',
    'tipoDocumento',
    'numeroDocumento',
    'codigoSusep',
    'situacaoCadastral',
    'acoes',
  ];

  resseguradoresList: ListarResseguradoresResponseEntity | null = null;
  allResseguradores: any[] = [];

  pageSize = 10;
  total = 0;
  currentPage = 1;

  isSideSheetOpen = false;
  filterForm: FormGroup;

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
    private listarResseguradoresUseCase: ListarResseguradoresUseCase,
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
    this.loadResseguradores();
  }

  async loadResseguradores(): Promise<void> {
    this.isLoading = true;
    try {
      const params = {
        page: this.currentPage - 1,
        size: this.pageSize,
      };

      const response = await this.listarResseguradoresUseCase.execute(params);
      if (response && response.content) {
        this.allResseguradores = response.content;
        this.total = response.page?.totalElements ?? 0;
        this.aplicarFiltroLocal(response);
      } else {
        this.resseguradoresList = null;
        this.allResseguradores = [];
        this.total = 0;
      }
    } catch (error) {
      console.error('Erro ao buscar resseguradores:', error);
      this.resseguradoresList = null;
      this.allResseguradores = [];
      this.total = 0;
    } finally {
      this.isLoading = false;
    }
  }

  aplicarFiltroLocal(response: any) {
    const rawValue = this.filterForm.value;

    const filtered = this.allResseguradores.filter((row) => {
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

    this.resseguradoresList = {
      content: filtered,
      page: response.page,
    };
  }

  paginationChange(event: PaginationEvent) {
    this.currentPage = event.currentPage;
    this.pageSize = event.pageSize;
    this.loadResseguradores();
  }

  abrirFiltros() {
    this.isSideSheetOpen = true;
  }

  fecharFiltros() {
    this.isSideSheetOpen = false;
  }

  aplicarFiltros() {
    this.currentPage = 1;
    this.loadResseguradores();
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
    this.loadResseguradores();
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

  goToDetails(idRessegurador: string) {
    this.navigation.navigate(NavigationRoute.ResseguradoresDetalhe, {
      mode: 'visualizar',
      id: idRessegurador,
    });
  }

  goToEdit(idRessegurador: string) {
    this.navigation.navigate(NavigationRoute.ResseguradoresDetalhe, {
      mode: 'editar',
      id: idRessegurador,
    });
  }

  goToCreate() {
    this.navigation.navigate(NavigationRoute.ResseguradoresDetalhe, {
      mode: 'criar',
    });
  }

  goBack() {
    this.navigation.navigate(NavigationRoute.Home);
  }
}
