import { DOCUMENT, Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PlatformService } from './platform.service';

export abstract class StatehandlerProcessorService {
  public abstract createState(url: string): Observable<string | undefined>;
  public abstract restoreState(state?: string): void;
}

@Injectable()
export class StatehandlerProcessorServiceImpl implements StatehandlerProcessorService {
  private sessionStorage: Storage | undefined;

  constructor(
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private platformService: PlatformService,
  ) {
    if(platformService.isBrowser) {
      this.sessionStorage = window.sessionStorage
    }
  }

  public createState(url: string): Observable<string> {
    if(this.platformService.isBrowser && this.sessionStorage){
      const externalUrl = this.location.prepareExternalUrl(url);
      const urlId = uuidv4();
      this.sessionStorage.setItem(urlId, externalUrl);
      return of(urlId);
    }
    return of();
  }

  public restoreState(state?: string): void {
    if(this.platformService.isBrowser && this.sessionStorage){
      if (state === undefined) {
        return;
      }
      const url = this.sessionStorage.getItem(state);
      if (url === null) {
          return;
      }
      this.document.location.href = (this.document.location.origin + url)
    }
  }
}
