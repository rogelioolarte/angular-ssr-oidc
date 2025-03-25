import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-user',
  imports: [AsyncPipe, JsonPipe],
  template: `
    <p><strong>Successfully authenticated</strong></p>
    <p>{{ user$ | async | json }}</p>
    <button (click)="triggerSignout()">signout</button>
  `,
  styles: ``
})
export class UserComponent {
  public user$?: Observable<any>;

    constructor(private auth: AuthenticationService, private platformService: PlatformService) {
      if(platformService.isBrowser) {
        this.user$ = this.auth.getOIDCUser();
      } else {
        console.log("ejecucion en el contructor del user en el server")
      }
    }

    triggerSignout(): void {
      if(this.platformService.isBrowser && this.user$) {
        this.auth.signout();
      }
    }
}
