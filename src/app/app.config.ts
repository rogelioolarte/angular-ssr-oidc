import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { AuthConfig, OAuthStorage, provideOAuthClient } from 'angular-oauth2-oidc';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { StatehandlerService, StatehandlerServiceImpl } from './services/statehandler.service';
import {
  StatehandlerProcessorService,
  StatehandlerProcessorServiceImpl
} from './services/statehandler-processor.service';
import { StorageService } from './services/storage.service';
import { environment } from '../environments/environment';

const authConfig: AuthConfig = environment.authConfig

const stateHandlerFn = () => {
  const statehandler = inject(StatehandlerService)
  return statehandler.initStateHandler();
};

const allowUrls = [
  environment.authConfig.issuer,
  `${environment.authConfig.issuer}/admin/v1`,
  `${environment.authConfig.issuer}/management/v1`,
  `${environment.authConfig.issuer}/auth/v1/`,
  `${environment.authConfig.issuer}/oauth/v2/authorize`,
  `${environment.authConfig.issuer}/oauth/v2/token`,
  `${environment.authConfig.issuer}/oauth/v2/introspect`,
  `${environment.authConfig.issuer}/oidc/v1/userinfo`,
  `${environment.authConfig.issuer}/oauth/v2/revoke`,
  `${environment.authConfig.issuer}/oidc/v1/end_session`,
  `${environment.authConfig.issuer}/oauth/v2/device_authorization`,
  `${environment.authConfig.issuer}/oauth/v2/keys`,
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAppInitializer(stateHandlerFn),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: allowUrls,
        sendAccessToken: true
      },
    }),
    { provide: AuthConfig, useValue: authConfig },
    { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
    { provide: StatehandlerService, useClass: StatehandlerServiceImpl },
    { provide: OAuthStorage, useClass: StorageService },
  ]
};
