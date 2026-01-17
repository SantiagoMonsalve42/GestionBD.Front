import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { SessionService } from '../../../../core/services/session.service';
import { RedirectService } from '../../../../core/services/redirect.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    router = inject(Router);
    sessionService = inject(SessionService);
    redirectService = inject(RedirectService);
    
    async redirectToLogin(): Promise<void> {
        this.redirectService.saveRedirectUrl('/core/dashboard');
        await this.sessionService.login();
    }
}
