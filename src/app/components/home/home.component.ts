import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>Welcome to our Zitadel Authentication template</h1>

    <p>This shows you how to authenticate as a user and retrieve authentication information from OIDC endpoint.</p>
    <br><br>

    @if(hasValidAccessToken) {
      <p><strong>You are authenticated</strong></p>
        <button [routerLink]="['/user']">Show OIDC User</button>
    } @else {
      <p><strong>You are not authenticated</strong></p>
        <button (click)="tiggerAuthentication()">Authenticate</button>
    }
  `,
  styles: ``
})
export class HomeComponent {
  public hasValidAccessToken = false;

  constructor(
    public auth: AuthenticationService,
    private oauthService: OAuthService,
    private platformService: PlatformService
  ) {
    if(platformService.isBrowser) {
      console.log("chequeo de access token")
      this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
    }
  }

  tiggerAuthentication(): void {
    if(this.platformService.isBrowser) {
      this.auth.authenticate();
    }
  }
}
