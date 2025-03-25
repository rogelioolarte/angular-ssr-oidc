import { Injectable, Injector, OnDestroy, Type } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter, map, Observable, of, shareReplay, Subject, switchMap, take, takeUntil, throwError } from 'rxjs';
import { StatehandlerProcessorService } from './statehandler-processor.service';
import { GuardsCheckStart, Router, RouterEvent } from '@angular/router';
import { PlatformService } from './platform.service';

export abstract class StatehandlerService {
  public abstract createState(): Observable<string | undefined>;
  public abstract initStateHandler(): void;
}

@Injectable()
export class StatehandlerServiceImpl implements StatehandlerService, OnDestroy {

  private events?: Observable<string>;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    oauthService: OAuthService,
    private injector: Injector,
    private processor: StatehandlerProcessorService,
    private platformService: PlatformService
  ) {
    if(platformService.isBrowser) {
      oauthService.events.pipe(
        filter(event => event.type === 'token_received'),
        map(() => oauthService.state),
        takeUntil(this.unsubscribe$),
    )
    .subscribe(state => processor.restoreState(state));
    }
  }

  public initStateHandler(): void {
    if(this.platformService.isBrowser) {
      console.log("init initStatehandler")
      const router = this.injector.get(Router as Type<Router>);
      this.events = (router.events as Observable<RouterEvent>).pipe(
        filter(event => event instanceof GuardsCheckStart),
        map(event => event.url),
        shareReplay(1),
      );
      this.events.pipe(takeUntil(this.unsubscribe$)).subscribe();
    }
  }

  public createState(): Observable<string | undefined> {
    if(this.platformService.isBrowser) {
      if (this.events === undefined) {
        throw Error('no router events');
      }
      return this.events.pipe(
        take(1),
        switchMap(url => this.processor.createState(url)),
      );
    }
    return of()
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
