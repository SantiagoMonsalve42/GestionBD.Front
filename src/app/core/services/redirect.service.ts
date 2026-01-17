import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  private router = inject(Router);
  private readonly REDIRECT_KEY = 'redirectUrl';

  saveRedirectUrl(url: string): void {
    sessionStorage.setItem(this.REDIRECT_KEY, url);
  }

  getRedirectUrl(): string | null {
    return sessionStorage.getItem(this.REDIRECT_KEY);
  }

  clearRedirectUrl(): void {
    sessionStorage.removeItem(this.REDIRECT_KEY);
  }

  redirectToSavedUrl(): void {
    const url = this.getRedirectUrl();
    if (url) {
      this.clearRedirectUrl();
      this.router.navigateByUrl(url);
    }
  }
}
