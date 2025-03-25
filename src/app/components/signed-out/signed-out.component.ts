import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-signed-out',
  imports: [],
  template: `
    <p>You are currently signed out!</p>
    <button (click)="triggerAuthentication()">Authenticate again</button>
  `,
  styles: ``
})
export class SignedOutComponent {

  constructor(private auth: AuthenticationService, private platformService: PlatformService) { }

    ngOnInit(): void {
    }

    triggerAuthentication(): void {
      if(this.platformService.isBrowser) {
        this.auth.authenticate();
      }
    }
}
