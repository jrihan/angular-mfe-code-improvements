import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IdsIconModule,
  IdsMainButtonModule,
  IdsProgressStepModule,
} from '@ids/angular';
import { NavigationRoute } from 'src/app/shared/navigation-routes';
import { NavigationService } from 'src/app/shared/navigation.service';
import { DetalheContratoArquivosComponent } from './detalhe_contrato_arquivos/detalhe_contrato_arquivos.component';
import { DetalheContratoResumoComponent } from './detalhe_contrato_resumo/detalhe_contrato_resumo.component';
import { DetalheContratoCadastroComponent } from './detalhe_contrato_cadastro/detalhe_contrato_cadastro.component';
import { DetalheContratoParticipantesComponent } from './detalhe_contrato_participantes/detalhe_contrato_participantes.component';

export type ScreenMode = 'create' | 'edit';

@Component({
  standalone: true,
  imports: [
    IdsProgressStepModule,
    IdsMainButtonModule,
    IdsIconModule,
    DetalheContratoArquivosComponent,
    DetalheContratoCadastroComponent,
    DetalheContratoParticipantesComponent,
    DetalheContratoResumoComponent,
  ],
  selector: 'detalhe-contrato',
  templateUrl: './detalhe_contrato.component.html',
  styleUrls: ['./detalhe_contrato.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetalheContratoComponent implements OnInit {
  private mode: ScreenMode = 'create';

  private contratoId?: string;
  public progress = 1;
  public steps = ['Cadastro', 'Participantes', 'Resumo', 'Arquivos'];

  @ViewChild(DetalheContratoCadastroComponent)
  cadastroComponent?: DetalheContratoCadastroComponent;

  @ViewChild(DetalheContratoParticipantesComponent)
  participantesComponent?: DetalheContratoParticipantesComponent;

  constructor(private readonly navigation: NavigationService) {}

  ngOnInit(): void {
    const params = this.navigation.current.params;

    if (params) {
      this.mode = params.mode || 'create';
      this.contratoId = params.id;
    }

    console.log('DetalheContratoComponent - Mode:', this.mode);
    console.log('DetalheContratoComponent - Contrato ID:', this.contratoId);
  }

  add() {
    this.progress = Math.min(this.progress + 1, this.steps.length);
  }

  //Navigations

  goBack() {
    console.log('Go Back');
    this.navigation.navigate(NavigationRoute.ContratosHome);
  }

  get headerTitle(): string {
    return this.mode === 'create' ? 'Cadastro de Contrato' : 'Edição de Contrato';
  }

  get podeContinuar(): boolean {
    if (this.mode !== 'create') {
      return true;
    }

    if (this.progress === 1) {
      return this.cadastroComponent?.formularioValido ?? false;
    }

    if (this.progress === 2) {
      return this.participantesComponent?.formularioValido ?? false;
    }

    return true;
  }
}
