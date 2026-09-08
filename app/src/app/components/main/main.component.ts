import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdsAlertComponent } from '@ids/angular';
import { EventTrackingService } from '@quickweb/mfe-analytics';
import {
  ContextService,
  IContext,
  IInteractionEvent,
  IOutputProcess,
  IRedirect,
  SubjectService,
} from '@quickweb/mfe-context';
import { Subscription, filter } from 'rxjs';
import { ConstantConfig } from '../../../app/models/constant-config';
import { FailDetail } from '../../models/error.model';
import { InputData } from '../../models/inputdata.model';
import { HomePage } from 'src/app/features/home/presentation/home.component';

// Novas importações de navegação e componentes
import {
  NavigationService,
  NavigationState,
} from '../../shared/navigation.service';
import { NavigationRoute } from '../../shared/navigation-routes';
import { WrapperStrategyComponent } from '../../shared/components/wrapper-strategy/wrapper-strategy.component';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { HomeCompanhiaResseguradaComponent } from '../../features/companhia_ressegurada/presentation/home-companhia-ressegurada/home-companhia-ressegurada.component';
import { CadastroCompanhiaResseguradaComponent } from '../../features/companhia_ressegurada/presentation/cadastro-companhia-ressegurada/cadastro-companhia-ressegurada.component';
import { HomeResseguradorComponent } from '../../features/resseguradores/presentation/home_ressegurador/home_ressegurador.component';
import { DetalheResseguradorComponent } from '../../features/resseguradores/presentation/detalhe_ressegurador/detalhe_ressegurador.component';
import { HomeBrokerComponent } from '../../features/brokers/presentation/pages/home_broker/home_broker.component';
import { DetalheBrokerComponent } from 'src/app/features/brokers/presentation/pages/detalhe_broker/detalhe_broker.component';
import { HomeContratoComponent } from 'src/app/features/contrato/presentation/home_contrato/home_contrato.component';
import { DetalheContratoComponent } from 'src/app/features/contrato/presentation/detalhe_contrato/detalhe_contrato.component';

@Component({
  selector: 'app-mf-plataformaresseguro-mfe-main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    CommonModule,
    IdsAlertComponent,
    HomePage,
    WrapperStrategyComponent,
    SnackbarComponent,
    HomeCompanhiaResseguradaComponent,
    CadastroCompanhiaResseguradaComponent,
    HomeResseguradorComponent,
    DetalheResseguradorComponent,
    HomeBrokerComponent,
    DetalheBrokerComponent,
    HomeContratoComponent,
    DetalheContratoComponent,
  ],
})
export class MainComponent implements OnInit, OnChanges, OnDestroy {
  @HostBinding('attr.class') segment = '';

  @HostBinding('attr.style') style = 'font-family: "Itau Text"';

  @Input() context: IContext<InputData>;

  @Output() interactionEventLib: EventEmitter<IInteractionEvent> =
    new EventEmitter<IInteractionEvent>();

  isContextValid = false;

  listFails: FailDetail[] = [];

  paginaAtual: NavigationState = { rota: NavigationRoute.Home };

  private readonly subscribes: Subscription[] = [];
  private readonly outputProcessService: SubjectService<IOutputProcess<any>>;
  private readonly redirectService: SubjectService<IRedirect>;

  constructor(
    private readonly contextService: ContextService,
    private readonly trackService: EventTrackingService,
    private readonly navigationService: NavigationService
  ) {
    this.outputProcessService = SubjectService.getInstance('outputProcess');
    this.redirectService = SubjectService.getInstance('redirect');
  }

  ngOnInit(): void {
    this.initialize();
    this.subscribeEvents();
  }

  ngOnChanges(): void {
    this.updateComponent();
  }

  ngOnDestroy(): void {
    this.subscribes.forEach((x) => x.unsubscribe());
  }

  validateContext(context: IContext<InputData>): boolean {
    this.listFails = this.listContextFails(context);
    this.isContextValid = this.listFails.length === 0;
    return this.isContextValid;
  }

  listContextFails(_context: IContext<InputData>): FailDetail[] {
    return [];
  }

  private updateComponent(): void {
    if (this.validateContext(this.context)) this.startComponent();
    else this.showMessageFails();
  }

  private initialize(): void {
    this.updateComponent();
  }

  private showMessageFails(): void {
    this.listFails = this.listContextFails(this.context);
  }

  private startComponent(): void {
    this.contextService.emit(this.context);
    this.updateSegment();
  }

  private updateSegment() {
    this.segment = `${ConstantConfig.SEGMENT_CLASS}${
      this.contextService.getSegment ?? ''
    }`;
  }

  private subscribeEvents(): void {
    this.subscribeEventsRefresh();
    this.subscribeEventsOutput();
    this.subscribeEventsTracking();
    this.subscribeEventRedirect();
    this.subscribeSegmentSource();
    this.subscribeRoute();
  }

  private subscribeRoute(): void {
    this.subscribes.push(
      this.navigationService.route$.subscribe((route) => {
        this.paginaAtual = route;
      })
    );
  }

  private subscribeSegmentSource(): void {
    this.subscribes.push(
      this.contextService.segmentSource$.subscribe(() => {
        this.updateSegment();
      })
    );
  }

  private subscribeEventsRefresh(): void {
    this.subscribes.push(
      this.contextService.refreshSource$.pipe(filter(Boolean)).subscribe(() =>
        this.interactionEventLib.emit({
          name: 'refreshTokenEvent',
          data: this.contextService.getContext,
        })
      )
    );
  }

  private subscribeEventsOutput(): void {
    this.subscribes.push(
      this.outputProcessService
        .listen()
        .pipe()
        .subscribe((result: unknown) =>
          this.interactionEventLib.emit({
            name: 'outputProcessEvent',
            data: result,
          })
        )
    );
  }

  private subscribeEventsTracking(): void {
    this.subscribes.push(
      this.trackService
        .listen()
        .pipe(filter(Boolean))
        .subscribe((result: EventTrackingService) =>
          this.interactionEventLib.emit({
            name: 'analyticsEvent',
            data: result,
          })
        )
    );
  }

  private subscribeEventRedirect(): void {
    this.subscribes.push(
      this.redirectService
        .listen()
        .pipe()
        .subscribe((result: unknown) =>
          this.interactionEventLib.emit({
            name: 'redirectEvent',
            data: result,
          })
        )
    );
  }
}
