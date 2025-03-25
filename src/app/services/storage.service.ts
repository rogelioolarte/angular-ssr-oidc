import { Injectable } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { PlatformService } from './platform.service';
import { environment } from '../../environments/environment';

const STORAGE_PREFIX = environment.storage_prefix;

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OAuthStorage {

  private storage: Storage | undefined;

  constructor(
    private platformService: PlatformService
  ) {
    if(platformService.isBrowser) {
      this.storage = window.localStorage;
    }
  }

  public setItem<TValue = string>(key: string, value: TValue): void {
    if(this.platformService.isBrowser && this.storage) {
      this.storage.setItem(this.getPrefixedKey(key), JSON.stringify(value));
    }
  }

  public getItem<TResult = string>(key: string): TResult | null {
    if(this.platformService.isBrowser && this.storage) {
      const result = this.storage.getItem(this.getPrefixedKey(key));
      if (result) {
        return JSON.parse(result);
      } else {
        return null;
      }
    }
    return null;
  }

  public removeItem(key: string): void {
    if(this.platformService.isBrowser && this.storage) {
      this.storage.removeItem(this.getPrefixedKey(key));
    }
  }

  public getPrefixedKey(key: string): string {
    return `${STORAGE_PREFIX}:${key}`;
  }
}
