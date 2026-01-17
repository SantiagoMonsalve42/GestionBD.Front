import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, AvatarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  items: MenuItem[] = [];
  router: Router = inject(Router);
  private sessionService = inject(SessionService);
  constructor() {
    this.initMenuItems();
  }
  username(): string|undefined{
    return this.sessionService.getUsername();
  }

  private initMenuItems(): void {
    if(this.sessionService.checkIsAdmin()){
      this.items = [
                    {
                      label: 'Proyectos',
                      icon: 'pi pi-folder',
                      items: [
                        {
                          label: 'Revisar ejecuciones',
                          icon: 'pi pi-check',
                          command: () => this.router.navigate(['/core/connections'])
                        }
                      ]
                    },
                    {
                      label: 'Configuración',
                      icon: 'pi pi-cog',
                      items: [
                        {
                          label: 'Instancias',
                          icon: 'pi pi-server',
                          command: () => this.router.navigate(['/core/connections'])
                        }
                      ]
                    },
                    
                    {
                      label: 'Cerrar Sesión',
                      icon: 'pi pi-sign-out',
                      command: async () => {
                        await this.sessionService.logout();
                      }
                    },
                  ];
    }else{
      this.items = [
                    {
                      label: 'Proyectos',
                      icon: 'pi pi-folder',
                      items: [
                        {
                          label: 'Ejecuciones',
                          icon: 'pi pi-list',
                          command: () => this.router.navigate(['/core/executions'])
                        }
                      ]
                    },
                    {
                      label: 'Cerrar Sesión',
                      icon: 'pi pi-sign-out',
                      command: async () => {
                        await this.sessionService.logout();
                      }
                    },
                  ];
    }
    
  }
  redirectHome(): void{
    this.router.navigate(['/core/dashboard']);
  }
}
