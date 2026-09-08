import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ANALYTICS_CONF,
  HttpRequestInterceptor,
  TrackingConfig,
} from '@quickweb/mfe-analytics';
import { ContextService, InteractionEventService } from '@quickweb/mfe-context';
import {
  EnvironmentProviders,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import {
  provideRouter,
  withHashLocation,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { ConstantConfig } from './app/models/constant-config';
import { provideConnectAngular } from '@quickweb/connect-angular';
import { COMPANHIA_RESSEGURADA_PROVIDERS } from './app/features/companhia_ressegurada/companhia_ressegurada.providers';
import { RESSEGURADORES_PROVIDERS } from './app/features/resseguradores/resseguradores.providers';
import { HttpErrorInterceptor } from './app/core/overrides/http-error.interceptor';
import { AuthInterceptor } from './app/core/overrides/auth.interceptor';
import { BROKERS_PROVIDERS } from './app/features/brokers/brokers.providers';

const trackingConfig: TrackingConfig = {
  cardName: 'cardName',
  customPath: '/path',
  implementationTeam: 'team',
  errorMapper: new Map<string, string>([
    ['400-499', 'Erro 400'],
    ['500-599', 'Erro 500'],
    ['404', 'Não encontrado'],
  ]),
};

export const providers: Array<Provider | EnvironmentProviders> = [
  importProvidersFrom([BrowserAnimationsModule]),
  provideHttpClient(withInterceptorsFromDi()),
  provideRouter(
    routes,
    withHashLocation(),
    withRouterConfig({
      onSameUrlNavigation: 'reload',
    })
  ),
  provideConnectAngular({ contextService: ContextService }),
  {
    provide: APP_BASE_HREF,
    useValue: '/',
  },
  {
    provide: ANALYTICS_CONF,
    useValue: {
      APP_NAME: ConstantConfig.TAG,
      APP_VERSION: '0.0.1',
    },
  },
  {
    provide: 'trackingConfig',
    useValue: trackingConfig,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true,
  },

  ...COMPANHIA_RESSEGURADA_PROVIDERS,
  ...RESSEGURADORES_PROVIDERS,
  ...BROKERS_PROVIDERS,

  ContextService,
  InteractionEventService,
];
