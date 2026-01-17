import { Injectable, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private configService = inject(ConfigService);
  private keycloakInstance?: Keycloak;

  async init(): Promise<boolean> {
    const config = this.configService.keycloakConfig;
    
    this.keycloakInstance = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId
    });

    try {
      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false
      });

      if (authenticated) {
        this.startTokenRefresh();
      }

      return authenticated;
    } catch (error) {
      console.error('Error al inicializar Keycloak', error);
      return false;
    }
  }

  login(): Promise<void> {
    return this.keycloakInstance?.login() ?? Promise.resolve();
  }

  logout(): Promise<void> {
    const redirectUri = window.location.origin + '/public/home';
    return this.keycloakInstance?.logout({ redirectUri }) ?? Promise.resolve();
  }

  clearToken(): void {
    // Limpiar token sin hacer logout completo de Keycloak
    if (this.keycloakInstance) {
      this.keycloakInstance.clearToken();
    }
  }

  isAuthenticated(): boolean {
    return this.keycloakInstance?.authenticated ?? false;
  }

  getToken(): string | undefined {
    return this.keycloakInstance?.token;
  }

  async refreshToken(): Promise<boolean> {
    try {
      return await this.keycloakInstance?.updateToken(30) ?? false;
    } catch (error) {
      console.error('Error al refrescar token', error);
      return false;
    }
  }

  getUserRoles(): string[] {
    return this.keycloakInstance?.tokenParsed?.realm_access?.roles ?? [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  getUsername(): string | undefined {
    return this.keycloakInstance?.tokenParsed?.['preferred_username'];
  }

  getUserEmail(): string | undefined {
    return this.keycloakInstance?.tokenParsed?.['email'];
  }

  getUserId(): string | undefined {
    return this.keycloakInstance?.tokenParsed?.sub;
  }

  private startTokenRefresh(): void {
    // Refrescar el token cada 30 segundos si está a punto de expirar
    setInterval(async () => {
      try {
        await this.keycloakInstance?.updateToken(70);
      } catch (error) {
        console.error('Error al refrescar token automáticamente', error);
      }
    }, 30000);
  }
}
