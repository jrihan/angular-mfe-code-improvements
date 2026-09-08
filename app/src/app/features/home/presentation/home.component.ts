import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { NavigationService } from '../../../shared/navigation.service';
import { NavigationRoute } from '../../../shared/navigation-routes';
import { CardBaseComponent } from 'src/app/shared/components/card_base/card_base.component';
import { ContainerBaseComponent } from 'src/app/shared/components/container_base/container_base.component';
import { QuickAccessCardComponent } from 'src/app/shared/components/quick-access-card/quick-access-card.component';

@Component({
  selector: 'home-page',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [
    CardBaseComponent,
    QuickAccessCardComponent,
    ContainerBaseComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  constructor(private navigation: NavigationService) {}

  ngOnInit() {}

  goTo(rota: string) {
    switch (rota) {
      case 'companhia-ressegurada-home':
        this.navigation.navigate(NavigationRoute.CompanhiaResseguradaHome);
        break;
      case 'home-ressegurador':
        this.navigation.navigate(NavigationRoute.ResseguradoresHome);
        break;
      case 'home-broker':
        this.navigation.navigate(NavigationRoute.BrokersHome);
        break;
      case 'home-contrato':
        this.navigation.navigate(NavigationRoute.ContratosHome);
        break;
      default:
        this.navigation.navigate(NavigationRoute.Home);
        break;
    }
  }
}
