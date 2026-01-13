import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

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
  constructor() {
    this.initMenuItems();
  }

  private initMenuItems(): void {
    this.items = [
      {
        label: 'Proyectos',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'Mis ejecuciones',
            icon: 'pi pi-list',
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
        command: () => this.router.navigate(['/publico/home'])
      },
    ];
  }
  redirectHome(): void{
    this.router.navigate(['/core/dashboard']);
  }
}
