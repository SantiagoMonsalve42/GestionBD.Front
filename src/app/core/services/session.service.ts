import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private authService = inject(AuthService);
  
  // Signals para reactividad
  private userRoles = signal<string[]>([]);
  private username = signal<string | undefined>(undefined);
  private userEmail = signal<string | undefined>(undefined);

  // Computed signals
  readonly isAdmin = computed(() => this.userRoles().includes('admin'));
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  initializeSession(): void {
    if (this.authService.isAuthenticated()) {
      this.updateSessionData();
    }
  }

  updateSessionData(): void {
    this.userRoles.set(this.authService.getUserRoles());
    this.username.set(this.authService.getUsername());
    this.userEmail.set(this.authService.getUserEmail());
  }

  clearSession(): void {
    this.userRoles.set([]);
    this.username.set(undefined);
    this.userEmail.set(undefined);
  }

  // Getters para acceso tradicional
  getUsername(): string | undefined {
    return this.username();
  }

  getUserEmail(): string | undefined {
    return this.userEmail();
  }

  getUserRoles(): string[] {
    return this.userRoles();
  }

  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  checkIsAdmin(): boolean {
    return this.isAdmin();
  }

  async login(): Promise<void> {
    await this.authService.login();
    this.updateSessionData();
  }

  async logout(): Promise<void> {
    this.clearSession();
    await this.authService.logout();
  }

  clearLocalSession(): void {
    this.clearSession();
    this.authService.clearToken();
  }
}
