import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { ConfigService, API_URL } from './core/services/config.service';
import { AuthService } from './core/services/auth.service';
import { SessionService } from './core/services/session.service';
import { RedirectService } from './core/services/redirect.service';

export function initializeApp(
  configService: ConfigService, 
  authService: AuthService, 
  sessionService: SessionService,
  redirectService: RedirectService
) {
  return async () => {
    await configService.loadConfig();
    const authenticated = await authService.init();
    
    if (authenticated) {
      sessionService.initializeSession();
      
      // Redirigir a la URL guardada si existe
      setTimeout(() => {
        redirectService.redirectToSavedUrl();
      }, 0);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])
    ),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, AuthService, SessionService, RedirectService],
      multi: true
    },
    {
      provide: API_URL,
      useFactory: (config: ConfigService) => config.apiUrl,
      deps: [ConfigService]
    }
  ]
};
