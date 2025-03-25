import { Injectable } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable, of, firstValueFrom, scheduled, asyncScheduler } from 'rxjs';
import { StatehandlerService } from './statehandler.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _authenticated: boolean = false;
  private readonly _authenticationChanged: BehaviorSubject<boolean> =
    new BehaviorSubject(this.authenticated);

  constructor(
    private oauthService: OAuthService,
    private authConfig: AuthConfig,
    private statehandler: StatehandlerService,
    private platformService: PlatformService,
  ) {}

  public get authenticated(): boolean {
    return this._authenticated;
  }

  public get authenticationChanged(): Observable<boolean> {
    return this._authenticationChanged;
  }

  public getOIDCUser(): Observable<any> {
    if(this.platformService.isBrowser) {
      return scheduled(this.oauthService.loadUserProfile(), asyncScheduler);
    }
    return of()
  }

  public async authenticate(setState: boolean = true): Promise<boolean> {
    if (!this.platformService.isBrowser) {
      return false;
    }

    try {
      this.oauthService.configure(this.authConfig);
      this.oauthService.setupAutomaticSilentRefresh();
      this.oauthService.strictDiscoveryDocumentValidation = false;

      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      const hasValidAccessToken = this.oauthService.hasValidAccessToken();
      const hasValidIdToken = this.oauthService.hasValidIdToken();

      this._authenticated = hasValidAccessToken;

      if (!hasValidIdToken || !hasValidAccessToken) {
        // **Nueva verificación: evitar redirección infinita**
        if (this.oauthService.state && this.oauthService.state !== '') {
          console.warn('Proceso de autenticación ya en curso. Se evita iniciar nuevamente.');
          return false;
        }

        const newState = setState ? await this.statehandler.createState().toPromise() : undefined;
        this.oauthService.initCodeFlow(newState);
      }

      this._authenticationChanged.next(this.authenticated);
      return this.authenticated;
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      return false;
    }
  }

  public signout(): void {
    if(this.platformService.isBrowser) {
      this.oauthService.logOut();
      this._authenticated = false;
      this._authenticationChanged.next(false);
    }
  }
}
