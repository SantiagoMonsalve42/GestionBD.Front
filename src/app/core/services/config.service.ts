import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
}

export const API_URL = new InjectionToken<string>('API_URL');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private config?: AppConfig;

  loadConfig(): Promise<AppConfig> {
    return firstValueFrom(this.http.get<AppConfig>('assets/config.json'))
      .then(config => {
        this.config = config;
        return config;
      });
  }

  getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  get apiUrl(): string {
    return this.getConfig().apiUrl;
  }

  get keycloakConfig() {
    return this.getConfig().keycloak;
  }
}
