import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
} from '@angular/core';
import {
  IdsContextualButtonModule,
  IdsIconModule,
  IdsInputSearchModule,
  IdsMainButtonModule,
  IdsPaginationModule,
  IdsShimmerModule,
  IdsTableModule,
} from '@ids/angular';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { NavigationService } from 'src/app/shared/navigation.service';
import { CompanhiaResseguradaListItemEntity } from '../../domain/entities/companhia-ressegurada-list-item.entity';
import { ListarCompanhiasResseguradasUseCase } from '../../domain/usecases/listar-companhias-resseguradas.usecase';
import { COMPANHIA_RESSEGURADA_USECASES } from 'src/app/core/tokens/companhia_ressegurada.tokens';

@Component({
  standalone: true,
  imports: [
    IdsMainButtonModule,
    IdsIconModule,
    ContainerBaseComponent,
    IdsInputSearchModule,
    IdsTableModule,
    CommonModule,
    IdsContextualButtonModule,
    IdsShimmerModule,
    IdsPaginationModule,
  ],
  selector: 'home-companhia-ressegurada',
  templateUrl: './home-companhia-ressegurada.component.html',
  styleUrls: ['./home-companhia-ressegurada.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeCompanhiaResseguradaComponent implements OnInit {
  constructor(
    private navigation: NavigationService,
    @Inject(COMPANHIA_RESSEGURADA_USECASES.LISTAR_COMPANHIAS_RESSEGURADAS)
    private listarCompanhiasResseguradasAppUseCase: ListarCompanhiasResseguradasUseCase
  ) {}

  displayedColumns = [
    'id_cliente',
    'codigo_companhia_ressegurada',
    'codigo_centro_custo',
    'codigo_susep',
    'situacao_cadastral',
  ];

  headerNames = [
    'ID Cliente',
    'Código Companhia Ressegurada',
    'Código Centro Custo',
    'Código SUSEP',
    'Situação Cadastral',
  ];

  data1: CompanhiaResseguradaListItemEntity[] = [];
  isLoading = false;
  total = 0;
  currentPage = 1;
  currentPageSize = 10;

  ngOnInit(): void {
    this.loadCompanhias();
  }

  async loadCompanhias() {
    this.isLoading = true;
    try {
      const response =
        await this.listarCompanhiasResseguradasAppUseCase.execute();
      this.data1 = response?.content ?? [];
      this.total = response?.page?.totalElements ?? this.data1.length;
      this.currentPage = (response?.page?.number ?? 0) + 1;
      this.currentPageSize = response?.page?.size ?? this.data1.length ?? 10;
    } finally {
      this.isLoading = false;
    }
  }

  goTo(rota: string) {
    switch (rota) {
      case 'companhia-ressegurada-cadastro':
        this.navigation.navigate(NavigationRoute.CompanhiaResseguradaCadastro);
        break;
    }
  }

  goBack() {
    this.navigation.navigate(NavigationRoute.Home);
  }
}
