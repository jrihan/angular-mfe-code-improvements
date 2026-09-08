import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationRoute } from '../shared/navigation-routes';

export interface NavigationState {
  rota: NavigationRoute;
  params?: any; // Pode ser tipado de forma mais restrita se preferir
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private routeSubject = new BehaviorSubject<NavigationState>({
    rota: NavigationRoute.Home,
  });
  public readonly route$ = this.routeSubject.asObservable();

  get current() {
    return this.routeSubject.value;
  }

  navigate(rota: NavigationRoute, params?: any) {
    this.routeSubject.next({ rota, params });
  }
}